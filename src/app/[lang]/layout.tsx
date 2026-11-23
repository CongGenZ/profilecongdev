import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { profile } from "@/data/profile";
import { locales, ogLocales, localePath } from "@/i18n/config";
import { getI18n } from "@/i18n/server";
import { I18nProvider } from "@/i18n/provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "vietnamese"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const { locale, tr } = await getI18n();
  const p = tr(profile);
  const description = p.bio.split("\n\n")[0].substring(0, 160);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://profilecongdev.vercel.app";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${p.displayName} — ${p.title}`,
      template: `%s | ${p.displayName}`,
    },
    description,
    keywords: [
      "freelance developer",
      "web developer",
      "next.js developer",
      "react developer",
      "frontend developer",
      "vietnam developer",
    ],
    authors: [{ name: p.name }],
    creator: p.name,
    alternates: {
      canonical: localePath(locale, "/"),
      languages: Object.fromEntries(locales.map((l) => [l, localePath(l, "/")])),
    },
    openGraph: {
      type: "website",
      locale: ogLocales[locale],
      title: `${p.displayName} — ${p.title}`,
      description,
      siteName: p.displayName,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const { locale, messages, tr } = await getI18n();
  const p = tr(profile);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: p.name,
    alternateName: p.displayName,
    jobTitle: p.title,
    description: p.tagline,
    email: p.email,
    telephone: p.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: profile.address,
      addressLocality: "Hà Nội",
      addressCountry: "VN",
    },
    sameAs: [p.github, p.linkedin],
  };

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <I18nProvider locale={locale} messages={messages}>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
