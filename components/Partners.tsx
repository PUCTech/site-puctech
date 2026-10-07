import Image from "next/image";
import PartnersCarousel from "@/components/PartnersCarousel";
import Section from "@/components/Section";
import { partners, partnersIntro } from "@/data/home";

export default function Partners() {
  return (
    <Section id="parceiros" title={partnersIntro.title}>
      <div className="max-w-2xl space-y-2 text-lg text-brand-200/90">
        {partnersIntro.paragraphs.map((text) => (
          <p key={text}>{text}</p>
        ))}
      </div>

      <PartnersCarousel partners={partners} />

      {/* Lista para leitores de tela (o carrossel é só visual). */}
      <ul className="sr-only">
        {partners.map((partner) => (
          <li key={partner.name}>{partner.name}</li>
        ))}
      </ul>

      <ul className="mt-10 hidden flex-wrap gap-4 motion-reduce:flex">
        {partners.map((partner) => (
          <li
            key={partner.name}
            className="flex size-28 items-center justify-center overflow-hidden rounded-2xl bg-paper sm:size-32"
          >
            {partner.logo ? (
              <Image
                src={partner.logo}
                alt={partner.name}
                width={128}
                height={128}
                className="size-full object-cover"
              />
            ) : (
              <span className="px-3 text-center font-semibold text-brand-950">
                {partner.name}
              </span>
            )}
          </li>
        ))}
      </ul>
    </Section>
  );
}