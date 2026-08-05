export function BrandMark({
  size = 32,
  stroke = "#ffffff",
  check = "#e4f222",
}: {
  size?: number;
  stroke?: string;
  check?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
      <rect
        x="2.5"
        y="2.5"
        width="19"
        height="19"
        rx="5"
        stroke={stroke}
        strokeWidth="1.5"
      />
      <path
        d="M7 12.5l3.2 3.2L17 8.5"
        stroke={check}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
