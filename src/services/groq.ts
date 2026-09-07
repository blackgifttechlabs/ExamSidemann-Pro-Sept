export type GroqChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

type GroqChatOptions = {
  messages: GroqChatMessage[];
  maxTokens?: number;
  temperature?: number;
};

const GROQ_CHAT_URL = 'https://api.groq.com/openai/v1/chat/completions';

/**
 * The models this account can actually call, strongest first.
 *
 * Groq retires model names without warning — `llama-3.1-8b-instant` and
 * `llama-3.3-70b-versatile` both went the same way — and a request naming a dead
 * model comes back as "the model does not exist or you do not have access to
 * it". Every AI feature reads this one list so the next retirement is a
 * one-line fix rather than a hunt through seven files.
 *
 * To re-check, list what the key can see:
 *   curl -H "Authorization: Bearer $VITE_GROQ_API_KEY" \
 *     https://api.groq.com/openai/v1/models
 *
 * Last verified against the live account: 2026-08-20. None of the models on it
 * read images, so anything offering an image attachment has to say so.
 */
export const GROQ_MODELS = [
  'openai/gpt-oss-120b',
  'qwen/qwen3.6-27b',
  'openai/gpt-oss-20b',
] as const;

/**
 * The reasoning switches each family needs.
 *
 * Both live families think before answering, and neither does what you want by
 * default: `gpt-oss` spends the completion budget on reasoning tokens and can
 * return an empty `content` if the cap is tight, while `qwen` writes its
 * thinking into the reply as a `<think>` block for the learner to read. These
 * settings keep the reasoning short and out of the answer.
 */
export const groqReasoningParams = (model: string) => (model.startsWith('qwen/')
  ? { reasoning_effort: 'none', reasoning_format: 'hidden' }
  : { reasoning_effort: 'low', include_reasoning: false });

const getGroqApiKey = () =>
  (import.meta as any).env?.VITE_GROQ_API_KEY as string | undefined;

export const requestGroqCompletion = async ({
  messages,
  maxTokens = 1400,
  temperature = 0.45,
}: GroqChatOptions): Promise<string> => {
  const apiKey = getGroqApiKey();

  if (!apiKey) {
    throw new Error(
      'Study with AI is not configured. Add VITE_GROQ_API_KEY to the deployment environment.',
    );
  }

  let lastError: Error | null = null;

  for (const model of GROQ_MODELS) {
    try {
      const response = await fetch(GROQ_CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          max_completion_tokens: maxTokens,
          ...groqReasoningParams(model),
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || data?.error) {
        const status = response.status;
        lastError = new Error(
          data?.error?.message || `Groq request failed with status ${status}.`,
        );
        if (status === 429) {
          break; // Rate limited — don't burn remaining models, surface the error
        }
        if (status !== 404) {
          break; // Non-recoverable error, cascading won't help
        }
        // 404 = model not found — try next model
        continue;
      }

      const content = data?.choices?.[0]?.message?.content;
      if (typeof content === 'string' && content.trim()) {
        return content.trim();
      }

      lastError = new Error('Groq returned an empty response.');
    } catch (error) {
      lastError =
        error instanceof Error ? error : new Error('Unable to reach the Groq API.');
    }
  }

  throw lastError || new Error('Groq could not generate a response.');
};

/**
 * Streams chat completion tokens from Groq via Server-Sent Events.
 */
export const requestGroqStream = async ({
  messages,
  maxTokens = 2000,
  temperature = 0.45,
  onChunk,
}: GroqChatOptions & { onChunk: (delta: string) => void }): Promise<string> => {
  const apiKey = getGroqApiKey();

  if (!apiKey) {
    throw new Error(
      'Study with AI is not configured. Add VITE_GROQ_API_KEY to the deployment environment.',
    );
  }

  let lastError: Error | null = null;

  for (const model of GROQ_MODELS) {
    try {
      const response = await fetch(GROQ_CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          max_completion_tokens: maxTokens,
          stream: true,
          ...groqReasoningParams(model),
        }),
      });

      if (!response.ok || !response.body) {
        const errJson = await response.json().catch(() => null);
        lastError = new Error(errJson?.error?.message || `Groq stream failed with status ${response.status}.`);
        continue;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let fullText = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data:')) continue;
          const dataStr = trimmed.replace(/^data:\s*/, '');
          if (dataStr === '[DONE]') continue;

          try {
            const parsed = JSON.parse(dataStr);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              fullText += delta;
              onChunk(delta);
            }
          } catch {
            // Ignore malformed chunks
          }
        }
      }

      // The final SSE event may arrive without a trailing newline.
      if (buffer.trim().startsWith('data:')) {
        try {
          const parsed = JSON.parse(buffer.trim().replace(/^data:\s*/, ''));
          const delta = parsed.choices?.[0]?.delta?.content;
          if (delta) {
            fullText += delta;
            onChunk(delta);
          }
        } catch {
          // Ignore an incomplete final event.
        }
      }

      if (fullText.trim()) {
        return fullText.trim();
      }

      lastError = new Error('Groq stream returned an empty response.');
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unable to stream from Groq API.');
    }
  }

  // If streaming failed across models, fallback to standard completion
  return requestGroqCompletion({ messages, maxTokens, temperature });
};
