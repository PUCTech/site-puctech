"use client";

import { useState } from "react";
import MemberCard from "@/components/team/MemberCard";
import { areas, type AreaId } from "@/data/team";

type TabId = "geral" | AreaId;

const tabs: { id: TabId; label: string }[] = [
  { id: "geral", label: "Geral" },
  ...areas.map((area) => ({ id: area.id, label: area.label })),
];

export default function CurrentTeam() {
  const [active, setActive] = useState<TabId>("geral");

  const isGeneral = active === "geral";
  const visibleAreas = isGeneral
    ? areas
    : areas.filter((area) => area.id === active);

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
        {!isGeneral && (
          <p className="max-w-2xl text-brand-200/80">
            {visibleAreas[0].description}
          </p>
        )}

        <div>
          <h3 className="text-xl font-semibold">Presidentes</h3>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visibleAreas.flatMap((area) =>
              area.presidents.map((member) => (
                <MemberCard
                  key={`${area.id}-${member.name}`}
                  member={member}
                  variant="highlight"
                  badge={isGeneral ? area.label : undefined}
                />
              )),
            )}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold">Membros</h3>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {visibleAreas.flatMap((area) =>
              area.members.map((member) => (
                <MemberCard
                  key={`${area.id}-${member.name}`}
                  member={member}
                  badge={isGeneral ? area.label : undefined}
                />
              )),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}