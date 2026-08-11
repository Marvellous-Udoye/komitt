"use client";

import { cn } from "@/lib/utils";

type UserAvatarProps = {
  user: { name?: string; avatarUrl?: string } | null;
  className?: string;
};

export function UserAvatar({ user, className }: UserAvatarProps) {
  const name = user?.name?.trim() || "Komitt user";
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  if (user?.avatarUrl) {
    return (
      <span
        className={cn(
          "inline-flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full ring-1 ring-graphite",
          className,
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={user.avatarUrl} alt={name} className="size-full object-cover" />
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex size-7 shrink-0 items-center justify-center rounded-full",
        className,
      )}
      style={{
        background:
          "conic-gradient(from 180deg, #4285f4, #34a853, #fbbc05, #ea4335, #4285f4)",
      }}
    >
      <span className="flex h-[calc(100%-4px)] w-[calc(100%-4px)] items-center justify-center rounded-full bg-obsidian text-[11px] font-[510] text-paper">
        {initials}
      </span>
    </span>
  );
}