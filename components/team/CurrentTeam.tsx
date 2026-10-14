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
    title: "Diretoria",
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

function levelIn(member: Member, area: AreaId | undefined): Level {
  if (member.group === "trainee") return "trainee";
  if (!area) return "member";
  if (member.presidentOf?.includes(area)) return "president";
  if (member.viceOf?.includes(area)) return "vice";
  return "member";
}

function roleIn(member: Member, area: AreaId | undefined): string {
  const level = levelIn(member, area);
  if (level === "president") return "Presidente";
  if (level === "vice") return "Vice-presidente";
  if (level === "trainee") return "Trainee";
  return "Membro";
}

export default function CurrentTeam() {
  const [active, setActive] = useState<TabId>("geral");
  const area = active === "geral" ? undefined : active;
  const areaDetails = areaInfo.find((item) => item.id === area);

  const visible = area
  ? team.filter((member) => areasOf(member).includes(area))
  : // Na aba Geral, quem lidera uma área aparece só na aba da própria área.
    team.filter(
      (member) => !member.presidentOf?.length && !member.viceOf?.length,
    );

  const badgeOf = (member: Member) =>
    area ? undefined : areasOf(member).map(labelOf).join(" · ") || undefined;

  return (
    <div>
      <div
        role="tablist"
        aria-label="Filtrar equipe por área"
        className="flex flex-wrap gap-2"
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
            className={`rounded-full border px-5 py-2 text-sm font-medium transition-colors ${
              active === tab.id
                ? "border-brand-200 bg-brand-200 text-brand-950"
                : "border-brand-800 text-brand-200 hover:border-brand-200"
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
        className="mt-10 space-y-12"
      >
        {areaDetails && (
          <p className="max-w-2xl text-brand-200/80">
            {areaDetails.description}
          </p>
        )}

        {visible.length === 0 && (
          <p className="text-brand-200/80">Ninguém por aqui ainda.</p>
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
              <h3 className="text-xl font-semibold">{section.title}</h3>
              <div className={`mt-6 ${section.grid}`}>
                {people.map((member, index) => (
                  <MemberCard
                    key={`${active}-${section.key}-${index}`}
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