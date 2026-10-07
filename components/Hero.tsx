import Image from "next/image";
import Link from "next/link";
import { hero } from "@/data/home";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-brand-800">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_0%,#143966_0%,transparent_100%)] opacity-70"
      />
      <div className="relative mx-auto flex max-w-5xl flex-col items-center px-6 py-20 text-center md:py-28">
        <Image
          src="/logo.png"
          alt="Logo da PUC Tech"
          width={112}
          height={112}
          loading="eager"
          className="rounded-3xl"
        />
        <h1 className="mt-8 text-balance text-3xl font-bold tracking-tight sm:text-5xl">
          {hero.title}
        </h1>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/equipe"
            className="rounded-full bg-paper px-6 py-3 font-medium text-brand-950 transition-colors hover:bg-brand-200"
          >
            Conheça os membros
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