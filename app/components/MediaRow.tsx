import Image from "next/image";
import type { MediaItem } from "../content";

/**
 * A podcast episode or a recorded webinar: artwork, title, then show and
 * length. The artwork is held to the row height and its own ratio sets the
 * width, so square podcast covers and 16:9 video thumbnails share one row.
 */
export function MediaRow({ item }: { item: MediaItem }) {
  return (
    <li>
      <a
        href={item.href}
        className="group -mx-3 flex items-start gap-4 rounded-md px-3 py-3 no-underline transition-colors hover:bg-hover"
      >
        <Image
          src={item.artwork}
          alt=""
          width={item.width}
          height={item.height}
          className="photo mt-0.5 h-11 w-auto shrink-0 rounded object-cover group-hover:[filter:none]"
        />
        <span className="min-w-0">
          <span className="block text-[0.9375rem] leading-snug underline decoration-rule underline-offset-4 transition-colors group-hover:decoration-fg">
            {item.label}
          </span>
          <span className="mt-1 block text-[0.8125rem] text-muted">
            {item.show} · {item.meta}
          </span>
        </span>
      </a>
    </li>
  );
}
