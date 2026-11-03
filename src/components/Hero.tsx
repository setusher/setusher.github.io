import { CodeTag } from "./CodeTag";
import { Duo } from "./Duo";
import { RibbonCanvas } from "./RibbonCanvas";

const pad = "pl-[clamp(24px,4vw,64px)]";

export function Hero() {
  return (
    <section id="top" aria-label="Introduction" className="relative min-h-[100svh] overflow-hidden pb-[min(380px,60vw)] md:pb-0">
      <RibbonCanvas />

      <div className={`pointer-events-none absolute top-[76px] md:top-6 ${pad} flex flex-col gap-1.5`}>
        <CodeTag tag="</html>" className="-ml-3" />
        <CodeTag tag="<body>" />
      </div>

      <div data-hero-content className={`relative z-10 ${pad} pr-6 pt-[max(25svh,120px)] md:pt-[25vh]`}>
        <CodeTag tag="<h1>" className="mb-3 block -ml-3" />
        <h1 className="text-[clamp(40px,6.2vw,96px)] font-extrabold leading-[0.95] tracking-[-0.03em] text-white">
          <span className="hero-line block" style={{ "--i": 0 } as React.CSSProperties}>
            Hi,
          </span>
          <span className="hero-line block" style={{ "--i": 1 } as React.CSSProperties}>
            I&apos;m <Duo char="S" />
            hradha,
          </span>
          <span className="hero-line block" style={{ "--i": 2 } as React.CSSProperties}>
            full stack developer
            <CodeTag tag="</h1>" className="ml-4 align-middle tracking-normal" />
          </span>
        </h1>

        <CodeTag tag="< p >" className="mt-7 block -ml-3" />
        <p
          className="hero-line mt-3 text-[13px] uppercase tracking-[0.2em] text-muted-2 md:text-[14px]"
          style={{ "--i": 3 } as React.CSSProperties}
        >
          AI &amp; Agentic Systems / Full Stack Developer
        </p>

        <div className="hero-line mt-[50px]" style={{ "--i": 4 } as React.CSSProperties}>
          <a href="#contact" className="btn-outline">
            Contact me!
          </a>
        </div>
        <CodeTag tag="< p / >" className="mt-5 block -ml-3" />
      </div>

      <a
        href="#about"
        className="group absolute bottom-8 left-2 z-10 hidden flex-col items-center gap-2 p-1 text-[11px] tracking-[0.12em] text-muted transition-colors hover:text-white md:flex"
      >
        <span className="rotate-180 [writing-mode:vertical-rl]">scroll down</span>
        <span aria-hidden="true" className="bob text-[13px] text-white/80 group-hover:text-mint">
          ↓
        </span>
      </a>
    </section>
  );
}
