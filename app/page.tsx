import Image from "next/image";
import { SocialIcon } from "./components/SocialIcon";
import { SpeakingPhoto } from "./components/SpeakingPhoto";
import { bio, mobileApps, portfolio, roles, socials, speaking } from "./content";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-2">
      <h2 className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-white/60">
        {title}
      </h2>
      {children}
    </section>
  );
}

function LinkList({ items }: { items: { label: string; href: string }[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((item) => (
        <li key={item.href}>
          <a href={item.href} className="hover:text-white/70">
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function Home() {
  return (
    <div className="relative z-10 flex min-h-dvh flex-col items-center justify-center p-4">
      <main className="w-full max-w-[34rem] rounded-xl bg-[rgba(12,12,20,0.71)] backdrop-blur-[0.575rem]">
        <div className="space-y-7 px-6 py-8 text-center text-[0.95rem] leading-relaxed sm:px-9 sm:py-10">
          <div className="space-y-4">
            <Image
              src="/images/erik-goins.jpg"
              alt="Erik Goins"
              width={540}
              height={539}
              priority
              className="mx-auto h-28 w-28 rounded-full object-cover"
            />
            <h1 className="text-3xl font-light tracking-tight">Erik Goins</h1>
            <p className="text-lg font-light text-white/90">{bio}</p>
          </div>

          <ul className="space-y-1.5">
            {roles.map((role) => (
              <li key={role.href}>
                <a href={role.href} className="hover:text-white/70">
                  {role.label}
                </a>
              </li>
            ))}
          </ul>

          <hr className="border-white/15" />

          <Section title="Portfolio of businesses">
            <LinkList items={portfolio} />
          </Section>

          <Section title="Mobile apps">
            <ul className="space-y-1.5">
              {mobileApps.map((app) => (
                <li key={app}>{app}</li>
              ))}
            </ul>
          </Section>

          <Section title="Public speaking">
            <div className="space-y-4">
              <SpeakingPhoto />
              <LinkList items={speaking.podcasts} />
            </div>
          </Section>

          <hr className="border-white/15" />

          <ul className="flex items-center justify-center gap-6">
            {socials.map((social) => (
              <li key={social.href}>
                <a
                  href={social.href}
                  aria-label={social.label}
                  className="inline-flex text-white/80 no-underline transition hover:text-white"
                >
                  <SocialIcon label={social.label} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
