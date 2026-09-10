import gsap from "gsap";

/** Reads the live prefers-reduced-motion state without subscribing (for one-off checks inside GSAP setup code). */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Wraps a GSAP animation setup function so it's skipped entirely when the
 * user prefers reduced motion — the caller is responsible for making sure
 * the underlying content is still visible/usable without it.
 */
export function withMotion(setup: () => void | (() => void)): () => void {
  if (prefersReducedMotion()) {
    return () => {};
  }
  const cleanup = setup();
  return cleanup ?? (() => {});
}

export function killTweensOf(target: gsap.TweenTarget) {
  gsap.killTweensOf(target);
}
