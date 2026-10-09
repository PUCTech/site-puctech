# PUC Tech | Site da Liga Acadêmica de Tecnologia da PUC-SP

Site institucional da PUC Tech, publicado em <https://www.puctech.com.br/>

Feito com **Next.js** (App Router), **TypeScript** e **Tailwind CSS 4**, hospedado na **Vercel**. Cada push na branch `main` publica uma nova versão automaticamente.

```
npm install      # instala as dependências
npm run dev      # desenvolvimento em http://localhost:3000
npm run build    # build de produção (checa erros de TypeScript e ESLint)
npm run start    # roda o build gerado
npm run lint     # roda só o ESLint
```

Requer Node.js 20.9 ou superior (exigência do Next.js 16).

---

## O que o site tem hoje

**Cinco páginas**

| Rota                 | Arquivo                           | Conteúdo                                                                 |
| -------------------- | --------------------------------- | ------------------------------------------------------------------------ |
| `/`                  | `app/page.tsx`                    | Home com hero, sobre, números, projetos, parceiros e redes sociais       |
| `/sobre`             | `app/sobre/page.tsx`              | Diferença da liga, visão, valores, história e apoio institucional        |
| `/equipe`            | `app/equipe/page.tsx`             | Orientadores, fundadores e equipe atual, com abas por área               |
| `/projetos`          | `app/projetos/page.tsx`           | Áreas de atuação e carrossel de projetos com pop-up de detalhes          |
| `/processo-seletivo` | `app/processo-seletivo/page.tsx`  | Data do próximo processo, como se preparar e botão de inscrição          |

**Elementos presentes em todas as páginas:** header fixo no topo (com menu responsivo e destaque da página atual) e footer.

**Funcionalidades**

