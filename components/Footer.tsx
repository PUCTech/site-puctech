import Link from "next/link";
import {
  InstagramIcon,
  LinkedinIcon,
  LinkIcon,
  TiktokIcon,
  XIcon,
} from "@/components/SocialIcons";
import { navLinks, siteConfig } from "@/lib/site";

const footerLink =
  "text-brand-200/80 underline decoration-transparent underline-offset-4 transition-colors duration-200 hover:text-white hover:decoration-brand-200 focus-visible:text-white focus-visible:decoration-brand-200";

const socialLink = `inline-flex items-center gap-2 ${footerLink}`;

export default function Footer() {
  return (
    <footer className="border-t border-brand-800 bg-brand-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10 md:flex-row md:justify-between">
        <div>
          <p className="text-lg font-bold">
            PUC<span className="font-light italic text-brand-200">Tech</span>
          </p>
          <p className="mt-2 max-w-sm text-sm text-brand-200/80">
            {siteConfig.description}
          </p>
        </div>

        <div className="flex gap-16 text-sm">
          <ul className="flex flex-col gap-2">
            <li className="font-semibold">Navegação</li>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={footerLink}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <ul className="flex flex-col gap-2">
            <li className="font-semibold">Redes</li>
            <li>
              <a
                href={siteConfig.links.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className={socialLink}
              >
                <InstagramIcon className="size-4" />
                Instagram
              </a>
            </li>
            <li>
              <a
                href={siteConfig.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={socialLink}
              >
                <LinkedinIcon className="size-4" />
                LinkedIn
              </a>
            </li>
            <li>
              <a
                href={siteConfig.links.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className={socialLink}
              >
                <TiktokIcon className="size-4" />
                TikTok
              </a>
            </li>
                        <li>
              <a
                href={siteConfig.links.x}
                target="_blank"
                rel="noopener noreferrer"
                className={socialLink}
              >
                <XIcon className="size-4" />
                X
              </a>
            </li>
            <li>
              <a
                href={siteConfig.links.allLinks}
                target="_blank"
                rel="noopener noreferrer"
                className={socialLink}
              >
                <LinkIcon className="size-4" />
                Nossos links
              </a>
            </li>
          </ul>
        </div>
      </div>

      <p className="pb-6 text-center text-xs text-brand-200/60">
        © {new Date().getFullYear()} PUC Tech. Todos os direitos reservados.
      </p>
    </footer>
  );
}