import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import './globals.css';
import ThemeToggle from '@/components/ThemeToggle';
import { SITE, tools } from '@/lib/tools';
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} – Free Online Tools`, template: `%s | ${SITE.name}` },
  description: SITE.desc, icons: { icon: '/favicon.svg' },
  openGraph: { siteName: SITE.name, type: 'website', title: `${SITE.name} – Free Online Tools`, description: SITE.desc },
  robots: { index: true, follow: true },
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#0f766e' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const ad = process.env.NEXT_PUBLIC_ADSENSE_ID;
  return (
    <html lang="en" suppressHydrationWarning>
      <head><script src="/theme.js" /></head>
      <body>
        <header className="border-b border-line"><div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link href="/" className="text-lg font-bold tracking-tight">{SITE.name}</Link>
          <nav aria-label="Tools" className="hidden gap-4 text-sm text-muted md:flex">{tools.map((t) => <Link key={t.slug} href={`/tools/${t.slug}`} className="hover:text-ink">{t.name.split(' ')[0]}</Link>)}</nav>
          <ThemeToggle />
        </div></header>
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        <footer className="border-t border-line py-6 text-center text-sm text-muted">© {new Date().getFullYear()} {SITE.name}. All processing happens in your browser.</footer>
        {ad && <Script async strategy="afterInteractive" src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ad}`} crossOrigin="anonymous" />}
      </body>
    </html>
  );
}
