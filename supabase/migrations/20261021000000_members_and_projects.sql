-- Membros (content/membros.json) e projetos (content/projetos/*.md).
-- Leitura pública; escrita só pelo servidor (service role ignora RLS).

create type member_group as enum (
  'orientador', 'honorario', 'fundador', 'presidente', 'vice-presidente',
  'diretoria-estrategica', 'membro', 'trainee', 'idealizador'
);
create type member_area as enum ('marketing', 'eventos', 'pessoas');
create type project_area as enum (
  'Inteligência Artificial', 'Engenharia de Software', 'Cibersegurança', 'Dados e Pesquisa Aplicada'
);
create type project_status as enum ('em-andamento', 'concluido');

create table members (
  id bigint generated always as identity primary key,
  position int not null unique, -- ordem em que aparece no site
  name text not null,
  "group" member_group not null,
  cargo text,
  areas member_area[],
  president_of member_area[],
  vice_of member_area[],
  photo text,
  linkedin text,
  inactive boolean not null default false, -- saiu da liga, mas segue creditado nos projetos
  -- mesmas regras de teamErrors() em data/team.ts
  check (areas is null or "group" in ('membro', 'trainee')),
  check (president_of is null or "group" = 'membro'),
  check (vice_of is null or "group" = 'membro')
);

-- Textos traduzíveis são jsonb no formato T de lib/i18n.ts: {"pt": "...", "en": "...", "es": "..."}.
-- Só "pt" é obrigatório; idioma que faltar cai no português.
create table projects (
  slug text primary key check (slug ~ '^[a-z0-9-]+$'),
  "order" int not null default 1000,
  title jsonb not null check (title ? 'pt'),
  summary jsonb,
  description jsonb not null check (description ? 'pt'),
  objective jsonb,
  results jsonb,
  area project_area,
  status project_status,
  period text,
  image text,
  tech text[],
  team text[], -- nomes livres: nem todo nome bate com members.name hoje
  repo text
);
create unique index projects_title_pt on projects ((title ->> 'pt'));

alter table members enable row level security;
alter table projects enable row level security;
create policy "leitura pública" on members for select using (true);
create policy "leitura pública" on projects for select using (true);
