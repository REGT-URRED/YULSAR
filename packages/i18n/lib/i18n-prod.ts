import type { DevLocale, MessageKey } from './type';
// ponytail: Spanish forced by default — lookup es → en → key, independent of browser locale
import esMessages from '../locales/es/messages.json';
import enMessages from '../locales/en/messages.json';

type Messages = Record<string, { message?: string; placeholders?: Record<string, { content?: string }> }>;

function applySubstitutions(
  raw: string,
  placeholders: Record<string, { content?: string }> | undefined,
  subs: (string | undefined)[],
): string {
  let out = raw;
  // named placeholders mapped via content ("$1" -> first arg)
  if (placeholders) {
    for (const [name, ph] of Object.entries(placeholders)) {
      const idx = Number(ph.content?.replace('$', '')) - 1;
      if (!Number.isNaN(idx) && subs[idx] !== undefined) {
        out = out.split(`$${name}$`).join(subs[idx]!);
      }
    }
  }
  // positional $1, $2, ...
  out = out.replace(/\$(\d+)\$/g, (_, n) => (subs[Number(n) - 1] !== undefined ? subs[Number(n) - 1]! : `$${n}$`));
  return out;
}

export function t(key: MessageKey, substitutions?: string | string[]) {
  const subs: (string | undefined)[] = Array.isArray(substitutions)
    ? substitutions
    : substitutions
      ? [substitutions]
      : [];

  const entry = (esMessages as Messages)[key] ?? (enMessages as Messages)[key];
  if (!entry?.message) return key as string;

  return applySubstitutions(entry.message, entry.placeholders, subs);
}

t.devLocale = '' as DevLocale; // for type consistency with i18n-dev.ts
