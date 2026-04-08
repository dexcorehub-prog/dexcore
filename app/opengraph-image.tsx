import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(circle at top, rgba(47,107,255,0.35), transparent 30%), linear-gradient(180deg, #0B0D10 0%, #12161C 100%)",
          color: "white",
          padding: 72,
          fontFamily: "Inter, sans-serif"
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: 36,
            padding: 48,
            background: "rgba(255,255,255,0.04)"
          }}
        >
          <div style={{ fontSize: 20, letterSpacing: 4, textTransform: "uppercase", opacity: 0.72 }}>
            Created in Mexico • Built for Mexico + USA
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ fontSize: 88, fontWeight: 900, lineHeight: 1 }}>Dexcore</div>
            <div style={{ fontSize: 34, color: "rgba(255,255,255,0.85)", maxWidth: 850 }}>
              Premium AI systems for real-world service businesses.
            </div>
          </div>
          <div style={{ display: "flex", gap: 14 }}>
            {["EN / ES", "USD / MXN", "Stripe Ready", "Legal + SEO"].map((item) => (
              <div
                key={item}
                style={{
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.06)",
                  padding: "10px 18px",
                  fontSize: 22
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size
  );
}
