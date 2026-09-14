import { getSettings } from "@/lib/db/settings";
import { TechnicalLabel } from "@/components/decorative/TechnicalLabel";
import { SectionMarker } from "@/components/decorative/SectionMarker";
import { FadeIn } from "@/components/motion/FadeIn";

export const metadata = { title: "NULL / ABOUT" };
export const revalidate = 300;

const DISCIPLINES = ["DEVELOPMENT", "DESIGN", "TECHNOLOGY"];

export default async function AboutPage() {
  const settings = await getSettings();

  return (
    <main className="px-6 py-20">
      <FadeIn className="mx-auto max-w-2xl space-y-16">
        <div className="space-y-6">
          <TechnicalLabel>/ABOUT</TechnicalLabel>
          <h1 className="text-3xl sm:text-4xl">{settings.authorName || "Whoever writes NULL /."}</h1>
          {settings.authorBio ? (
            <p className="whitespace-pre-line text-lg leading-relaxed text-foreground-secondary">{settings.authorBio}</p>
          ) : (
            <p className="text-lg leading-relaxed text-foreground-secondary">
              A monochrome digital journal for ideas, experiments, technology, design, and things
              worth thinking about.
            </p>
          )}
        </div>

        <div className="space-y-4">
          <SectionMarker>WHAT I WORK WITH</SectionMarker>
          <div className="flex flex-wrap gap-3">
            {DISCIPLINES.map((d) => (
              <span
                key={d}
                className="rounded-xs border border-border px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-foreground-secondary"
              >
                {d}
              </span>
            ))}
          </div>
        </div>

        {settings.socialLinks.length > 0 && (
          <div className="space-y-4">
            <SectionMarker>CONTACT</SectionMarker>
            <div className="flex flex-col gap-2">
              {settings.socialLinks.map((link: { label: string; url: string }) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-sm text-foreground-secondary transition-colors duration-base hover:text-foreground"
                >
                  {link.label} →
                </a>
              ))}
            </div>
          </div>
        )}
      </FadeIn>
    </main>
  );
}
