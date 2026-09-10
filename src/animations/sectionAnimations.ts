import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "./reducedMotion";

gsap.registerPlugin(ScrollTrigger);

const defaultTrigger = (el: Element) => ({
  trigger: el,
  start: "top 82%",
  toggleActions: "play none none reverse" as const,
});

/** Fade + translate upward — used for headings and body text. */
export function revealText(el: Element | null, opts: { delay?: number } = {}) {
  if (!el || prefersReducedMotion()) return () => {};
  const tween = gsap.fromTo(
    el,
    { opacity: 0, y: 28 },
    { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", delay: opts.delay ?? 0, scrollTrigger: defaultTrigger(el) }
  );
  return () => tween.scrollTrigger?.kill();
}

/** Scale 0.96 -> 1 with fade — used for photographic content. */
export function revealImage(el: Element | null) {
  if (!el || prefersReducedMotion()) return () => {};
  const tween = gsap.fromTo(
    el,
    { opacity: 0, scale: 0.96 },
    { opacity: 1, scale: 1, duration: 1.1, ease: "power2.out", scrollTrigger: defaultTrigger(el) }
  );
  return () => tween.scrollTrigger?.kill();
}

/** Translate + rotate — used for floral/botanical decorations. */
export function revealFloral(el: Element | null, direction: 1 | -1 = 1) {
  if (!el || prefersReducedMotion()) return () => {};
  const tween = gsap.fromTo(
    el,
    { opacity: 0, y: 20, rotate: -4 * direction },
    { opacity: 1, y: 0, rotate: 0, duration: 1.2, ease: "power2.out", scrollTrigger: defaultTrigger(el) }
  );
  return () => tween.scrollTrigger?.kill();
}

/** Sequential stagger — used for the day-program timeline. */
export function revealSequence(els: Element[], container: Element | null, opts: { duration?: number; stagger?: number; scrub?: number } = {}) {
  if (!container || els.length === 0 || prefersReducedMotion()) return () => {};
  const tween = gsap.fromTo(
    els,
    { opacity: 0, y: 18 },
    {
      opacity: 1,
      y: 0,
      duration: opts.duration ?? 0.6,
      ease: "power2.out",
      stagger: opts.stagger ?? 0.12,
      scrollTrigger: { ...defaultTrigger(container), start: "top 78%" },
    }
  );
  return () => tween.scrollTrigger?.kill();
}

/** Gentle upward fade for form fields. */
export function revealForm(els: Element[], container: Element | null) {
  if (!container || els.length === 0 || prefersReducedMotion()) return () => {};
  const tween = gsap.fromTo(
    els,
    { opacity: 0, y: 14 },
    {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: "power2.out",
      stagger: 0.08,
      scrollTrigger: { ...defaultTrigger(container), start: "top 85%" },
    }
  );
  return () => tween.scrollTrigger?.kill();
}

/** Subtle parallax for background/decorative layers, tied to scroll not setState. */
export function parallaxLayer(el: Element | null, speed = 0.15, rotation?: number) {
  if (!el || prefersReducedMotion()) return () => {};
  const tween = gsap.to(el, {
    yPercent: speed * 100,
    ...(rotation === undefined ? {} : { rotation }),
    ease: "none",
    scrollTrigger: {
      trigger: el,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  });
  return () => tween.scrollTrigger?.kill();
}
