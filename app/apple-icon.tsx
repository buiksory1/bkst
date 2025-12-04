import { ImageResponse } from "next/og"

export const size = {
  width: 180,
  height: 180,
}
export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        fontSize: 24,
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "32px",
      }}
    >
      <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Center node */}
        <circle cx="12" cy="12" r="3" fill="#22d3ee" />

        {/* Outer nodes */}
        <circle cx="12" cy="4" r="2" fill="#06b6d4" />
        <circle cx="20" cy="12" r="2" fill="#06b6d4" />
        <circle cx="12" cy="20" r="2" fill="#06b6d4" />
        <circle cx="4" cy="12" r="2" fill="#06b6d4" />

        {/* Connection lines */}
        <line x1="12" y1="6" x2="12" y2="9" stroke="#0891b2" strokeWidth="1.5" />
        <line x1="18" y1="12" x2="15" y2="12" stroke="#0891b2" strokeWidth="1.5" />
        <line x1="12" y1="18" x2="12" y2="15" stroke="#0891b2" strokeWidth="1.5" />
        <line x1="6" y1="12" x2="9" y2="12" stroke="#0891b2" strokeWidth="1.5" />

        {/* Diagonal nodes */}
        <circle cx="6" cy="6" r="1.5" fill="#0e7490" />
        <circle cx="18" cy="6" r="1.5" fill="#0e7490" />
        <circle cx="18" cy="18" r="1.5" fill="#0e7490" />
        <circle cx="6" cy="18" r="1.5" fill="#0e7490" />

        {/* Diagonal lines */}
        <line x1="7.5" y1="7.5" x2="10" y2="10" stroke="#0891b2" strokeWidth="1" opacity="0.7" />
        <line x1="16.5" y1="7.5" x2="14" y2="10" stroke="#0891b2" strokeWidth="1" opacity="0.7" />
        <line x1="16.5" y1="16.5" x2="14" y2="14" stroke="#0891b2" strokeWidth="1" opacity="0.7" />
        <line x1="7.5" y1="16.5" x2="10" y2="14" stroke="#0891b2" strokeWidth="1" opacity="0.7" />
      </svg>
    </div>,
    {
      ...size,
    },
  )
}
