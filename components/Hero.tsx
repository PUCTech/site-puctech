import Image from "next/image";
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
      </div>
    </section>
  );
}