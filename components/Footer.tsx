import Image from "next/image";
import Link from "next/link";
import { socials } from "@/components/SocialIcons";
import { container } from "@/components/Section";
import { navLinks, siteConfig } from "@/lib/site";

// Rodapé enxuto: uma linha com logo, navegação e redes; embaixo, o crédito.
export default function Footer() {
  return (
    <footer className="mt-16 border-t border-border">
      <div className={`${container} flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between`}>
        <Link href="/" aria-label="PUC Tech, página inicial" className="shrink-0">
          <Image src="/logo-puctech-ink.svg" alt="" width={310} height={82} className="h-6 w-auto" />
        </Link>

        <nav aria-label="Rodapé" className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-ink">
              {link.label}
            </Link>
          ))}
        </nav>

        <ul className="flex gap-4 text-muted">
          {socials.map(({ label, href, Icon }) => (
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
        © {new Date().getFullYear()} PUC Tech · {siteConfig.description}
      </p>
    </footer>
  );
}
