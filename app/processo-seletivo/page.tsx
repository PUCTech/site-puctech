import type { Metadata } from "next";
import { Block, SidebarLayout, button, withBold } from "@/components/Section";
import { ExternalIcon } from "@/components/SocialIcons";
import { apply, prepare, selectionPage } from "@/data/selection";

export const metadata: Metadata = {
  title: "Processo Seletivo",
  description:
    "Saiba como se preparar para o próximo processo seletivo da PUC Tech, previsto para o primeiro semestre de 2027.",
};

export default function ProcessoSeletivoPage() {
  return (
    <SidebarLayout title={selectionPage.title}>
      <Block tone="surface">
        <p className="font-display text-2xl leading-snug font-semibold tracking-[-0.015em] text-balance text-muted md:text-[2rem]">
          {withBold(selectionPage.intro)}
        </p>
      </Block>

      <div className="grid gap-4 md:grid-cols-2">
        <Block title={prepare.title}>
          <p className="leading-relaxed text-muted">{withBold(prepare.text)}</p>
          <a
            href={prepare.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${button.base} ${button.dark} mt-6`}
          >
            {prepare.linkLabel}
            <ExternalIcon className="size-4" />
          </a>
        </Block>

        <section className="tile flex flex-col items-start justify-between gap-10 bg-ink text-white">
          <p className="font-display text-2xl leading-snug font-bold tracking-[-0.015em] text-balance md:text-3xl">
            <span aria-hidden className="mb-4 block size-3 rounded-full bg-accent" />
            {selectionPage.badge}
          </p>
          {apply.applyUrl ? (
            <a
              href={apply.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${button.base} ${button.primary}`}
            >
              {apply.applyLabel}
              <ExternalIcon className="size-4" />
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="cursor-not-allowed rounded-full border border-white/30 px-5 py-2.5 text-left text-[15px] font-semibold text-white/75"
            >
              {apply.soonLabel}
            </button>
          )}
        </section>
      </div>
    </SidebarLayout>
  );
}
