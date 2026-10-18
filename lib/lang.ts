import "server-only";
import { cookies } from "next/headers";
import { isLang, LANG_COOKIE, type Lang } from "@/lib/i18n";

/** Idioma da visita, pelo cookie do PT · EN · ES. Sem escolha, português. */
export async function getLang(): Promise<Lang> {
  const value = (await cookies()).get(LANG_COOKIE)?.value;
  return isLang(value) ? value : "pt";
}
