import { siteConfig } from "@/lib/site";

export default function Invitation() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-4xl px-6">
        <div className="rounded-3xl bg-brand-200 px-8 py-14 text-center">
          <h2 className="text-3xl font-bold text-brand-950 md:text-4xl">
            Quer fazer parte da PucTech?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-brand-900">
            Acompanhe nossas redes para saber sobre processos seletivos, eventos
            e novidades.
          </p>
          <a
            href={siteConfig.links.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block rounded-full bg-brand-950 px-6 py-3 font-medium text-white transition-colors hover:bg-brand-800"
          >
            Siga no Instagram
          </a>
        </div>
      </div>
    </section>
  );
}