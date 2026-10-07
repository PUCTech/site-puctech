"use client";

import { useState } from "react";
import MemberCard, {
  featuredGrid,
  membersGrid,
} from "@/components/team/MemberCard";
import { areaInfo, members, type AreaId, type Member } from "@/data/team";

type TabId = "geral" | AreaId;
type Level = "president" | "member" | "trainee";

const tabs: { id: TabId; label: string }[] = [
  { id: "geral", label: "Geral" },
  ...areaInfo.map((area) => ({ id: area.id, label: area.label })),
];

const sections: {
  level: Level;
  title: string;
  highlight: boolean;
  grid: string;
}[] = [
  {
    level: "president",
    title: "Presidentes",
    highlight: true,
    grid: featuredGrid,
  },
  {
    level: "member",
    title: "Membros",
    highlight: false,
    grid: membersGrid,
  },
  {
    level: "trainee",
    title: "Trainees",
    highlight: false,
    grid: membersGrid,
  },
];

const labelOf = (id: AreaId) =>
  areaInfo.find((area) => area.id === id)?.label ?? id;

function joinLabels(ids: AreaId[]) {
  const labels = ids.map(labelOf);
  if (labels.length <= 1) return labels.join("");
  return `${labels.slice(0, -1).join(", ")} e ${labels[labels.length - 1]}`;
}

// Equipe atual: orientadores e fundadores têm suas próprias seções na página.
const team = members.filter(
  (member) =>
    member.group === "presidente" ||
    member.group === "vice-presidente" ||
    member.group === "membro" ||
    member.group === "trainee",
);

// Áreas da pessoa: as de `areas` mais as que ela preside, sem repetir.
const areasOf = (member: Member): AreaId[] =>
  Array.from(new Set([...(member.areas ?? []), ...(member.presidentOf ?? [])]));

// Nível da pessoa dentro de uma aba. Quem preside só algumas áreas aparece como presidente nelas e como membro nas outras.
function levelIn(member: Member, area: AreaId | undefined): Level {
  if (member.group === "trainee") return "trainee";
  if (member.group === "presidente" || member.group === "vice-presidente") {
    return "president";
  }
  const presides = area
    ? Boolean(member.presidentOf?.includes(area))
    : (member.presidentOf?.length ?? 0) > 0;
  return presides ? "president" : "member";
}

function roleIn(member: Member, area: AreaId | undefined): string {
  const level = levelIn(member, area);
  if (level === "trainee") return "Trainee";
  if (level === "member") return "Membro";
  if (member.group === "presidente") return "Presidente geral";
  if (member.group === "vice-presidente") return "Vice-presidente";
  if (area) return "Presidente";
  return `Presidente de ${joinLabels(member.presidentOf ?? [])}`;
}

export default function CurrentTeam() {
  const [active, setActive] = useState<TabId>("geral");

  const area = active === "geral" ? undefined : active;
  const areaDetails = areaInfo.find((item) => item.id === area);

  // Na aba Geral entram todas, inclusive quem não tem área, uma única vez cada.
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
          const people = visible.filter(
            (member) => levelIn(member, area) === section.level,
          );
          if (people.length === 0) return null;

          return (
            <div key={section.level}>
              <h3 className="text-xl font-semibold">{section.title}</h3>
              <div className={`mt-6 ${section.grid}`}>
                {people.map((member, index) => (
                  <MemberCard
                    key={`${active}-${section.level}-${index}`}
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