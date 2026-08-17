import Image from "next/image";
import type { Podcast } from "../content";

export function PodcastRow({ podcast }: { podcast: Podcast }) {
  return (
    <li>
      <a
        href={podcast.href}
        className="group -mx-3 flex items-start gap-4 rounded-md px-3 py-3 no-underline transition-colors hover:bg-hover"
      >
        <Image
          src={podcast.artwork}
          alt=""
          width={600}
          height={600}
          sizes="44px"
          className="photo mt-0.5 h-11 w-11 shrink-0 rounded object-cover group-hover:[filter:none]"
        />
        <span className="min-w-0">
          <span className="block text-[0.9375rem] leading-snug underline decoration-rule underline-offset-4 transition-colors group-hover:decoration-fg">
            {podcast.label}
          </span>
          <span className="mt-1 block text-[0.8125rem] text-muted">
            {podcast.show} · {podcast.meta}
          </span>
        </span>
      </a>
    </li>
  );
}
