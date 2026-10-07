import Hero from "@/components/Hero";
import About from "@/components/About";
import Stats from "@/components/Stats";
import ProjectsSection from "@/components/ProjectsSection";
import Partners from "@/components/Partners";
import Social from "@/components/Social";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Stats />
      <ProjectsSection />
      <Partners />
      <Social />
    </main>
  );
}