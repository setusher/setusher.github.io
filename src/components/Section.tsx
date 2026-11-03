import { CodeTag } from "./CodeTag";
import { Duo } from "./Duo";

export const sectionPad = "px-[clamp(24px,4vw,64px)]";

type Props = {
  id: string;
  index: string;
  label: string;
  title: string;
  children: React.ReactNode;
};

/** Shared section frame: index label, big heading with a two-tone first letter, decorative tags. */
export function Section({ id, index, label, title, children }: Props) {
  const [first, ...rest] = title;
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`relative border-t border-line py-24 md:py-32 ${sectionPad}`}>
      <CodeTag tag="<section>" className="absolute top-6 -ml-3" />
      <div className="mx-auto max-w-[1180px] md:mx-0">
        <p data-reveal className="mb-4 font-mono text-[12px] italic tracking-[0.2em] text-muted">
          {index} / {label}
        </p>
        <CodeTag tag="<h2>" className="mb-2 block -ml-3" />
        <h2
          id={`${id}-title`}
          data-reveal
          className="text-[clamp(36px,4.6vw,64px)] font-extrabold leading-[1] tracking-[-0.03em]"
        >
          <span className="sr-only">{title}</span>
          <span aria-hidden="true">
            <Duo char={first} />
            {rest.join("")}
          </span>
          <CodeTag tag="</h2>" className="ml-3 align-middle tracking-normal" />
        </h2>
        <div className="mt-12 md:mt-16">{children}</div>
      </div>
      <CodeTag tag="</section>" className="absolute bottom-6 -ml-3" />
    </section>
  );
}
