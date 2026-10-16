import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
  LinkIcon,
  TiktokIcon,
  XIcon,
} from "@/components/SocialIcons";
import { links, linksPage, type LinkItem } from "@/data/links";

export const metadata: Metadata = {
  title: "Links",
  description: "Siga a PUC Tech no GitHub, LinkedIn, Instagram, TikTok e X.",
};

const icons = {
  github: GithubIcon,
  instagram: InstagramIcon,
  linkedin: LinkedinIcon,
  tiktok: TiktokIcon,
  x: XIcon,
  link: LinkIcon,
};

const card =
  "group flex w-full items-center gap-4 rounded-2xl border border-brand-800 bg-brand-900/60 px-5 py-4 text-left transition-colors";

function LinkContent({ item, arrow }: { item: LinkItem; arrow?: string }) {
  const Icon = icons[item.icon ?? "link"];

  return (
    <>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-200 text-brand-950">
        <Icon className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold">{item.label}</span>
        {item.description && (
          <span className="block text-sm text-brand-200/80">
            {item.description}
          </span>
        )}
      </span>
      {arrow && (
        <span
          aria-hidden
          className="text-brand-200/60 transition-colors group-hover:text-brand-200"
        >
          {arrow}
        </span>
      )}
    </>
  );
}

function LinkCard({ item }: { item: LinkItem }) {
  const hover =
    "hover:border-brand-200 hover:bg-brand-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-200";

  // Sem link ainda: botão desativado, como no processo seletivo.
  if (!item.href) {
    return (
      <div aria-disabled className={`${card} cursor-not-allowed opacity-60`}>
        <LinkContent item={item} />
        <span className="rounded-full border border-brand-500 px-3 py-1 text-xs font-medium text-brand-200">
          em breve
        </span>
      </div>
    );
  }

  // Página do próprio site.
  if (item.href.startsWith("/")) {
    return (
      <Link href={item.href} className={`${card} ${hover}`}>
        <LinkContent item={item} arrow="→" />
      </Link>
    );
  }

  return (
    <a
      href={item.href}
      target={item.href.startsWith("http") ? "_blank" : undefined}
      rel="noopener noreferrer"
      className={`${card} ${hover}`}
    >
      <LinkContent item={item} arrow="↗" />
    </a>
  );
}

export default function LinksPage() {
  return (
    <main className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_40%_at_50%_0%,#143966_0%,transparent_100%)] opacity-70"
      />
      <div className="relative mx-auto flex max-w-xl flex-col items-center px-6 py-16 text-center md:py-24">
        <h1>
          <Image
            src="/logo-puctech.svg"
            alt="PUC Tech"
            width={310}
            height={82}
            loading="eager"
            className="h-auto w-56 sm:w-64"
          />
        </h1>
        <p className="mt-4 text-balance text-brand-200/90">
          {linksPage.tagline}
        </p>
        
        <ul className="mt-10 flex w-full flex-col gap-3">
          {links.map((item) => (
            <li key={item.label}>
              <LinkCard item={item} />
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}