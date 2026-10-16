import Image from "next/image";
import Link from "next/link";
import { socials } from "@/components/SocialIcons";
import { navLinks, siteConfig } from "@/lib/site";

const footerLink =
  "inline-flex items-center gap-2 text-muted transition-colors hover:text-ink";


export default function Footer() {
  return (
    <footer className="mt-16 bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 py-14 sm:px-6 md:flex-row md:justify-between">
        <div>
          <Image
            src="/logo-puctech-ink.svg"
            alt="PUC Tech"
            width={310}
            height={82}
            className="h-7 w-auto"
          />
          <p className="mt-4 max-w-xs text-sm text-muted">
            {siteConfig.description}
          </p>
        </div>

        <div className="flex gap-16 text-sm">
          <ul className="flex flex-col gap-2.5">
            <li className="font-semibold">Navegação</li>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={footerLink}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <ul className="flex flex-col gap-2.5">
            <li className="font-semibold">Redes</li>
            {socials.map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={footerLink}
                >
                  <Icon className="size-4" />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mx-auto max-w-6xl border-t border-border px-5 py-6 text-xs text-muted sm:px-6">
        © {new Date().getFullYear()} PUC Tech. Todos os direitos reservados.
      </p>
    </footer>
  );
}
