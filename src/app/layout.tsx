import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/shared/contexts/LanguageContext";
import { LanguageSelector } from "@/shared/components/LanguageSelector";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = 'https://ddangit.vercel.app';

export const metadata: Metadata = {
  title: "ddangit | Quick Games",
  description: "Simple mini-games to kill time. Test your reaction speed, aim, and more!",
  metadataBase: new URL(BASE_URL),
  openGraph: {
    title: 'ddangit | Quick Games',
    description: 'Simple mini-games to kill time. Test your reaction speed, aim, and more!',
    url: BASE_URL,
    siteName: 'ddangit',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ddangit | Quick Games',
    description: 'Simple mini-games to kill time. Test your reaction speed, aim, and more!',
  },
  other: {
    "google-adsense-account": "ca-pub-6250352377526864",
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#030712',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6250352377526864"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          <LanguageSelector />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
