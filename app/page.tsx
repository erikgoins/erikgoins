import Image from "next/image";
import { PodcastRow } from "./components/PodcastRow";
import { SpeakingPhoto } from "./components/SpeakingPhoto";
import { bio, mobileApps, portfolio, roles, socials, speaking } from "./content";

/**
 * The one grid the whole page hangs off: labels sit in a narrow column that
 * hangs into the left margin, and every piece of real content — masthead
 * included — shares a single left edge in the wider column. On small screens it
 * collapses to a stack.
 */
const GRID = "sm:grid sm:grid-cols-[7rem_1fr] sm:gap-x-10";

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className={`border-t border-rule py-9 sm:py-10 ${GRID}`}>
      <h2 className="label mb-4 sm:mb-0 sm:pt-1.5">{label}</h2>
      <div>{children}</div>
    </section>
  );
}

/** External link with a hairline underline and a nudging arrow on hover. */
function LinkRow({ href, children }: { href: string; children: string }) {
  return (
    <li>
      <a
        href={href}
        className="group inline-flex items-baseline gap-1.5 no-underline"
      >
        <span className="underline decoration-rule underline-offset-4 transition-colors group-hover:decoration-fg">
          {children}
        </span>
        {/* Held back until hover so eight of these do not clutter a page whose
            whole argument is restraint. */}
        <span
          aria-hidden="true"
          className="text-[0.75em] text-muted opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          ↗
        </span>
      </a>
    </li>
  );
}

export default function Home() {
  return (
    <div className="px-6 py-20 sm:px-8 sm:py-28">
      <main className="mx-auto w-full max-w-[40rem]">
        <header className={`mb-14 sm:mb-16 ${GRID}`}>
          <div aria-hidden="true" />
          <div>
            <Image
              src="/images/erik-goins.jpg"
              alt="Erik Goins"
              width={540}
              height={539}
              priority
              className="photo h-16 w-16 rounded-full object-cover"
            />
            <h1 className="mt-8 font-serif text-[clamp(2.5rem,9vw,3.5rem)] leading-[0.95] tracking-[-0.02em]">
              Erik Goins
            </h1>
            <p className="mt-5 max-w-[30ch] text-lg leading-relaxed text-pretty text-muted sm:text-xl">
              {bio}
            </p>
          </div>
        </header>

        <Section label="Roles">
          <ul className="space-y-2.5 text-[0.9375rem]">
            {roles.map((role) => (
              <LinkRow key={role.href} href={role.href}>
                {role.label}
              </LinkRow>
            ))}
          </ul>
        </Section>

        <Section label="Portfolio">
          <ul className="space-y-2.5 text-[0.9375rem]">
            {portfolio.map((company) => (
              <LinkRow key={company.href} href={company.href}>
                {company.label}
              </LinkRow>
            ))}
          </ul>
        </Section>

        <Section label="Mobile apps">
          <ul className="space-y-2.5 text-[0.9375rem]">
            {mobileApps.map((app) => (
              <li key={app}>{app}</li>
            ))}
          </ul>
        </Section>

        <Section label="Speaking">
          <div className="space-y-8">
            <SpeakingPhoto />
            <ul className="space-y-1">
              {speaking.podcasts.map((podcast) => (
                <PodcastRow key={podcast.href} podcast={podcast} />
              ))}
            </ul>
          </div>
        </Section>

        <footer className={`border-t border-rule pt-8 ${GRID}`}>
          <h2 className="label mb-4 sm:mb-0 sm:pt-0.5">Elsewhere</h2>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[0.9375rem]">
            {socials.map((social) => (
              <li key={social.href}>
                <a
                  href={social.href}
                  className="decoration-rule underline-offset-4 hover:decoration-fg"
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </footer>
      </main>
    </div>
  );
}
