# PUC Tech | Site da Liga de Ciência e Tecnologia da PUC-SP

Site institucional da PUC Tech, publicado em <https://www.puctech.com.br/>

Feito com **Next.js** (App Router), **TypeScript** e **Tailwind CSS 4**, hospedado na **Vercel**. Cada push na branch `main` publica uma nova versão automaticamente.

```
npm install      # instala as dependências
npm run dev      # desenvolvimento em http://localhost:3000
npm run build    # build de produção (checa TypeScript e confere os arquivos de dados e de projetos)
npm run start    # roda o build gerado
npm run lint     # roda o ESLint
```

Requer Node.js 20.9 ou superior (exigência do Next.js 16).

---

## O que o site tem hoje

**Páginas**

| Rota                 | Arquivo                            | Conteúdo                                                                                     |
| -------------------- | ---------------------------------- | -------------------------------------------------------------------------------------------- |
| `/`                  | `app/page.tsx`                   | Home com hero, sobre, números, projetos (áreas), parceiros e redes sociais                   |
| `/sobre`             | `app/sobre/page.tsx`               | Diferença da liga, visão, valores, história e apoio institucional                            |
| `/equipe`            | `app/equipe/page.tsx`              | Foto da equipe, introdução, tutores, fundadores, diretoria e áreas operacionais (com abas)   |
| `/projetos`          | `app/projetos/page.tsx`            | Áreas de atuação e a seção de projetos (filtros, carrossel e lista completa)                 |
| `/processo-seletivo` | `app/processo-seletivo/page.tsx`   | Data do próximo processo, como se preparar e botão de inscrição                              |
| `/links`             | `app/links/page.tsx`               | GitHub e redes sociais da liga (é o "Nossos links" do rodapé e da home)                      |

**Elementos presentes em todas as páginas:** header fixo no topo (com menu responsivo e destaque da página atual) e footer.

**Funcionalidades**

