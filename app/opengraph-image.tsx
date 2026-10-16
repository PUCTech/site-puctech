import { ImageResponse } from "next/og";

export const alt = "PUC Tech | A Primeira Liga de Ciência e Tecnologia da PUC-SP";
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
            "#ffffff",
          color: "#04142f",
        }}
      >
        <div style={{ display: "flex", fontSize: 150, fontWeight: 700 }}>
          <span>PUC</span>
          <span style={{ color: "#00799a", marginLeft: 16 }}>Tech</span>
        </div>
        <div style={{ marginTop: 32, fontSize: 34, padding: "12px 32px", borderRadius: 999, background: "#01d4ff" }}>
          A Primeira Liga de Ciência e Tecnologia da PUC-SP
        </div>
      </div>
    ),
    { ...size },
  );
}