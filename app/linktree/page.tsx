import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/components/Logo";
import {
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
  LinkIcon,
  TiktokIcon,
  XIcon,
} from "@/components/SocialIcons";
import { links, type LinkItem } from "@/data/links";
import { ui } from "@/data/ui";
import type { Lang } from "@/lib/i18n";
import { getLang } from "@/lib/lang";

const descriptions: Record<Lang, string> = {
  pt: "Processo seletivo, projetos e as redes da PUC Tech: GitHub, LinkedIn, Instagram, TikTok e X.",
  en: "PUC Tech's selection process, projects and social media: GitHub, LinkedIn, Instagram, TikTok and X.",
  es: "Proceso de selección, proyectos y redes de PUC Tech: GitHub, LinkedIn, Instagram, TikTok y X.",
};

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return { title: "Links", description: descriptions[lang] };
}

const icons = {
  github: GithubIcon,
  instagram: InstagramIcon,
  linkedin: LinkedinIcon,
  tiktok: TiktokIcon,
  x: XIcon,
  link: LinkIcon,
};

// Linha inteira clicável, alta o bastante para o dedo no celular.
const row = "group flex items-center gap-4 py-5";

function Content({ item, arrow }: { item: LinkItem; arrow?: string }) {
  const Icon = icons[item.icon ?? "link"];
  return (
    <>
      <Icon className="size-6 shrink-0 text-accent-ink" />
      <span className="min-w-0 flex-1">
        <span className="block text-lg font-semibold leading-snug underline decoration-transparent decoration-2 underline-offset-4 transition-colors group-hover:decoration-accent">
          {item.label}
        </span>
        {item.description && <span className="block truncate font-mono text-sm text-muted">{item.description}</span>}
      </span>
      {arrow && (
        <span aria-hidden className="text-lg text-muted transition-all group-hover:translate-x-0.5 group-hover:text-ink">
          {arrow}
        </span>
      )}
    </>
  );
}

function Row({ item }: { item: LinkItem }) {
  // Sem link ainda: aparece apagado, com "em breve".
  if (!item.href) {
    return (
      <div aria-disabled className={`${row} opacity-50`}>
        <Content item={item} />
        <span className="font-mono text-sm text-muted">em breve</span>
      </div>
    );
  }
  if (item.href.startsWith("/")) {
    return (
      <Link href={item.href} className={row}>
        <Content item={item} arrow="→" />
      </Link>
    );
  }
  return (
    <a href={item.href} target="_blank" rel="noopener noreferrer" className={row}>
      <Content item={item} arrow="↗" />
    </a>
  );
}

export default async function LinktreePage() {
  const lang = await getLang();
  return (
    <main className="mx-auto w-full max-w-md px-5 pt-16 pb-16 md:pt-24 md:pb-24">
      {/* Sem cabeçalho nesta página (veja o Header): o logo abre a página. */}
      <h1>
        <Logo className="h-auto w-44" alt="PUC Tech" eager />
      </h1>
      <p className="mt-3 text-pretty text-muted">{ui[lang].site.tagline}</p>

      <ul className="mt-10 border-b border-border">
        {links(lang).map((item) => (
          <li key={item.label} className="border-t border-border">
            <Row item={item} />
          </li>
        ))}
      </ul>
    </main>
  );
}
