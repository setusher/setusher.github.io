import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { site } from "@/lib/content";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  style: ["italic"],
  weight: ["400"],
  display: "swap",
});

const title = `${site.name} · Full Stack & AI Developer`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title,
  description: site.description,
  authors: [{ name: site.name, url: site.github }],
  openGraph: {
    type: "website",
    url: site.url,
    title,
    description: site.description,
    siteName: site.name,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: `${site.name} portfolio` }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: site.description,
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#1d1d1f",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <head>
        {/* Flags that JS runs so scroll-reveal styles only hide content when they can reveal it again. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
