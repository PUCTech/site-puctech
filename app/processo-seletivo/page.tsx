import type { Metadata } from "next";
import { apply, prepare, selectionPage } from "@/data/selection";

export const metadata: Metadata = {
  title: "Processo Seletivo",
  description:
    "Saiba como se preparar para o próximo processo seletivo da PUC Tech, previsto para o primeiro semestre de 2027.",
};

// Texto entre **dois asteriscos** vira negrito.
function withBold(text: string) {
  return text.split("**").map((part, index) =>
    index % 2 === 1 ? (
      <strong key={index} className="font-semibold">
        {part}
      </strong>
    ) : (
      part
    ),
  );
}

export default function ProcessoSeletivoPage() {
  return (
    <main>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_0%,#143966_0%,transparent_100%)] opacity-70"
        />
        <div className="relative mx-auto max-w-4xl px-6 py-20 text-center md:py-28">
          <h1 className="text-5xl font-bold tracking-tight md:text-6xl">
            {selectionPage.title}
          </h1>
          <p className="mt-6 inline-block rounded-full bg-brand-200 px-4 py-2 text-sm font-medium text-brand-800">
            {selectionPage.badge}
          </p>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-brand-200/90">
            {withBold(selectionPage.intro)}
          </p>
        </div>
      </section>

      <section className="px-6 pb-20 md:pb-28">
        <div className="mx-auto max-w-3xl rounded-2xl bg-paper p-8 text-center md:p-12">
          <h2 className="text-2xl font-bold text-brand-950 md:text-3xl">
            {prepare.title}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-brand-800">
            {withBold(prepare.text)}
          </p>
          <a
            href={prepare.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block rounded-full bg-brand-950 px-6 py-3 font-medium text-white transition-colors hover:bg-brand-800"
          >
            {prepare.linkLabel} ↗
          </a>
        </div>

        <div className="mt-10 flex justify-center">
          {apply.applyUrl ? (
            <a
              href={apply.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full bg-paper px-8 py-4 text-lg font-semibold text-brand-950 transition-colors hover:bg-brand-200"
            >
              {apply.applyLabel} ↗
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="inline-block cursor-not-allowed text-balance rounded-full border border-brand-500 px-6 py-4 text-center text-base font-semibold text-brand-200/80 sm:px-8 sm:text-lg"
            >
              {apply.soonLabel}
            </button>
          )}
        </div>
      </section>
    </main>
  );
}