import { useCallback, useEffect, useRef, useState } from "react";
import { Music, Pause } from "lucide-react";

export const MUSIC_START_EVENT = "invitation-start-music";
export const AUTOSCROLL_START_EVENT = "invitation-start-autoscroll";
export const AUTOSCROLL_STOP_EVENT = "invitation-stop-autoscroll";

export function MusicToggle({ src }: { src?: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const autoScrollFrame = useRef<number | null>(null);
  const autoScrollRestart = useRef<number | null>(null);
  const autoScrollTarget = useRef(0);
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
    if (autoScrollFrame.current !== null) {
      cancelAnimationFrame(autoScrollFrame.current);
      autoScrollFrame.current = null;
    }
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
    const scrollElement = document.scrollingElement ?? document.documentElement;
    autoScrollTarget.current = scrollElement.scrollTop;
    let previousTime = performance.now();

    const tick = (time: number) => {
      const atEnd = scrollElement.scrollTop + scrollElement.clientHeight >= scrollElement.scrollHeight - 1;
      if (atEnd) {
        autoScrollFrame.current = null;
        autoScrollEnabled.current = false;
        setAutoScrollActive(false);
        document.documentElement.classList.remove("is-autoscrolling");
        setAutoScrollDone(true);
        return;
      }

      const elapsed = Math.min(time - previousTime, 50);
      previousTime = time;
      autoScrollTarget.current = scrollElement.scrollTop + elapsed * 0.1;
      scrollElement.scrollTop = autoScrollTarget.current;
      autoScrollFrame.current = requestAnimationFrame(tick);
    };

    autoScrollFrame.current = requestAnimationFrame(tick);
  }, [stopAutoScroll]);

  useEffect(() => {
    const events = ["wheel", "touchmove", "keydown", "pointerdown"] as const;
    const onInteraction = (event: Event) => {
      const target = event.target;
      if (target instanceof Element && target.closest(".music-toggle")) return;
      stopAutoScroll();
      clearAutoScrollRestart();
      setAutoScrollActive(false);
      setAutoScrollDone(false);
      document.documentElement.classList.remove("is-autoscrolling");

      if (autoScrollEnabled.current) {
        autoScrollRestart.current = window.setTimeout(() => {
          autoScrollRestart.current = null;
          startAutoScroll();
        }, 5000);
      }
    };

    events.forEach((event) => window.addEventListener(event, onInteraction, { passive: true }));

    return () => {
      events.forEach((event) => window.removeEventListener(event, onInteraction));
      stopAutoScroll();
      clearAutoScrollRestart();
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