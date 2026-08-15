import { ImageResponse } from "next/og";
import { BrandMark } from "./_assets/brand";
import { inter400, inter500, inter600 } from "./_assets/fonts";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const stats = [
  { value: "3", label: "goals done" },
  { value: "31", label: "milestones done" },
  { value: "86%", label: "consistency" },
];

const bars = [
  { key: "mon", day: "M", value: 68 },
  { key: "tue", day: "T", value: 82 },
  { key: "wed", day: "W", value: 55 },
  { key: "thu", day: "T", value: 92 },
  { key: "fri", day: "F", value: 74 },
  { key: "sat", day: "S", value: 88 },
  { key: "sun", day: "S", value: 60 },
];

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#08090a",
          padding: "56px 88px 48px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 90% 55% at 50% -10%, rgba(22,23,24,0.9) 0%, rgba(8,9,10,0) 60%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            background:
              "linear-gradient(90deg, #e4f222 0%, #e4f222 140px, #23252a 140px, #23252a 100%)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <BrandMark size={44} />
          <div
            style={{
              fontSize: 34,
              fontWeight: 500,
              letterSpacing: -0.8,
              color: "#ffffff",
            }}
          >
            Komitt
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            paddingTop: 40,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 58,
              fontWeight: 500,
              lineHeight: 1.02,
              letterSpacing: -1.3,
              color: "#ffffff",
            }}
          >
            <span>Turn your goals into</span>
            <span>daily proof of progress.</span>
          </div>
          <div
            style={{
              marginTop: 26,
              fontSize: 21,
              lineHeight: 1.5,
              letterSpacing: -0.2,
              color: "#8a8f98",
            }}
          >
            Set a goal. Get a plan. Check in daily. Let AI coach the next move.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            background: "#0f1011",
            border: "1px solid #23252a",
            borderRadius: 18,
            padding: "22px 26px",
            boxShadow: "inset 0 0 0 1px rgba(35,37,42,1)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  background: "#e4f222",
                }}
              />
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 500,
                  letterSpacing: -0.3,
                  color: "#e5e5e6",
                }}
              >
                Execution dashboard
              </span>
            </div>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 14px",
                borderRadius: 999,
                background: "rgba(228,242,34,0.12)",
                color: "#e4f222",
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
                <path
                  d="M12 2.5c2.8 4 4.5 6.6 4.5 9a4.5 4.5 0 11-9 0c0-2.4 1.7-5 4.5-9z"
                  stroke="#e4f222"
                  strokeWidth="1.6"
                />
                <path
                  d="M12 9v5"
                  stroke="#e4f222"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
              5 day streak
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginTop: 20,
              gap: 32,
            }}
          >
            <div style={{ display: "flex", gap: 40 }}>
              {stats.map((stat) => (
                <div key={stat.label} style={{ display: "flex", flexDirection: "column" }}>
                  <span
                    style={{
                      fontSize: 32,
                      fontWeight: 500,
                      letterSpacing: -1,
                      color: "#ffffff",
                    }}
                  >
                    {stat.value}
                  </span>
                  <span style={{ fontSize: 13, color: "#8a8f98", marginTop: 4 }}>
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 12 }}>
              {bars.map((bar) => (
                <div
                  key={bar.key}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      width: 20,
                      height: 88,
                      borderRadius: 4,
                      background: "rgba(35,37,42,0.9)",
                      display: "flex",
                      alignItems: "flex-end",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: `${Math.round((bar.value / 92) * 100)}%`,
                        borderRadius: 4,
                        background:
                          bar.value >= 80 ? "#e4f222" : "#8a8f98",
                      }}
                    />
                  </div>
                  <span style={{ fontSize: 11, color: "#62666d" }}>{bar.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 22,
          }}
        >
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 15,
              letterSpacing: -0.2,
              color: "#62666d",
            }}
          >
            komitt.vercel.app
          </span>
          <span style={{ fontSize: 13, color: "#62666d" }}>
            AI accountability for what you&apos;re building
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Inter", data: inter400, weight: 400, style: "normal" },
        { name: "Inter", data: inter500, weight: 500, style: "normal" },
        { name: "Inter", data: inter600, weight: 600, style: "normal" },
      ],
    },
  );
}
