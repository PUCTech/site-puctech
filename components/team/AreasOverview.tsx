import Image from "next/image";
import { areaColor, areasOf } from "@/components/team/areas";
import { areaInfo, members, type AreaId } from "@/data/team";

// Ícones de linha (traço Lucide), como os das áreas de projeto.
const icons: Record<AreaId, React.ReactNode> = {
  marketing: <path d="m3 11 18-5v12L3 14v-3zM11.6 16.8a3 3 0 1 1-5.8-1.6" />,
  eventos: (
    <>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </>
  ),
  pessoas: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      <circle cx="9" cy="7" r="4" />
    </>
  ),
};

// Só membros (trainees ficam de fora por enquanto, como no resto da página).
const team = members.filter((m) => m.group === "membro");

/** As três áreas lado a lado: o que fazem, quem coordena e o rosto de quem está nelas. */
export default function AreasOverview() {
  return (
    <ul className="grid gap-12 md:grid-cols-3 md:gap-8">
      {areaInfo.map((area) => {
        const people = team.filter((m) => areasOf(m).includes(area.id));
        const leads = [
          ...people.filter((m) => m.presidentOf?.includes(area.id)).map((m) => ({ m, role: "Coordenação" })),
          ...people.filter((m) => m.viceOf?.includes(area.id)).map((m) => ({ m, role: "Vice" })),
        ];
        const color = areaColor[area.id];
        return (
          <li key={area.id} className={`border-l-2 border-dashed pl-6 ${color.border}`}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
              className={`size-7 ${color.text}`}
            >
              {icons[area.id]}
            </svg>
            <h3 className="mt-4 text-2xl font-bold tracking-[-0.02em]">{area.label}</h3>
            <p className="mt-2 leading-relaxed text-pretty text-muted">{area.description}</p>

            <p className={`mt-6 font-mono text-xs ${color.text}`}>Coordenação</p>
            {leads.length > 0 ? (
              <ul className="mt-2 space-y-1">
                {leads.map(({ m, role }) => (
                  <li key={m.name} className="font-semibold">
                    {m.name} <span className="text-sm font-normal text-muted">· {role}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-muted">A definir</p>
            )}

            <p className={`mt-6 font-mono text-xs ${color.text}`}>
              {people.length} {people.length === 1 ? "pessoa" : "pessoas"}
            </p>
            {/* Rostos sobrepostos; o nome aparece ao passar o mouse e para leitores de tela. */}
            <ul className="mt-3 flex flex-wrap -space-x-3">
              {people.map((m) => (
                <li
                  key={m.name}
                  title={m.name}
                  className="relative size-11 overflow-hidden rounded-full bg-surface ring-2 ring-paper transition-transform hover:z-10 hover:-translate-y-1"
                >
                  {m.photo && <Image src={m.photo} alt="" fill sizes="44px" className="object-cover" />}
                  <span className="sr-only">{m.name}</span>
                </li>
              ))}
            </ul>
          </li>
        );
      })}
    </ul>
  );
}
