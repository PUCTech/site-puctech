# PucTech | Site da Liga Academia de Tecnologia da PUC-SP

Site institucional da PucTech, publicado em https://site-puctech.vercel.app.

Feito com **Next.js** (App Router), **TypeScript** e **Tailwind CSS**, hospedado na **Vercel**. Cada push na branch `main` publica uma nova versão automaticamente.

```bash
npm install      # instala as dependências
npm run dev      # desenvolvimento em http://localhost:3000
npm run build    # build de produção (checa erros de TypeScript e ESLint)
npm run start    # roda o build gerado
```

---

## O que o site tem hoje

**Duas páginas**

| Rota | Arquivo | Conteúdo |
|---|---|---|
| `/` | `app/page.tsx` | Home com hero, sobre, números, pilares, eventos e convite final |
| `/equipe` | `app/equipe/page.tsx` | Orientadores, fundadores e equipe atual, com abas por área |

**Elementos presentes em todas as páginas:** header fixo no topo (com menu responsivo e destaque da página atual) e footer.

**Funcionalidades**
- Contagem animada nos números da home, que começa quando a seção aparece na tela.
- Abas na página de equipe: **Geral**, **Marketing**, **Eventos** e **Pessoas**. Os presidentes de cada área ficam em destaque.
- Seções da home com fundos alternados (normal e mais claro) para separar os blocos.
- SEO: título e descrição, imagem de prévia ao compartilhar o link, favicon, `sitemap.xml` e `robots.txt`.

---

## Estrutura de pastas

```
app/
├── layout.tsx            Estrutura comum a todas as páginas: fonte, header, footer e metadados de SEO
├── page.tsx              Home (monta as seções na ordem em que aparecem)
├── equipe/
│   └── page.tsx          Página da equipe
├── globals.css           Paleta de cores e estilos globais
├── icon.png              Favicon
├── opengraph-image.tsx   Gera a imagem de prévia ao compartilhar o link
├── sitemap.ts            Gera o sitemap.xml
└── robots.ts             Gera o robots.txt

components/
├── Header.tsx            Cabeçalho
├── Footer.tsx            Rodapé
├── Section.tsx           Bloco padrão de seção (título, espaçamento e fundo)
├── Hero.tsx              Topo da home
├── About.tsx             Seção "Sobre"
├── Stats.tsx             Seção de números (com a animação de contagem)
├── Pillars.tsx           Seção "Nossos pilares"
├── Events.tsx            Seção "Eventos e palestras"
├── Invitation.tsx        Convite final ("Quer fazer parte da PucTech?")
└── team/
    ├── MemberCard.tsx    Cartão de um membro (normal ou em destaque)
    └── CurrentTeam.tsx   Abas e listas da "Equipe atual"

data/
├── home.ts               Textos e números da home
└── team.ts               Orientadores, fundadores, áreas e membros

lib/
└── site.ts               Nome do site, endereço, links das redes e itens do menu

public/
├── logo.png              Logo da liga (usada no header)
└── equipe/               Fotos dos membros
```

A regra geral: **o conteúdo fica em `data/` e `lib/`; a aparência fica em `components/` e `app/`.**

---

## Onde mexer para cada coisa

| Quero mudar... | Arquivo |
|---|---|
| Subtítulo do topo da home | `data/home.ts` → `hero` |
| Texto da seção "Sobre" | `data/home.ts` → `about` |
| Números da seção de números | `data/home.ts` → `stats` |
| Os três pilares | `data/home.ts` → `pillars` |
| Eventos e palestras da home | `data/home.ts` → `events` |
| Orientadores, fundadores e membros | `data/team.ts` |
| Links do Instagram e LinkedIn | `lib/site.ts` → `siteConfig.links` |
| Itens do menu (topo e rodapé) | `lib/site.ts` → `navLinks` |
| Descrição que aparece no rodapé | `lib/site.ts` → `siteConfig.description` |
| Cores do site | `app/globals.css` |
| Títulos fixos das seções ("Nossos pilares", "Eventos e palestras" etc.) | No próprio componente da seção, em `components/` |
| Botões do topo da home ("Conheça a equipe", "Saiba mais") | `components/Hero.tsx` |
| Chamada e botão do convite final | `components/Invitation.tsx` |
| Título e descrição do site no Google | `app/layout.tsx` → `metadata` |
| Imagem de prévia ao compartilhar o link | `app/opengraph-image.tsx` |
| Favicon | `app/icon.png` |
| Ordem das seções da home | `app/page.tsx` |

