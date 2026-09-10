import { useCallback, useEffect, useRef, useState } from "react";
import { Music, Pause } from "lucide-react";

export const MUSIC_START_EVENT = "invitation-start-music";

export function MusicToggle({ src }: { src?: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const autoScrollFrame = useRef<number | null>(null);
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

  const startAutoScroll = useCallback(() => {
    stopAutoScroll();

    const tick = () => {
      const atEnd = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 1;
      if (atEnd) {
        autoScrollFrame.current = null;
        return;
      }

      window.scrollBy(0, 0.65);
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
    };

    events.forEach((event) => window.addEventListener(event, onInteraction, { passive: true }));

    return () => {
      events.forEach((event) => window.removeEventListener(event, onInteraction));
      stopAutoScroll();
    };
  }, [stopAutoScroll]);

  useEffect(() => {
    const handleStart = async () => {
      const started = await start();
      if (started) startAutoScroll();
    };

    window.addEventListener(MUSIC_START_EVENT, handleStart);
    return () => window.removeEventListener(MUSIC_START_EVENT, handleStart);
  }, [start, startAutoScroll]);

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