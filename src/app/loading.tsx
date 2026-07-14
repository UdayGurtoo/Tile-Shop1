export default function Loading() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(8px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999990,
        transition: "opacity 0.2s ease",
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          border: "4px solid #f1f5f9",
          borderTopColor: "#D4AF37",
          animation: "pageSpin 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite",
          marginBottom: 24,
          boxShadow: "0 0 25px rgba(212, 175, 55, 0.25)",
        }}
      />
      <h3
        style={{
          fontSize: 16,
          fontWeight: 700,
          color: "#1e293b",
          letterSpacing: 1.5,
          textTransform: "uppercase",
          fontFamily: "var(--font-sans, sans-serif)",
        }}
      >
        MOHIT TILES & GRANITES
      </h3>
      <p style={{ fontSize: 13, color: "#64748b", marginTop: 6, fontWeight: 500 }}>
        Loading experience...
      </p>
      <style>{`
        @keyframes pageSpin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
