import Link from "next/link";
import { cn } from "@/lib/utils";

export function BrandLogo({ className }: { className?: string }) {
  return (
    <Link className={cn("flex items-center gap-2.5", className)} href="/">
      <span className="flex size-6 items-center justify-center" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" className="size-6">
          <rect
            x="2.5"
            y="2.5"
            width="19"
            height="19"
            rx="5"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-mist"
          />
          <path
            d="M7 12.5l3.2 3.2L17 8.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-acid-lime"
          />
        </svg>
      </span>
      <span className="text-[16px] font-[510] leading-none tracking-[-0.011em] text-paper">
        Komitt
      </span>
    </Link>
  );
}
