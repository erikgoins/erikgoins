import { existsSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import { speaking } from "../content";

/**
 * Renders the conference photo only when the file is actually present in
 * /public. Keeping this check on the server means a missing photo degrades to
 * a plain caption instead of a broken image, and never fails the build.
 */
export function SpeakingPhoto() {
  const { photo } = speaking;
  const present = existsSync(path.join(process.cwd(), "public", photo.src));

  if (!present) {
    return <p className="text-white/70">{photo.caption}</p>;
  }

  return (
    <figure className="space-y-2">
      <Image
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        sizes="(max-width: 40rem) 100vw, 34rem"
        className="w-full rounded-lg"
      />
      <figcaption className="text-white/70">{photo.caption}</figcaption>
    </figure>
  );
}
