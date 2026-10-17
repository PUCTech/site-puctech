import { areaInfo, type AreaId, type Member } from "@/data/team";

// Cor de cada área (organograma e Áreas Operacionais): contorno pontilhado e texto.
export const areaColor: Record<AreaId, { border: string; text: string }> = {
  marketing: { border: "border-accent", text: "text-accent-ink" },
  eventos: { border: "border-amber-400", text: "text-amber-600 dark:text-amber-300" },
  pessoas: { border: "border-fuchsia-400", text: "text-fuchsia-600 dark:text-fuchsia-300" },
};

export const areaIndex = (id: AreaId) => areaInfo.findIndex((area) => area.id === id);
export const labelOf = (id: AreaId) => areaInfo[areaIndex(id)].label;

/** Áreas de alguém (como membro ou na coordenação), na ordem do areaInfo. */
export const areasOf = (m: Member): AreaId[] =>
  Array.from(new Set([...(m.areas ?? []), ...(m.presidentOf ?? []), ...(m.viceOf ?? [])])).sort(
    (a, b) => areaIndex(a) - areaIndex(b),
  );
