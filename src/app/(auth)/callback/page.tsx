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
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <BrandLogo />
      <p className="max-w-sm text-base leading-7">
        Finishing your Commit session and opening your dashboard.
      </p>
    </div>
  );
}
