'use client';
import { useMemo, useState } from 'react';
import { clean, copy, useDebounce } from '@/lib/util';
const enc = (b: Uint8Array) => { let s = ''; for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode(...b.subarray(i, i + 0x8000)); return btoa(s); };
const dec = (s: string) => Uint8Array.from(atob(s.replace(/\s/g, '').replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));
export default function Base64Tool() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [text, setText] = useState('Hello, wörld 🌍');
  const [safe, setSafe] = useState(false);
  const [fileOut, setFileOut] = useState(''); const [fileErr, setFileErr] = useState('');
  const q = useDebounce(text, 200);
  const r = useMemo(() => {
    const s = clean(q); if (!s) return { out: '', err: '' };
    try {
      if (mode === 'encode') { let o = enc(new TextEncoder().encode(s)); if (safe) o = o.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); return { out: o, err: '' }; }
      return { out: new TextDecoder('utf-8', { fatal: true }).decode(dec(s)), err: '' };
    } catch { return { out: '', err: 'Not valid Base64 text (or the decoded bytes are not UTF-8).' }; }
  }, [q, mode, safe]);
  const onFile = async (f?: File) => {
    setFileErr(''); setFileOut(''); if (!f) return;
    if (f.size > 5 * 1024 * 1024) return setFileErr('File is larger than 5 MB.');
    setFileOut(enc(new Uint8Array(await f.arrayBuffer())));
  };
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Mode">
        {(['encode', 'decode'] as const).map((m) => <button key={m} onClick={() => setMode(m)} aria-pressed={mode === m} className={`btn ${mode === m ? 'btn-primary' : ''}`}>{m === 'encode' ? 'Encode' : 'Decode'}</button>)}
        {mode === 'encode' && <label className="ml-2 flex items-center gap-2 text-sm"><input type="checkbox" checked={safe} onChange={(e) => setSafe(e.target.checked)} />URL-safe</label>}
      </div>
      <textarea aria-label="Input" rows={6} value={text} onChange={(e) => setText(e.target.value)} className="field" spellCheck={false} />
      <div><div className="mb-1 flex items-center gap-2"><span className="text-sm font-medium">Result</span><button className="btn btn-primary" disabled={!r.out} onClick={() => copy(r.out)}>Copy</button></div>
        <pre className="field min-h-24 whitespace-pre-wrap break-all">{r.out}</pre>
        <p role="status" className="mt-1 min-h-6 text-sm text-danger">{r.err}</p></div>
      {mode === 'encode' && <div className="rounded-md border border-line p-4">
        <label htmlFor="f" className="mb-2 block text-sm font-medium">Or encode a file (max 5 MB)</label>
        <input id="f" type="file" onChange={(e) => onFile(e.target.files?.[0])} className="text-sm" />
        {fileErr && <p className="mt-2 text-sm text-danger" role="status">{fileErr}</p>}
        {fileOut && <><button className="btn btn-primary mt-3" onClick={() => copy(fileOut)}>Copy file Base64</button><pre className="field mt-2 max-h-48 overflow-auto break-all whitespace-pre-wrap">{fileOut.slice(0, 5000)}{fileOut.length > 5000 ? '…' : ''}</pre></>}
      </div>}
    </div>
  );
}
