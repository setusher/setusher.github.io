import { Hero } from "@/components/Hero";
import { Sidebar } from "@/components/Sidebar";

export default function Home() {
  return (
    <>
      <a href="#about" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-black focus:px-4 focus:py-2">
        Skip to content
      </a>
      <Sidebar />
      <main className="md:ml-[var(--sidebar-w)]">
        <Hero />
      </main>
    </>
  );
}
