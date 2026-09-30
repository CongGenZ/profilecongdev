import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { profile } from "@/data/profile";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${profile.displayName} — ${profile.title}`,
    template: `%s | ${profile.displayName}`,
  },
  description: profile.bio.split("\n\n")[0].substring(0, 160),
  keywords: [
    "freelance developer",
    "web developer",
    "next.js developer",
    "react developer",
    "frontend developer",
    "vietnam developer",
  ],
  authors: [{ name: profile.name }],
  creator: profile.name,
  openGraph: {
    type: "website",
    locale: "vi_VN",
    title: `${profile.displayName} — ${profile.title}`,
    description: profile.bio.split("\n\n")[0].substring(0, 160),
    siteName: profile.displayName,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
