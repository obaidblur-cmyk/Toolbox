'use client';
import { useEffect, useState } from 'react';
import { md5 } from '@/lib/md5';
import { clean, copy, useDebounce } from '@/lib/util';
const SETS = { lower: 'abcdefghijklmnopqrstuvwxyz', upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', digits: '0123456789', symbols: '!@#$%^&*()-_=+[]{};:,.?/' } as const;
type K = keyof typeof SETS;
function rnd(n: number) { const a = new Uint32Array(1), lim = Math.floor(2 ** 32 / n) * n; do crypto.getRandomValues(a); while (a[0] >= lim); return a[0] % n; }
function gen(len: number, on: K[]) {
  const pool = on.map((k) => SETS[k]).join(''); if (!pool) return '';
  const c = on.map((k) => SETS[k][rnd(SETS[k].length)]);
  while (c.length < len) c.push(pool[rnd(pool.length)]);
  for (let i = c.length - 1; i > 0; i--) { const j = rnd(i + 1); [c[i], c[j]] = [c[j], c[i]]; }
  return c.slice(0, len).join('');
}
const ALGOS = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];
export default function PasswordHashTool() {
  const [len, setLen] = useState(20);
  const [on, setOn] = useState<Record<K, boolean>>({ lower: true, upper: true, digits: true, symbols: true });
  const keys = (Object.keys(on) as K[]).filter((k) => on[k]);
  const [pw, setPw] = useState('');
  const [txt, setTxt] = useState('hello world');
  const [hashes, setHashes] = useState<[string, string][]>([]);
  const q = useDebounce(txt, 250);
  useEffect(() => { setPw(gen(len, keys)); /* eslint-disable-next-line */ }, []);
  useEffect(() => {
    let live = true; const bytes = new TextEncoder().encode(clean(q, 1_000_000));
    (async () => {
      const out: [string, string][] = [['MD5', md5(bytes)]];
      for (const a of ALGOS) out.push([a, Array.from(new Uint8Array(await crypto.subtle.digest(a, bytes)), (b) => b.toString(16).padStart(2, '0')).join('')]);
      if (live) setHashes(out);
    })();
    return () => { live = false; };
  }, [q]);
  const bits = keys.length ? Math.round(len * Math.log2(keys.map((k) => SETS[k]).join('').length)) : 0;
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <section aria-labelledby="pwh"><h2 id="pwh" className="mb-3 text-lg font-semibold">Password generator</h2>
        <output className="field block break-all text-lg" aria-live="polite">{pw || 'Select at least one character type'}</output>
        <p className="mt-1 text-sm text-muted">Entropy: {bits} bits {bits >= 80 ? '(strong)' : bits >= 60 ? '(fair)' : '(weak)'}</p>
        <label className="mt-4 block text-sm">Length: {len}<input type="range" min={8} max={128} value={len} onChange={(e) => setLen(+e.target.value)} className="block w-full accent-[rgb(var(--accent))]" /></label>
        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">{(Object.keys(SETS) as K[]).map((k) =>
          <label key={k} className="flex items-center gap-2"><input type="checkbox" checked={on[k]} onChange={(e) => setOn({ ...on, [k]: e.target.checked })} />{k[0].toUpperCase() + k.slice(1)}</label>)}</div>
        <div className="mt-4 flex gap-2"><button className="btn btn-primary" disabled={!keys.length} onClick={() => setPw(gen(len, keys))}>Generate</button><button className="btn" disabled={!pw} onClick={() => copy(pw)}>Copy</button></div>
      </section>
      <section aria-labelledby="hh"><h2 id="hh" className="mb-3 text-lg font-semibold">Hash generator</h2>
        <textarea aria-label="Text to hash" rows={4} value={txt} onChange={(e) => setTxt(e.target.value)} className="field" />
        <ul className="mt-3 space-y-2">{hashes.map(([n, h]) => <li key={n} className="rounded-md border border-line bg-card p-2"><div className="flex items-center justify-between text-xs text-muted"><span>{n}</span><button className="btn !py-0.5" onClick={() => copy(h)}>Copy</button></div><code className="block break-all text-xs">{h}</code></li>)}</ul>
      </section>
    </div>
  );
}
