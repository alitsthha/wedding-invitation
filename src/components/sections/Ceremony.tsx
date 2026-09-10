import { useEffect, useRef } from "react";
import { revealText } from "../../animations/sectionAnimations";
import { Divider } from "../ui/Divider";
import type { Wedding } from "../../data/wedding";

export function Ceremony({ data }: { data: Wedding }) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => revealText(cardRef.current), []);

  return (
      <section id="details" className="section section--tight container" aria-label="Ceremony details">
        <div ref={cardRef} className="details-card" style={{ textAlign: "center" }}>
          <p className="eyebrow">The ceremony</p>
          <Divider />
          <h2 className="section-heading font-display" style={{ marginBottom: "0.5rem" }}>
            {data.ceremony.time}
          </h2>
          <p style={{ marginBottom: "0.2rem" }}>{data.ceremony.venue}</p>
          <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>{data.ceremony.address}</p>

          {/* Embedded Google Map */}
          <div className="map-container">
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.820313790272!2d85.31441727625612!3d27.691947976191564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1900328f550b%3A0x59ec089865f59b43!2sAarambha%20Banquet%20%26%20Events!5e0!3m2!1sen!2snp!4v1789034904468!5m2!1sen!2snp"
                width="600"
                height="450"
                style={{ border: 0, display: "block" }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                title="Aarambha Banquet & Events Location Map"
            />
          </div>
        </div>
      </section>
  );
}
