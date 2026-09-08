import { globalAgentRateLimiter, type RateLimitWaitInfo } from './agentRateLimiter';

export type { RateLimitWaitInfo };

// ─── In-memory response cache ─────────────────────────────────────────────────
// Prevents duplicate API calls when the same prompt is sent more than once
// in the same browser session (e.g., re-opening a feed card, re-running a tutor).
// - Max 30 entries (LRU eviction: oldest entry removed when full).
// - 5-minute TTL: entries older than 5 min are ignored and re-fetched.

const CACHE_MAX = 30;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

type CacheEntry = { value: string; ts: number };
const completionCache = new Map<string, CacheEntry>();

const makeCacheKey = (obj: unknown): string => JSON.stringify(obj);

const cacheGet = (key: string): string | null => {
  const entry = completionCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL_MS) {
    completionCache.delete(key);
    return null;
  }
  // Refresh position (LRU): re-insert at end
  completionCache.delete(key);
  completionCache.set(key, entry);
  return entry.value;
};

const cacheSet = (key: string, value: string): void => {
  if (completionCache.size >= CACHE_MAX) {
    // Evict oldest entry
    const oldest = completionCache.keys().next().value;
    if (oldest !== undefined) completionCache.delete(oldest);
  }
  completionCache.set(key, { value, ts: Date.now() });
};


export type GeminiImageAttachment = {
  mimeType: string;
  data: string;
};

export type GeminiGeneratedImage = {
  mimeType: string;
  data: string;
  dataUrl: string;
  text?: string;
};

export type GeminiChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
  image?: GeminiImageAttachment;
};

export type GeminiChatOptions = {
  messages: GeminiChatMessage[];
  maxTokens?: number;
  temperature?: number;
  model?: string;
  onWait?: (info: RateLimitWaitInfo) => void;
};

export const GEMINI_MODELS = [
  'gemini-3.6-flash',
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-3-flash-preview',
  'gemini-3.7-flash',
] as const;

export const DEFAULT_GEMINI_MODEL = 'gemini-3.6-flash';

export const getGeminiApiKeys = (): string[] => {
  const env = (import.meta as any).env || {};
  const processEnv = typeof process !== 'undefined' ? process.env : undefined;
  const candidates = [
    env.VITE_GEMINI_API_KEY_3,
    env.VITE_GEMINI_API_KEY_2,
    env.VITE_GEMINI_API_KEY,
    env.GEMINI_API_KEY_2,
    env.GEMINI_API_KEY,
    env.VITE_GOOGLE_API_KEY,
    processEnv?.GEMINI_API_KEY_3,
    processEnv?.VITE_GEMINI_API_KEY_3,
    processEnv?.GEMINI_API_KEY_2,
    processEnv?.GEMINI_API_KEY,
    processEnv?.VITE_GEMINI_API_KEY_2,
    processEnv?.VITE_GEMINI_API_KEY,
    processEnv?.API_KEY,
  ];
  return [...new Set(candidates.map((key) => String(key || '').trim()).filter(Boolean))];
};

export const getGeminiApiKey = (): string => getGeminiApiKeys()[0] || '';

const pcmToWavBlob = (pcm: Uint8Array, sampleRate = 24000) => {
  const buffer = new ArrayBuffer(44 + pcm.byteLength);
  const view = new DataView(buffer);
  const writeText = (offset: number, value: string) => {
    for (let index = 0; index < value.length; index += 1) view.setUint8(offset + index, value.charCodeAt(index));
  };
  writeText(0, 'RIFF');
  view.setUint32(4, 36 + pcm.byteLength, true);
  writeText(8, 'WAVE');
  writeText(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeText(36, 'data');
  view.setUint32(40, pcm.byteLength, true);
  new Uint8Array(buffer, 44).set(pcm);
  return new Blob([buffer], { type: 'audio/wav' });
};

const decodeBase64Audio = (data: string) => {
  const binary = window.atob(data);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
};

export const requestGeminiSpeech = async (transcript: string, voiceName = 'Kore'): Promise<Blob> => {
  const apiKeys = getGeminiApiKeys();
  if (!apiKeys.length) throw new Error('Gemini API key is not configured.');
  const models = ['gemini-3.1-flash-tts-preview', 'gemini-2.5-flash-preview-tts', 'gemini-2.5-pro-preview-tts'];
  let lastError: Error | null = null;

  for (const model of models) {
    for (const apiKey of apiKeys) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
          body: JSON.stringify({
            contents: [{ parts: [{ text: transcript }] }],
            generationConfig: {
              responseModalities: ['AUDIO'],
              speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName } } },
            },
          }),
        });
        const data = await response.json().catch(() => null);
        if (!response.ok || data?.error) {
          lastError = new Error(data?.error?.message || `Speech generation failed with status ${response.status}.`);
          if (response.status === 404) break;
          continue;
        }
        const audioPart = data?.candidates?.[0]?.content?.parts?.find((part: any) => part?.inlineData?.data)?.inlineData;
        if (!audioPart?.data) {
          lastError = new Error('Gemini returned no speech audio.');
          continue;
        }
        const bytes = decodeBase64Audio(audioPart.data);
        return String(audioPart.mimeType || '').toLowerCase().includes('wav')
          ? new Blob([bytes], { type: 'audio/wav' })
          : pcmToWavBlob(bytes);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unable to reach Gemini speech generation.');
      }
    }
  }
  throw lastError || new Error('Gemini could not generate speech.');
};

