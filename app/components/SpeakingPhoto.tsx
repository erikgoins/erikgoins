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
    return <p className="text-[0.9375rem] text-muted">{photo.caption}</p>;
  }

  return (
    <figure>
      <Image
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        className="photo w-full rounded"
      />
      <figcaption className="mt-3 text-[0.8125rem] text-muted">
        {photo.caption}
      </figcaption>
    </figure>
  );
}
