// Central configuration for the invitation.
// Edit this file to reuse the site for a different couple/event —
// no component code needs to change.

export interface TimelineItem {
  time: string;
  label: string;
}

export const wedding = {
  couple: {
    partnerOne: "Shreeti",
    partnerTwo: "Prayag",
    monogram: "S & P",
  },
  date: {
    display: "12 October 2026",
    day: "12",
    month: "October",
    year: "2026",
    iso: "2026-10-12",
  },
  fullname: {
    partnerOne: "Shreeti Khadka",
    partnerTwo: "Prayag Gurung"
  },
  intro: {
    eyebrow: "WITH THE BLESSINGS & LOVE OF OUR FAMILIES",
    partnerOne: "Daughter of Apsara Khadka & Ramesh Khadka and the Khadka Family",
    partnerTwo: "Son of Late Pratap Singh Gurung & Aruna Gurung and the Gurung Family",
    invite: "invite you to join them for an evening of celebration as they begin their happily ever after.",
    begin: "After an intimate wedding celebration with family, we would love to celebrate this beautiful new beginning with our family and friends.",
  },
  story: {
    heading: "Our story",
    body: "A little moment, a thousand memories, and a lifetime still to come. What started as a chance conversation at a mutual friend's dinner table became six years of quiet Sundays, long drives, and one very persistent dog. We can't wait to make it official.",
  },
  ceremony: {
    heading: "The ceremony",
    time: "5:30 PM",
    venue: "Aarambha Banquet",
    address: "Tripureswor inside Blue Bird Mallika ",
    mapUrl: "https://maps.app.goo.gl/EoghKYP6PeW21KXH9",
  },
  timeline: [
    { time: "5:30 PM", label: "Guest Arrival" },
    { time: "5:45 PM", label: "Bride & Groom Entry" },
    { time: "6:00 - 6:30 PM", label: "Drinks & Mingling" },
    { time: "6:30 - 8:00 PM", label: "Dance • Songs • Performances" },
    { time: "8:00 - 8:30 PM", label: "Cake Cutting" },
    { time: "8:30 - 9:30 PM", label: "Dinner • Drinks • Good Company\n" +
          "(Dinner & snacks will be available throughout the evening,\n" +
          "please feel free to eat whenever you’re hungry.)" },
    { time: "9:30 - 10:00 PM", label: "Games with the Bartenders" },
    { time: "10:00 - 11:00 PM", label: "Open Floor • Dance • Have Fun" },
  ] as TimelineItem[],
  hugs: {
    line: "Meet the bride & groom anytime throughout the evening.\n" +
        "There’s no schedule for hugs, hellos or congratulations. 🤍",
  },
  closing: {
    line: "We can't wait to celebrate with you.",
  },
  nav: [
    { id: "home", label: "Home" },
    { id: "story", label: "Story" },
    { id: "details", label: "Details" },
    { id: "rsvp", label: "RSVP" },
  ],
};

export type Wedding = typeof wedding;
