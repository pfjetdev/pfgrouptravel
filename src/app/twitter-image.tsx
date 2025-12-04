import { ImageResponse } from "next/og"

export const runtime = "edge"

export const alt = "Priority Flyers - Group Flight Booking Specialists"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0f172a",
          backgroundImage:
            "radial-gradient(circle at 25% 25%, #1e3a8a 0%, transparent 50%), radial-gradient(circle at 75% 75%, #312e81 0%, transparent 50%)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "40px",
          }}
        >
          {/* Logo / Icon */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "30px",
            }}
          >
            <svg
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              style={{ marginRight: "20px" }}
            >
              <path
                d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"
                fill="white"
              />
            </svg>
            <span
              style={{
                fontSize: 48,
                fontWeight: 700,
                color: "white",
                letterSpacing: "-0.02em",
              }}
            >
              Priority Flyers
            </span>
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: 32,
              color: "#94a3b8",
              marginBottom: "40px",
              maxWidth: "800px",
            }}
          >
            Group Flight Booking Specialists
          </div>

          {/* Features */}
          <div
            style={{
              display: "flex",
              gap: "40px",
              color: "#e2e8f0",
              fontSize: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span style={{ color: "#3b82f6" }}>✓</span>
              <span>500+ Airlines</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span style={{ color: "#3b82f6" }}>✓</span>
              <span>10+ Passengers</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span style={{ color: "#3b82f6" }}>✓</span>
              <span>24h Quotes</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: "linear-gradient(to right, #3b82f6, #8b5cf6)",
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  )
}
