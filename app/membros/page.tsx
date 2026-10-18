import type { Metadata } from "next";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import { Heading, Stage } from "@/components/Section";
import MemberCard, {
  featuredGrid,
  membersGrid,
} from "@/components/team/MemberCard";
import MembersWall from "@/components/team/MembersWall";
import OrgChart from "@/components/team/OrgChart";
import {
  advisors,
  executive,
  founders,
  honorary,
  idealizers,
  members,
  strategic,
  teamPage,
  type Member,
} from "@/data/team";
import type { Lang } from "@/lib/i18n";
import { getLang } from "@/lib/lang";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  const t = teamPage[lang];
  return { title: t.title, description: t.description };
}

// Mesmo ritmo da home e do /sobre.
const gap = "py-12 md:py-16";

// Grupo de pessoas. Se estiver vazio, a seção não aparece.
function MemberGroup({
  lang,
  id,
  title,
  subtitle,
  members,
  role,
  highlight = false,
}: {
  lang: Lang;
  id: string;
  title: string;
  subtitle: string;
  members: Member[];
  role?: string;
  highlight?: boolean;
}) {
  if (members.length === 0) return null;

  return (
    <Stage id={id} className={gap}>
      <Heading title={title}>
        <p>{subtitle}</p>
      </Heading>
      <Reveal delay={150}>
        <div className={`mt-10 ${highlight ? featuredGrid : membersGrid}`}>
          {members.map((member) => (
            <MemberCard
              key={member.name}
              member={member}
              lang={lang}
              role={role}
              variant={highlight ? "highlight" : "default"}
            />
          ))}
        </div>
      </Reveal>
    </Stage>
  );
}

// Grupo pequeno, em meia largura: título menor e fotos menores.
function CompactGroup({
  lang,
  title,
  subtitle,
  members,
  role,
}: {
  lang: Lang;
  title: string;
  subtitle: string;
  members: Member[];
  role: string;
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold tracking-[-0.02em] md:text-3xl">{title}</h2>
      <p className="mt-3 leading-relaxed text-pretty text-muted">{subtitle}</p>
      <div className="mt-8 flex flex-wrap gap-x-6 gap-y-8">
        {members.map((member) => (
          <div key={member.name} className="w-36">
            <MemberCard member={member} lang={lang} role={role} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function MembrosPage() {
  const lang = await getLang();
  const t = teamPage[lang];
  const g = t.groups;
  return (
    <main>
      <Stage className="pt-16 pb-12 md:pt-28 md:pb-16">
        <h1 className="fade-in text-4xl font-bold tracking-[-0.04em] md:text-6xl">{t.title}</h1>
        <p className="fade-in mt-6 max-w-3xl text-lg leading-relaxed text-pretty text-muted [animation-delay:250ms] md:text-xl">
          {t.intro}
        </p>
      </Stage>

      <Stage id="conheca-os-membros">
        <Reveal>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl sm:aspect-[21/9]">
            <Image
              src="/equipe/grupo-puctech.jpg"
              alt={t.groupPhotoAlt}
              fill
              sizes="(min-width: 1152px) 1152px, 100vw"
              priority
              className="object-cover"
            />
          </div>
          <p className="mt-8 max-w-3xl text-lg leading-relaxed text-pretty text-muted">
            {t.community}
          </p>
        </Reveal>
      </Stage>

      {/* Tutores e fundadores lado a lado: grupos pequenos, em meia largura. */}
      <Stage id="tutores" className={gap}>
        <Reveal>
          <div className="grid gap-14 md:grid-cols-2 md:gap-16">
            <CompactGroup
              lang={lang}
              title={g.tutores.title}
              subtitle={g.tutores.text}
              members={advisors}
              role={t.roles.tutor}
            />
            <CompactGroup
              lang={lang}
              title={g.fundadores.title}
              subtitle={g.fundadores.text}
              members={founders}
              role={t.roles.founder}
            />
          </div>
        </Reveal>
      </Stage>

      <MemberGroup
        lang={lang}
        id="honorarios"
        title={g.honorarios.title}
        subtitle={g.honorarios.text}
        members={honorary}
        role={t.roles.honorary}
      />

      <Stage id="diretoria-executiva" className={gap}>
        <Heading title={g.organograma.title}>
          <p>{g.organograma.text}</p>
        </Heading>
        <Reveal delay={150}>
          <div className="mt-12">
            <OrgChart lang={lang} />
          </div>
        </Reveal>
      </Stage>

      <MemberGroup
        lang={lang}
        id="diretorias-estrategicas"
        title={g.diretoriasEstrategicas.title}
        subtitle={g.diretoriasEstrategicas.text}
        members={strategic}
        highlight
      />

      {/* Todo mundo da liga (sem trainees por enquanto), com o LinkedIn de cada um. */}
      <Stage id="integrantes" className={gap}>
        <Heading title={g.integrantes.title}>
          <p>{g.integrantes.text}</p>
        </Heading>
        <Reveal delay={150}>
          <div className="mt-10">
            <MembersWall
              lang={lang}
              people={[
                ...executive,
                ...members.filter((m) => m.group === "membro").sort((a, b) => a.name.localeCompare(b.name)),
              ]}
            />
          </div>
        </Reveal>
      </Stage>

      <MemberGroup
        lang={lang}
        id="idealizadores"
        title={g.idealizadores.title}
        subtitle={g.idealizadores.text}
        members={idealizers}
      />

      <div className="pb-12 md:pb-16" />
    </main>
  );
}
