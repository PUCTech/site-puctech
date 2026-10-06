import { ImageResponse } from "next/og";

export const alt = "PucTech | Liga Academia de Tecnologia da PUC-SP";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #020d2b 0%, #081a3e 60%, #2b6fac 100%)",
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex", fontSize: 150, fontWeight: 700 }}>
          <span>PUC</span>
          <span style={{ color: "#bae4fe", marginLeft: 16 }}>Tech</span>
        </div>
        <div style={{ marginTop: 24, fontSize: 36, color: "#bae4fe" }}>
          Liga Academia de Tecnologia da PUC-SP
        </div>
      </div>
    ),
    { ...size },
  );
}