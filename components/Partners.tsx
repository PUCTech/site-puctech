import Image from "next/image";
import Section from "@/components/Section";
import { partners, partnersIntro } from "@/data/home";

export default function Partners() {
  // A lista aparece 3 vezes para a rolagem infinita fechar o ciclo sem emenda.
  const loop = [...partners, ...partners, ...partners];

  return (
    <Section id="parceiros" title={partnersIntro.title}>
      <div className="max-w-2xl space-y-2 text-lg text-brand-200/90">
        {partnersIntro.paragraphs.map((text) => (
          <p key={text}>{text}</p>
        ))}
      </div>

      <div className="marquee mt-10 overflow-hidden">
        <ul className="marquee-track flex w-max">
          {loop.map((partner, index) => {
            const duplicate = index >= partners.length;
            return (
              <li
                key={index}
                aria-hidden={duplicate || undefined}
                className={`mr-4 shrink-0 ${duplicate ? "marquee-copy" : ""}`}
              >
                <div className="flex size-28 items-center justify-center overflow-hidden rounded-2xl bg-paper sm:size-32">
                  {partner.logo ? (
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      width={128}
                      height={128}
                      loading="eager"
                      className="size-full object-cover"
                    />
                  ) : (
                    <span className="px-3 text-center font-semibold text-brand-950">
                      {partner.name}
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}