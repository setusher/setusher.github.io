import { Duo } from "./Duo";
import { site } from "@/lib/content";

/** The black logo block at the top of the sidebar: two-tone "S", name and role. */
export function Logo({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <a href="#top" className="flex items-center gap-2.5">
        <span className="text-[30px] font-black leading-none" aria-hidden="true">
          <Duo char="S" shift="0.05em" />
        </span>
        <span className="text-[15px] font-bold">{site.shortName}</span>
        <span className="sr-only">, back to top</span>
      </a>
    );
  }
  return (
    <a
      href="#top"
     
      className="flex h-[128px] w-full flex-col items-center justify-center bg-black"
    >
      <span className="text-[58px] font-black leading-[0.9]" aria-hidden="true">
        <Duo char="S" shift="0.05em" />
      </span>
      <span className="mt-1.5 text-[16px] font-bold leading-tight text-white">{site.shortName}</span>
      <span className="mt-0.5 text-[9.5px] leading-tight text-[#a8a8a8]">{site.role}</span>
      <span className="sr-only">, back to top</span>
    </a>
  );
}
