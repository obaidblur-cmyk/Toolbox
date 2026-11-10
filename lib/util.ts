import { useEffect, useState } from 'react';
export const MAX_INPUT = 2_000_000;
/** Strips control characters (keeps tab/newline/CR) and caps length to protect the main thread. */
export const clean = (s: string, max = MAX_INPUT) =>
  s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').slice(0, max);
export function useDebounce<T>(v: T, ms = 250): T {
  const [d, setD] = useState(v);
  useEffect(() => { const t = setTimeout(() => setD(v), ms); return () => clearTimeout(t); }, [v, ms]);
  return d;
}
export const copy = (s: string) => navigator.clipboard?.writeText(s).catch(() => {});
