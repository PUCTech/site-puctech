import Image from "next/image";

type Partner = { name: string; logo?: string };

// Faixa de logos que rola sem parar (marquee). A lista é duplicada, então andar
// metade da largura fecha o ciclo sem "pulo". Passar o mouse pausa.
// Logos .svg viram pretos (brancos no modo escuro); imagens comuns ficam em tons de cinza.
export default function LogoMarquee({ partners }: { partners: Partner[] }) {
  const logo = (partner: Partner, hidden: boolean) => (
    <li
      key={hidden ? `copia-${partner.name}` : partner.name}
      aria-hidden={hidden || undefined}
      className={`flex h-16 w-40 shrink-0 items-center justify-center ${hidden ? "motion-reduce:hidden" : ""}`}
    >
      {partner.logo ? (
        <Image
          src={partner.logo}
          alt={hidden ? "" : partner.name}
          width={160}
          height={64}
          className={`max-h-14 w-auto object-contain opacity-70 transition-opacity hover:opacity-100 ${
            partner.logo.endsWith(".svg") ? "brightness-0 dark:invert" : "rounded-lg grayscale"
          }`}
        />
      ) : (
        <span className="font-semibold text-muted">{partner.name}</span>
      )}
    </li>
  );

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
