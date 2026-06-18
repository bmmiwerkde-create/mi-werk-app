import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from '@/components/Footer'
import CookieBanner from '@/components/CookieBanner'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import SessionWrapper from '@/components/SessionWrapper'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mi-Werk – Handwerker & Dienstleister finden",
  description: "Finde geprüfte Handwerker, Reinigungskräfte, Personal Trainer und mehr in deiner Region. Kostenlos, direkt und ohne Vermittler kontaktieren.",
  keywords: ["Handwerker finden", "Dienstleister", "Elektriker", "Reinigung", "Personal Trainer", "Babysitter", "Nachhilfe", "Heimservice", "lokal", "Deutschland"],
  openGraph: {
    title: "Mi-Werk – Handwerker & Dienstleister finden",
    description: "Finde Dienstleister in deiner Region – schnell, einfach, direkt.",
    url: "https://mi-werk.de",
    siteName: "Mi-Werk",
    locale: "de_DE",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://mi-werk.de",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <GoogleAnalytics />
        <SessionWrapper>
          {children}
        </SessionWrapper>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
