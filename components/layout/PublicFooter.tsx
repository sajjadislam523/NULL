import Link from "next/link";
import { TechnicalLabel } from "@/components/decorative/TechnicalLabel";

interface PublicFooterProps {
  siteTitle: string;
  socialLinks: { label: string; url: string }[];
}

export function PublicFooter({ siteTitle, socialLinks }: PublicFooterProps) {
  return (
    <footer className="border-t border-border px-6 py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <div className="text-foreground">{siteTitle}</div>
          <TechnicalLabel>EST. 2026</TechnicalLabel>
        </div>

        {socialLinks.length > 0 && (
          <nav className="flex flex-wrap gap-6">
            {socialLinks.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs uppercase tracking-widest text-foreground-secondary transition-colors duration-base hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}

        <Link
          href="/login"
          className="font-mono text-xs uppercase tracking-widest text-foreground-secondary transition-colors duration-base hover:text-foreground"
        >
          /ACCESS
        </Link>
      </div>
    </footer>
  );
}
