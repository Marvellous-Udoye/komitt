import { ImageResponse } from "next/og";
import { BrandMark } from "./_assets/brand";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
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
            width: 320,
            height: 320,
            borderRadius: 76,
            border: "10px solid #ffffff",
            background: "#0f1011",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 24px 60px rgba(0,0,0,0.55)",
          }}
        >
          <BrandMark size={176} />
        </div>
      </div>
    ),
    { ...size },
  );
}
