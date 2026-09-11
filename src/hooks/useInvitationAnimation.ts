import { useCallback, useEffect, useRef, useState } from "react";
import {
  createOpeningTimeline,
  type OpeningProgressRef,
} from "../animations/envelopeTimeline";
import {
  AUTOSCROLL_START_EVENT,
  AUTOSCROLL_STOP_EVENT,
} from "../components/ui/MusicToggle";

interface UseInvitationAnimationArgs {
  hostRef: React.RefObject<HTMLElement | null>;
  hintRef: React.RefObject<HTMLElement | null>;
}

interface UseInvitationAnimationResult {
  /** Mutable ref read inside useFrame — never triggers React re-renders. */
  progressRef: React.RefObject<OpeningProgressRef>;
  /** True once the opening has substantially completed; used to reveal the nav bar. */
  revealed: boolean;
  open: () => void;
}

export function useInvitationAnimation({
  hostRef,
  hintRef,
}: UseInvitationAnimationArgs): UseInvitationAnimationResult {
  const progressRef = useRef<OpeningProgressRef>({ value: 0 });
  const [revealed, setRevealed] = useState(false);
  const revealedFired = useRef(false);
  const timelineRef = useRef<ReturnType<typeof createOpeningTimeline> | null>(null);
  const openedRef = useRef(false);
  const lockedRef = useRef(true);

  const setScrollLocked = useCallback((locked: boolean) => {
    document.documentElement.style.overflow = locked ? "hidden" : "";
    document.body.style.overflow = locked ? "hidden" : "";
    lockedRef.current = locked;
  }, []);

  const open = useCallback(() => {
    openedRef.current = true;
    timelineRef.current?.play();
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const timeline = createOpeningTimeline(progressRef.current, {
      host,
      hint: hintRef.current,
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
      onComplete: () => {
        setScrollLocked(false);
        window.dispatchEvent(new Event(AUTOSCROLL_START_EVENT));
      },
      onReverseComplete: () => {
        openedRef.current = false;
        setScrollLocked(true);
        window.dispatchEvent(new Event(AUTOSCROLL_STOP_EVENT));
      },
    });
    timelineRef.current = timeline;
    setScrollLocked(progressRef.current.value < 1);

    if (progressRef.current.value === 1) {
      setRevealed(true);
    }

    const handleWheel = (event: WheelEvent) => {
      if (lockedRef.current) {
        event.preventDefault();
        return;
      }

      if (event.deltaY < 0 && window.scrollY <= 1 && !lockedRef.current) {
        event.preventDefault();
        setScrollLocked(true);
        timeline.reverse();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      timeline.kill();
      timelineRef.current = null;
      setScrollLocked(false);
    };
  }, [setScrollLocked]);

  return { progressRef, revealed, open };
}