- Contagem animada nos números da home, que começa quando a seção aparece na tela.
- Faixa de parceiros que rola sem parar (a lista é duplicada para o ciclo fechar sem "pulo").
- Carrossel de projetos com botões de anterior/próximo. Troca sozinho a cada 4 segundos, reinicia o tempo a cada clique e pausa com o mouse, o foco do teclado ou o pop-up aberto.
- Botão **Filtros** acima do carrossel, com os filtros de **Área** e **Status**, e contador de projetos. Os filtros valem para o carrossel e para a lista.
- Botão **Ver todos os projetos**, que abre a lista completa (respeitando os filtros) abaixo do carrossel.
- Pop-up com os detalhes de cada projeto (descrição, stacks, objetivo, resultados, equipe e link do repositório).
- Projetos escritos em arquivos `.md` (um por projeto), lidos e conferidos no build.
- Abas na seção de áreas operacionais da página de equipe: **Geral**, **Marketing**, **Eventos** e **Pessoas**.
- Botão de inscrição do processo seletivo que fica desativado ("em breve") até o link existir.
- Acessibilidade: quem usa "reduzir movimento" no sistema vê a lista de projetos sempre aberta no lugar do carrossel, uma grade estática no lugar da faixa de parceiros e o número final direto nos números; o carrossel de projetos tem uma lista alternativa para teclado e leitor de tela; o pop-up usa o `<dialog>` nativo (ESC, foco preso e fundo travado).
- SEO: título e descrição por página, imagem de prévia ao compartilhar o link, favicon, `sitemap.xml` e `robots.txt`.
- Cabeçalhos de segurança configurados em `next.config.ts` (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` e `Permissions-Policy`).

---

## Estrutura de pastas

```
app/
├── layout.tsx                  Estrutura comum: fontes, header, footer e metadados de SEO
├── page.tsx                    Home (monta as seções na ordem em que aparecem)
├── sobre/page.tsx              Página "Sobre nós"
├── equipe/page.tsx             Página da equipe
├── projetos/page.tsx           Página de projetos
├── processo-seletivo/page.tsx  Página do processo seletivo
├── links/page.tsx              Página de links (GitHub e redes sociais)
├── globals.css                 Paleta de cores e estilos globais
├── icon.png                    Favicon
├── opengraph-image.tsx         Gera a imagem de prévia ao compartilhar o link
├── sitemap.ts                  Gera o sitemap.xml
└── robots.ts                   Gera o robots.txt

components/
├── Header.tsx                  Cabeçalho
├── Footer.tsx                  Rodapé
├── Section.tsx                 Bloco padrão de seção (título, subtítulo, espaçamento e fundo)
├── Hero.tsx                    Topo da home (logo e título)
├── About.tsx                   Seção "Sobre" da home
├── Stats.tsx                   Seção de números (com a animação de contagem)
├── ProjectsSection.tsx         Seção "Projetos" da home (texto e áreas)
├── ProjectsShowcase.tsx        Filtros, carrossel de projetos, lista completa e pop-up
├── ProjectTile.tsx             Quadrado de um projeto (capa e título)
├── ProjectDetails.tsx          Conteúdo de um projeto, mostrado dentro do pop-up
├── ProjectModal.tsx            Pop-up com os detalhes de um projeto
├── Partners.tsx                Seção "Parceiros"
├── PartnersCarousel.tsx        Faixa de logos dos parceiros que rola sem parar
├── FeaturedCarousel.tsx        Carrossel com destaque no centro (usado pelos projetos)
├── Social.tsx                  Seção "Acompanhe nossas redes sociais"
├── SocialIcons.tsx             Ícones (GitHub, Instagram, LinkedIn, TikTok, X, link)
└── team/
    ├── MemberCard.tsx          Cartão de um membro (normal ou em destaque)
    └── CurrentTeam.tsx         Abas e listas das "Áreas Operacionais"

content/
└── projetos/                   Um arquivo .md por projeto (e o modelo _modelo.md)

data/
├── home.ts                     Textos, números e parceiros da home
├── about.ts                    Textos da página "Sobre nós"
├── projects.ts                 Textos da página, áreas, status e tipos dos projetos
├── selection.tsx               Textos e link do processo seletivo
├── team.ts                     Orientadores, fundadores, diretoria, áreas e membros
└── links.ts                    Links da página /links

lib/
├── site.ts                     Nome do site, endereço, links das redes e itens do menu
└── projects.ts                 Lê e confere os arquivos de content/projetos (só no servidor)

public/
├── logo-puctech.svg            Logotipo da liga (header, hero e /links)
├── logo.png                    Ícone quadrado da liga (não é mais usado nas páginas; fica de reserva)
├── equipe/                     Fotos dos membros e a foto do grupo (grupo-puctech.jpg)
├── parceiros/                  Logos dos parceiros
└── projetos/                   Capas dos projetos (e, em areas/, as fotos das áreas de atuação)
```

A regra geral: **o conteúdo fica em `content/`, `data/` e `lib/site.ts`; a aparência fica em `components/` e `app/`.**

---

## Onde mexer para cada coisa

| Quero mudar...                                                 | Arquivo                                              |
| -------------------------------------------------------------- | ---------------------------------------------------- |
| Título grande do topo da home                                  | `data/home.ts` → `hero`                              |
| Texto da seção "Sobre" da home                                 | `data/home.ts` → `about`                             |
| Números da seção de números                                    | `data/home.ts` → `stats`                             |
| Texto da seção "Projetos" da home                              | `data/home.ts` → `projectsIntro`                     |
| Texto da seção "Parceiros"                                     | `data/home.ts` → `partnersIntro`                     |
| Lista de parceiros e logos                                     | `data/home.ts` → `partners` + `public/parceiros/`    |
| Texto da seção de redes sociais                                | `data/home.ts` → `socialIntro`                       |
| Textos da página "Sobre nós"                                   | `data/about.ts`                                      |
| Cadastrar, editar ou remover um projeto                        | `content/projetos/` (um arquivo `.md` por projeto)   |
| Título e introdução da página de projetos                      | `data/projects.ts` → `projectsPage`                  |
| Áreas de atuação dos projetos                                  | `data/projects.ts` → `projectAreas`                  |
| Opções do filtro de status                                     | `data/projects.ts` → `projectStatuses`               |
| Textos dos botões "Filtros" e "Ver todos os projetos"          | `components/ProjectsShowcase.tsx`                    |
| Abrir o processo seletivo (link do formulário)                 | `data/selection.tsx` → `apply.applyUrl`              |
| Data e textos do processo seletivo                             | `data/selection.tsx`                                 |
| Orientadores, fundadores, diretoria e membros                  | `data/team.ts` → `members`                           |
| Descrição de cada grupo da equipe                              | `data/team.ts` → `groupDescriptions`                 |
| Áreas operacionais (abas)                                      | `data/team.ts` → `areaInfo`                          |
| Texto de introdução da página de equipe                        | `app/equipe/page.tsx`                                |
| Links da página /links (e a ordem deles)                       | `data/links.ts`                                      |
| Endereços do GitHub, LinkedIn, Instagram, TikTok, X e "Nossos links" | `lib/site.ts` → `siteConfig.links`             |
| Ordem dos botões de redes no rodapé                            | `components/Footer.tsx` (coluna "Redes")             |
| Ordem dos botões de redes na seção da home                     | `components/Social.tsx`                              |
| Adicionar o ícone de uma nova rede                             | `components/SocialIcons.tsx` (e `LinkIconId` em `data/links.ts`) |
| Logo do site (header, hero e /links)                           | `public/logo-puctech.svg`                            |
| Tamanho do logo no header, no hero ou em /links                | `components/Header.tsx`, `components/Hero.tsx` ou `app/links/page.tsx` (classe `h-`/`w-` do `<Image>`) |
| Itens do menu (topo e rodapé)                                  | `lib/site.ts` → `navLinks`                           |
| Descrição que aparece no rodapé                                | `lib/site.ts` → `siteConfig.description`             |
| Cores do site                                                  | `app/globals.css`                                    |
| Títulos fixos das seções ("Nossos números", "Projetos" etc.)   | No próprio componente da seção, em `components/`     |
| Texto do botão "Conheça nossos projetos"                       | `components/ProjectsSection.tsx`                     |
| Título e descrição do site no Google                           | `app/layout.tsx` → `metadata`                        |
| Título e descrição de cada página no Google                    | `metadata` no `page.tsx` da página                   |
| Imagem de prévia ao compartilhar o link                        | `app/opengraph-image.tsx`                            |
| Favicon                                                        | `app/icon.png`                                       |
| Ordem das seções da home                                       | `app/page.tsx`                                     |
| Páginas listadas no sitemap                                    | `app/sitemap.ts`                                     |
| Cabeçalhos de segurança                                        | `next.config.ts`                                     |

---

## Idiomas (português, inglês e espanhol)

O site existe em três idiomas, no mesmo endereço (como no site da Peacore). O PT · EN · ES no
cabeçalho grava a escolha num cookie (`lang`) e o servidor já manda a página no idioma; sem
escolha, português. O `/admin` é só em português. O Google vê a versão em português.

- **Textos das páginas:** cada arquivo de `data/` tem um bloco `pt`, um `en` e um `es` com a
  mesma estrutura. Mudou um texto em português, mude também nos outros dois (o TypeScript reclama
  se faltar um campo). Os marcos da linha do tempo (`data/about.ts`) e as áreas dos projetos
  (`data/projects.ts`) têm o texto nos três idiomas lado a lado.
- **Menu, rodapé e botões:** `data/ui.ts`.
- **Projetos:** o `.md` de `content/projetos/` é o português. A tradução fica em
  `content/projetos/en/` e `content/projetos/es/`, com o mesmo nome de arquivo, só com `title`,
  `summary` e as seções (`## Description`, `## Goal and scope`, `## Results and lessons learned`;
  em espanhol, `## Descripción`, `## Objetivo y alcance`, `## Resultados y aprendizajes`).
  Sem tradução, a página mostra o português. Editar pelo `/admin` muda só o português.
