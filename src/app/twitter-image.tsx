import { ImageResponse } from "next/og";
import { BrandMark } from "./_assets/brand";
import { inter400, inter500 } from "./_assets/fonts";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function TwitterImage() {
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
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #23252a",
            paddingTop: 20,
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
            Goals · Tasks · Check-ins · Coaching
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Inter", data: inter400, weight: 400, style: "normal" },
        { name: "Inter", data: inter500, weight: 500, style: "normal" },
      ],
    },
  );
}
