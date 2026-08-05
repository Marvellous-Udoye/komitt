import { ImageResponse } from "next/og";
import { BrandMark } from "./_assets/brand";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#08090a",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 50% 18%, #161718 0%, #08090a 58%)",
          }}
        />
        <div
          style={{
            display: "flex",
            width: 112,
            height: 112,
            borderRadius: 28,
            border: "4px solid #ffffff",
            background: "#0f1011",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <BrandMark size={60} />
        </div>
      </div>
    ),
    { ...size },
  );
}
