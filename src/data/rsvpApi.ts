export interface RSVPData {
  name: string;
  attendance: "accepts" | "declines";
  guests: number;
  message?: string;
}

export interface RSVPResult {
  ok: boolean;
  error?: string;
}

const FORM_SUBMIT_ENDPOINT = "https://formsubmit.co/ajax/alitshrestha74@gmail.com";

export async function submitRSVP(data: RSVPData): Promise<RSVPResult> {
  try {
    const payload = new FormData();
    payload.append("name", data.name);
    payload.append("attendance", data.attendance);
    payload.append("guests", String(data.guests));
    payload.append("message", data.message ?? "");
    payload.append("_subject", `Wedding RSVP from ${data.name}`);
    payload.append("_captcha", "false");
    payload.append("_template", "table");

    const response = await fetch(FORM_SUBMIT_ENDPOINT, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: payload,
    });
    if (!response.ok) {
      return { ok: false, error: "The RSVP couldn't be submitted. Please try again shortly." };
    }

    const result = (await response.json().catch(() => null)) as { success?: boolean } | null;
    if (result?.success === false) {
      return { ok: false, error: "The RSVP couldn't be submitted. Please try again shortly." };
    }

    return { ok: true };
  } catch {
    return { ok: false, error: "The RSVP couldn't be submitted. Check your connection and try again." };
  }
}
