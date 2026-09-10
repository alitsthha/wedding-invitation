import { useEffect, useRef } from "react";
import { revealText, revealImage, parallaxLayer } from "../../animations/sectionAnimations";
import { Divider } from "../ui/Divider";
import type { Wedding } from "../../data/wedding";

export function Story({ data }: { data: Wedding }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cleanups = [
      revealText(headingRef.current),
      revealText(bodyRef.current, { delay: 0.08 }),
      revealImage(imageRef.current),
      parallaxLayer(imageRef.current, 0.08),
    ];
    return () => cleanups.forEach((c) => c());
  }, []);

  return (
    <section id="story" className="section container" aria-label="Our story">
      <div className="story">
        <div>
          <h2 ref={headingRef} className="section-heading font-display">
            {data.story.heading}
          </h2>
          <Divider center={false} />
          <p ref={bodyRef} className="body-measure">
            {data.story.body}
          </p>
        </div>
        <div ref={imageRef} className="story__image" role="img" aria-label="Shreeti and Prayag together outdoors" />
      </div>
    </section>
  );
}
