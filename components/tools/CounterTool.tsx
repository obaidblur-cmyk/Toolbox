'use client';
import { useState } from 'react';
import { clean, useDebounce } from '@/lib/util';
export default function CounterTool() {
  const [text, setText] = useState('');
  const t = clean(useDebounce(text, 150), 5_000_000);
  const words = (t.match(/\S+/g) || []).length;
  const stats: [string, string | number][] = [
    ['Words', words], ['Characters', t.length], ['No spaces', t.replace(/\s/g, '').length],
    ['Lines', t ? t.split(/\r\n|\r|\n/).length : 0], ['Sentences', (t.match(/[^.!?]+[.!?]+(\s|$)/g) || []).length],
    ['Paragraphs', t.split(/\n\s*\n/).filter((p) => p.trim()).length],
    ['Reading time', words ? `${Math.ceil(words / 200)} min` : '0 min'], ['Speaking time', words ? `${Math.ceil(words / 130)} min` : '0 min'],
  ];
  return (
    <div>
      <label htmlFor="c" className="mb-1 block text-sm font-medium">Your text</label>
      <textarea id="c" rows={12} value={text} onChange={(e) => setText(e.target.value.slice(0, 5_000_000))} className="field font-sans" placeholder="Start typing or paste text here" />
      <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map(([k, v]) => <div key={k} className="rounded-md border border-line bg-card p-3"><dt className="text-xs text-muted">{k}</dt><dd className="text-2xl font-semibold tabular-nums">{v}</dd></div>)}
      </dl>
    </div>
  );
}
