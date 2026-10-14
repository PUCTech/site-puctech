import Image from "next/image";

type Partner = { name: string; logo?: string };

const tile =
  "flex size-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-paper sm:size-32";

export default function PartnersCarousel({
  partners,
}: {
  partners: Partner[];
}) {
  if (partners.length === 0) return null;

  // Cada metade precisa ser mais larga que a tela: repete a lista até ter ao menos 10 logos.
  const repeats = Math.ceil(10 / partners.length);
  const half = Array.from({ length: repeats }, () => partners).flat();

  return (
    <div
      aria-hidden
      className="carousel-mask mt-10 overflow-hidden motion-reduce:hidden"
    >
      <div
        className="marquee-track flex w-max"
        // Velocidade constante (cerca de 3 s por logo), não importa quantos parceiros existam.
        style={{ animationDuration: `${half.length * 3}s` }}
      >
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0 gap-4 pr-4">
            {half.map((partner, index) => (
              <li key={index} className={tile}>
                {partner.logo ? (
                  <Image
                    src={partner.logo}
                    alt=""
                    width={128}
                    height={128}
                    sizes="128px"
                    loading="eager"
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
        ))}
      </div>
    </div>
  );
}