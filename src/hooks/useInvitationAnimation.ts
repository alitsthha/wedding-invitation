import { useEffect, useRef, useState } from "react";
import {
  createOpeningTimeline,
  type OpeningProgressRef,
} from "../animations/envelopeTimeline";

interface UseInvitationAnimationArgs {
  hostRef: React.RefObject<HTMLElement | null>;
  hintRef: React.RefObject<HTMLElement | null>;
  scrollLengthVh?: number;
}

interface UseInvitationAnimationResult {
  /** Mutable ref read inside useFrame — never triggers React re-renders. */
  progressRef: React.RefObject<OpeningProgressRef>;
  /** True once the opening has substantially completed; used to reveal the nav bar. */
  revealed: boolean;
}

export function useInvitationAnimation({
  hostRef,
  hintRef,
  scrollLengthVh = 350,
}: UseInvitationAnimationArgs): UseInvitationAnimationResult {
  const progressRef = useRef<OpeningProgressRef>({ value: 0 });
  const [revealed, setRevealed] = useState(false);
  const revealedFired = useRef(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const { kill } = createOpeningTimeline(progressRef.current, {
      host,
      hint: hintRef.current,
      scrollLengthVh,
      onUpdate: (progress) => {
        // Only reveal nav after card has completely filled viewport
        if (!revealedFired.current && progress > 0.95) {
          revealedFired.current = true;
          setRevealed(true);
        } else if (revealedFired.current && progress < 0.88) {
          revealedFired.current = false;
          setRevealed(false);
        }
      },
    });

    // Reduced-motion path resolves progress to 1 synchronously.
    if (progressRef.current.value === 1) {
      setRevealed(true);
    }

    return () => kill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { progressRef, revealed };
}
