import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage-grotesque",
  subsets: ["latin"],
  weight: ["800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://commit.coach"),
  title: {
    default: "Commit | AI accountability coach",
    template: "%s | Commit",
  },
  description:
    "Commit turns ambitious goals into scheduled milestones, daily check-ins, AI coaching, and progress dashboards powered by n8n and Supabase.",
  keywords: [
    "AI accountability coach",
    "goal tracking",
    "n8n automation",
    "Supabase",
    "daily check-ins",
    "execution platform",
  ],
  openGraph: {
    title: "Commit | AI accountability coach",
    description:
      "Set goals, stay accountable, reflect daily, and adapt your execution plan with AI.",
    url: "https://commit.coach",
    siteName: "Commit",
    images: [
      {
        url: "/og.svg",
        width: 1200,
        height: 630,
        alt: "Commit AI accountability dashboard preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Commit | AI accountability coach",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bricolage.variable} ${inter.variable} ${robotoMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
