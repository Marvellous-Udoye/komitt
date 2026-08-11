"use client";

import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { useUser } from "@/lib/user-store";
import { useDashboard } from "@/lib/dashboard-store";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    useUser.getState().hydrate();
    useDashboard.getState().syncFromN8n().catch(() => undefined);
  }, []);

  return (
    <div className="min-h-screen bg-void">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[240px] lg:block">
        <Sidebar />
      </aside>

      <div className="lg:pl-[240px]">
        <Topbar onMenuClick={() => setMobileOpen(true)} />
        <main className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 sm:py-10">
          {children}
        </main>
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[260px] border-r border-graphite bg-carbon p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <Sidebar onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
