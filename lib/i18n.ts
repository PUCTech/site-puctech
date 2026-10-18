// Idiomas do site. O endereço é o mesmo em todos (como no site da Peacore): o idioma
// escolhido fica num cookie e o servidor já manda a página nele. Sem cookie, português.

export const langs = ["pt", "en", "es"] as const;
export type Lang = (typeof langs)[number];

/** Um texto em cada idioma. */
export type T = Record<Lang, string>;

/** Cookie com o idioma escolhido no PT · EN · ES do cabeçalho. */
export const LANG_COOKIE = "lang";

export const isLang = (value: string | undefined): value is Lang =>
  (langs as readonly (string | undefined)[]).includes(value);

export const langInfo: Record<Lang, { html: string; og: string; intl: string; short: string; name: string }> = {
  pt: { html: "pt-BR", og: "pt_BR", intl: "pt-BR", short: "PT", name: "Português" },
  en: { html: "en", og: "en_US", intl: "en-US", short: "EN", name: "English" },
  es: { html: "es", og: "es_ES", intl: "es", short: "ES", name: "Español" },
};
