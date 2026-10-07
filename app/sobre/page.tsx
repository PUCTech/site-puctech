import type { Metadata } from "next";
import Image from "next/image";
import Section from "@/components/Section";
import {
  aboutPage,
  difference,
  history,
  support,
  values,
  vision,
} from "@/data/about";

export const metadata: Metadata = {
  title: "Sobre nós",
  description:
    "Conheça a visão, os valores e a história da PUC Tech, a primeira liga de ciência e tecnologia da PUC-SP.",
};

export default function SobrePage() {
  return (
    <main>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_0%,#143966_0%,transparent_100%)] opacity-70"
        />
        <div className="relative mx-auto max-w-4xl px-6 py-20 text-center md:py-28">
          <h1 className="text-5xl font-bold tracking-tight md:text-6xl">
            {aboutPage.title}
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-brand-200/90">
            {aboutPage.intro}
          </p>
        </div>
      </section>

      <Section id="diferenca" title={difference.title}>
        <div className="grid gap-4 sm:grid-cols-2">
          {difference.items.map((item, index) => (
            <div key={item.title} className="rounded-2xl bg-paper p-6 md:p-8">
              <p className="text-sm font-semibold text-brand-500">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 text-xl font-semibold text-brand-950">
                {item.title}
              </h3>
              <p className="mt-3 text-brand-800">{item.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="visao" title={vision.title}>
        <div className="rounded-3xl bg-brand-200 p-8 md:p-12">
          <p className="max-w-4xl text-xl leading-relaxed text-brand-950 md:text-2xl">
            {vision.text}
          </p>
        </div>
      </Section>

      <Section id="valores" title={values.title}>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {values.items.map((value) => (
            <li key={value.title} className="rounded-2xl bg-paper p-6">
              <h3 className="text-lg font-semibold text-brand-950">
                {value.title}
              </h3>
              <p className="mt-2 text-brand-800">{value.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <section id="historia" className="scroll-mt-16 px-6 py-16 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-8 rounded-[2rem] bg-paper p-8 md:grid-cols-12 md:p-14">
          <div className="md:col-span-4">
            <h2 className="text-3xl font-bold text-brand-950 md:text-4xl">
              {history.title}
            </h2>
            <ul className="mt-6 flex flex-wrap gap-3 md:flex-col md:items-start">
              {history.milestones.map((item) => (
                <li
                  key={item.year}
                  className="rounded-full bg-brand-200 px-4 py-2 text-sm font-medium text-brand-800"
                >
                  <span className="font-bold">{item.year}</span> · {item.label}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4 text-lg leading-relaxed text-brand-800 md:col-span-8">
            {history.paragraphs.map((text) => (
              <p key={text}>{text}</p>
            ))}
          </div>
        </div>
      </section>

      <Section id="apoio" title={support.title}>
        <div className="flex flex-col gap-8 md:flex-row md:items-center">
          <Image
            src={support.logo}
            alt="Logo da PUC-SP"
            width={160}
            height={160}
            className="size-32 shrink-0 rounded-2xl object-cover md:size-40"
          />
          <div className="max-w-3xl space-y-4 text-lg text-brand-200/90">
            {support.paragraphs.map((text) => (
              <p key={text}>{text}</p>
            ))}
          </div>
        </div>
      </Section>
    </main>
  );
}