'use client';
import { useMemo, useState } from 'react';
import { clean, copy, useDebounce } from '@/lib/util';
export default function JsonTool() {
  const [src, setSrc] = useState('{"hello":"world","list":[1,2,3]}');
  const [indent, setIndent] = useState(2);
  const q = useDebounce(src, 250);
  const r = useMemo(() => {
    const s = clean(q); if (!s.trim()) return { out: '', err: '' };
    try { return { out: JSON.stringify(JSON.parse(s), null, indent), err: '' }; }
    catch (e) {
      const m = (e as Error).message, p = /position (\d+)/.exec(m); let loc = '';
      if (p) { const l = s.slice(0, +p[1]).split('\n'); loc = ` (line ${l.length}, column ${l[l.length - 1].length + 1})`; }
      return { out: '', err: m + loc };
    }
  }, [q, indent]);
  const minify = () => { try { setSrc(JSON.stringify(JSON.parse(clean(src)))); } catch {} };
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <label htmlFor="j" className="mb-1 block text-sm font-medium">Input</label>
        <textarea id="j" value={src} onChange={(e) => setSrc(e.target.value)} spellCheck={false} rows={16} aria-invalid={!!r.err}
          className={`field ${r.err ? 'border-danger' : ''}`} />
        <p role="status" className={`mt-2 min-h-6 text-sm ${r.err ? 'text-danger' : 'text-accent'}`}>{r.err ? `Invalid JSON: ${r.err}` : q.trim() ? 'Valid JSON' : 'Paste JSON to validate it.'}</p>
      </div>
      <div>
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium">Formatted</span>
          <select aria-label="Indentation" className="btn" value={indent} onChange={(e) => setIndent(+e.target.value)}><option value={2}>2 spaces</option><option value={4}>4 spaces</option></select>
          <button className="btn" onClick={minify} disabled={!!r.err}>Minify</button>
          <button className="btn btn-primary" onClick={() => copy(r.out)} disabled={!r.out}>Copy</button>
        </div>
        <pre className="field h-[24.5rem] overflow-auto whitespace-pre-wrap break-words">{r.out}</pre>
      </div>
    </div>
  );
}
