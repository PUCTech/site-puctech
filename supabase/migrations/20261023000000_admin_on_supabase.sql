-- /admin passa a gravar no banco.

-- A ordem vira um campo editável: duas pessoas com o mesmo número ficam em ordem alfabética.
alter table members drop constraint members_position_key;
create index members_position on members (position, name);

-- Fotos enviadas pelo /admin (membros/ e projetos/). Leitura pública; só o servidor grava.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('imagens', 'imagens', true, 4194304, array['image/jpeg', 'image/png', 'image/webp']);
