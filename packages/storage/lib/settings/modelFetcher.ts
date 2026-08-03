import { ProviderTypeEnum } from './types';

export interface FetchedModelsResult {
  models: string[];
  error?: string;
}

// ponytail: fetch models from each provider's API, filter to chat models only
// one function per provider pattern, adds new provider = new case

export async function fetchModels(
  providerType: ProviderTypeEnum,
  apiKey: string,
  baseUrl?: string,
): Promise<FetchedModelsResult> {
  if (!apiKey.trim()) {
    return { models: [], error: 'API key requerida' };
  }

  switch (providerType) {
    case ProviderTypeEnum.OpenAI:
    case ProviderTypeEnum.DeepSeek:
    case ProviderTypeEnum.Grok:
    case ProviderTypeEnum.Groq:
    case ProviderTypeEnum.Cerebras:
    case ProviderTypeEnum.Bynara:
    case ProviderTypeEnum.CustomOpenAI:
    case ProviderTypeEnum.OpenRouter:
    case ProviderTypeEnum.Llama:
      return fetchOpenAICompatible(apiKey, baseUrl, providerType);
    case ProviderTypeEnum.Gemini:
      return fetchGemini(apiKey);
    case ProviderTypeEnum.Ollama:
      return fetchOllama(baseUrl);
    case ProviderTypeEnum.Anthropic:
      return fetchAnthropic(apiKey);
    default:
      return fetchOpenAICompatible(apiKey, baseUrl, providerType);
  }
}

async function fetchOpenAICompatible(
  apiKey: string,
  baseUrl?: string,
  _providerType?: string,
): Promise<FetchedModelsResult> {
  const resolvedBase = sanitizeBaseUrl(baseUrl);
  if (!resolvedBase) {
    return { models: [], error: 'Base URL requerida' };
  }

  try {
    const res = await fetch(`${resolvedBase}/models`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      return { models: [], error: `API error ${res.status}: ${text.slice(0, 200)}` };
    }

    const json = await res.json();
    const raw: { id: string }[] = json.data ?? [];

    return {
      models: raw
        .map(m => m.id)
        .filter(id => isChatModel(id)),
    };
  } catch {
    return { models: [], error: 'Error de red al obtener modelos' };
  }
}

async function fetchGemini(apiKey: string): Promise<FetchedModelsResult> {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
    );

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      return { models: [], error: `Gemini error ${res.status}: ${text.slice(0, 200)}` };
    }

    const json = await res.json();
    const raw: { name: string; supportedGenerationMethods?: string[] }[] = json.models ?? [];

    return {
      models: raw
        .filter(m => m.supportedGenerationMethods?.includes('generateContent'))
        .map(m => m.name.replace('models/', ''))
        .filter(id => !id.includes('embedding')),
    };
  } catch {
    return { models: [], error: 'Error de red al obtener modelos de Gemini' };
  }
}

async function fetchOllama(baseUrl?: string): Promise<FetchedModelsResult> {
  const host = baseUrl?.replace(/\/+$/, '') || 'http://localhost:11434';

  try {
    const res = await fetch(`${host}/api/tags`);

    if (!res.ok) {
      return { models: [], error: `Ollama error ${res.status}. El servidor local esta corriendo?` };
    }

    const json = await res.json();
    const raw: { name: string }[] = json.models ?? [];
    return { models: raw.map(m => m.name) };
  } catch {
    return { models: [], error: 'Error de red. Verifica que Ollama este corriendo.' };
  }
}

async function fetchAnthropic(apiKey: string): Promise<FetchedModelsResult> {
  try {
    const res = await fetch('https://api.anthropic.com/v1/models', {
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      return { models: [], error: `Anthropic error ${res.status}: ${text.slice(0, 200)}` };
    }

    const json = await res.json();
    const raw: { id: string }[] = json.data ?? [];

    return {
      models: raw.map(m => m.id).filter(id => id.startsWith('claude-')),
    };
  } catch {
    return { models: [], error: 'Error de red al obtener modelos de Anthropic' };
  }
}

// ponytail: filter out non-chat models (embeddings, moderations, TTS, dall-e, whisper, etc.)
function isChatModel(id: string): boolean {
  const lower = id.toLowerCase();
  const skip = [
    'embedding', 'moderation', 'tts-', 'dall-e', 'whisper',
    'babbage', 'davinci', 'text-search', 'code-search',
    'text-embedding', 'text-moderation',
  ];
  return !skip.some(s => lower.includes(s));
}

function sanitizeBaseUrl(url?: string): string {
  if (!url) return '';
  return url.replace(/\/+$/, '').replace(/\/chat\/completions$/, '');
}
