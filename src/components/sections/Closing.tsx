import { useEffect, useRef } from "react";
import { revealText } from "../../animations/sectionAnimations";
import { Divider } from "../ui/Divider";
import type { Wedding } from "../../data/wedding";

export function Closing({ data }: { data: Wedding }) {
  const lineRef = useRef<HTMLParagraphElement>(null);
  const namesRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const cleanups = [revealText(lineRef.current), revealText(namesRef.current, { delay: 0.1 })];
    return () => cleanups.forEach((c) => c());
  }, []);

  return (
    <section className="closing container" aria-label="Closing">
      <p ref={lineRef} className="body-measure" style={{ marginInline: "auto", color: "var(--muted)" }}>
        {data.closing.line}
      </p>
      <Divider />
      <h2 ref={namesRef} className="font-display" style={{ fontStyle: "italic", fontSize: "clamp(2rem, 5vw, 3.2rem)" }}>
        {data.couple.partnerOne} &amp; {data.couple.partnerTwo}
      </h2>
    </section>
  );
}
