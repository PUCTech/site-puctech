import type { Metadata } from "next";
import Image from "next/image";
import { Block, SectionNav, SidebarLayout } from "@/components/Section";
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
    <SidebarLayout
      title={aboutPage.title}
      intro={<p>{aboutPage.intro}</p>}
      aside={
        <SectionNav
          items={[
            { id: "visao", label: vision.title },
            { id: "diferenca", label: "Por que e como" },
            { id: "valores", label: values.title },
            { id: "historia", label: history.title },
            { id: "apoio", label: support.title },
          ]}
        />
      }
    >
      <Block id="visao" tone="accent">
        <h2 className="font-semibold">{vision.title}</h2>
        <p className="mt-4 font-display text-2xl leading-snug font-semibold tracking-[-0.015em] text-balance md:text-[2rem]">
          {vision.text}
        </p>
      </Block>

      <Block id="diferenca" title={difference.title}>
        <ul className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
          {difference.items.map((item, index) => (
            <li key={item.title} className="border-t-2 border-accent pt-5">
              <p className="text-sm font-semibold text-accent-ink">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-2 font-display text-lg font-bold">{item.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{item.text}</p>
            </li>
          ))}
        </ul>
      </Block>

      <Block id="valores" title={values.title}>
        <ul className="divide-y divide-border">
          {values.items.map((value) => (
            <li
              key={value.title}
              className="grid gap-1 py-4 first:pt-0 last:pb-0 sm:grid-cols-[16rem_1fr] sm:gap-6"
            >
              <h3 className="font-display font-bold">{value.title}</h3>
              <p className="text-muted">{value.text}</p>
            </li>
          ))}
        </ul>
      </Block>

      <Block id="historia" title={history.title}>
        <ul className="flex flex-wrap gap-x-12 gap-y-4">
          {history.milestones.map((item) => (
            <li key={item.year}>
              <p className="font-display text-5xl font-bold tracking-[-0.03em]">{item.year}</p>
              <p className="text-sm text-muted">{item.label}</p>
            </li>
          ))}
        </ul>
        <div className="mt-6 space-y-4 leading-relaxed text-muted">
          {history.paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </div>
      </Block>

      <Block id="apoio" title={support.title}>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <Image
            src={support.logo}
            alt="Logo da PUC-SP"
            width={128}
            height={128}
            className="size-24 shrink-0 rounded-xl object-cover"
          />
          <div className="space-y-4 leading-relaxed text-muted">
            {support.paragraphs.map((text) => (
              <p key={text}>{text}</p>
            ))}
          </div>
        </div>
      </Block>
    </SidebarLayout>
  );
}
