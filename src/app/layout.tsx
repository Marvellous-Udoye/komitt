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
  metadataBase: new URL("https://komitt.coach"),
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
  ],
  openGraph: {
    title: "Komitt | AI accountability coach",
    description:
      "Set goals, stay accountable, reflect daily, and adapt your execution plan with AI.",
    url: "https://komitt.coach",
    siteName: "Komitt",
    images: [
      {
        url: "/og.svg",
        width: 1200,
        height: 630,
        alt: "Komitt AI accountability dashboard preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Komitt | AI accountability coach",
    description:
      "An AI execution platform for goals, tasks, check-ins, and coaching feedback.",
    images: ["/og.svg"],
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
    apple: "/icon.svg",
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
