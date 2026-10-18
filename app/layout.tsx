import type { Metadata } from "next";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { ui } from "@/data/ui";
import { langInfo } from "@/lib/i18n";
import { getLang } from "@/lib/lang";
import { siteConfig } from "@/lib/site";

// Só para desenhar as letras do "PUCTech" em ASCII na abertura; os títulos usam a Figtree.
const display = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const body = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  const t = ui[lang].site;
  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: t.title, template: "%s | PUC Tech" },
    description: t.description,
    openGraph: { type: "website", locale: langInfo[lang].og, siteName: "PUC Tech" },
    twitter: { card: "summary_large_image" },
  };
}

// O idioma vem do cookie (lib/lang.ts): a mesma página, no idioma escolhido no cabeçalho.
export default async function RootLayout({ children }: LayoutProps<"/">) {
  const lang = await getLang();
  return (
    <html
      lang={langInfo[lang].html}
      suppressHydrationWarning
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <head>
        {/* Aplica o tema salvo (ou o do sistema) antes de pintar, para não piscar. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`,
          }}
        />
      </head>
      <body className="font-sans" suppressHydrationWarning>
        <Header lang={lang} />
        {children}
        <Footer lang={lang} />
      </body>
    </html>
  );
}
