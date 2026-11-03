import { projects, site } from "@/lib/content";
import { ArrowIcon, GitHubIcon } from "./icons";
import { Section } from "./Section";

export function Work() {
  return (
    <Section id="work" index="03" label="work" title="Work">
      <ul className="grid gap-6 md:grid-cols-2">
        {projects.map((p, i) => (
          <li
            key={p.name}
            data-reveal
            style={{ "--reveal-delay": `${(i % 2) * 90}ms` } as React.CSSProperties}
          >
            <article className="flex h-full flex-col border border-line bg-panel p-7 transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-pink md:p-8">
              <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-[24px] font-extrabold tracking-[-0.02em]">{p.name}</h3>
                <p className="font-mono text-[11px] italic tracking-[0.1em] text-muted">{p.period}</p>
              </header>
              <ul aria-label="Tech stack" className="mt-4 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11.5px] text-mint">
                {p.tech.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <ul className="mt-5 space-y-3 text-[14px] leading-[1.7] text-[#b4b4b4]">
                {p.bullets.map((b) => (
                  <li key={b} className="relative pl-4 before:absolute before:left-0 before:top-[0.7em] before:h-px before:w-2 before:bg-pink">
                    {b}
                  </li>
                ))}
              </ul>
              {(p.github || p.live) && (
                <div className="mt-auto flex gap-6 pt-7 text-[12px] uppercase tracking-[0.15em]">
                  {p.github && (
                    <a href={p.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-muted transition-colors hover:text-white">
                      <GitHubIcon className="h-3.5 w-3.5" /> Code
                      <span className="sr-only">for {p.name} on GitHub</span>
                    </a>
                  )}
                  {p.live && (
                    <a href={p.live} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-muted transition-colors hover:text-white">
                      <ArrowIcon /> Live
                      <span className="sr-only">site for {p.name}</span>
                    </a>
                  )}
                </div>
              )}
            </article>
          </li>
        ))}
      </ul>
      <p data-reveal className="mt-10">
        <a href={site.github} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.15em] text-mint">
          More on GitHub <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
        </a>
      </p>
    </Section>
  );
}
