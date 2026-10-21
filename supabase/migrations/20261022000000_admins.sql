-- Quem entra no /admin (login com GitHub). Só o servidor lê e grava: RLS ligado e sem policies.
-- github_id é preenchido no primeiro login e passa a valer mais que o nome de usuário
-- (que pode ser trocado e depois pego por outra pessoa).

create table admins (
  id uuid primary key default gen_random_uuid(),
  github_login text not null unique check (github_login = lower(github_login)),
  github_id bigint unique,
  added_by text not null,
  created_at timestamptz not null default now()
);

alter table admins enable row level security;
