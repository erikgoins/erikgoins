/**
 * Single source of truth for every piece of copy and every link on the site.
 * Editing this file is the only thing needed to update the page content.
 */

export const bio = "I help mobile apps make more money.";

export const roles = [
  { label: "Founder, Flywheel Studio", href: "https://flywheel.so" },
  { label: "Partner, MIG Real Estate", href: "https://mittenpm.com" },
  { label: "Writing @ I'm the Product", href: "https://imtheproduct.beehiiv.com/subscribe" },
];

export const portfolio = [
  { label: "thyme.so", href: "https://thyme.so" },
  { label: "pushfire.app", href: "https://pushfire.app" },
  { label: "ulink.ly", href: "https://ulink.ly" },
  { label: "analyticsdrop.com", href: "https://analyticsdrop.com" },
  { label: "somara.ai", href: "https://somara.ai" },
];

export const mobileApps = ["Primus Fitness", "QuitAnything", "BettorTogether"];

export const speaking = {
  photo: {
    // Drop the conference photo at this path in /public to have it render.
    src: "/images/speaking-flutterflow-2026.jpg",
    alt: "Erik Goins speaking at the FlutterFlow Developer Conference 2026",
    caption: "FlutterFlow Developer Conference 2026",
    width: 2000,
    height: 1327,
  },
  podcasts: [
    {
      label: "Secret of Running a No Code Agency — No Code Talks",
      href: "https://www.youtube.com/watch?v=haBiPhDkamQ",
    },
    {
      label: "Reality of a No Code Agency — No Code Talks",
      href: "https://www.youtube.com/watch?v=BQbrQCIO7Zo",
    },
  ],
};

export const socials = [
  { label: "Twitter", href: "https://twitter.com/erikgoinsHQ" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/egoins/" },
  { label: "Instagram", href: "https://www.instagram.com/erik.goins/" },
  { label: "Email", href: "mailto:erik@flywheel.so" },
] as const;

export type SocialLabel = (typeof socials)[number]["label"];
