"use client";

import { useState } from "react";
import MemberCard from "@/components/team/MemberCard";
import { areaColor, areasOf, labelOf } from "@/components/team/areas";
import { areaInfo, teamPage, type AreaId, type Member } from "@/data/team";
import type { Lang } from "@/lib/i18n";

// Cor do pontinho de cada área (o mesmo tom do contorno no organograma).
const dot: Record<AreaId, string> = {
  marketing: "bg-accent",
  eventos: "bg-amber-400",
  pessoas: "bg-fuchsia-400",
};

// 2, 3, 4 e 5 colunas, descontando os gaps de 1.5rem entre elas.
const cell =
  "w-[calc((100%-1.5rem)/2)] sm:w-[calc((100%-3rem)/3)] md:w-[calc((100%-4.5rem)/4)] lg:w-[calc((100%-6rem)/5)]";

/**
 * Todo mundo, com filtro por área. Filtrar não tira ninguém da grade: quem não é
 * da área só apaga, como no hover do organograma, e o layout não pula.
 */
export default function MembersWall({ people, lang }: { people: Member[]; lang: Lang }) {
  const t = teamPage[lang];
  const [area, setArea] = useState<AreaId | null>(null);
  const filters = [
    { id: null, label: t.all, count: people.length },
    ...areaInfo.map((a) => ({
      id: a.id,
      label: a.name[lang],
      count: people.filter((m) => areasOf(m).includes(a.id)).length,
    })),
  ];

  return (
    <div>
      <div role="group" aria-label={t.filter} className="flex flex-wrap gap-2">
        {filters.map((f) => {
          const active = area === f.id;
          const color = f.id ? areaColor[f.id] : { border: "border-ink", text: "text-ink" };
          return (
            <button
              key={f.label}
              type="button"
              aria-pressed={active}
              onClick={() => setArea(f.id)}
              className={`rounded-full border-2 border-dashed px-4 py-1.5 font-mono text-sm transition-colors ${
                active ? `${color.border} ${color.text}` : "border-transparent text-muted hover:text-ink"
              }`}
            >
              {f.label} <span className="opacity-60">{f.count}</span>
            </button>
          );
        })}
      </div>

      {/* Flex com largura de coluna fixa: a última linha, se incompleta, fica centralizada. */}
      <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-10">
        {people.map((m) => {
          const areas = areasOf(m);
          const dimmed = area !== null && !areas.includes(area);
          return (
            <div
              key={m.name}
              aria-hidden={dimmed || undefined}
              className={`${cell} transition-opacity duration-300 ${dimmed ? "pointer-events-none opacity-20" : ""}`}
            >
              <MemberCard
                member={m}
                lang={lang}
                role={m.presidentOf ? t.roles.lead : m.viceOf ? t.roles.vice : t.roles.member}
                badge={
                  areas.length > 0 && (
                    <span className="flex flex-wrap gap-x-3 gap-y-1">
                      {areas.map((id) => (
                        <span key={id} className={`inline-flex items-center gap-1.5 ${areaColor[id].text}`}>
                          <span aria-hidden className={`size-1.5 rounded-full ${dot[id]}`} />
                          {labelOf(id, lang)}
                        </span>
                      ))}
                    </span>
                  )
                }
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
