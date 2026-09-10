import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "./reducedMotion";

gsap.registerPlugin(ScrollTrigger);

export interface OpeningProgressRef {
  /** 0 -> closed envelope, 1 -> invitation fully revealed. Read this every frame in R3F, never via setState. */
  value: number;
}

export interface OpeningTimelineOptions {
  /** The tall pinned host element the ScrollTrigger pins/scrubs against. */
  host: HTMLElement;
  /** Overlay DOM node containing the "Scroll to open" hint. */
  hint: HTMLElement | null;
  /** Scroll distance (in viewport heights) the whole opening sequence consumes. */
  scrollLengthVh?: number;
  onUpdate?: (progress: number) => void;
}

/**
 * Builds the one centralized scroll timeline that drives the entire
 * envelope -> card -> full page transformation. All visual phases are
 * derived from timeline progress (0..1), never from setTimeout or fixed
 * durations, so scrubbing forward/backward/fast/slow stays in sync.
 */
export function createOpeningTimeline(
  progressRef: OpeningProgressRef,
  options: OpeningTimelineOptions
) {
  const { host, hint, scrollLengthVh = 350, onUpdate } = options;

  if (prefersReducedMotion()) {
    // Reduced motion: skip the pinned scroll sequence entirely, show the
    // invitation directly, keep the hint hidden.
    progressRef.value = 1;
    onUpdate?.(1);
    if (hint) gsap.set(hint, { opacity: 0 });
    return { scrollTrigger: null as ScrollTrigger | null, kill: () => {} };
  }

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: host,
      start: "top top",
      end: `+=${scrollLengthVh}%`,
      scrub: 0.85,
      pin: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        progressRef.value = self.progress;
        onUpdate?.(self.progress);
      },
    },
  });

  if (hint) {
    // Hint fades out as soon as the user begins scrolling (phase 0 -> 0.06).
    tl.to(hint, { opacity: 0, duration: 0.06 }, 0);
  }

  // A no-op tween just to give the timeline a duration to scrub across;
  // the actual visual work happens in the Three.js scene reading progressRef.
  tl.to({}, { duration: 1 });

  return {
    scrollTrigger: tl.scrollTrigger as ScrollTrigger,
    kill: () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    },
  };
}

/**
 * Named phase boundaries — the extended cinematic timeline.
 * Each phase occupies more scroll distance for a luxurious feel.
 *
 * 0.00–0.06  Idle / hint fades
 * 0.06–0.18  Camera approaches, gentle tilt
 * 0.18–0.26  Wax seal reacts (wobble)
 * 0.26–0.36  Seal lifts away, particles burst
 * 0.36–0.54  Flap unfolds backward revealing liner
 * 0.54–0.72  Card rises out of envelope
 * 0.72–0.83  Envelope fades, card straightens & centers
 * 0.83–0.95  Card fills viewport
 * 0.95–1.00  Final settle
 */
export const OPENING_PHASES = {
  idle: 0.06,
  cameraApproach: 0.18,
  sealReacts: 0.18,
  sealOpens: 0.36,
  flapOpens: 0.54,
  cardEmerges: 0.54,
  cardRises: 0.72,
  cardStraightens: 0.83,
  cardFillsViewport: 0.95,
  complete: 1,
};

/** Linear interpolation: maps a sub-range of progress to 0..1. */
export function mapRange(value: number, start: number, end: number): number {
  if (end === start) return value >= end ? 1 : 0;
  const t = (value - start) / (end - start);
  return Math.min(1, Math.max(0, t));
}

/** Smoothstep variant: same as mapRange but with ease-in-out smoothing. */
export function smoothMapRange(value: number, start: number, end: number): number {
  const t = mapRange(value, start, end);
  return t * t * (3 - 2 * t);
}
