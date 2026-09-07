/**
 * services/agentRateLimiter.ts
 *
 * Sliding window rate limiter & priority request queue with exponential backoff
 * to stay safely below the 15 Requests Per Minute (RPM) Gemini limit.
 *
 * Defaults:
 * - Max 13 requests per 60,000 ms rolling window (leaves safety margin under 15 RPM).
 * - Minimum 2,200 ms spacing between consecutive requests to prevent sudden bursts.
 * - Queue mechanism with live wait status callback to simulate UI feedback without extra AI calls.
 * - Exponential backoff for 429 Too Many Requests (4s -> 8s -> 16s with random jitter).
 */

export type RateLimitWaitInfo = {
  state: 'queued' | 'waiting_slot' | 'retrying' | 'running';
  waitSeconds: number;
  reason: string;
};

export type RateLimiterOptions = {
  maxRequestsPerMinute?: number;
  windowMs?: number;
  minSpacingMs?: number;
  maxRetries?: number;
  initialBackoffMs?: number;
};

class AgentRateLimiter {
  private maxRequests: number;
  private windowMs: number;
  private minSpacingMs: number;
  private maxRetries: number;
  private initialBackoffMs: number;

  private timestamps: number[] = [];
  private lastRequestTime = 0;
  private queue: Array<{
    task: (apiKey: string) => Promise<any>;
    apiKeys: string[];
    onWait?: (info: RateLimitWaitInfo) => void;
    resolve: (value: any) => void;
    reject: (reason?: any) => void;
  }> = [];
  private isProcessing = false;

  constructor(options: RateLimiterOptions = {}) {
    this.maxRequests = options.maxRequestsPerMinute ?? 13;
    this.windowMs = options.windowMs ?? 60_000;
    this.minSpacingMs = options.minSpacingMs ?? 2_200;
    this.maxRetries = options.maxRetries ?? 3;
    this.initialBackoffMs = options.initialBackoffMs ?? 4_000;
  }

  /**
   * Enqueues an API task to run within safe rate limits.
   */
  public enqueue<T>(
    task: (apiKey: string) => Promise<T>,
    apiKeys: string[],
    onWait?: (info: RateLimitWaitInfo) => void
  ): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push({
        task,
        apiKeys: apiKeys.length ? apiKeys : [''],
        onWait,
        resolve,
        reject,
      });

      if (this.queue.length > 1) {
        onWait?.({
          state: 'queued',
          waitSeconds: Math.ceil(this.queue.length * (this.minSpacingMs / 1000)),
          reason: 'Request queued to maintain safe API limits',
        });
      }