- Contagem animada nos números da home, que começa quando a seção aparece na tela.
- Carrosséis automáticos de projetos e de parceiros (trocam a cada 5 segundos e pausam com o mouse ou o foco).
- Pop-up com os detalhes de cada projeto.
- Abas na página de equipe: **Geral**, **Marketing**, **Eventos** e **Pessoas**.
- Botão de inscrição do processo seletivo que fica desativado ("em breve") até o link existir.
- Acessibilidade: quem usa "reduzir movimento" no sistema vê grades estáticas no lugar dos carrosséis e o número final direto nos números; os carrosséis têm uma lista alternativa para teclado e leitor de tela; o pop-up usa o `<dialog>` nativo (ESC, foco preso e fundo travado).
- SEO: título e descrição por página, imagem de prévia ao compartilhar o link, favicon, `sitemap.xml` e `robots.txt`.
- Cabeçalhos de segurança configurados em `next.config.ts` (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` e `Permissions-Policy`).

---

## Estrutura de pastas

```
app/
├── layout.tsx                 Estrutura comum: fontes, header, footer e metadados de SEO
├── page.tsx                   Home (monta as seções na ordem em que aparecem)
├── sobre/page.tsx             Página "Sobre nós"
├── equipe/page.tsx            Página da equipe
├── projetos/page.tsx          Página de projetos
├── processo-seletivo/page.tsx Página do processo seletivo
├── globals.css                Paleta de cores e estilos globais
├── icon.png                   Favicon
├── opengraph-image.tsx        Gera a imagem de prévia ao compartilhar o link
├── sitemap.ts                 Gera o sitemap.xml
└── robots.ts                  Gera o robots.txt

components/
├── Header.tsx                 Cabeçalho
├── Footer.tsx                 Rodapé
├── Section.tsx                Bloco padrão de seção (título, espaçamento e fundo)
├── Hero.tsx                   Topo da home (logo e título)
├── About.tsx                  Seção "Sobre" da home
├── Stats.tsx                  Seção de números (com a animação de contagem)
├── ProjectsSection.tsx        Seção "Projetos" da home
├── ProjectsShowcase.tsx       Carrossel de projetos + grade + pop-up
├── ProjectModal.tsx           Pop-up com os detalhes de um projeto
├── Partners.tsx               Seção "Parceiros"
├── PartnersCarousel.tsx       Carrossel dos logos dos parceiros
├── FeaturedCarousel.tsx       Carrossel genérico usado pelos dois acima
├── Social.tsx                 Seção "Acompanhe nossas redes sociais"
├── SocialIcons.tsx            Ícones das redes (Instagram, LinkedIn, TikTok, X, link)
└── team/
    ├── MemberCard.tsx         Cartão de um membro (normal ou em destaque)
    └── CurrentTeam.tsx        Abas e listas da "Equipe atual"

data/
├── home.ts                    Textos, números e parceiros da home
├── about.ts                   Textos da página "Sobre nós"
├── projects.ts                Projetos e áreas de atuação
├── selection.tsx              Textos e link do processo seletivo
└── team.ts                    Orientadores, fundadores, áreas e membros

lib/
└── site.ts                    Nome do site, endereço, links das redes e itens do menu

public/
├── logo.png                   Logo da liga (header e hero)
├── equipe/                    Fotos dos membros
├── parceiros/                 Logos dos parceiros
└── projetos/                  Capas dos projetos (crie a pasta quando houver o primeiro)
```

A regra geral: **o conteúdo fica em `data/` e `lib/`; a aparência fica em `components/` e `app/`.**

---

## Onde mexer para cada coisa

| Quero mudar...                                                 | Arquivo                                              |
| -------------------------------------------------------------- | ---------------------------------------------------- |
| Título grande do topo da home                                  | `data/home.ts` → `hero`                              |
| Texto da seção "Sobre" da home                                 | `data/home.ts` → `about`                             |
| Números da seção de números                                    | `data/home.ts` → `stats`                             |
| Texto e áreas da seção "Projetos" da home                      | `data/home.ts` → `projectsIntro`                     |
| Texto da seção "Parceiros"                                     | `data/home.ts` → `partnersIntro`                     |
| Lista de parceiros e logos                                     | `data/home.ts` → `partners` + `public/parceiros/`    |
| Texto da seção de redes sociais                                | `data/home.ts` → `socialIntro`                       |
| Textos da página "Sobre nós"                                   | `data/about.ts`                                      |
| Cadastrar, editar ou remover um projeto                        | `data/projects.ts` → `projects`                      |
| Título e introdução da página de projetos                      | `data/projects.ts` → `projectsPage`                  |
| Áreas de atuação dos projetos                                  | `data/projects.ts` → `projectAreas`                  |
| Abrir o processo seletivo (link do formulário)                 | `data/selection.tsx` → `apply.applyUrl`              |
| Data e textos do processo seletivo                             | `data/selection.tsx`                                 |
| Orientadores, fundadores e membros                             | `data/team.ts` → `members`                           |
| Áreas da equipe (abas)                                         | `data/team.ts` → `areaInfo`                          |
| Links do Instagram, LinkedIn, TikTok, X e "Nossos links"       | `lib/site.ts` → `siteConfig.links`                   |
| Itens do menu (topo e rodapé)                                  | `lib/site.ts` → `navLinks`                           |
| Descrição que aparece no rodapé                                | `lib/site.ts` → `siteConfig.description`             |
| Cores do site                                                  | `app/globals.css`                                    |
| Títulos fixos das seções ("Nossos números", "Projetos" etc.)   | No próprio componente da seção, em `components/`     |
| Texto do botão "Conheça nossos projetos"                       | `components/ProjectsSection.tsx`                     |
| Título e descrição do site no Google                           | `app/layout.tsx` → `metadata`                        |
| Título e descrição de cada página no Google                    | `metadata` no `page.tsx` da página                   |
| Imagem de prévia ao compartilhar o link                        | `app/opengraph-image.tsx`                            |
| Favicon                                                        | `app/icon.png`                                       |
| Ordem das seções da home                                       | `app/page.tsx`                                       |
| Páginas listadas no sitemap                                    | `app/sitemap.ts`                                     |
| Cabeçalhos de segurança                                        | `next.config.ts`                                     |

---

## Conteúdo

Em todos os arquivos de `data/`, para adicionar ou remover um item de uma lista basta incluir ou apagar um objeto: os componentes mostram todos os itens, sem precisar de outra alteração.

### `data/home.ts`

Textos e números da home. Para destacar uma palavra em negrito, use `**assim**`.

| Exportação      | Formato                       | Usada por                              |
| --------------- | ----------------------------- | -------------------------------------- |
| `hero`          | `{ title }`                   | `Hero.tsx`                             |
| `about`         | `{ title, paragraphs[] }`     | `About.tsx`                            |
| `stats`         | `[{ value, suffix, label }]`  | `Stats.tsx`                            |
| `projectsIntro` | `{ text, areas[] }`           | `ProjectsSection.tsx`                  |
| `partnersIntro` | `{ title, paragraphs[] }`     | `Partners.tsx`                         |
| `partners`      | `[{ name, logo? }]`           | `Partners.tsx`, `PartnersCarousel.tsx` |
| `socialIntro`   | `{ title, tagline, text }`    | `Social.tsx`                           |

Em `stats`, `value` é o número final da contagem (um número, não texto) e `suffix` é o sinal exibido depois dele, como `+`.

Em `partners`, para mostrar o logo coloque o arquivo em `public/parceiros/` e informe `logo: "/parceiros/nome.jpg"`. Sem `logo`, aparece o nome em texto.

> Atenção: o `about` de `data/home.ts` é o texto da **home**. O texto da **página `/sobre`** fica em `data/about.ts`.

### `data/about.ts`

Textos da página `/sobre`: `aboutPage` (título e introdução), `difference` (quatro cartões), `vision`, `values` (lista de valores), `history` (marcos por ano e parágrafos) e `support` (apoio institucional, com o logo da PUC-SP).

### `data/projects.ts`

Exporta `projectsPage` (título e introdução da página), `projectAreas` (as quatro áreas de atuação), o tipo `Project` e a lista `projects`. A ordem da lista é a ordem do carrossel.

Se `projects` estiver vazia, o carrossel não aparece na home e a página `/projetos` mostra "Em breve, os projetos da PUC Tech vão aparecer aqui."

Campos de cada projeto (só `title` e `description` são obrigatórios):

| Campo         | Função                                                                                          |
| ------------- | ----------------------------------------------------------------------------------------------- |
| `title`       | Nome do projeto (**deve ser único**: é usado para identificar o item na lista de teclado)       |
| `description` | Descrição (uma linha em branco separa os parágrafos)                                            |
| `image`       | Capa, ex.: `"/projetos/nome-do-projeto.jpg"` (arquivo em `public/projetos/`)                    |
| `summary`     | Resumo de 1 ou 2 frases, que aparece embaixo do carrossel                                       |
| `period`      | Período, ex.: `"2026.1"`                                                                        |
| `area`        | Uma das quatro áreas de `projectAreas` (outro valor gera erro no build)                         |
| `tech`        | Stacks e ferramentas, ex.: `["Python", "React", "AWS"]`                                         |
| `team`        | Nomes da equipe envolvida                                                                       |
| `objective`   | Objetivo e escopo                                                                               |
| `results`     | Resultados e aprendizados                                                                       |
| `repo`        | Link do repositório ou da publicação (vira o botão "Ver repositório")                           |

O pop-up mostra apenas os campos preenchidos.

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

| Campo         | Obrigatório | Função                                                                                               |
| ------------- | ----------- | ---------------------------------------------------------------------------------------------------- |
| `name`        | sim         | Nome                                                                                                 |
| `group`       | sim         | `"orientador"`, `"fundador"`, `"presidente"` (geral), `"vice-presidente"`, `"membro"` ou `"trainee"` |
| `areas`       | não         | Áreas de membro ou trainee (`"marketing"`, `"eventos"`, `"pessoas"`); sem área, só aparece na aba Geral |
| `presidentOf` | não         | Áreas que o membro preside (só para `group: "membro"`)                                               |
| `photo`       | não         | Ex.: `"/equipe/nome.jpg"` (arquivo em `public/equipe/`)                                              |
| `linkedin`    | não         | Torna o cartão inteiro um link                                                                       |

Quem preside uma área já pertence a ela, não precisa repetir em `areas`. Quem é fundador (ou orientador) e também faz parte da equipe atual ganha duas linhas, uma de cada `group`.

Sem `photo`, o cartão mostra um círculo com as iniciais do nome (títulos como "Prof." são ignorados). Fotos quadradas, ou com o rosto centralizado, ficam melhores no círculo.

O arquivo confere a lista a cada build. Se algo estiver errado (por exemplo, `areas` em quem não é membro nem trainee), o build falha com uma mensagem dizendo qual pessoa (posição na lista) tem o problema.

| Exportação  | Aparece em                              |
| ----------- | --------------------------------------- |
| `advisors`  | Seção "Orientadores"                    |
| `founders`  | Seção "Fundadores"                      |
| `members`   | Seção "Equipe atual" (via `CurrentTeam`) |
| `areaInfo`  | Abas e descrições das áreas             |

**Como a "Equipe atual" é organizada:** em cada aba há até três blocos. **Presidentes** (o presidente geral, o vice e quem tem `presidentOf`, em destaque), **Membros** e **Trainees**. Na aba **Geral** aparecem todos, com a área em uma etiqueta; nas abas de área aparecem só os dessa área (presidente geral e vice não têm área, então só aparecem na Geral). Aba sem ninguém mostra "Ninguém por aqui ainda."

**Para criar uma nova área:** adicione um item em `areaInfo` e inclua o `id` no tipo `AreaId`, no mesmo arquivo. A aba aparece sozinha.

### `lib/site.ts`

Concentra o que é compartilhado pelo site inteiro:

- `siteConfig.name`, `description` e `links` (`instagram`, `linkedin`, `tiktok`, `x` e `allLinks`, o link para "Nossos links").
- `siteConfig.url`: endereço público do site, usado no sitemap, no `robots.txt` e na imagem de compartilhamento. Vem da variável `NEXT_PUBLIC_SITE_URL` e, se ela não existir, do endereço de produção que a Vercel fornece. Em desenvolvimento local, usa `http://localhost:3000`.
- `navLinks`: lista de `{ label, href }` usada no menu do header e na coluna "Navegação" do footer. Hoje: Home, Sobre Nós, Membros, Projetos e Processo Seletivo.

---

## Aparência

### Cores e fontes

Definidas em `app/globals.css`, dentro de `@theme inline`, e usadas como classes do Tailwind (`bg-brand-900`, `text-brand-200`, `bg-paper` etc.). O Tailwind 4 não usa arquivo `tailwind.config`: a paleta fica toda nesse CSS.

| Token       | Cor       | Onde aparece                                                          |
| ----------- | --------- | --------------------------------------------------------------------- |
| `brand-950` | `#020d2b` | Fundo do site                                                         |
| `brand-900` | `#081a3e` | Faixas alternadas e gradientes                                        |
| `brand-800` | `#143966` | Bordas, textos sobre fundo claro e brilho dos topos                   |
| `brand-500` | `#2b6fac` | Números de destaque, botões e hover dos cartões                       |
| `brand-200` | `#bae4fe` | Textos de destaque, "Tech" do logotipo e cartão de redes sociais      |
| `paper`     | `#f0f4f9` | Cartões claros (números, equipe, valores, pop-up de projeto)          |

O cartão da seção "Sobre" da home usa branco puro (`bg-white`), que não é um token da paleta.

Para mudar uma cor no site inteiro, altere o valor do token. O brilho do topo (no `Hero.tsx` e nas páginas Sobre, Equipe, Projetos e Processo Seletivo) e a imagem de compartilhamento (`app/opengraph-image.tsx`) usam códigos de cor escritos diretamente no arquivo, então, se a paleta mudar, ajuste também esses pontos.

A fonte é a **Geist** (e **Geist Mono**), carregada pelo `next/font` em `app/layout.tsx`.

O `globals.css` também define a máscara que esmaece as bordas dos carrosséis (`.carousel-mask`) e a animação de entrada do pop-up de projeto, que é desligada para quem usa "reduzir movimento".

### Seções (`components/Section.tsx`)

O componente `Section` define largura máxima, espaçamento, título e o "eyebrow" (o texto pequeno em maiúsculas acima do título). É usado em `Stats`, `ProjectsSection`, `Partners` e nas páginas Sobre, Equipe e Projetos. `Hero`, `About` e `Social`, e a página Processo Seletivo, têm marcação própria.

Propriedades:

| Propriedade | Função                                                                                 |
| ----------- | -------------------------------------------------------------------------------------- |
| `id`        | Âncora para links (ex.: `#projetos`)                                                   |
| `eyebrow`   | Texto pequeno acima do título                                                          |
| `title`     | Título da seção                                                                        |
| `tone`      | `"default"` (fundo normal) ou `"alt"` (fundo mais claro, com linhas em cima e embaixo) |

Para mudar o ritmo de fundos de uma página, adicione `tone="alt"` em uma `Section`. Hoje nenhuma seção usa essa opção.

### Ordem da home

Está em `app/page.tsx`: `Hero` → `About` → `Stats` → `ProjectsSection` → `Partners` → `Social`. Para reordenar ou remover uma seção, mude as linhas desse arquivo.

Âncoras disponíveis: na home, `#sobre`, `#projetos`, `#parceiros` e `#redes`; em `/sobre`, `#diferenca`, `#visao`, `#valores`, `#historia` e `#apoio`; em `/projetos`, `#areas` e `#projetos`.

---

## Cada componente em detalhe

**`Header.tsx`**: logo + nome, links de `navLinks` e menu em forma de ícone no celular. A página atual aparece em branco, em negrito e com uma barra azul-clara embaixo; as demais ficam mais apagadas.

**`Footer.tsx`**: logo, descrição, colunas "Navegação" (de `navLinks`) e "Redes" (Instagram, LinkedIn, TikTok, X e "Nossos links", de `siteConfig.links`) e o copyright, cujo ano é atualizado automaticamente.

**`Hero.tsx`**: logo grande e o título de `hero`, sobre um brilho azul no topo.

**`About.tsx`**: cartão branco centralizado com o título e os parágrafos de `about` (`data/home.ts`). Texto entre `**dois asteriscos**` vira negrito.

**`Stats.tsx`**: um cartão por item de `stats`. Os números sobem de 0 até o valor final quando a seção aparece na tela. Para quem usa "reduzir movimento" no sistema, o número final aparece direto, sem animação. Leitores de tela leem sempre o valor final.

**`ProjectsSection.tsx`**: texto e etiquetas de área (de `projectsIntro`), o carrossel de projetos (só se houver projetos) e o botão "Conheça nossos projetos", que leva a `/projetos`.

**`ProjectsShowcase.tsx`**: mostra os projetos no `FeaturedCarousel` (capa, com o título e o resumo do item em destaque embaixo). Para quem usa "reduzir movimento", vira uma grade de botões. Clicar em um projeto abre o `ProjectModal`.

**`ProjectModal.tsx`**: pop-up com imagem, período e área, descrição, stacks, objetivo, resultados, equipe e botão para o repositório. Usa o `<dialog>` nativo (ESC fecha, o foco fica preso dentro), trava a rolagem da página enquanto está aberto e também fecha ao clicar no fundo escuro.

**`Partners.tsx`**: texto de `partnersIntro` e o `PartnersCarousel` com os logos. Há também uma lista invisível para leitores de tela e, para quem usa "reduzir movimento", uma grade estática no lugar do carrossel.

**`PartnersCarousel.tsx`**: configura o `FeaturedCarousel` com quadrados menores e mostra o nome do parceiro em destaque embaixo.

**`FeaturedCarousel.tsx`**: carrossel genérico. A cada 5 segundos o item seguinte vai para o centro e os vizinhos diminuem e esmaecem. Pausa com o mouse ou com o foco do teclado dentro dele (e quando o pop-up está aberto). Recebe os itens, como desenhar cada quadrado (`renderTile`), a legenda (`renderCaption`), uma função de clique (`onSelect`) e o tamanho (`sizeClass`). Com `onSelect`, oferece uma lista de botões para navegação por teclado.

**`Social.tsx`**: cartão claro com o texto de `socialIntro` e um botão para cada rede de `siteConfig.links`.

**`SocialIcons.tsx`**: ícones em SVG (Instagram, LinkedIn, TikTok, X e link).

**`team/MemberCard.tsx`**: cartão de uma pessoa. Aceita `variant="highlight"` (usado para presidentes: foto maior e fundo em destaque), `role` (texto abaixo do nome) e `badge` (etiqueta com a área, usada na aba Geral). Quando há LinkedIn, o cartão inteiro é clicável.

**`team/CurrentTeam.tsx`**: monta as abas a partir de `areaInfo` e separa Presidentes, Membros e Trainees conforme a aba escolhida.

---

## SEO e compartilhamento

| Arquivo                   | O que faz                                                                                          |
| ------------------------- | -------------------------------------------------------------------------------------------------- |
| `app/layout.tsx`          | Título padrão, modelo `"%s \| PUC Tech"`, descrição, idioma `pt-BR` e cartão de compartilhamento    |
| `app/*/page.tsx`          | Cada página (menos a home) define o próprio `metadata` com título e descrição                       |
| `app/opengraph-image.tsx` | Gera a imagem de prévia (fundo azul com "PUCTech" e o slogan) que aparece ao compartilhar o link   |
| `app/icon.png`            | Favicon da aba do navegador                                                                        |
| `app/sitemap.ts`          | Lista as cinco páginas do site para o Google                                                       |
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

A Vercel está ligada a este repositório. Cada push na `main` gera um novo deploy em produção, e cada pull request recebe um link de preview.