import {
  InstagramIcon,
  LinkedinIcon,
  LinkIcon,
  TiktokIcon,
  XIcon,
} from "@/components/SocialIcons";
import { socialIntro } from "@/data/home";
import { siteConfig } from "@/lib/site";

const button =
  "inline-flex items-center gap-2 rounded-full bg-brand-950 px-6 py-3 font-medium text-white transition-colors hover:bg-brand-800";

export default function Social() {
  return (
    <section id="redes" className="scroll-mt-16 py-20">
      <div className="mx-auto max-w-4xl px-6">
        <div className="rounded-3xl bg-brand-200 px-8 py-14 text-center">
          <h2 className="text-3xl font-bold text-brand-950 md:text-4xl">
            {socialIntro.title}
          </h2>
          <p className="mt-3 text-lg font-semibold text-brand-900">
            {socialIntro.tagline}
          </p>
          <p className="mx-auto mt-2 max-w-xl text-brand-900">
            {socialIntro.text}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={siteConfig.links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className={button}
            >
              <InstagramIcon />
              Instagram
            </a>
            <a
              href={siteConfig.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={button}
            >
              <LinkedinIcon />
              LinkedIn
            </a>
            <a
              href={siteConfig.links.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className={button}
            >
              <TiktokIcon />
              TikTok
            </a>
            <a
              href={siteConfig.links.x}
              target="_blank"
              rel="noopener noreferrer"
              className={button}
            >
              <XIcon />
              X
            </a>
            <a
              href={siteConfig.links.allLinks}
              target="_blank"
              rel="noopener noreferrer"
              className={button}
            >
              <LinkIcon />
              Nossos links
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}