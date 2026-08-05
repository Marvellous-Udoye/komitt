import type { Metadata } from "next";
import { AppShell } from "@/components/dashboard/app-shell";

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: "%s | Komitt",
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
