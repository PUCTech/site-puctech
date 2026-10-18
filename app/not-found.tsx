import Link from "next/link";
import { Stage } from "@/components/Section";
import { ui } from "@/data/ui";
import { getLang } from "@/lib/lang";

export default async function NotFound() {
  const t = ui[await getLang()].notFound;
  return (
    <main>
      <Stage className="pt-16 pb-24 md:pt-28 md:pb-32">
        <p className="font-mono text-sm text-accent-ink">404</p>
        <h1 className="mt-4 text-4xl font-bold tracking-[-0.04em] md:text-6xl">{t.title}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-muted md:text-xl">{t.text}</p>
        <Link
          href="/"
          className="mt-10 inline-block font-mono text-sm text-accent-ink underline underline-offset-4 hover:text-ink"
        >
          cd ~ — {t.back}
        </Link>
      </Stage>
    </main>
  );
}
