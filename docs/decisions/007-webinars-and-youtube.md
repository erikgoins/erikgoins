# 007 — Webinars in Speaking, Flywheel's YouTube in Elsewhere

_2026-09-27. Extends [005](./005-trim-roles-and-socials.md), which set Elsewhere to
Twitter, LinkedIn and Email._

## Context

Erik asked for Flywheel Studio's YouTube channel and his latest webinars — those on
FlutterFlow's channel and those on Flywheel's own — on the site. The Speaking section held
the conference photo and three podcast episodes. The site has no personal YouTube channel.

The webinars were picked from each channel's feed on 2026-09-27:

- **FlutterFlow**, Workshop Series, both livestreamed with Erik as the speaker:
  "What Should You Build Next?" (2026-09-23) and "The Numbers Every App Builder Should Know
  in 2026" (2026-09-09). FlutterFlow's channel search and RSS feed turn up no other Erik
  sessions; a June FFDC panel matched only on "Erik Nordlander".
- **Flywheel Studio**: "Why Most Apps Lose 95% of Their Users" (2026-05-04, 39 minutes, a
  recorded session). It is the only webinar on the channel. The August Shipaton uploads are
  short edited videos, and no older video's description calls it a session or webinar.

## Decision

- Add `speaking.webinars` in `app/content.ts`, newest first, and render it above the
  podcasts as its own list. Both lists share one row component, `MediaRow`.
- Mirror each YouTube thumbnail into `public/images/webinar-*.jpg` at 176×99 and draw it at
  16:9 on the 44px row height. Do not crop it to the podcast square: the FlutterFlow
  thumbnails are mostly title text, and a centre crop keeps none of it.
- Add "YouTube" to `socials`, linking to `https://www.youtube.com/@FlywheelStudio`.
  Elsewhere is now Twitter, LinkedIn, YouTube and Email.
- Mirror both changes in `README.md`.

## Alternatives considered

- **Append the webinars to `podcasts`.** Rejected: the rows link to YouTube, not Apple
  Podcasts, and the test that pins every podcast to `podcasts.apple.com` would have to
  weaken.
- **Sub-labels ("Webinars", "Podcasts") inside Speaking.** Rejected: a second tier of the
  same uppercase label muddles the one-label-per-section grid. The two lists are visibly
  separate (the thumbnail shape and a larger gap), and each `<ul>` carries an `aria-label`
  for screen readers.
- **Link the YouTube channel from the Flywheel role.** Rejected: that row already links
  `flywheel.so`, and a second link in one row breaks the one-link-per-row pattern.

## Consequences

The webinar list goes stale as new sessions ship. To add one, put a row at the top of
`speaking.webinars` and a 176×99 thumbnail in `public/images/`. The tests check the
YouTube URL shape, that the thumbnail file exists, and that the declared `width`/`height`
reach the `<img>`.

The YouTube link is Flywheel's channel, not a personal one. If Erik starts a personal
channel, replace the URL and write a record superseding this one.
