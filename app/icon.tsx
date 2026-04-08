import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512
};

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
          background: "linear-gradient(180deg, #0B0D10 0%, #12161C 100%)"
        }}
      >
        <div
          style={{
            width: 300,
            height: 300,
            borderRadius: 80,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid rgba(255,255,255,0.12)",
            background: "linear-gradient(180deg, rgba(47,107,255,0.35), rgba(255,255,255,0.06))",
            color: "white",
            fontSize: 168,
            fontWeight: 900
          }}
        >
          D
        </div>
      </div>
    ),
    size
  );
}