- **Cargos** (Presidente, Tutora...): a tradução fica em `data/team.ts` → `cargos`.
- **Como funciona:** `lib/lang.ts` lê o cookie (`getLang()`), e cada página pega os textos do
  idioma. As definições dos idiomas ficam em `lib/i18n.ts`.

## Conteúdo

Em `data/home.ts`, `about.ts`, `selection.tsx`, `team.ts` e `links.ts`, para adicionar ou remover um item de uma lista basta incluir ou apagar um objeto: os componentes mostram todos os itens, sem precisar de outra alteração.

### `content/projetos/` (projetos)

Cada projeto é um arquivo `.md`. O nome do arquivo só identifica o projeto: use letras minúsculas, sem acento e com hífen no lugar de espaço (ex.: `meu-projeto.md`).

**Para adicionar um projeto:**

1. Copie `content/projetos/_modelo.md` e renomeie (ex.: `meu-projeto.md`).
2. Preencha o cabeçalho (entre os `---`) e as seções do texto.
3. Se tiver capa, coloque a imagem em `public/projetos/` e informe `image: "/projetos/meu-projeto.jpg"`.
4. Pronto: ele aparece no carrossel e na lista completa.

Arquivos que começam com `_` são ignorados pelo site (é o caso do modelo).

**Exemplo:**

```md
---
title: "Nome do Projeto"
summary: "Resumo breve em uma ou duas frases."
area: "Inteligência Artificial"
status: "em-andamento"
period: "2026.1"
tech: [Python, React, AWS]
team:
  - "Nome Sobrenome"
  - "Nome Sobrenome"
repo: "https://github.com/..."
---

## Descrição

Texto da descrição. Uma linha em branco separa os parágrafos.

## Objetivo e escopo

Texto do objetivo.

## Resultados e aprendizados

Texto dos resultados.
```

**Campos do cabeçalho** (só `title` é obrigatório aqui; a descrição vem do texto):

