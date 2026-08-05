"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";
import { readSessionFromHash, storeSession } from "@/lib/auth-session";

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const session = readSessionFromHash(window.location.hash);
    if (session) {
      storeSession(session);
    }
    router.replace("/dashboard");
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-4 text-center">
      <BrandLogo />
      <div className="flex items-center gap-2">
        <span className="size-1.5 animate-pulse rounded-full bg-acid-lime" />
        <p className="max-w-sm text-[14px] leading-relaxed text-fog">
          Finishing your Komitt session and opening your dashboard.
        </p>
      </div>
    </div>
  );
}
