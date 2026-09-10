import { useEffect, useRef } from "react";
import { CalendarPlus } from "lucide-react";
import { revealText, revealFloral } from "../../animations/sectionAnimations";
import { Button } from "../ui/Button";
import type { Wedding } from "../../data/wedding";

export function SaveTheDate({ data }: { data: Wedding }) {
  const dayRef = useRef<HTMLDivElement>(null);
  const monthRef = useRef<HTMLParagraphElement>(null);
  const yearRef = useRef<HTMLParagraphElement>(null);

  const addToCalendar = () => {
    const location = `${data.ceremony.venue}, ${data.ceremony.address}`;
    const calendarUrl = new URL("https://calendar.google.com/calendar/render");
    calendarUrl.searchParams.set("action", "TEMPLATE");
    calendarUrl.searchParams.set("text", "Shreeti & Prayag's Wedding Celebration");
    calendarUrl.searchParams.set("dates", `${data.date.iso.replaceAll("-", "")}T000000/${data.date.iso.replaceAll("-", "")}T235959`);
    calendarUrl.searchParams.set("location", location);
    calendarUrl.searchParams.set("details", "Join us for an evening of celebration.");
    window.open(calendarUrl.toString(), "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    const cleanups = [
      revealText(dayRef.current),
      revealText(monthRef.current, { delay: 0.1 }),
      revealText(yearRef.current, { delay: 0.15 }),
      revealFloral(dayRef.current),
    ];
    return () => cleanups.forEach((c) => c());
  }, []);

  return (
    <section className="section save-the-date container" aria-label="Save the date">
      <img className="save-the-date__curtains" src="/curtains.png" alt="" aria-hidden="true" />
      <div className="save-the-date__reminder">
      <p className="eyebrow">Save the date</p>
      <div ref={dayRef} className="save-the-date__day font-display">
        {data.date.day}
      </div>
      <p ref={monthRef} className="save-the-date__month">
        {data.date.month.toUpperCase()}
      </p>
      <p ref={yearRef} className="save-the-date__year">
        {data.date.year}
      </p>
      <Button type="button" variant="solid" className="save-the-date__button" onClick={addToCalendar}>
        <CalendarPlus size={18} aria-hidden="true" />
        Add to calendar
      </Button>
      </div>
    </section>
  );
}