| Campo     | Função                                                                                              |
| --------- | --------------------------------------------------------------------------------------------------- |
| `title`   | Nome do projeto (**deve ser único**)                                                                |
| `summary` | Resumo de 1 ou 2 frases, que aparece embaixo do carrossel                                           |
| `area`    | Uma das quatro áreas de `projectAreas`, escrita exatamente igual (outro valor gera erro no build)   |
| `status`  | `"em-andamento"` ou `"concluido"` (usado no filtro; sem status, o projeto some ao filtrar por ele)  |
| `period`  | Período, ex.: `"2026.1"` (**sempre entre aspas**)                                                   |
| `image`   | Capa, ex.: `"/projetos/nome-do-projeto.jpg"` (arquivo em `public/projetos/`). Aparece nos cards do carrossel e da lista, não no pop-up |
| `tech`    | Stacks, ex.: `[Python, React, AWS]` (veja a observação abaixo)                                      |
| `team`    | Lista com a equipe envolvida (um nome por linha, com `-`)                                           |
| `repo`    | Link do repositório ou da publicação (vira o botão "Ver repositório")                               |
| `order`   | Número que define a posição no carrossel e na lista (menor aparece primeiro). Sem `order`, o projeto vai para o fim, em ordem alfabética |

**Seções do texto** (títulos exatos, nesta ordem): `## Descrição` (obrigatória), `## Objetivo e escopo` e `## Resultados e aprendizados`. Cada seção é opcional, menos a descrição. O texto é simples: uma linha em branco separa os parágrafos, e listas, negrito e links não são formatados.

**Boas práticas para os textos:** escreva a partir do README do repositório do projeto, com frases diretas: o que o projeto faz, como foi feito e o que ficou pronto. Não inclua números, pesquisas ou afirmações que você não consiga conferir.

**Stacks (`tech`):** liste só linguagens, frameworks, bibliotecas e bancos de dados. Fica de fora o que é hospedagem, provedor ou técnica genérica (por exemplo Render, Railway, Supabase, "APIs REST" ou "Web Scraping").

**Capas (`image`):**

- Proporção 4:3 (por exemplo, 1600×1200), com o conteúdo importante no centro.
- Deixe livre o quarto de baixo da imagem, porque o título do projeto aparece sobre ela.
- Prefira JPG ou WebP, com até uns 300 KB.
- Sem `image`, o card mostra um degradê azul.

**Cuidados com o cabeçalho:**

- Use aspas em textos que tenham `:` ou comecem com `@` (ex.: `"@usuario"`). Sem aspas, o arquivo dá erro.
- `period` sem aspas vira número (`2026.10` viraria `2026.1`). Escreva `"2026.1"`.

Se algo estiver errado, o build falha com uma mensagem dizendo qual arquivo e qual campo têm o problema. Se não houver nenhum projeto, a seção mostra "Em breve, os projetos da PUC Tech vão aparecer aqui."

O pop-up mostra apenas os campos preenchidos.

### `data/projects.ts`

Exporta `projectsPage` (título e introdução da página), `projectAreas` (as quatro áreas de atuação), `projectStatuses` (as opções de status, com `id` e `label`) e os tipos `Project`, `ProjectArea` e `ProjectStatus`. Os projetos em si ficam em `content/projetos/`, e quem os lê é o `lib/projects.ts`.

### `data/home.ts`

Textos e números da home. Para destacar uma palavra em negrito, use `**assim**`.

| Exportação      | Formato                       | Usada por                              |
| --------------- | ----------------------------- | -------------------------------------- |
| `hero`          | `{ title }`                   | `Hero.tsx`                             |
| `about`         | `{ title, paragraphs[] }`     | `About.tsx`                            |
| `stats`         | `[{ value, suffix, label }]`  | `Stats.tsx`                            |
| `projectsIntro` | `{ text, areas[] }`           | `ProjectsSection.tsx` (só usa `text`)  |
| `partnersIntro` | `{ title, paragraphs[] }`     | `Partners.tsx`                         |
| `partners`      | `[{ name, logo? }]`           | `Partners.tsx`, `PartnersCarousel.tsx` |
| `socialIntro`   | `{ title, tagline, text }`    | `Social.tsx`                           |

Em `stats`, `value` é o número final da contagem (um número, não texto) e `suffix` é o sinal exibido depois dele, como `+`.

Em `partners`, para mostrar o logo coloque o arquivo em `public/parceiros/` e informe `logo: "/parceiros/nome.jpg"`. Sem `logo`, aparece o nome em texto.

> Atenção: o `about` de `data/home.ts` é o texto da **home**. O texto da **página `/sobre`** fica em `data/about.ts`. As áreas de atuação mostradas na home vêm de `projectAreas` (em `data/projects.ts`).

