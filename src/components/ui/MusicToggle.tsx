import { useCallback, useEffect, useRef, useState } from "react";
import { Music, Pause } from "lucide-react";
import Lenis from "lenis";

export const MUSIC_START_EVENT = "invitation-start-music";
export const AUTOSCROLL_START_EVENT = "invitation-start-autoscroll";
export const AUTOSCROLL_STOP_EVENT = "invitation-stop-autoscroll";

const AUTO_SCROLL_PIXELS_PER_SECOND = 120;
const AUTO_SCROLL_RESUME_DELAY_MS = 5000;

export function MusicToggle({ src }: { src?: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const autoScrollFrame = useRef<number | null>(null);
  const autoScrollRestart = useRef<number | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const autoScrollEnabled = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [autoScrollActive, setAutoScrollActive] = useState(false);
  const [autoScrollDone, setAutoScrollDone] = useState(false);

  const start = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return false;
    try {
      await audio.play();
      setPlaying(true);
      setStarted(true);
      return true;
    } catch {
      setPlaying(false);
      return false;
    }
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setPlaying(false);
  }, []);

  const stopAutoScroll = useCallback(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    lenis.scrollTo(lenis.scroll, { immediate: true, force: true });
    lenis.start();
    document.documentElement.classList.remove("is-autoscrolling");
  }, []);

  const clearAutoScrollRestart = useCallback(() => {
    if (autoScrollRestart.current !== null) {
      window.clearTimeout(autoScrollRestart.current);
      autoScrollRestart.current = null;
    }
  }, []);

  const startAutoScroll = useCallback(() => {
    stopAutoScroll();
    setAutoScrollDone(false);
    setAutoScrollActive(true);
    document.documentElement.classList.add("is-autoscrolling");
    const lenis = lenisRef.current;
    if (!lenis) return;
    lenis.start();
    const distance = Math.max(lenis.limit - lenis.scroll, 1);
    lenis.scrollTo(lenis.limit, {
      duration: distance / AUTO_SCROLL_PIXELS_PER_SECOND,
      easing: (progress) => progress,
      programmatic: true,
      onComplete: () => {
        autoScrollEnabled.current = false;
        setAutoScrollActive(false);
        document.documentElement.classList.remove("is-autoscrolling");
        setAutoScrollDone(true);
      },
    });
  }, [stopAutoScroll]);

  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: false,
      smoothWheel: true,
      syncTouch: true,
      respectReducedMotion: true,
    });
    lenisRef.current = lenis;

    const animate = (time: number) => {
      lenis.raf(time);
      autoScrollFrame.current = requestAnimationFrame(animate);
    };
    autoScrollFrame.current = requestAnimationFrame(animate);

    const events = ["wheel", "touchmove", "keydown", "pointerdown"] as const;
    const scheduleAutoScrollResume = () => {
      if (!autoScrollEnabled.current) return;
      clearAutoScrollRestart();
      autoScrollRestart.current = window.setTimeout(() => {
        autoScrollRestart.current = null;
        startAutoScroll();
      }, AUTO_SCROLL_RESUME_DELAY_MS);
    };

    const onInteraction = (event: Event) => {
      const target = event.target;
      if (target instanceof Element && target.closest(".music-toggle")) return;
      const isDirectScrollInput = event.type === "wheel" || event.type === "touchmove";
      if (!isDirectScrollInput) stopAutoScroll();
      clearAutoScrollRestart();
      setAutoScrollActive(false);
      setAutoScrollDone(false);
      document.documentElement.classList.remove("is-autoscrolling");
      scheduleAutoScrollResume();
    };

    const onVirtualScroll = () => {
      if (!autoScrollEnabled.current) return;
      clearAutoScrollRestart();
      setAutoScrollActive(false);
      setAutoScrollDone(false);
      scheduleAutoScrollResume();
    };

    events.forEach((event) => window.addEventListener(event, onInteraction, { passive: true }));
    lenis.on("virtual-scroll", onVirtualScroll);

    return () => {
      events.forEach((event) => window.removeEventListener(event, onInteraction));
      lenis.off("virtual-scroll", onVirtualScroll);
      stopAutoScroll();
      clearAutoScrollRestart();
      if (autoScrollFrame.current !== null) {
        cancelAnimationFrame(autoScrollFrame.current);
        autoScrollFrame.current = null;
      }
      lenis.destroy();
      lenisRef.current = null;
      setAutoScrollActive(false);
      setAutoScrollDone(false);
      document.documentElement.classList.remove("is-autoscrolling");
    };
  }, [clearAutoScrollRestart, startAutoScroll, stopAutoScroll]);

  useEffect(() => {
    const handleMusicStart = async () => {
      const started = await start();
      if (!started) setPlaying(false);
    };
    const handleAutoScrollStart = () => {
      autoScrollEnabled.current = true;
      startAutoScroll();
    };
    const handleAutoScrollStop = () => {
      autoScrollEnabled.current = false;
      stopAutoScroll();
      clearAutoScrollRestart();
      setAutoScrollActive(false);
      setAutoScrollDone(false);
      document.documentElement.classList.remove("is-autoscrolling");
    };

    window.addEventListener(MUSIC_START_EVENT, handleMusicStart);
    window.addEventListener(AUTOSCROLL_START_EVENT, handleAutoScrollStart);
    window.addEventListener(AUTOSCROLL_STOP_EVENT, handleAutoScrollStop);
    return () => {
      window.removeEventListener(MUSIC_START_EVENT, handleMusicStart);
      window.removeEventListener(AUTOSCROLL_START_EVENT, handleAutoScrollStart);
      window.removeEventListener(AUTOSCROLL_STOP_EVENT, handleAutoScrollStop);
    };
  }, [clearAutoScrollRestart, start, startAutoScroll, stopAutoScroll]);

  if (!src) return null;

  return (
      <>
        <audio
            ref={audioRef}
            src={src}
            loop
            preload="metadata"
            playsInline
        />
        {started && <button
            type="button"
            className={`music-toggle${playing ? " music-toggle--playing" : ""}`}
            onClick={() => {
              if (playing) pause();
              else void start();
            }}
            aria-pressed={playing}
            aria-label={playing ? "Pause music" : "Play music"}
        >
          {playing ? <Pause size={18} /> : <Music size={18} />}
        </button>}
        {autoScrollActive && <p className="auto-scroll-status auto-scroll-status--active">Scrolling through the celebration</p>}
        {autoScrollDone && <p className="auto-scroll-status" role="status">You have reached the end</p>}
      </>
  );
}