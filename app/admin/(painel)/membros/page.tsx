import Image from "next/image";
import Link from "next/link";
import { Notice } from "@/components/admin/forms";
import { button } from "@/components/Section";
import { areaInfo, groups } from "@/data/team";
import { loadMembers } from "@/lib/admin-data";

const areaLabel = (id: string) => areaInfo.find((area) => area.id === id)?.label ?? id;

export default async function AdminMembers({ searchParams }: { searchParams: Promise<{ ok?: string }> }) {
  const [{ ok }, members] = await Promise.all([searchParams, loadMembers()]);

  return (
    <>
      <Notice ok={ok} />
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-[-0.03em] md:text-5xl">Membros</h1>
          <p className="mt-3 text-lg text-muted">
            {members.filter((m) => !m.inactive).length} pessoas no site
            {members.some((m) => m.inactive) && `, ${members.filter((m) => m.inactive).length} que já saíram`}.
          </p>
        </div>
        <Link href="/admin/membros/novo" className={`${button.base} ${button.primary}`}>
          Nova pessoa
        </Link>
      </div>

      <div className="mt-12 space-y-14">
        {groups.map((group) => {
          const people = members.filter((member) => member.group === group.id);
          if (people.length === 0) return null;
          return (
            <section key={group.id}>
              <h2 className="font-mono text-sm text-muted">
                {group.label} <span className="opacity-60">{people.length}</span>
              </h2>
              <ul className="mt-4 border-b border-border">
                {people.map((member) => (
                  <li key={member.id} className="border-t border-border">
                    <Link href={`/admin/membros/${member.id}`} className="group flex items-center gap-4 py-4">
                      {member.photo ? (
                        <Image src={member.photo} alt="" width={44} height={44} className="size-11 rounded-full object-cover" />
                      ) : (
                        <span aria-hidden className="size-11 rounded-full bg-surface" />
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="font-semibold underline decoration-transparent decoration-2 underline-offset-4 transition-colors group-hover:decoration-accent">
                          {member.name}
                        </span>
                        {member.inactive && <span className="ml-2 font-mono text-xs text-muted">inativo</span>}
                        <span className="mt-0.5 block truncate font-mono text-sm text-muted">
                          {[member.cargo, ...(member.areas ?? []).map(areaLabel)].filter(Boolean).join(" · ") || "—"}
                        </span>
                      </span>
                      <span className="font-mono text-sm text-muted group-hover:text-ink">editar →</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </>
  );
}
