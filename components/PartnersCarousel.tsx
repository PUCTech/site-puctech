"use client";

import Image from "next/image";
import FeaturedCarousel from "@/components/FeaturedCarousel";

type Partner = { name: string; logo?: string };

export default function PartnersCarousel({
  partners,
}: {
  partners: Partner[];
}) {
  return (
    <div className="mt-10 motion-reduce:hidden">
      <FeaturedCarousel
        items={partners}
        getName={(partner) => partner.name}
        sizeClass="[--tile:5.5rem] [--ratio:1] sm:[--tile:7rem]"
        scales={[1.6, 1, 0.9, 0.8, 0.7]}
        renderTile={(partner) =>
          partner.logo ? (
            <Image
              src={partner.logo}
              alt=""
              width={400}
              height={400}
              sizes="180px"
              loading="eager"
              className="size-full object-cover"
            />
          ) : (
            <span className="flex size-full items-center justify-center px-3 text-center text-sm font-semibold text-brand-950">
              {partner.name}
            </span>
          )
        }
        renderCaption={(partner) => (
          <p className="mt-4 text-center text-lg font-semibold">
            {partner.name}
          </p>
        )}
      />
    </div>
  );
}