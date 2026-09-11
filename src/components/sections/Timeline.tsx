import { useEffect, useRef } from "react";
import { revealText } from "../../animations/sectionAnimations";
import { Divider } from "../ui/Divider";
import type { Wedding } from "../../data/wedding";

export function Timeline({ data }: { data: Wedding }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const timeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hugsRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const cleanups = [revealText(headingRef.current)];
    data.timeline.forEach((_, i) => {
      cleanups.push(
        revealText(timeRefs.current[i], { delay: i * 0.2 }),
        revealText(labelRefs.current[i], { delay: i * 0.2 + 0.08 }),
      );
    });
    cleanups.push(revealText(hugsRef.current, { delay: data.timeline.length * 0.2 + 0.16 }));
    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  return (
    <section className="section container section-timeline" style={{ textAlign: "center" }} aria-label="Day program">
      <p className="eyebrow">The Evening Ahead</p>
      <h2 ref={headingRef} className="section-heading font-display">
        How the day unfolds
      </h2>
      <Divider />
      <ol className="timeline" style={{ textAlign: "left" }}>
        {data.timeline.map((item, i) => (
          <li
            key={item.time}
            className="timeline__item"
          >
            <div ref={(element) => { timeRefs.current[i] = element; }} className="timeline__time">
              {item.time}
            </div>
            <div ref={(element) => { labelRefs.current[i] = element; }} className="timeline__label font-display">
              {item.label}
            </div>
          </li>
        ))}
      </ol>
        <p ref={hugsRef} className="body-measure" style={{ marginInline: "auto", color: "var(--muted)" }}>
            {data.hugs.line}
        </p>
    </section>
  );
}