### `data/about.ts`

Textos da página `/sobre`: `aboutPage` (título e introdução), `difference` (quatro cartões), `vision`, `values` (lista de valores), `history` (marcos por ano e parágrafos) e `support` (apoio institucional, com o logo da PUC-SP).

### `data/selection.tsx`

Textos da página `/processo-seletivo`. Texto entre `**dois asteriscos**` vira negrito.

| Exportação      | Conteúdo                                                                 |
| --------------- | ------------------------------------------------------------------------ |
| `selectionPage` | `title`, `badge` (etiqueta abaixo do título) e `intro`                   |
| `prepare`       | Bloco "Como se preparar": `title`, `text`, `linkLabel` e `linkUrl`       |
| `apply`         | Botão de inscrição: `applyUrl`, `applyLabel` e `soonLabel`               |

**Para abrir o processo seletivo:** cole o link do formulário em `apply.applyUrl`. Enquanto estiver vazio, o botão aparece desativado com o texto de `soonLabel`. Quando abrir, atualize também o `badge`, a `intro` e a `description` do `metadata` em `app/processo-seletivo/page.tsx`, que citam o semestre.

### `data/team.ts`

Toda a equipe fica em uma lista só, `members`, uma linha por pessoa. Para adicionar, copie uma linha; para editar, mude os campos; para remover, apague a linha. A ordem da lista é a ordem no site.

| Campo         | Obrigatório | Função                                                                                                      |
| ------------- | ----------- | ----------------------------------------------------------------------------------------------------------- |
| `name`        | sim         | Nome                                                                                                        |
| `group`       | sim         | Nível da pessoa (veja a tabela abaixo)                                                                      |
| `cargo`       | não         | Texto abaixo do nome (ex.: `"Presidente"`). Sem ele, o site usa o texto padrão do grupo                     |
| `areas`       | não         | Áreas de membro ou trainee (`"marketing"`, `"eventos"`, `"pessoas"`); sem área, só aparece na aba Geral     |
| `presidentOf` | não         | Áreas que o membro coordena (só para `group: "membro"`)                                                     |
| `viceOf`      | não         | Áreas em que o membro é vice-coordenador (só para `group: "membro"`)                                        |
| `photo`       | não         | Ex.: `"/equipe/nome.jpg"` (arquivo em `public/equipe/`)                                                     |
| `linkedin`    | não         | Torna o cartão inteiro um link (o texto do link é sempre "LinkedIn")                                        |

**Valores de `group` e onde cada um aparece em `/equipe`:**

| `group`                   | Seção                                  |
| ------------------------- | -------------------------------------- |
| `"orientador"`            | Tutores                                |
| `"honorario"`             | Membros Honorários                     |
| `"fundador"`              | Fundadores                             |
| `"presidente"`            | Diretoria Executiva                    |
| `"vice-presidente"`       | Diretoria Executiva                    |
| `"diretoria-estrategica"` | Diretorias Estratégicas                |
| `"membro"`                | Áreas Operacionais                     |
| `"trainee"`               | Áreas Operacionais                     |
| `"idealizador"`           | Idealizadores                          |

Grupos sem ninguém não aparecem na página (hoje é o caso de Membros Honorários, Diretorias Estratégicas e Idealizadores). Se alguém for cadastrado em Membros Honorários ou Diretorias Estratégicas, a seção aparece na página.

Quem coordena uma área já pertence a ela, não precisa repetir em `areas`. Quem é fundador (ou orientador) e também faz parte da equipe atual ganha duas linhas, uma de cada `group`.

Sem `photo`, o cartão mostra um círculo com as iniciais do nome (títulos como "Prof." são ignorados). Fotos quadradas, ou com o rosto centralizado, ficam melhores no círculo.

O arquivo confere a lista a cada build. Se algo estiver errado (por exemplo, `areas` em quem não é membro nem trainee), o build falha com uma mensagem dizendo qual pessoa (posição na lista) tem o problema.

| Exportação          | Aparece em                                       |
| ------------------- | ------------------------------------------------ |
| `advisors`          | Seção "Tutores"                                  |
| `honorary`          | Seção "Membros Honorários"                       |
| `founders`          | Seção "Fundadores"                               |
| `executive`         | Seção "Diretoria Executiva"                      |
| `strategic`         | Seção "Diretorias Estratégicas"                  |
| `members`           | Seção "Áreas Operacionais" (via `CurrentTeam`)   |
| `idealizers`        | Seção "Idealizadores"                            |
| `areaInfo`          | Abas e descrições das áreas                      |
| `groupDescriptions` | Subtítulo de cada seção                          |

