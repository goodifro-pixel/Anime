import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://anihub-clone.vercel.app"),
  title: {
    default: "AniHub — Аніме українською онлайн",
    template: "%s | AniHub",
  },
  description:
    "AniHub — дивіться аніме онлайн українською безкоштовно. Каталог, новинки, топ рейтингу, онгоінги.",
  keywords: [
    "аніме",
    "аніме українською",
    "anihub",
    "anime online",
    "дивитись аніме",
    "озвучення",
    "субтитри",
  ],
  openGraph: {
    type: "website",
    locale: "uk_UA",
    siteName: "AniHub",
    title: "AniHub — Аніме українською онлайн",
    description:
      "AniHub — дивіться аніме онлайн українською безкоштовно. Каталог, новинки, топ рейтингу, онгоінги.",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0b12",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uk" className={inter.variable}>
      <body className="min-h-screen bg-bg text-gray-100 antialiased">
        <Header />
        <main className="min-h-[calc(100vh-180px)]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
