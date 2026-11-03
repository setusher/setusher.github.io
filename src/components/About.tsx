import { about, site } from "@/lib/content";
import { CountUp } from "./CountUp";
import { Section } from "./Section";

export function About() {
  return (
    <Section id="about" index="01" label="about" title="About me">
        <div className="max-w-[640px] space-y-5 text-[15px] leading-[1.8] text-[#b4b4b4] md:text-[16px]">
          {about.paragraphs.map((p, i) => (
            <p key={i} data-reveal style={{ "--reveal-delay": `${i * 80}ms` } as React.CSSProperties}>
              {p}
            </p>
          ))}
          {site.resume && (
            <div data-reveal className="pt-6">
              <a href={site.resume} download className="btn-outline">
                Download Resume
              </a>
            </div>
          )}
        </div>

      <dl className="mt-16 grid grid-cols-2 border-y border-line lg:grid-cols-4">
        {about.stats.map((s, i) => (
          <div
            key={s.label}
            data-reveal
            style={{ "--reveal-delay": `${i * 80}ms` } as React.CSSProperties}
            className={`flex flex-col-reverse gap-2 px-2 py-8 md:px-6 ${i % 2 ? "border-l border-line" : ""} ${
              i === 2 ? "border-t border-line lg:border-t-0 lg:border-l" : ""
            } ${i === 3 ? "border-t border-line lg:border-t-0" : ""}`}
          >
            <dt className="text-[11px] uppercase tracking-[0.2em] text-muted">{s.label}</dt>
            <dd className="text-[clamp(32px,3.6vw,48px)] font-extrabold leading-none tracking-[-0.02em]">
              <span className="sr-only">
                {s.value.toLocaleString("en-US")}
                {s.suffix}
              </span>
              <span aria-hidden="true" className={i % 2 ? "text-pink" : "text-mint"}>
                <CountUp value={s.value} suffix={s.suffix} />
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
