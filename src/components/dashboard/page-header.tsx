import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  actions,
  className,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-4", className)}>
      <div>
        <h2 className="text-[28px] font-[510] leading-tight tracking-[-0.022em] text-paper">
          {title}
        </h2>
        {description && (
          <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-fog">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "hairline rounded-xl bg-carbon p-5",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  description,
  trailing,
}: {
  title: string;
  description?: string;
  trailing?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h3 className="text-[15px] font-[510] tracking-[-0.011em] text-paper">{title}</h3>
        {description && <p className="mt-1 text-[12px] text-fog">{description}</p>}
      </div>
      {trailing}
    </div>
  );
}