**Como as "Áreas Operacionais" são organizadas:** só membros e trainees (a diretoria tem seção própria). Há uma aba **Geral** e uma aba por área. Na aba Geral aparecem **Membros** e **Trainees**, com as áreas em uma etiqueta. Nas abas de área aparecem até três blocos: **Coordenação** (quem tem `presidentOf` ou `viceOf` daquela área, em destaque), **Membros** e **Trainees**. Aba sem ninguém mostra "Ninguém por aqui ainda."

**Para criar uma nova área:** adicione um item em `areaInfo` e inclua o `id` no tipo `AreaId`, no mesmo arquivo. A aba aparece sozinha.

### `data/links.ts`

Lista dos links da página `/links`. A ordem da lista é a ordem na página (hoje: GitHub, LinkedIn, Instagram, TikTok e X). Campos de cada link: `label` (texto do botão), `href` (endereço), `description` (texto menor, opcional) e `icon` (`"github"`, `"instagram"`, `"linkedin"`, `"tiktok"`, `"x"` ou `"link"`). Se `href` começar com `/`, é uma página do site; se estiver vazio, o botão aparece desativado com "em breve".

Para usar um ícone novo, crie o componente em `components/SocialIcons.tsx`, acrescente o nome em `LinkIconId` (neste arquivo) e no objeto `icons` de `app/links/page.tsx`.

### `lib/site.ts`

Concentra o que é compartilhado pelo site inteiro:

- `siteConfig.name`, `description` e `links` (`github`, `instagram`, `linkedin`, `tiktok`, `x` e `allLinks`, que aponta para a página `/links`).
- `siteConfig.url`: endereço público do site, usado no sitemap, no `robots.txt` e na imagem de compartilhamento. Vem da variável `NEXT_PUBLIC_SITE_URL` e, se ela não existir, do endereço de produção que a Vercel fornece. Em desenvolvimento local, usa `http://localhost:3000`.
- `navLinks`: lista de `{ label, href }` usada no menu do header e na coluna "Navegação" do footer. Hoje: Home, Sobre Nós, Equipe, Projetos e Processo Seletivo.

### `lib/projects.ts`

Lê os arquivos de `content/projetos/` (com a biblioteca `gray-matter`), confere os campos e entrega a lista de projetos (`getProjects`). Só funciona no servidor (durante o build), por isso os componentes que rodam no navegador recebem os projetos por parâmetro.

---

## Aparência

### Logo

O logotipo da liga é o arquivo `public/logo-puctech.svg` (só o texto "PUC Tech", com degradê). Ele aparece no header (`components/Header.tsx`), no topo da home (`components/Hero.tsx`) e na página `/links` (`app/links/page.tsx`). O tamanho é definido pelas classes `h-` e `w-` do `<Image>` em cada um desses arquivos. O rodapé ainda mostra "PUCTech" escrito com texto e CSS, não o SVG.

### Cores e fontes

Definidas em `app/globals.css`, dentro de `@theme inline`, e usadas como classes do Tailwind (`bg-brand-900`, `text-brand-200`, `bg-paper` etc.). O Tailwind 4 não usa arquivo `tailwind.config`: a paleta fica toda nesse CSS.

| Token       | Cor       | Onde aparece                                                          |
| ----------- | --------- | --------------------------------------------------------------------- |
| `brand-950` | `#020d2b` | Fundo do site                                                         |
| `brand-900` | `#081a3e` | Faixas alternadas, cartões escuros, gradientes e o pop-up de projeto  |
| `brand-800` | `#143966` | Bordas, textos sobre fundo claro e brilho dos topos                   |
| `brand-500` | `#2b6fac` | Números de destaque, botões e hover dos cartões                       |
| `brand-200` | `#bae4fe` | Textos de destaque, "Tech" do logotipo do rodapé, botões do pop-up e cartão de redes sociais |
| `paper`     | `#f0f4f9` | Cartões claros (números, equipe e valores)                            |

O cartão da seção "Sobre" da home usa branco puro (`bg-white`), que não é um token da paleta.

Para mudar uma cor no site inteiro, altere o valor do token. O brilho do topo (no `Hero.tsx` e nas páginas Sobre, Projetos, Processo Seletivo e Links) e a imagem de compartilhamento (`app/opengraph-image.tsx`) usam códigos de cor escritos diretamente no arquivo, então, se a paleta mudar, ajuste também esses pontos. As cores do logo ficam dentro do próprio `logo-puctech.svg`.

A fonte é a **Geist** (e **Geist Mono**), carregada pelo `next/font` em `app/layout.tsx`.

O `globals.css` também define:

