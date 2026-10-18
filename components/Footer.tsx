import Logo from "@/components/Logo";
import Link from "next/link";
import { socials } from "@/components/SocialIcons";
import { container } from "@/components/Section";
import { ui } from "@/data/ui";
import type { Lang } from "@/lib/i18n";
import { navLinks } from "@/lib/site";

// Rodapé enxuto: uma linha com logo, navegação e redes; embaixo, o crédito.
export default function Footer({ lang }: { lang: Lang }) {
  const t = ui[lang];
  return (
    <footer className="mt-16 border-t border-border">
      <div className={`${container} flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between`}>
        <Link href={"/"} aria-label={t.footer.home} className="shrink-0">
          <Logo className="h-6 w-auto" alt="" />
        </Link>

        <nav aria-label={t.footer.label} className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-ink">
              {t.nav[link.key]}
            </Link>
          ))}
        </nav>

        <ul className="flex gap-4 text-muted">
          {socials(lang).map(({ label, href, Icon }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
                className="transition-colors hover:text-accent-ink"
              >
                <Icon className="size-[18px]" />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <p className={`${container} pb-8 text-xs text-muted`}>
        © {new Date().getFullYear()} PUC Tech · {t.site.tagline}
      </p>
    </footer>
  );
}
