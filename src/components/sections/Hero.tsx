import { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { useInvitationAnimation } from "../../hooks/useInvitationAnimation";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { MUSIC_START_EVENT } from "../ui/MusicToggle";

export function Hero({ monogram }: { monogram: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const { progressRef, open } = useInvitationAnimation({
    hostRef,
    hintRef,
  });

  // RAF loop: read progressRef and push to CSS custom property
  useEffect(() => {
    if (reducedMotion) return;
    let raf: number;
    let displayedProgress = 0;
    const tick = () => {
      const el = sceneRef.current;
      if (el) {
        const targetProgress = progressRef.current?.value ?? 0;
        displayedProgress += (targetProgress - displayedProgress) * 0.14;
        if (Math.abs(targetProgress - displayedProgress) < 0.001) {
          displayedProgress = targetProgress;
        }
        el.style.setProperty("--p", String(displayedProgress));
        // Stop the idle float once user starts scrolling
        el.style.setProperty("--float-state", displayedProgress > 0.02 ? "paused" : "running");
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reducedMotion, progressRef]);

  return (
    <section ref={hostRef} className="env-hero" aria-label="Invitation opening animation">
      <div ref={sceneRef} className="env" style={{ "--p": "0" } as React.CSSProperties}>
        <div className="envelope-reference" aria-label={`Wedding invitation envelope for ${monogram}`}>
          <div className="front">
            <img className="envelope-corner envelope-corner--left" src="/disco.gif" alt="" aria-hidden="true" />
            <div className="mailme">
              <p className="mailme__names">Shreeti<br /><span>&amp;</span><br />Prayag</p>
              <div className="mailme__divider">
                <div className="mailme__rule" aria-hidden="true" />
                <span className="mailme__icon">❦</span>
                <div className="mailme__rule__back" aria-hidden="true" />
              </div>
              <p className="mailme__details">13 October 2026</p>
              <p className="mailme__details">Arambha Banquet</p>
              <button
                type="button"
                className="invitation-start"
                onClick={() => {
                  window.dispatchEvent(new Event(MUSIC_START_EVENT));
                  open();
                }}
              >
                Open invitation
              </button>
            </div>
          </div>
          <div className="back">
            <img className="envelope-seal" src="/seal.png" alt="" aria-hidden="true" />
            <div className="letter">
              <div className="letter-inner">
                <p className="letter-eyebrow">WE’RE GETTING MARRIED</p>
                <h2>Shreeti<br /><span>&amp;</span><br />Prayag</h2>
                <p className="letter-event">HAPPILY EVER AFTER PARTY</p>
                <p className="letter-families">The Khadka Family&nbsp; &amp; &nbsp;The Gurung Family</p>
              </div>
            </div>
            <div className="flap left-flap" />
            <div className="flap right-flap" />
            <div className="flap bottom-flap" />
            <div className="flap top-flap" />
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div ref={hintRef} className="env__hint">
        <span>Open your invitation</span>
        <ChevronDown size={20} aria-hidden="true" />
      </div>
    </section>
  );
}
