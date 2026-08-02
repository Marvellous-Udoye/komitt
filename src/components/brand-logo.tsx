import Link from "next/link";

export function BrandLogo() {
  return (
    <Link className="flex items-center gap-2" href="/">
      <span className="brand-mark" aria-hidden="true">
        ko
      </span>
      <span className="text-xl font-bold tracking-normal">Komitt</span>
    </Link>
  );
}
