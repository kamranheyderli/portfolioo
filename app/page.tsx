import SceneLoader from "@/components/SceneLoader";
import Nav from "@/components/Nav";
import Cursor from "@/components/Cursor";
import Terminal from "@/components/Terminal";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Skills from "@/components/sections/Skills";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <SceneLoader />
      <Cursor />
      <Terminal />
      <Nav />
      <main>
        <Hero />
        <About />
        <Experience />
        <Skills />
        <Contact />
      </main>
    </>
  );
}