- `.carousel-mask`: esmaece as bordas do carrossel de projetos e da faixa de parceiros.
- `.marquee-track`: a animação da faixa de parceiros.
- `.hero-fade-x`: esmaece as laterais da foto da equipe em telas grandes.
- `.project-dialog`: a animação de entrada do pop-up de projeto (desligada para quem usa "reduzir movimento").

### Seções (`components/Section.tsx`)

O componente `Section` define largura máxima, espaçamento, título, subtítulo e o "eyebrow" (o texto pequeno em maiúsculas acima do título). É usado em `Stats`, `ProjectsSection`, `Partners` e nas páginas Sobre, Equipe e Projetos. `Hero`, `About` e `Social`, a seção "História" de `/sobre`, a introdução de `/equipe` e as páginas Processo Seletivo e Links têm marcação própria.

Propriedades:

| Propriedade | Função                                                                                 |
| ----------- | -------------------------------------------------------------------------------------- |
| `id`        | Âncora para links (ex.: `#projetos`)                                                   |
| `eyebrow`   | Texto pequeno acima do título (hoje nenhuma seção usa)                                 |
| `title`     | Título da seção                                                                        |
| `subtitle`  | Texto de apoio abaixo do título                                                        |
| `tone`      | `"default"` (fundo normal) ou `"alt"` (fundo mais claro, com linhas em cima e embaixo) |

Para mudar o ritmo de fundos de uma página, adicione `tone="alt"` em uma `Section`. Hoje nenhuma seção usa essa opção.

### Ordem da home

Está em `app/page.tsx`: `Hero` → `About` → `Stats` → `ProjectsSection` → `Partners` → `Social`. Para reordenar ou remover uma seção, mude as linhas desse arquivo.

Âncoras disponíveis:

- Home: `#sobre`, `#projetos`, `#parceiros` e `#redes`.
- `/sobre`: `#diferenca`, `#visao`, `#valores`, `#historia` e `#apoio`.
- `/equipe`: `#conheca-os-membros` (a introdução), `#tutores`, `#honorarios`, `#fundadores`, `#diretoria-executiva`, `#diretorias-estrategicas`, `#areas-operacionais` e `#idealizadores`.
- `/projetos`: `#areas` e `#projetos`.

---

## Cada componente em detalhe

**`Header.tsx`**: logotipo em SVG (`public/logo-puctech.svg`), links de `navLinks` e menu em forma de ícone no celular. A página atual aparece em branco, em negrito e com uma barra azul-clara embaixo; as demais ficam mais apagadas.

**`Footer.tsx`**: nome "PUCTech" (em texto), descrição, colunas "Navegação" (de `navLinks`) e "Redes" (GitHub, LinkedIn, Instagram, TikTok, X e "Nossos links", de `siteConfig.links`) e o copyright, cujo ano é atualizado automaticamente. Os botões de redes são escritos um a um no componente, então a ordem deles é a do arquivo.

**`Hero.tsx`**: logotipo grande em SVG e o título de `hero`, sobre um brilho azul no topo.

**`About.tsx`**: cartão branco centralizado com o título e os parágrafos de `about` (`data/home.ts`). Texto entre `**dois asteriscos**` vira negrito.

**`Stats.tsx`**: um cartão por item de `stats`. Os números sobem de 0 até o valor final quando a seção aparece na tela. Para quem usa "reduzir movimento" no sistema, o número final aparece direto, sem animação. Leitores de tela leem sempre o valor final.

**`ProjectsSection.tsx`**: texto de `projectsIntro`, as quatro áreas de atuação (cartões com foto, de `projectAreas`) e o botão "Conheça nossos projetos", que leva a `/projetos`.

**`ProjectsShowcase.tsx`**: a seção de projetos da página `/projetos`. No topo ficam o botão **Filtros** (que abre os campos **Área** e **Status**, com o número de filtros ativos e "Limpar filtros") e o contador de projetos ("3 projetos"). Abaixo vem o `FeaturedCarousel` (capa, com o título e o resumo do item em destaque embaixo) e o botão **Ver todos os projetos**, que abre e fecha a lista completa em grade. Os filtros valem para o carrossel e para a lista, e os dois filtros funcionam juntos. Para quem usa "reduzir movimento", o carrossel e o botão não aparecem e a lista fica sempre aberta. Clicar em um projeto abre o `ProjectModal`.

**`ProjectTile.tsx`**: o quadrado de um projeto (capa e título). Sem `image`, aparece um degradê azul.

**`ProjectDetails.tsx`**: o conteúdo de um projeto, sem capa: período, área e status, descrição, stacks, objetivo, resultados, equipe e o botão "Ver repositório". Só mostra os campos preenchidos.

**`ProjectModal.tsx`**: pop-up escuro (`brand-900`, com borda) que envolve o `ProjectDetails`. Usa o `<dialog>` nativo (ESC fecha, o foco fica preso dentro), trava a rolagem da página enquanto está aberto e também fecha ao clicar no fundo escuro ou no botão "X".