---

## Conteúdo

### `data/home.ts`

Exporta cinco blocos, cada um usado por um componente:

| Exportação | Formato | Usada por |
|---|---|---|
| `hero` | `{ subtitle }` | `Hero.tsx` |
| `about` | `{ title, paragraphs[] }` | `About.tsx` |
| `stats` | `[{ value, suffix, label }]` | `Stats.tsx` |
| `pillars` | `[{ title, description }]` | `Pillars.tsx` |
| `events` | `[{ tag, title, date, description }]` | `Events.tsx` |

Em `stats`, `value` é o número final da contagem (um número, não texto) e `suffix` é o sinal exibido depois dele, como `+`. Para adicionar ou remover um item de qualquer lista, basta incluir ou apagar um objeto: os componentes mostram todos os itens da lista, sem precisar de outra alteração.

### `data/team.ts`

Cada pessoa segue este formato:

```ts
type Member = {
  name: string;       // obrigatório
  role: string;       // obrigatório
  photo?: string;     // opcional, ex.: "/equipe/nome.jpg"
  linkedin?: string;  // opcional
};
```

Sem `photo`, o cartão mostra um círculo com as iniciais do nome. Para usar uma foto, coloque o arquivo em `public/equipe/` e informe o caminho começando por `/equipe/`. Fotos quadradas, ou com o rosto centralizado, ficam melhores no círculo.

| Exportação | Aparece em |
|---|---|
| `advisors` | Seção "Orientadores" |
| `founders` | Seção "Fundadores" |
| `areas` | Seção "Equipe atual" |

Cada item de `areas` tem `id`, `label`, `description`, `presidents` (cartões em destaque) e `members` (cartões normais). A aba **Geral** reúne todas as áreas e mostra o nome da área em cada cartão; as demais abas mostram só a área escolhida, com a descrição no topo.

**Para criar uma nova área:** adicione um objeto em `areas` e inclua o novo `id` no tipo `AreaId`, no mesmo arquivo. A aba aparece sozinha.

### `lib/site.ts`

Concentra o que é compartilhado pelo site inteiro:

- `siteConfig.name`, `description` e `links` (Instagram e LinkedIn).
- `siteConfig.url`: endereço público do site, usado no sitemap, no `robots.txt` e na imagem de compartilhamento. Vem da variável `NEXT_PUBLIC_SITE_URL` e, se ela não existir, do endereço que a Vercel fornece. Em desenvolvimento local, usa `http://localhost:3000`.
- `navLinks`: lista de `{ label, href }` usada no menu do header e na coluna "Navegação" do footer.

---

## Aparência

### Cores

Definidas em `app/globals.css`, dentro de `@theme`, e usadas como classes do Tailwind (`bg-brand-900`, `text-brand-200`, `border-brand-800` etc.):

| Token | Cor | Onde aparece |
|---|---|---|
| `brand-950` | `#020d2b` | Fundo do site |
| `brand-900` | `#081a3e` | Cartões, faixas alternadas e gradientes |
| `brand-800` | `#143966` | Bordas e brilho do hero |
| `brand-500` | `#2b6fac` | Botão principal, números de destaque e hover dos cartões |
| `brand-200` | `#bae4fe` | Textos de destaque e "Tech" do logotipo |

Para mudar uma cor no site inteiro, altere o valor do token. O brilho do topo do hero (em `Hero.tsx` e `app/equipe/page.tsx`) e a imagem de compartilhamento (`app/opengraph-image.tsx`) usam os códigos de cor escritos diretamente no arquivo, então se a paleta mudar, ajuste também esses dois pontos.

