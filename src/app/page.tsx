import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Experience } from "@/components/Experience";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { RevealObserver } from "@/components/RevealObserver";
import { Sidebar } from "@/components/Sidebar";
import { Skills } from "@/components/Skills";
import { Work } from "@/components/Work";

export default function Home() {
  return (
    <>
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-black focus:px-4 focus:py-2"
      >
        Skip to content
      </a>
      <Sidebar />
      <main className="md:ml-[var(--sidebar-w)]">
        <Hero />
        <About />
        <Skills />
        <Work />
        <Experience />
        <Contact />
      </main>
      <div className="md:ml-[var(--sidebar-w)]">
        <Footer />
      </div>
      <RevealObserver />
    </>
  );
}
