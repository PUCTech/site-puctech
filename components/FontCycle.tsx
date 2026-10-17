"use client";

import {
  Abril_Fatface,
  Archivo_Black,
  Audiowide,
  Bangers,
  Bebas_Neue,
  Black_Ops_One,
  Bungee,
  Caveat,
  Cinzel,
  Comfortaa,
  Creepster,
  DM_Serif_Display,
  Dancing_Script,
  Fascinate,
  Lobster,
  Major_Mono_Display,
  Monoton,
  Nosifer,
  Orbitron,
  Pacifico,
  Permanent_Marker,
  Playfair_Display,
  Press_Start_2P,
  Righteous,
  Rubik_Mono_One,
  Rye,
  Shrikhand,
  Silkscreen,
  Space_Mono,
  Special_Elite,
  Syne_Mono,
  UnifrakturMaguntia,
  VT323,
  Zilla_Slab,
} from "next/font/google";
import { useEffect, useState, type CSSProperties } from "react";

const INTERVAL = 70; // ms em cada fonte: rápido, como um obturador disparando

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
const archivoBlack = Archivo_Black({ subsets: ["latin"], preload: false, weight: "400" });
const audiowide = Audiowide({ subsets: ["latin"], preload: false, weight: "400" });
const bangers = Bangers({ subsets: ["latin"], preload: false, weight: "400" });
const blackOps = Black_Ops_One({ subsets: ["latin"], preload: false, weight: "400" });
const bungee = Bungee({ subsets: ["latin"], preload: false, weight: "400" });
const caveat = Caveat({ subsets: ["latin"], preload: false, weight: "700" });
const comfortaa = Comfortaa({ subsets: ["latin"], preload: false, weight: "700" });
const creepster = Creepster({ subsets: ["latin"], preload: false, weight: "400" });
const dancing = Dancing_Script({ subsets: ["latin"], preload: false, weight: "700" });
const dmSerif = DM_Serif_Display({ subsets: ["latin"], preload: false, weight: "400" });
const fascinate = Fascinate({ subsets: ["latin"], preload: false, weight: "400" });
const majorMono = Major_Mono_Display({ subsets: ["latin"], preload: false, weight: "400" });
const nosifer = Nosifer({ subsets: ["latin"], preload: false, weight: "400" });
const rye = Rye({ subsets: ["latin"], preload: false, weight: "400" });
const shrikhand = Shrikhand({ subsets: ["latin"], preload: false, weight: "400" });
const silkscreen = Silkscreen({ subsets: ["latin"], preload: false, weight: "400" });
const specialElite = Special_Elite({ subsets: ["latin"], preload: false, weight: "400" });
const syneMono = Syne_Mono({ subsets: ["latin"], preload: false, weight: "400" });
const zillaSlab = Zilla_Slab({ subsets: ["latin"], preload: false, weight: "700" });

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
  { style: archivoBlack.style, size: 0.9 },
  { style: audiowide.style, size: 0.85 },
  { style: bangers.style },
  { style: blackOps.style, size: 0.85 },
  { style: bungee.style, size: 0.8 },
  { style: caveat.style, size: 1.15 },
  { style: comfortaa.style, size: 0.9 },
  { style: creepster.style },
  { style: dancing.style, size: 1.05 },
  { style: dmSerif.style },
  { style: fascinate.style, size: 0.9 },
  { style: majorMono.style, size: 0.75 },
  { style: nosifer.style, size: 0.6 },
  { style: rye.style, size: 0.85 },
  { style: shrikhand.style, size: 0.9 },
  { style: silkscreen.style, size: 0.75 },
  { style: specialElite.style, size: 0.9 },
  { style: syneMono.style, size: 0.9 },
  { style: zillaSlab.style },
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
