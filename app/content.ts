/**
 * Single source of truth for every piece of copy and every link on the site.
 * Editing this file is the only thing needed to update the page content.
 */

export const bio = "I help mobile apps make more money.";

export const roles = [
  { label: "Founder, Flywheel Studio", href: "https://flywheel.so" },
  { label: "Partner, MIG Real Estate", href: "https://mittenpm.com" },
];

export const portfolio = [
  { label: "thyme.so", href: "https://thyme.so" },
  { label: "pushfire.app", href: "https://pushfire.app" },
  { label: "ulink.ly", href: "https://ulink.ly" },
  { label: "analyticsdrop.com", href: "https://analyticsdrop.com" },
  { label: "somara.ai", href: "https://somara.ai" },
];

export const mobileApps = ["Primus Fitness", "QuitAnything", "BettorTogether"];

/**
 * One row in the Speaking section: a podcast episode or a recorded webinar.
 * The artwork ships at source size (no image optimizer in a static export), so
 * `width` and `height` are the real pixels of the file in /public — replace
 * the file and these numbers together.
 */
export type MediaItem = {
  label: string;
  show: string;
  meta: string;
  artwork: string;
  width: number;
  height: number;
  href: string;
};

export const speaking = {
  photo: {
    // Drop the conference photo at this path in /public to have it render.
    src: "/images/speaking-flutterflow-2026.jpg",
    alt: "Erik Goins speaking at the FlutterFlow Developer Conference 2026",
    caption: "FlutterFlow Developer Conference 2026",
    // The file ships as-is (no image optimizer in a static export), so these are
    // the real pixels of the file in /public. Replace the photo and these
    // numbers together.
    width: 1200,
    height: 797,
  },
  // Recorded webinars, newest first. Titles and lengths come from each video's
  // YouTube page. Thumbnails are mirrored into /public at 176x99, twice the
  // size the row draws them.
  webinars: [
    {
      label: "What Should You Build Next? A Framework for Making Product Decisions",
      show: "FlutterFlow Workshop Series",
      meta: "57m",
      artwork: "/images/webinar-flutterflow-build-next.jpg",
      width: 176,
      height: 99,
      href: "https://www.youtube.com/watch?v=V2jC3C1lJxo",
    },
    {
      label: "The Numbers Every App Builder Should Know in 2026",
      show: "FlutterFlow Workshop Series",
      meta: "1h 2m",
      artwork: "/images/webinar-flutterflow-numbers.jpg",
      width: 176,
      height: 99,
      href: "https://www.youtube.com/watch?v=mwJndIeLbiQ",
    },
    {
      label: "Why Most Apps Lose 95% of Their Users (And How the Winners Beat Those Odds)",
      show: "Flywheel Studio Webinar",
      meta: "39m",
      artwork: "/images/webinar-flywheel-retention.jpg",
      width: 176,
      height: 99,
      href: "https://www.youtube.com/watch?v=Rf1pciW7xt0",
    },
  ] satisfies MediaItem[],
  // Titles, show names and artwork come from each episode's own Open Graph
  // tags; the artwork is mirrored into /public so the page has no third-party
  // image dependency.
  podcasts: [
    {
      label: "Episode 37 — Community Episode #1 with Erik, Tony & Mizan",
      show: "Blaze.Tech — No Code No Problem",
      meta: "34m",
      artwork: "/images/podcast-blaze-tech.jpg",
      width: 176,
      height: 176,
      href: "https://podcasts.apple.com/us/podcast/blaze-tech-no-code-no-problem/id1484594161?i=1000487230594",
    },
    {
      label: "Building Success in No-Code: Flywheel Studio's Journey and Strategies",
      show: "This Week in AI",
      meta: "1h 10m",
      artwork: "/images/podcast-this-week-in-ai.jpg",
      width: 176,
      height: 176,
      href: "https://podcasts.apple.com/us/podcast/building-success-in-no-code-flywheel-studios-journey/id1708719563?i=1000653054876",
    },
    {
      label: "LowCode Podcast Episode 10: How to start a no-code agency",
      show: "The LowCode Podcast",
      meta: "38m",
      artwork: "/images/podcast-lowcode.jpg",
      width: 176,
      height: 176,
      href: "https://podcasts.apple.com/us/podcast/lowcode-podcast-episode-10-how-to-start-a-no-code-agency/id1614887981?i=1000562858306",
    },
  ] satisfies MediaItem[],
};

export const socials = [
  { label: "Twitter", href: "https://twitter.com/erikgoinsHQ" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/egoins/" },
  // Flywheel Studio's channel: the webinars and build videos live there.
  { label: "YouTube", href: "https://www.youtube.com/@FlywheelStudio" },
  { label: "Email", href: "mailto:erik@flywheel.so" },
];

/**
 * Where Erik has lived, newest first.
 *
 * `from: null` is an open start (the row Erik was born into), `to: null` is
 * "now", and `lat`/`lon` of `null` means the row has no single point on the
 * map — the nomadic years. The map dots and the connecting route are both
 * derived from these coordinates, so editing a row here moves everything at
 * once.
 */
export type Place = {
  label: string;
  from: number | null;
  to: number | null;
  lat: number | null;
  lon: number | null;
};

export const places: Place[] = [
  { label: "Buenos Aires", from: 2023, to: null, lat: -34.6, lon: -58.38 },
  { label: "Nomadic", from: 2020, to: 2023, lat: null, lon: null },
  { label: "Hong Kong", from: 2015, to: 2020, lat: 22.32, lon: 114.17 },
  { label: "Charlotte", from: 2013, to: 2015, lat: 35.23, lon: -80.84 },
  // Bowling Green State University.
  { label: "Ohio", from: 2009, to: 2013, lat: 41.37, lon: -83.65 },
  { label: "Michigan", from: null, to: 2009, lat: 43.0, lon: -84.5 },
];
