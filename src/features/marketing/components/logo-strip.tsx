const logos = [
  { name: "Vercel", mark: "▲" },
  { name: "Cursor", mark: "▯" },
  { name: "Oscar", mark: "◆" },
  { name: "OpenAI", mark: "◈" },
  { name: "Coinbase", mark: "●" },
  { name: "Cash App", mark: "$" },
  { name: "Boom", mark: "◆" },
  { name: "Ramp", mark: "▰" },
];

export function LogoStrip() {
  return (
    <div className="mx-auto max-w-[1200px] px-6">
      <p className="text-center font-mono text-[11px] uppercase tracking-[0.14em] text-fog">
        Trusted by teams who ship every day
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-14 gap-y-6">
        {logos.map((logo) => (
          <span
            key={logo.name}
            className="inline-flex items-center gap-2 text-[15px] font-[510] tracking-[-0.011em] text-ash transition-colors hover:text-fog"
          >
            <span className="text-sm">{logo.mark}</span>
            {logo.name}
          </span>
        ))}
      </div>
    </div>
  );
}
