-- Admin é a conta do GitHub (id), não o nome de usuário: o id é buscado no GitHub
-- quando a pessoa é adicionada. O nome fica só para mostrar (e acompanha trocas de nome).

delete from admins where github_id is null; -- convites antigos, ainda sem conta confirmada
alter table admins alter column github_id set not null;
alter table admins drop constraint admins_github_login_key; -- depois de trocas de nome, dois podem coincidir por um tempo
update admins set added_by = 'ADMIN_GITHUB_ID' where added_by = 'ADMIN_GITHUB';
