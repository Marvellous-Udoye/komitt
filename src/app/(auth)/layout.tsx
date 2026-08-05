import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-void text-mist">
      <header className="fixed inset-x-0 top-0 z-50">
        <nav className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-6">
          <BrandLogo />
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-[13px] text-fog transition-colors hover:text-paper"
          >
            <ArrowLeft className="size-3.5" />
            Back to site
          </Link>
        </nav>
      </header>
      {children}
    </main>
  );
}
