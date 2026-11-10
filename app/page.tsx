import Link from 'next/link';
import { SITE, tools } from '@/lib/tools';
export default function Home() {
  return (
    <>
      <h1 className="max-w-2xl text-4xl font-bold tracking-tight">Small tools that never upload your data</h1>
      <p className="mt-3 max-w-xl text-muted">{SITE.desc}</p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {tools.map((t) => <li key={t.slug}><Link href={`/tools/${t.slug}`} className="block h-full rounded-lg border border-line bg-card p-5 hover:border-accent">
          <h2 className="font-semibold">{t.name}</h2><p className="mt-1 text-sm text-muted">{t.short}</p></Link></li>)}
      </ul>
    </>
  );
}
