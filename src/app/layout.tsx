import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, Inter, JetBrains_Mono, Caveat } from 'next/font/google';
import { site, profile } from '@/content';
import './globals.css';

/* Fonts are downloaded at build time and self-hosted, so there is no
 * request to Google from the visitor's browser and no layout shift. */
const display = Bricolage_Grotesque({ subsets: ['latin'], weight: ['600', '800'], variable: '--font-display', display: 'swap' });
const sans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono', display: 'swap' });
const hand = Caveat({ subsets: ['latin'], weight: ['500'], variable: '--font-hand', display: 'swap', preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  authors: [{ name: profile.name, url: profile.links.linkedin }],
  keywords: ['Python backend engineer', 'Django developer', 'Django REST Framework', 'Leeds', 'UK', 'AWS', 'PostgreSQL'],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: '/',
    title: site.title,
    description: site.description,
    siteName: profile.name,
    locale: 'en_GB',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: `${profile.name}, ${profile.role}` }],
  },
  twitter: { card: 'summary_large_image', title: site.title, description: site.description, images: ['/og.png'] },
  icons: { icon: '/favicon.svg' },
};

export const viewport: Viewport = { themeColor: '#0A0B0D', colorScheme: 'dark' };

/** Structured data so search engines understand who the site is about. */
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: profile.name,
  jobTitle: profile.role,
  email: `mailto:${profile.email}`,
  url: site.url,
  address: { '@type': 'PostalAddress', addressLocality: 'Leeds', addressCountry: 'GB' },
  sameAs: [profile.links.github, profile.links.linkedin],
  knowsAbout: ['Python', 'Django', 'Django REST Framework', 'PostgreSQL', 'MySQL', 'AWS', 'Docker', 'Celery', 'Redis'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${display.variable} ${sans.variable} ${mono.variable} ${hand.variable}`}>
      <body className="bg-bg font-sans text-fg antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
      </body>
    </html>
  );
}