### Seções da home (`components/Section.tsx`)

Todas as seções, exceto o hero e o convite final, usam o componente `Section`, que define largura máxima, espaçamento, título e o "eyebrow" (o texto pequeno em maiúsculas acima do título). Propriedades:

| Propriedade | Função |
|---|---|
| `id` | Âncora para links (ex.: `#sobre`) |
| `eyebrow` | Texto pequeno acima do título |
| `title` | Título da seção |
| `tone` | `"default"` (fundo normal) ou `"alt"` (fundo mais claro, com linhas em cima e embaixo) |

Hoje, `About` e `Pillars` usam `tone="alt"`. Para mudar o ritmo de fundos da home, adicione ou remova essa propriedade nos componentes.

### Ordem da home

Está em `app/page.tsx`: `Hero` → `About` → `Stats` → `Pillars` → `Events` → `Invitation`. Para reordenar ou remover uma seção, mude as linhas desse arquivo.

---

## Cada componente em detalhe

**`Header.tsx`**: logo + nome, links de `navLinks` e menu em forma de ícone no celular. A página atual aparece em branco, em negrito e com uma barra azul embaixo; as demais ficam mais apagadas.

**`Footer.tsx`**: logo, descrição, colunas "Navegação" (de `navLinks`) e "Redes" (Instagram e LinkedIn de `siteConfig.links`) e o copyright, cujo ano é atualizado automaticamente. Os links têm efeito de sublinhado e mudança de cor ao passar o mouse.

**`Hero.tsx`**: nome da liga em tamanho grande, subtítulo (de `data/home.ts`) e dois botões: "Conheça a equipe" (vai para `/equipe`) e "Saiba mais" (rola até a seção `#sobre`).

**`About.tsx`**: título e parágrafos de `about`.

**`Stats.tsx`**: um cartão por item de `stats`. Os números sobem de 0 até o valor final quando a seção aparece na tela. Para quem usa "reduzir movimento" no sistema, o número final aparece direto, sem animação.

**`Pillars.tsx`**: um cartão numerado por item de `pillars`.

**`Events.tsx`**: um cartão por item de `events`, com etiqueta, título, descrição e data.

**`Invitation.tsx`**: faixa final com chamada e botão que leva ao Instagram da liga (`siteConfig.links.instagram`).

**`team/MemberCard.tsx`**: cartão de uma pessoa. Aceita `variant="highlight"` (usado para presidentes: foto maior, anel azul e fundo em gradiente) e `badge` (etiqueta com o nome da área, usada na aba Geral).

**`team/CurrentTeam.tsx`**: monta as abas a partir de `areas` e filtra presidentes e membros conforme a aba escolhida.

---

## SEO e compartilhamento

| Arquivo | O que faz |
|---|---|
| `app/layout.tsx` | Define o título padrão, o modelo `"%s | PucTech"` para as outras páginas e a descrição do site |
| `app/equipe/page.tsx` | Define o título da página de equipe (`metadata`) |
| `app/opengraph-image.tsx` | Gera a imagem de prévia (fundo azul com "PUCTech") que aparece ao compartilhar o link |
| `app/icon.png` | Favicon da aba do navegador |
| `app/sitemap.ts` | Lista as páginas do site para o Google |
| `app/robots.ts` | Libera os buscadores e aponta para o sitemap |

---

## Como criar uma nova página

1. Crie `app/nome-da-pagina/page.tsx`. A página de equipe (`app/equipe/page.tsx`) serve de modelo: um bloco de topo e uma ou mais `Section`.
2. Exporte um `metadata` com o `title` da página, que recebe automaticamente o sufixo "| PucTech".
3. Adicione o item em `navLinks`, no `lib/site.ts`, para ele aparecer no menu e no footer.
4. Adicione o caminho na lista de `app/sitemap.ts`.

---

## Publicação

A Vercel está ligada a este repositório. Cada push na `main` gera um novo deploy em produção, e cada pull request recebe um link de preview.