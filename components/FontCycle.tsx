"use client";

import {
  Abril_Fatface,
  Bebas_Neue,
  Cinzel,
  Lobster,
  Monoton,
  Orbitron,
  Pacifico,
  Permanent_Marker,
  Playfair_Display,
  Press_Start_2P,
  Righteous,
  Rubik_Mono_One,
  Space_Mono,
  UnifrakturMaguntia,
  VT323,
} from "next/font/google";
import { useEffect, useState, type CSSProperties } from "react";

const INTERVAL = 350; // ms em cada fonte

// Só baixam quando esta página usa; nenhuma entra no preload do site.
const playfair = Playfair_Display({ subsets: ["latin"], preload: false, weight: "700", style: "italic" });
const spaceMono = Space_Mono({ subsets: ["latin"], preload: false, weight: "700" });
const pressStart = Press_Start_2P({ subsets: ["latin"], preload: false, weight: "400" });
const pacifico = Pacifico({ subsets: ["latin"], preload: false, weight: "400" });
const bebas = Bebas_Neue({ subsets: ["latin"], preload: false, weight: "400" });
const abril = Abril_Fatface({ subsets: ["latin"], preload: false, weight: "400" });
const lobster = Lobster({ subsets: ["latin"], preload: false, weight: "400" });
const vt323 = VT323({ subsets: ["latin"], preload: false, weight: "400" });
const rubikMono = Rubik_Mono_One({ subsets: ["latin"], preload: false, weight: "400" });
const righteous = Righteous({ subsets: ["latin"], preload: false, weight: "400" });
const cinzel = Cinzel({ subsets: ["latin"], preload: false, weight: "700" });
const marker = Permanent_Marker({ subsets: ["latin"], preload: false, weight: "400" });
const fraktur = UnifrakturMaguntia({ subsets: ["latin"], preload: false, weight: "400" });
const monoton = Monoton({ subsets: ["latin"], preload: false, weight: "400" });
const orbitron = Orbitron({ subsets: ["latin"], preload: false, weight: "700" });

// `size` compensa as fontes muito largas, para o texto caber no celular.
const fonts: { style?: CSSProperties; size?: number }[] = [
  {}, // a fonte do site (Figtree), que também é a do servidor e a do movimento reduzido
  { style: playfair.style },
  { style: pressStart.style, size: 0.62 },
  { style: pacifico.style, size: 0.9 },
  { style: bebas.style, size: 1.15 },
  { style: vt323.style, size: 1.2 },
  { style: abril.style },
  { style: rubikMono.style, size: 0.72 },
  { style: lobster.style },
  { style: spaceMono.style, size: 0.85 },
  { style: fraktur.style },
  { style: orbitron.style, size: 0.8 },
  { style: marker.style },
  { style: cinzel.style, size: 0.9 },
  { style: monoton.style, size: 0.7 },
  { style: righteous.style },
];

/** Texto que troca de fonte a cada instante, passando por estilos bem diferentes. */
export default function FontCycle({ text, className = "" }: { text: string; className?: string }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer = 0;
    let cancelled = false;
    // Espera todas as fontes baixarem, para nunca piscar a fonte de reserva.
    Promise.all(
      fonts.map(({ style }) =>
        style
          ? document.fonts.load(`${style.fontStyle ?? ""} ${style.fontWeight ?? ""} 1em ${style.fontFamily}`, text)
          : null,
      ),
    ).then(() => {
      if (cancelled) return;
      timer = window.setInterval(() => setIndex((i) => (i + 1) % fonts.length), INTERVAL);
    });
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [text]);

  const { style, size = 1 } = fonts[index];
  return (
    <span className={`flex h-[1.1em] items-center whitespace-nowrap ${className}`}>
      <span style={style && { ...style, fontSize: `${size}em`, letterSpacing: "normal" }}>{text}</span>
    </span>
  );
}
