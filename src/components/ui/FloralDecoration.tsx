import { useEffect, useRef } from "react";
import { revealFloral } from "../../animations/sectionAnimations";

interface FloralDecorationProps {
  className?: string;
  flip?: boolean;
  direction?: 1 | -1;
  style?: React.CSSProperties;
}

/** A single reusable botanical branch mark, used as a section accent. */
export function FloralDecoration({ className = "", flip = false, direction = 1, style }: FloralDecorationProps) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => revealFloral(ref.current, direction), [direction]);

  return (
    <svg
      ref={ref}
      className={`floral-decoration ${className}`}
      width="120"
      height="160"
      viewBox="0 0 120 160"
      fill="none"
      style={{ ...(flip ? { transform: "scaleX(-1)" } : {}), ...style }}
      aria-hidden="true"
    >
      <path
        d="M60 150C58 110 62 70 58 20"
        stroke="var(--sage)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {[24, 46, 68, 92, 116].map((y, i) => (
        <path
          key={y}
          d={`M60 ${y} C ${i % 2 === 0 ? 80 : 40} ${y - 16}, ${i % 2 === 0 ? 88 : 32} ${y + 6}, 60 ${y + 18}`}
          stroke="var(--sage)"
          strokeWidth="1.2"
          fill="none"
        />
      ))}
      <circle cx="60" cy="16" r="4" fill="var(--clay-soft)" />
    </svg>
  );
}
