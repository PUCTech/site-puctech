import Link from "next/link";
import { hero } from "@/data/home";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-brand-800">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_0%,#143966_0%,transparent_100%)] opacity-70"
      />
      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-6 py-20 text-center md:py-28">
        <h1 className="text-6xl font-bold tracking-tight md:text-8xl">
          PUC<span className="font-light italic text-brand-200">Tech</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-brand-200/90 md:text-xl">
          {hero.subtitle}
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/equipe"
            className="rounded-full bg-white px-6 py-3 font-medium text-brand-950 transition-colors hover:bg-brand-200"
          >
            Conheça a equipe
          </Link>
          <a
            href="#sobre"
            className="rounded-full border border-brand-500 px-6 py-3 font-medium transition-colors hover:border-brand-200 hover:text-brand-200"
          >
            Saiba mais
          </a>
        </div>
      </div>
    </section>
  );
}