'use client';
import { useState } from 'react';
import { clean, copy, useDebounce } from '@/lib/util';
const words = (s: string) => s.match(/[\p{L}\p{N}]+/gu) || [];
const cap = (w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
const MODES: Record<string, (s: string) => string> = {
  UPPERCASE: (s) => s.toUpperCase(), lowercase: (s) => s.toLowerCase(),
  'Title Case': (s) => s.toLowerCase().replace(/(^|[\s-])(\p{L})/gu, (_, a, b) => a + b.toUpperCase()),
  'Sentence case': (s) => s.toLowerCase().replace(/(^\s*|[.!?]\s+)(\p{L})/gu, (_, a, b) => a + b.toUpperCase()),
  camelCase: (s) => words(s).map((w, i) => (i ? cap(w) : w.toLowerCase())).join(''),
  snake_case: (s) => words(s).map((w) => w.toLowerCase()).join('_'),
  'kebab-case': (s) => words(s).map((w) => w.toLowerCase()).join('-'),
  'URL slug': (s) => s.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
};
export default function CaseTool() {
  const [text, setText] = useState('The Quick Brown Fox — Café Crème');
  const [mode, setMode] = useState('URL slug');
  const out = MODES[mode](clean(useDebounce(text, 150), 500_000));
  return (
    <div className="space-y-4">
      <textarea aria-label="Input text" rows={6} value={text} onChange={(e) => setText(e.target.value)} className="field font-sans" />
      <div className="flex flex-wrap gap-2" role="group" aria-label="Conversion">{Object.keys(MODES).map((m) => <button key={m} aria-pressed={mode === m} onClick={() => setMode(m)} className={`btn ${mode === m ? 'btn-primary' : ''}`}>{m}</button>)}</div>
      <div><div className="mb-1 flex items-center gap-2"><span className="text-sm font-medium">{mode}</span><button className="btn btn-primary" disabled={!out} onClick={() => copy(out)}>Copy</button></div>
        <pre className="field min-h-24 whitespace-pre-wrap break-words font-sans">{out}</pre></div>
    </div>
  );
}