const formatGeminiPayload = (
  messages: GeminiChatMessage[],
  maxTokens = 2000,
  temperature = 0.45
) => {
  let systemInstruction: string | undefined;
  const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> }> = [];

  for (const m of messages) {
    if (m.role === 'system') {
      systemInstruction = systemInstruction ? `${systemInstruction}\n\n${m.content}` : m.content;
    } else {
      const parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = [];

      if (m.image?.data) {
        const cleanBase64 = m.image.data.includes('base64,')
          ? m.image.data.split('base64,')[1]
          : m.image.data;
        parts.push({
          inlineData: {
            mimeType: m.image.mimeType || 'image/png',
            data: cleanBase64,
          },
        });
      }

      if (m.content && m.content.trim()) {
        parts.push({ text: m.content });
      } else if (parts.length === 0) {
        parts.push({ text: ' ' });
      }

      contents.push({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts,
      });
    }
  }

  // Ensure at least one user message
  if (contents.length === 0) {
    contents.push({
      role: 'user',
      parts: [{ text: 'Hello' }],
    });
  }

  return {
    ...(systemInstruction
      ? {
          systemInstruction: {
            parts: [{ text: systemInstruction }],
          },
        }
      : {}),
    contents,
    generationConfig: {
      temperature,
      maxOutputTokens: maxTokens,
    },
  };
};

/**
 * Streams Gemini chat completion tokens via Server-Sent Events with rate limiting.
 */
export const requestGeminiStream = async ({
  messages,
  maxTokens = 2000,
  temperature = 0.45,
  model = DEFAULT_GEMINI_MODEL,
  onChunk,
  onWait,
}: GeminiChatOptions & { onChunk: (delta: string) => void }): Promise<string> => {
  const apiKeys = getGeminiApiKeys();

  if (!apiKeys.length) {
    throw new Error('Gemini API key is not configured.');
  }

  const payload = formatGeminiPayload(messages, maxTokens, temperature);
  const modelsToTry = [model, ...GEMINI_MODELS.filter((m) => m !== model)];

  return globalAgentRateLimiter.enqueue(
    async (apiKey: string) => {
      let lastError: Error | null = null;

      for (const targetModel of modelsToTry) {
        try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:streamGenerateContent?alt=sse`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
            },
            body: JSON.stringify(payload),
          });

          if (!response.ok || !response.body) {
            const errJson = await response.json().catch(() => null);
            const err = new Error(
              errJson?.error?.message || `Gemini stream failed with status ${response.status}.`
            );
            (err as any).status = response.status;
            throw err;
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
                const parts = parsed.candidates?.[0]?.content?.parts;
                if (Array.isArray(parts)) {
                  for (const part of parts) {
                    if (typeof part?.text === 'string' && part.text.length > 0) {
                      fullText += part.text;
                      onChunk(part.text);
                    }
                  }
                }
              } catch {
                // Ignore partial/malformed JSON
              }
            }
          }

          if (buffer.trim().startsWith('data:')) {
            try {
              const parsed = JSON.parse(buffer.trim().replace(/^data:\s*/, ''));
              const parts = parsed.candidates?.[0]?.content?.parts;
              if (Array.isArray(parts)) {
                for (const part of parts) {
                  if (typeof part?.text === 'string' && part.text.length > 0) {
                    fullText += part.text;
                    onChunk(part.text);
                  }
                }
              }
            } catch {
              // Ignore incomplete final chunk
            }
          }

          if (fullText.trim()) {
            return fullText.trim();
          }

          lastError = new Error('Gemini stream returned an empty response.');
        } catch (error) {
          lastError = error instanceof Error ? error : new Error('Unable to stream from Gemini API.');
          const status = (error as any)?.status;
          if (status === 429) {
            throw error; // Let rate limiter retry with backoff — do NOT try other models
          }
          if (status !== 404) {
            break; // Non-404 non-429 error: no point cascading through other models
          }
          // 404 means this model is unavailable — try the next one
        }
      }

      throw lastError || new Error('Gemini stream could not generate a response.');
    },
    apiKeys,
    onWait
  );
};

/**
 * Standard non-streaming completion for Gemini with rate limiting and queue management.
 */
export const requestGeminiCompletion = async ({
  messages,
  maxTokens = 2000,
  temperature = 0.45,
  model = DEFAULT_GEMINI_MODEL,
  onWait,
}: GeminiChatOptions): Promise<string> => {
  const apiKeys = getGeminiApiKeys();

  if (!apiKeys.length) {
    throw new Error('Gemini API key is not configured.');
  }

  // ── Cache lookup ─────────────────────────────────────────────────────────
  const cacheKey = makeCacheKey({ messages, maxTokens, temperature, model });
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  const payload = formatGeminiPayload(messages, maxTokens, temperature);
  const modelsToTry = [model, ...GEMINI_MODELS.filter((m) => m !== model)];

  const result = await globalAgentRateLimiter.enqueue(
    async (apiKey: string) => {
      let lastError: Error | null = null;

      for (const targetModel of modelsToTry) {
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent`;
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-goog-api-key': apiKey,
            },
            body: JSON.stringify(payload),
          });

          const data = await response.json().catch(() => null);

          if (!response.ok || data?.error) {
            const err = new Error(
              data?.error?.message || `Gemini request failed with status ${response.status}.`
            );
            (err as any).status = response.status;
            throw err;
          }

          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (typeof text === 'string' && text.trim()) {
            return text.trim();
          }

          lastError = new Error('Gemini returned an empty response.');
        } catch (error) {
          lastError = error instanceof Error ? error : new Error('Unable to reach Gemini API.');
          const status = (error as any)?.status;
          if (status === 429) {
            throw error; // Let rate limiter handle backoff — do NOT cascade to other models
          }
          if (status !== 404) {
            break; // Non-404 non-429: cascading won't help
          }
          // 404 = model unavailable, try next model
        }
      }

      throw lastError || new Error('Gemini could not generate a response.');
    },
    apiKeys,
    onWait
  );

  // ── Cache result ─────────────────────────────────────────────────────────
  cacheSet(cacheKey, result);
  return result;
};


