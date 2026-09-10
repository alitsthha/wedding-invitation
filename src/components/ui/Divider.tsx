export function Divider({ center = true }: { center?: boolean }) {
  return <div className={`divider ${center ? "divider--center" : ""}`} aria-hidden="true" />;
}