**`Partners.tsx`**: texto de `partnersIntro` e o `PartnersCarousel` com os logos. Há também uma lista invisível para leitores de tela e, para quem usa "reduzir movimento", uma grade estática no lugar da faixa.

**`PartnersCarousel.tsx`**: faixa de logos que rola sem parar (animação CSS `.marquee-track`). A lista é repetida até a faixa ficar mais larga que a tela, e a velocidade é constante (cerca de 3 segundos por logo), não importa quantos parceiros existam.

**`FeaturedCarousel.tsx`**: carrossel genérico, usado pelos projetos. A cada 4 segundos o item seguinte vai para o centro e os vizinhos diminuem e esmaecem. Tem botões de anterior e próximo (que reiniciam o tempo) e pausa com o mouse, com o foco do teclado dentro dele e quando o pop-up está aberto. Recebe os itens, como desenhar cada quadrado (`renderTile`), a legenda (`renderCaption`), uma função de clique (`onSelect`), o tamanho (`sizeClass`), as escalas (`scales`) e os textos dos botões (`prevLabel` e `nextLabel`). Com `onSelect`, oferece uma lista de botões para navegação por teclado.

**`Social.tsx`**: cartão claro com o texto de `socialIntro` e um botão para cada rede de `siteConfig.links` (GitHub, LinkedIn, Instagram, TikTok, X e "Nossos links"). Como no rodapé, os botões são escritos um a um, então a ordem é a do arquivo.

**`SocialIcons.tsx`**: ícones em SVG (GitHub, Instagram, LinkedIn, TikTok, X e link).

**`team/MemberCard.tsx`**: cartão de uma pessoa. Aceita `variant="highlight"` (usado para diretoria e coordenação: foto maior e fundo em destaque), `role` (texto abaixo do nome, que o `cargo` da pessoa substitui) e `badge` (etiqueta com a área, usada na aba Geral). Quando há LinkedIn, o cartão inteiro é clicável.

**`team/CurrentTeam.tsx`**: monta as abas a partir de `areaInfo` e separa Coordenação, Membros e Trainees conforme a aba escolhida. Só mostra membros e trainees.

---

## Páginas em detalhe

**`/equipe`**: foto do grupo no topo (`public/equipe/grupo-puctech.jpg`) com o título "Equipe", um parágrafo de introdução sobre a comunidade e uma seção para cada grupo de `team.ts`, na ordem: Tutores, Membros Honorários, Fundadores, Diretoria Executiva, Diretorias Estratégicas, Áreas Operacionais e Idealizadores.

**`/projetos`**: título e introdução, "Áreas de Atuação" (quatro cartões com foto) e "Nossos projetos" (filtros, carrossel e lista completa). Cada projeto abre em um pop-up.

**`/links`**: logotipo em SVG, slogan e um botão para cada item de `data/links.ts`, na ordem da lista.

---

## SEO e compartilhamento

| Arquivo                   | O que faz                                                                                          |
| ------------------------- | -------------------------------------------------------------------------------------------------- |
| `app/layout.tsx`          | Título padrão, modelo `"%s \| PUC Tech"`, descrição, idioma `pt-BR` e cartão de compartilhamento    |
| `app/*/page.tsx`          | Cada página (menos a home) define o próprio `metadata` com título e descrição                       |
| `app/opengraph-image.tsx` | Gera a imagem de prévia (fundo azul com "PUCTech" e o slogan) que aparece ao compartilhar o link   |
| `app/icon.png`            | Favicon da aba do navegador                                                                        |
| `app/sitemap.ts`          | Lista as páginas do site para o Google                                                             |
| `app/robots.ts`           | Libera os buscadores e aponta para o sitemap                                                       |

---

## Como criar uma nova página

1. Crie `app/nome-da-pagina/page.tsx`. A página `/sobre` ou `/projetos` serve de modelo: um bloco de topo com título e introdução e uma ou mais `Section`.
2. Exporte um `metadata` com o `title` da página, que recebe automaticamente o sufixo "| PUC Tech".
3. Se tiver muito texto, crie um arquivo em `data/` para guardar o conteúdo, como nas outras páginas.
4. Adicione o item em `navLinks`, no `lib/site.ts`, para ele aparecer no menu e no footer.
5. Adicione o caminho na lista de `app/sitemap.ts`.

---

## Publicação

A Vercel está ligada a este repositório. Cada push na `main` gera um novo deploy em produção, e cada pull request recebe um link de preview. Como os projetos são lidos no build, adicionar ou editar um `.md` só aparece no site depois do deploy.