"use client";

import { useState } from "react";
import MemberCard, {
  featuredGrid,
  membersGrid,
} from "@/components/team/MemberCard";
import { areaInfo, members, type AreaId, type Member } from "@/data/team";

type TabId = "geral" | AreaId;

type Level = "president" | "vice" | "member" | "trainee";

const tabs: { id: TabId; label: string }[] = [
  { id: "geral", label: "Geral" },
  ...areaInfo.map((area) => ({ id: area.id, label: area.label })),
];

const sections: {
  key: string;
  levels: Level[];
  title: string;
  highlight: boolean;
  grid: string;
}[] = [
  {
    key: "leaders",
    levels: ["president", "vice"],
    title: "Coordenação",
    highlight: true,
    grid: featuredGrid,
  },
  {
    key: "member",
    levels: ["member"],
    title: "Membros",
    highlight: false,
    grid: membersGrid,
  },
  {
    key: "trainee",
    levels: ["trainee"],
    title: "Trainees",
    highlight: false,
    grid: membersGrid,
  },
];

const labelOf = (id: AreaId) =>
  areaInfo.find((area) => area.id === id)?.label ?? id;

// Só membros e trainees. Presidente e vice gerais ficam na Diretoria Executiva.
const team = members.filter(
  (member) => member.group === "membro" || member.group === "trainee",
);

const areasOf = (member: Member): AreaId[] =>
  Array.from(
    new Set([
      ...(member.areas ?? []),
      ...(member.presidentOf ?? []),
      ...(member.viceOf ?? []),
    ]),
  );

// Na aba Geral (area indefinida) todo mundo é "membro" ou "trainee".
// Na aba de uma área, quem lidera essa área vai para a Coordenação.
function levelIn(member: Member, area: AreaId | undefined): Level {
  if (member.group === "trainee") return "trainee";
  if (!area) return "member";
  if (member.presidentOf?.includes(area)) return "president";
  if (member.viceOf?.includes(area)) return "vice";
  return "member";
}

function roleIn(member: Member, area: AreaId | undefined): string {
  const level = levelIn(member, area);
  if (level === "president") return "Coordenador(a)";
  if (level === "vice") return "Vice-coordenador(a)";
  if (level === "trainee") return "Trainee";
  return "Membro";
}

export default function CurrentTeam() {
  const [active, setActive] = useState<TabId>("geral");
  const area = active === "geral" ? undefined : active;
  const areaDetails = areaInfo.find((item) => item.id === area);

  const visible = area
    ? team.filter((member) => areasOf(member).includes(area))
    : team;

  const badgeOf = (member: Member) =>
    area ? undefined : areasOf(member).map(labelOf).join(" · ") || undefined;

  return (
    <div>
      <div
        role="tablist"
        aria-label="Filtrar equipe por área"
        className="inline-flex flex-wrap gap-1 rounded-3xl bg-surface p-1.5 sm:rounded-full"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={active === tab.id}
            aria-controls="team-panel"
            onClick={() => setActive(tab.id)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
              active === tab.id
                ? "bg-ink text-paper"
                : "text-muted hover:text-ink"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        id="team-panel"
        role="tabpanel"
        aria-labelledby={`tab-${active}`}
        className="mt-8 space-y-10"
      >
        {areaDetails && (
          <p className="max-w-[62ch] text-muted">
            {areaDetails.description}
          </p>
        )}

        {visible.length === 0 && (
          <p className="text-muted">Ninguém por aqui ainda.</p>
        )}

        {sections.map((section) => {
          const people = visible
            .filter((member) => section.levels.includes(levelIn(member, area)))
            .sort(
              (a, b) =>
                section.levels.indexOf(levelIn(a, area)) -
                section.levels.indexOf(levelIn(b, area)),
            );

          if (people.length === 0) return null;

          return (
            <div key={section.key}>
              <h3 className="font-display text-xl font-bold">{section.title}</h3>
              <div className={`mt-6 ${section.grid}`}>
                {people.map((member) => (
                  <MemberCard
                    key={`${active}-${member.name}`}
                    member={member}
                    role={roleIn(member, area)}
                    variant={section.highlight ? "highlight" : "default"}
                    badge={badgeOf(member)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}