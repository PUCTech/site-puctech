import Hero from "@/components/Hero";
import About from "@/components/About";
import Stats from "@/components/Stats";
import Pillars from "@/components/Pillars";
import Events from "@/components/Events";
import Invitation from "@/components/Invitation";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Stats />
      <Pillars />
      <Events />
      <Invitation />
    </main>
  );
}