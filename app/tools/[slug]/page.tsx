import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AdSlot from '@/components/AdSlot';
import ToolRunner from '@/components/ToolRunner';
import { SITE, bySlug, tools } from '@/lib/tools';
export const dynamicParams = false;
export const generateStaticParams = () => tools.map((t) => ({ slug: t.slug }));
type P = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const t = bySlug((await params).slug); if (!t) return {};
  const url = `/tools/${t.slug}`;
  return { title: t.title, description: t.description, keywords: t.keywords, alternates: { canonical: url },
    openGraph: { title: t.title, description: t.description, url, type: 'website' }, twitter: { card: 'summary', title: t.title, description: t.description } };
}
export default async function ToolPage({ params }: P) {
  const t = bySlug((await params).slug); if (!t) notFound();
  const url = `${SITE.url}/tools/${t.slug}`;
  const ld = [
    { '@context': 'https://schema.org', '@type': 'WebApplication', name: t.name, description: t.description, url, applicationCategory: 'UtilitiesApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: t.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url }, { '@type': 'ListItem', position: 2, name: t.name, item: url }] },
  ];
  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, '\\u003c') }} />
      <h1 className="text-3xl font-bold tracking-tight">{t.name}</h1>
      <p className="mt-2 mb-6 max-w-2xl text-muted">{t.short}</p>
      <AdSlot slot={process.env.NEXT_PUBLIC_AD_SLOT_TOP} height={100} />
      <ToolRunner slug={t.slug} />
      <AdSlot slot={process.env.NEXT_PUBLIC_AD_SLOT_BOTTOM} height={280} />
      <section className="prose-x max-w-2xl"><h2>How to use the {t.name}</h2><ol>{t.howTo.map((s) => <li key={s}>{s}</li>)}</ol>
        <h2>Frequently asked questions</h2>{t.faq.map((f) => <div key={f.q} className="mb-4"><h3 className="font-medium">{f.q}</h3><p>{f.a}</p></div>)}</section>
    </article>
  );
}
