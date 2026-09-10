import { useEffect, useRef, useState, type FormEvent } from "react";
import { revealText, revealForm } from "../../animations/sectionAnimations";
import { Divider } from "../ui/Divider";
import { Button } from "../ui/Button";
import { submitRSVP, type RSVPData } from "../../data/rsvpApi";

type FormState = {
  name: string;
  attendance: "accepts" | "declines";
  guests: string;
  message: string;
};

const initialState: FormState = {
  name: "",
  attendance: "accepts",
  guests: "1",
  message: "",
};

type Errors = Partial<Record<keyof FormState, string>>;

function validate(state: FormState): Errors {
  const errors: Errors = {};
  if (!state.name.trim()) errors.name = "Please enter your name.";
  const guestsNum = Number(state.guests);
  if (!Number.isInteger(guestsNum) || guestsNum < 1 || guestsNum > 10) {
    errors.guests = "Enter a number of guests between 1 and 10.";
  }
  return errors;
}

export function RSVP() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const fieldRefs = useRef<HTMLDivElement[]>([]);

  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    const cleanups = [revealText(headingRef.current), revealForm(fieldRefs.current, formRef.current)];
    return () => cleanups.forEach((c) => c());
  }, []);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setStatus("submitting");
    const payload: RSVPData = {
      name: form.name.trim(),
      attendance: form.attendance,
      guests: Number(form.guests),
      message: form.message.trim() || undefined,
    };
    const result = await submitRSVP(payload);
    if (result.ok) {
      setStatus("success");
      setStatusMessage("Thank you — your RSVP has been received.");
      setForm(initialState);
    } else {
      setStatus("error");
      setStatusMessage(result.error ?? "Something went wrong.");
    }
  };

  return (
    <section id="rsvp" className="section container section-rsvp" style={{ textAlign: "center" }} aria-label="RSVP">
      <h2 ref={headingRef} className="section-heading font-display">
        Let us know you're coming
      </h2>
      <Divider />

      <form ref={formRef} className="rsvp-form" style={{ textAlign: "left" }} onSubmit={handleSubmit} noValidate>
        <div
          className="field"
          ref={(el) => {
            if (el) fieldRefs.current[0] = el;
          }}
        >
          <label htmlFor="rsvp-name">Name</label>
          <input
            id="rsvp-name"
            name="name"
            type="text"
            autoComplete="name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "rsvp-name-error" : undefined}
          />
          {errors.name && (
            <span id="rsvp-name-error" className="field-error" role="alert">
              {errors.name}
            </span>
          )}
        </div>

        <div
          className="field"
          ref={(el) => {
            if (el) fieldRefs.current[1] = el;
          }}
        >
          <label htmlFor="rsvp-attendance">Attendance</label>
          <select
            id="rsvp-attendance"
            name="attendance"
            value={form.attendance}
            onChange={(e) => update("attendance", e.target.value as FormState["attendance"])}
          >
            <option value="accepts">Joyfully accepts</option>
            <option value="declines">Regretfully declines</option>
          </select>
        </div>

        <div
          className="field"
          ref={(el) => {
            if (el) fieldRefs.current[2] = el;
          }}
        >
          <label htmlFor="rsvp-guests">Number of guests</label>
          <input
            id="rsvp-guests"
            name="guests"
            type="number"
            min={1}
            max={10}
            value={form.guests}
            onChange={(e) => update("guests", e.target.value)}
            aria-invalid={!!errors.guests}
            aria-describedby={errors.guests ? "rsvp-guests-error" : undefined}
          />
          {errors.guests && (
            <span id="rsvp-guests-error" className="field-error" role="alert">
              {errors.guests}
            </span>
          )}
        </div>

        <div
          className="field"
          ref={(el) => {
            if (el) fieldRefs.current[3] = el;
          }}
        >
          <label htmlFor="rsvp-message">Message (optional)</label>
          <textarea
            id="rsvp-message"
            name="message"
            rows={4}
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
          />
        </div>

        <div
          ref={(el) => {
            if (el) fieldRefs.current[4] = el;
          }}
        >
          <Button type="submit" variant="solid" disabled={status === "submitting"}>
            {status === "submitting" ? "Sending…" : "Send RSVP"}
          </Button>
        </div>

        {status !== "idle" && status !== "submitting" && (
          <p
            className={`rsvp-status ${status === "success" ? "rsvp-status--success" : "rsvp-status--error"}`}
            role="status"
          >
            {statusMessage}
          </p>
        )}
      </form>
    </section>
  );
}
