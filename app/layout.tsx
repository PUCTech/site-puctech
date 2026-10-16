import type { Metadata } from "next";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "PUC Tech | A Primeira Liga de Ciência e Tecnologia da PUC-SP",
    template: "%s | PUC Tech",
  },
  description:
    "A primeira liga de ciência e tecnologia da PUC-SP, formada por estudantes que acreditam no protagonismo estudantil como motor de transformação.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "PUC Tech",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
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
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
