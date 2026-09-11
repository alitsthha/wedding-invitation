import { useCallback, useEffect, useRef, useState } from "react";
import { Music, Pause } from "lucide-react";

export const MUSIC_START_EVENT = "invitation-start-music";
export const AUTOSCROLL_START_EVENT = "invitation-start-autoscroll";
export const AUTOSCROLL_STOP_EVENT = "invitation-stop-autoscroll";

export function MusicToggle({ src }: { src?: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const autoScrollFrame = useRef<number | null>(null);
  const autoScrollRestart = useRef<number | null>(null);
  const autoScrollEnabled = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);

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

    const tick = () => {
      const atEnd = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 1;
      if (atEnd) {
        autoScrollFrame.current = null;
        return;
      }

      window.scrollBy(0, 3);
      autoScrollFrame.current = requestAnimationFrame(tick);
    };

    autoScrollFrame.current = requestAnimationFrame(tick);
  }, [stopAutoScroll]);

  useEffect(() => {
    const events = ["wheel", "touchmove", "keydown"] as const;
    const onInteraction = (event: Event) => {
      const target = event.target;
      if (target instanceof Element && target.closest(".music-toggle")) return;
      stopAutoScroll();
      clearAutoScrollRestart();

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
      </>
  );
}