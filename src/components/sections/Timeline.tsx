import { useEffect, useRef } from "react";
import { revealText, revealSequence } from "../../animations/sectionAnimations";
import { Divider } from "../ui/Divider";
import type { Wedding } from "../../data/wedding";

export function Timeline({ data }: { data: Wedding }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const itemRefs = useRef<HTMLLIElement[]>([]);
    const lineRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const cleanups = [
      revealText(headingRef.current),
      revealSequence(itemRefs.current, listRef.current, { duration: 5, stagger: 0.22, scrub: 0.8 }),
    ];
    return () => cleanups.forEach((c) => c());
  }, []);

  return (
    <section className="section container section-timeline" style={{ textAlign: "center" }} aria-label="Day program">
      <p className="eyebrow">The Evening Ahead</p>
      <h2 ref={headingRef} className="section-heading font-display">
        How the day unfolds
      </h2>
      <Divider />
      <ol ref={listRef} className="timeline" style={{ textAlign: "left" }}>
        {data.timeline.map((item, i) => (
          <li
            key={item.time}
            className="timeline__item"
            ref={(el) => {
              if (el) itemRefs.current[i] = el;
            }}
          >
            <div className="timeline__time">{item.time}</div>
            <div className="timeline__label font-display">{item.label}</div>
          </li>
        ))}
      </ol>
        <p ref={lineRef} className="body-measure" style={{ marginInline: "auto", color: "var(--muted)" }}>
            {data.hugs.line}
        </p>
    </section>
  );
}
