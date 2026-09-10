import { useEffect, useRef } from "react";
import { parallaxLayer, revealText } from "../../animations/sectionAnimations";
import { Divider } from "../ui/Divider";
import type { Wedding } from "../../data/wedding";

function CheersIcon() {
  return (
    <svg
      className="intro__cheers"
      viewBox="0 0 64 64"
      fill="none"
      aria-label="Cheers"
      role="img"
    >
      <path d="M32 3V9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M26 6L28 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M38 6L36 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />

      <g transform="translate(32 34) rotate(-24) translate(-32 -34)">
        <path
          d="M23 16H31L29.4 32C29.2 34 27.6 35.4 25.6 35.4C23.6 35.4 22 34 21.8 32L20 16Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path d="M20.6 20H29.9" stroke="currentColor" strokeWidth="1.2" />
        <path d="M25.6 35.4V45" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M20 47H31.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="24.4" cy="24" r="0.9" fill="currentColor" />
        <circle cx="26.6" cy="27.5" r="0.7" fill="currentColor" />
        <circle cx="25.2" cy="30.5" r="0.6" fill="currentColor" />
      </g>

      <g transform="translate(32 34) rotate(24) translate(-32 -34)">
        <path
          d="M35 16H43L41.2 32C41 34 39.4 35.4 37.4 35.4C35.4 35.4 33.8 34 33.6 32L32 16Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path d="M32.6 20H41.9" stroke="currentColor" strokeWidth="1.2" />
        <path d="M37.4 35.4V45" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M32 47H43.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="36.4" cy="25" r="0.9" fill="currentColor" />
        <circle cx="38.6" cy="28.5" r="0.7" fill="currentColor" />
        <circle cx="37.2" cy="31.5" r="0.6" fill="currentColor" />
      </g>
    </svg>
  );
}

export function Introduction({ data }: { data: Wedding }) {
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const namesRef = useRef<HTMLHeadingElement>(null);
  const inviteRef = useRef<HTMLParagraphElement>(null);
  const beginRef = useRef<HTMLParagraphElement>(null);
  const bottleRef = useRef<HTMLDivElement>(null);
  const glassRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const cleanups = [
      revealText(eyebrowRef.current),
      revealText(namesRef.current, { delay: 0.1 }),
      revealText(inviteRef.current, { delay: 0.2 }),
      revealText(beginRef.current, { delay: 0.3 }),
      parallaxLayer(bottleRef.current, 0.08, 274),
      parallaxLayer(glassRef.current, -0.06, 49),
    ];
    return () => cleanups.forEach((c) => c());
  }, []);

  return (
    <section id="home" className="section intro container" aria-label="Introduction">
      <div className="intro__decor intro__decor--bottle" ref={bottleRef} aria-hidden="true">
        <img src="/champagneBottle.png" alt="" />
      </div>
      <div className="intro__decor intro__decor--glass" ref={glassRef} aria-hidden="true">
        <img src="/glass.png" alt="" />
      </div>
      <p ref={eyebrowRef} className="eyebrow intro__eyebrow">
        {data.intro.eyebrow}
      </p>
      <Divider />
      <h1 ref={namesRef} className="intro__names font-display">
        <div className="intro__partner-column" aria-hidden="true">
        <span className="fullname_partner">{data.fullname.partnerOne}</span>
        <span className="intro__partner">{data.intro.partnerOne}</span>
        </div>
        <CheersIcon />
        <div className="intro__partner-column" aria-hidden="true">
        <span className="fullname_partner">{data.fullname.partnerTwo}</span>
        <span className="intro__partner">{data.intro.partnerTwo}</span>
        </div>
      </h1>
      <p ref={inviteRef} className="body-measure intro__invite">
        {data.intro.invite}
      </p>
      <p ref={beginRef} className="body-measure intro__begin">
        {data.intro.begin}
      </p>
    </section>
  );
}