      void this.processQueue();
    });
  }

  private cleanTimestamps(now: number) {
    const cutoff = now - this.windowMs;
    this.timestamps = this.timestamps.filter((t) => t > cutoff);
  }

  private getRequiredDelay(now: number): number {
    this.cleanTimestamps(now);

    let delay = 0;

    // Check minimum spacing between calls
    const timeSinceLast = now - this.lastRequestTime;
    if (timeSinceLast < this.minSpacingMs) {
      delay = Math.max(delay, this.minSpacingMs - timeSinceLast);
    }

    // Check rolling window limit
    if (this.timestamps.length >= this.maxRequests) {
      const oldestInWindow = this.timestamps[0];
      const timeUntilOldestExpires = (oldestInWindow + this.windowMs) - now;
      if (timeUntilOldestExpires > 0) {
        delay = Math.max(delay, timeUntilOldestExpires + 100);
      }
    }

    return delay;
  }

  private async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;
    this.isProcessing = true;

    while (this.queue.length > 0) {
      const item = this.queue[0];
      const now = Date.now();
      const delay = this.getRequiredDelay(now);

      if (delay > 0) {
        const waitSec = Math.ceil(delay / 1000);
        item.onWait?.({
          state: 'waiting_slot',
          waitSeconds: waitSec,
          reason: `Waiting for API availability (${waitSec}s remaining)`,
        });

        // Run local periodic countdown for smooth UI updates
        const intervalStep = 500;
        let remaining = delay;
        while (remaining > 0) {
          const step = Math.min(intervalStep, remaining);
          await new Promise((r) => setTimeout(r, step));
          remaining -= step;
          if (remaining > 0) {
            item.onWait?.({
              state: 'waiting_slot',
              waitSeconds: Math.ceil(remaining / 1000),
              reason: `Waiting for API availability (${Math.ceil(remaining / 1000)}s remaining)`,
            });
          }
        }
      }

      // Dequeue current item
      this.queue.shift();

      item.onWait?.({
        state: 'running',
        waitSeconds: 0,
        reason: 'Executing API request',
      });

      // Record request timestamp
      const requestStart = Date.now();
      this.timestamps.push(requestStart);
      this.lastRequestTime = requestStart;

      try {
        const result = await this.executeWithRetry(item.task, item.apiKeys, item.onWait);
        item.resolve(result);
      } catch (err) {
        item.reject(err);
      }
    }

    this.isProcessing = false;
  }

  private isRateLimitError(error: any): boolean {
    if (!error) return false;
    const msg = String(error?.message || error || '').toLowerCase();
    const status = error?.status || error?.statusCode || error?.code;
    return (
      status === 429 ||
      msg.includes('429') ||
      msg.includes('resource_exhausted') ||
      msg.includes('rate limit') ||
      msg.includes('quota exceeded') ||
      msg.includes('too many requests')
    );
  }

  private async executeWithRetry<T>(
    task: (apiKey: string) => Promise<T>,
    apiKeys: string[],
    onWait?: (info: RateLimitWaitInfo) => void
  ): Promise<T> {
    let lastError: any = null;
    let keyIndex = 0;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      const currentApiKey = apiKeys[keyIndex % apiKeys.length];

      try {
        return await task(currentApiKey);
      } catch (error: any) {
        lastError = error;

        if (this.isRateLimitError(error)) {
          // If we have alternative keys, try switching keys immediately
          if (apiKeys.length > 1 && keyIndex < apiKeys.length - 1) {
            keyIndex++;
            continue;
          }

          if (attempt < this.maxRetries) {
            // Exponential backoff with random jitter: 4s -> 8s -> 16s + jitter
            const backoffMs =
              this.initialBackoffMs * Math.pow(2, attempt) + Math.floor(Math.random() * 1000);
            const waitSec = Math.ceil(backoffMs / 1000);

            onWait?.({
              state: 'retrying',
              waitSeconds: waitSec,
              reason: `Rate limit reached. Retrying automatically in ${waitSec}s…`,
            });

            // Countdown wait
            let remaining = backoffMs;
            const step = 500;
            while (remaining > 0) {
              const currentStep = Math.min(step, remaining);
              await new Promise((r) => setTimeout(r, currentStep));
              remaining -= currentStep;
              if (remaining > 0) {
                onWait?.({
                  state: 'retrying',
                  waitSeconds: Math.ceil(remaining / 1000),
                  reason: `Rate limit reached. Retrying in ${Math.ceil(remaining / 1000)}s…`,
                });
              }
            }

            // Record extra timestamp for the retry
            this.timestamps.push(Date.now());
            this.lastRequestTime = Date.now();
            continue;
          }
        }

        // Non-rate limit error or retries exhausted
        throw error;
      }
    }

    throw lastError || new Error('API request failed after retries.');
  }

  /**
   * Returns current stats about rate limiter
   */
  public getStats() {
    this.cleanTimestamps(Date.now());
    return {
      requestsInWindow: this.timestamps.length,
      maxRequests: this.maxRequests,
      queueLength: this.queue.length,
      isProcessing: this.isProcessing,
    };
  }
}

// Export singleton instance configured for safe 13-14 RPM
export const globalAgentRateLimiter = new AgentRateLimiter({
  maxRequestsPerMinute: 13,
  windowMs: 60_000,
  minSpacingMs: 2_300,
  maxRetries: 3,
  initialBackoffMs: 4_000,
});
