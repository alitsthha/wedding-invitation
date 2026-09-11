import gsap from "gsap";
import { prefersReducedMotion } from "./reducedMotion";

export interface OpeningProgressRef {
  /** 0 -> closed envelope, 1 -> invitation fully revealed. Read this every frame in R3F, never via setState. */
  value: number;
}

export interface OpeningTimelineOptions {
  /** The hero element that owns the opening interaction. */
  host: HTMLElement;
  /** Overlay DOM node containing the opening hint. */
  hint: HTMLElement | null;
  onUpdate?: (progress: number) => void;
  onComplete?: () => void;
  onReverseComplete?: () => void;
}

/**
 * Builds the one centralized timeline that drives the entire envelope -> card
 * transformation. Visual phases are derived from progress (0..1), so the
 * same animation can be played by the invitation button and reversed by an
 * upward scroll gesture.
 */
export function createOpeningTimeline(
  progressRef: OpeningProgressRef,
  options: OpeningTimelineOptions
) {
  const { host, hint, onUpdate, onComplete, onReverseComplete } = options;
  void host;

  if (prefersReducedMotion()) {
    progressRef.value = 1;
    onUpdate?.(1);
    if (hint) gsap.set(hint, { opacity: 0 });
    onComplete?.();
    return { play: () => {}, reverse: () => {}, kill: () => {} };
  }

  const tl = gsap.timeline({
    paused: true,
    onUpdate: () => {
      progressRef.value = tl.progress();
      onUpdate?.(tl.progress());
    },
    onComplete,
    onReverseComplete,
  });

  if (hint) {
    // Hint fades out as soon as the user begins scrolling (phase 0 -> 0.06).
    tl.to(hint, { opacity: 0, duration: 0.06 }, 0);
  }

  // Give each physical action enough time to read instead of rushing through
  // the turn, flap, and letter reveal in a single beat.
  tl.to({}, { duration: 9, ease: "none" });

  return {
    play: () => tl.play(),
    reverse: () => tl.reverse(),
    kill: () => tl.kill(),
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
