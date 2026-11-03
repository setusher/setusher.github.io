import { skills } from "@/lib/content";
import { Section } from "./Section";

export function Skills() {
  return (
    <Section id="skills" index="02" label="skills" title="My skills">
      <div className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3 border border-line">
        {skills.map((group, i) => (
          <div
            key={group.title}
            data-reveal
            style={{ "--reveal-delay": `${i * 70}ms` } as React.CSSProperties}
            className={`bg-bg p-6 md:p-8 ${i === 0 ? "lg:col-span-2" : ""}`}
          >
            <h3 className="mb-5 flex items-baseline gap-3 text-[15px] font-bold tracking-[-0.01em]">
              <span className="font-mono text-[11px] font-normal italic text-pink">0{i + 1}</span>
              {group.title}
            </h3>
            <ul className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="border border-line px-3 py-1.5 font-mono text-[12px] text-[#bdbdbd] transition-colors duration-200 hover:border-mint hover:text-white"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
