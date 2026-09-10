export function LoadingScreen({ monogram }: { monogram: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.75rem",
      }}
    >
      <span className="font-display" style={{ fontStyle: "italic", fontSize: "2rem", color: "var(--deep-brown)" }}>
        {monogram}
      </span>
      <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>Preparing your invitation…</span>
    </div>
  );
}
