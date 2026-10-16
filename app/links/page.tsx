import type { Metadata } from "next";
import Logo from "@/components/Logo";
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
  "group flex w-full items-center gap-4 rounded-full border border-border bg-paper py-2.5 pr-6 pl-2.5 text-left transition-colors";

function LinkContent({ item, arrow }: { item: LinkItem; arrow?: string }) {
  const Icon = icons[item.icon ?? "link"];

  return (
    <>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-on-accent">
        <Icon className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold">{item.label}</span>
        {item.description && (
          <span className="block text-sm text-muted">
            {item.description}
          </span>
        )}
      </span>
      {arrow && (
        <span
          aria-hidden
          className="text-muted transition-colors group-hover:text-ink"
        >
          {arrow}
        </span>
      )}
    </>
  );
}

function LinkCard({ item }: { item: LinkItem }) {
  const hover =
    "hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-ink";

  // Sem link ainda: botão desativado, como no processo seletivo.
  if (!item.href) {
    return (
      <div aria-disabled className={`${card} cursor-not-allowed opacity-60`}>
        <LinkContent item={item} />
        <span className="rounded-full bg-surface px-3 py-1 text-xs font-medium">
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
      <div className="relative mx-auto flex max-w-xl flex-col items-center px-6 py-16 text-center md:py-24">
        <h1>
          <Logo className="h-auto w-56 sm:w-64" alt="PUC Tech" eager />
        </h1>
        <p className="mt-4 text-balance text-muted">
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