import Image from "next/image";

// logoDark: logo colorido (sem o filtro preto/branco), com a versão para o modo escuro.
type Partner = { name: string; logo?: string; logoDark?: string; href?: string };

// Faixa de logos que rola sem parar (marquee). A lista é duplicada, então andar
// metade da largura fecha o ciclo sem "pulo". Passar o mouse pausa.
// Logos .svg/.png com fundo transparente viram pretos (brancos no modo escuro);
// .jpg (com fundo) ficam em tons de cinza até ganharem uma versão vetorial.
export default function LogoMarquee({ partners }: { partners: Partner[] }) {
  const image = (partner: Partner, hidden: boolean, src: string, className: string, decorative = hidden) => (
    <Image
      key={src}
      src={src}
      alt={decorative ? "" : partner.name}
      width={224}
      height={96}
      className={`max-h-20 w-auto object-contain ${className}`}
    />
  );

  const logo = (partner: Partner, hidden: boolean) => {
    const content = !partner.logo ? (
      <span className="font-semibold text-muted">{partner.name}</span>
    ) : partner.logoDark ? (
      <>
        {image(partner, hidden, partner.logo, "dark:hidden")}
        {image(partner, hidden, partner.logoDark, "hidden dark:block", true)}
      </>
    ) : (
      image(
        partner,
        hidden,
        partner.logo,
        `opacity-70 transition-opacity hover:opacity-100 ${
          partner.logo.endsWith(".jpg") ? "rounded-lg grayscale" : "brightness-0 dark:invert"
        }`,
      )
    );
    return (
      <li
        key={hidden ? `copia-${partner.name}` : partner.name}
        aria-hidden={hidden || undefined}
        className={`flex h-24 w-56 shrink-0 items-center justify-center ${hidden ? "motion-reduce:hidden" : ""}`}
      >
        {partner.href ? (
          <a
            href={partner.href}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={hidden ? -1 : undefined}
            className="flex size-full items-center justify-center"
          >
            {content}
          </a>
        ) : (
          content
        )}
      </li>
    );
  };

  return (
    <div className="marquee-mask group overflow-hidden motion-reduce:overflow-visible">
      <ul className="marquee-track flex w-max gap-10 group-hover:[animation-play-state:paused] motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:animate-none">
        {partners.map((partner) => logo(partner, false))}
        {/* Segunda cópia só para o efeito contínuo; some para leitores de tela e com movimento reduzido. */}
        {partners.map((partner) => logo(partner, true))}
      </ul>
    </div>
  );
}
