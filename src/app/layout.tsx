import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter-variable",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-berkeley-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://komitt.vercel.app"),
  applicationName: "Komitt",
  title: {
    default: "Komitt | AI accountability coach",
    template: "%s | Komitt",
  },
  description:
    "Komitt turns ambitious goals into clear plans, daily check-ins, personalized coaching, and progress dashboards that keep execution moving.",
  keywords: [
    "AI accountability coach",
    "goal tracking",
    "daily check-ins",
    "execution platform",
    "AI coach",
    "habit tracking",
  ],
  authors: [{ name: "Komitt" }],
  category: "productivity",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://komitt.vercel.app",
    siteName: "Komitt",
    title: "Komitt | AI accountability coach",
    description:
      "Set goals, stay accountable, reflect daily, and adapt your execution plan with AI. Turn your goals into daily proof of progress.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@komitt",
    creator: "@komitt",
    title: "Komitt | AI accountability coach",
    description:
      "An AI execution platform for goals, tasks, check-ins, and coaching feedback.",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "48x48" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#08090a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
        <Toaster position="bottom-right" theme="dark" richColors closeButton />
      </body>
    </html>
  );
}
