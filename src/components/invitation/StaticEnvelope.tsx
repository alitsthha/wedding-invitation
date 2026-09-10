export function StaticEnvelope({ monogram }: { monogram: string }) {
  return (
    <div className="static-envelope" role="img" aria-label={`Wedding invitation envelope for ${monogram}`}>
      <svg width="280" height="200" viewBox="0 0 280 200" fill="none">
        <rect x="4" y="4" width="272" height="192" rx="10" fill="#f3e8d6" stroke="#e1cfae" />
        <path d="M4 14 L140 120 L276 14" stroke="#e1cfae" strokeWidth="2" fill="none" />
        <circle cx="140" cy="100" r="26" fill="#8f3b34" />
        <circle cx="140" cy="100" r="12" fill="#7a2f29" />
        <text x="140" y="105" textAnchor="middle" fontSize="12" fill="#f3e8d6" fontFamily="serif">
          {monogram}
        </text>
      </svg>
    </div>
  );
}