/**
 * Edits an input image with Gemini's native image-output models. The returned
 * image remains in memory as a data URL; callers decide whether to display or
 * persist it. Camera images are sent only when this function is explicitly run.
 */
export const requestGeminiImageEdit = async ({
  image,
  prompt,
  onWait,
}: {
  image: GeminiImageAttachment;
  prompt: string;
  onWait?: (info: RateLimitWaitInfo) => void;
}): Promise<GeminiGeneratedImage> => {
  const apiKeys = getGeminiApiKeys();
  if (!apiKeys.length) throw new Error('Gemini API key is not configured.');

  const cleanBase64 = image.data.includes('base64,')
    ? image.data.split('base64,')[1]
    : image.data;
  // Try the old preview model first — still free on some accounts.
  // Fall back to paid Nano Banana models if it 404s or quota-errors.
  const models = [
    'gemini-2.0-flash-preview-image-generation',
    'gemini-3.1-flash-image',
    'gemini-3-pro-image-preview',
  ];

  return globalAgentRateLimiter.enqueue(
    async (apiKey: string) => {
      let lastError: Error | null = null;

      for (const model of models) {
        try {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': apiKey,
              },
              body: JSON.stringify({
                contents: [{
                  role: 'user',
                  parts: [
                    { inlineData: { mimeType: image.mimeType || 'image/jpeg', data: cleanBase64 } },
                    { text: prompt },
                  ],
                }],
                generationConfig: {
                  responseModalities: ['TEXT', 'IMAGE'],
                },
              }),
            },
          );
          const payload = await response.json().catch(() => null);
          if (!response.ok || payload?.error) {
            const error = new Error(payload?.error?.message || `Gemini image request failed with status ${response.status}.`);
            (error as any).status = response.status;
            throw error;
          }

          const parts = payload?.candidates?.[0]?.content?.parts || [];
          const imagePart = parts.find((part: any) => part?.inlineData?.data)?.inlineData;
          if (imagePart?.data) {
            const mimeType = imagePart.mimeType || 'image/png';
            const text = parts.map((part: any) => part?.text || '').join('\n').trim();
            return {
              mimeType,
              data: imagePart.data,
              dataUrl: `data:${mimeType};base64,${imagePart.data}`,
              ...(text ? { text } : {}),
            };
          }
          lastError = new Error('Gemini returned no edited image.');
        } catch (error) {
          lastError = error instanceof Error ? error : new Error('Unable to reach Gemini image generation.');
          if ((error as any)?.status === 429) throw error;
        }
      }

      throw lastError || new Error('Gemini could not generate the next-step image.');
    },
    apiKeys,
    onWait,
  );
};
