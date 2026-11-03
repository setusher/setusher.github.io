import { site } from "@/lib/content";
import { CodeTag } from "./CodeTag";
import { sectionPad } from "./Section";

export function Footer() {
  return (
    <footer className={`flex flex-wrap items-center justify-between gap-4 border-t border-line py-8 ${sectionPad}`}>
      <p className="text-[12px] text-muted">
        © {new Date().getFullYear()} {site.name}
      </p>
      <CodeTag tag="</body></html>" />
    </footer>
  );
}
