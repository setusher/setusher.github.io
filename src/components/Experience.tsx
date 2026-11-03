import { experience } from "@/lib/content";
import { Section } from "./Section";

export function Experience() {
  return (
    <Section id="experience" index="04" label="experience" title="Experience">
      <ol className="relative ml-1.5 max-w-[860px] border-l border-line">
        {experience.map((job) => (
          <li key={`${job.org}-${job.role}`} data-reveal className="relative pb-14 pl-8 last:pb-0 md:pl-12">
            <span aria-hidden="true" className="absolute -left-[5px] top-[7px] h-[9px] w-[9px] rounded-full bg-mint ring-4 ring-bg" />
            <p className="font-mono text-[11.5px] italic tracking-[0.12em] text-muted">
              {job.period}
              {job.place ? ` · ${job.place}` : ""}
            </p>
            <h3 className="mt-2 text-[22px] font-extrabold leading-tight tracking-[-0.02em] md:text-[26px]">
              {job.org}
            </h3>
            <p className="mt-1 text-[14px] text-mint">{job.role}</p>
            <ul className="mt-4 space-y-2 text-[14.5px] leading-[1.7] text-[#b4b4b4]">
              {job.bullets.map((b) => (
                <li key={b} className="relative pl-4 before:absolute before:left-0 before:top-[0.75em] before:h-px before:w-2 before:bg-pink">
                  {b}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </Section>
  );
}
