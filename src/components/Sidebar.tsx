"use client";

import { useEffect, useRef, useState } from "react";
import { nav, site } from "@/lib/content";
import { Logo } from "./Logo";
import { GitHubIcon, LinkedInIcon, MailIcon } from "./icons";

function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const visible = new Map<string, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) visible.set(e.target.id, e.isIntersecting);
        // Pick the first section (in page order) whose band crosses the viewport middle.
        setActive(ids.find((id) => visible.get(id)) ?? null);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [ids]);
  return active;
}

function Socials({ className = "" }: { className?: string }) {
  const links = [
    { href: site.github, label: "GitHub", Icon: GitHubIcon },
    ...(site.linkedin ? [{ href: site.linkedin, label: "LinkedIn", Icon: LinkedInIcon }] : []),
    { href: `mailto:${site.email}`, label: "Email", Icon: MailIcon },
  ];
  return (
    <ul className={`flex items-center justify-center gap-4 ${className}`}>
      {links.map(({ href, label, Icon }) => (
        <li key={label}>
          <a
            href={href}
            aria-label={label}
            {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="block p-1 text-[#8a8a8a] transition-colors duration-200 hover:text-mint"
          >
            <Icon />
          </a>
        </li>
      ))}
    </ul>
  );
}

const ids = nav.map((n) => n.id);

export function Sidebar() {
  const active = useActiveSection(ids);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    menuRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[var(--sidebar-w)] flex-col bg-sidebar md:flex">
        <Logo />
        <nav aria-label="Primary" className="mt-[95px]">
          <ul className="border-b border-line">
            {nav.map(({ id, label }) => {
              const isActive = active === id;
              return (
                <li key={id} className="border-t border-line">
                  <a
                    href={`#${id}`}
                    aria-current={isActive ? "true" : undefined}
                    className={`relative flex h-9 items-center justify-center text-[12.5px] transition-colors duration-200 hover:text-white focus-visible:-outline-offset-2 ${
                      isActive ? "text-white" : "text-muted"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`absolute inset-y-2 left-0 w-[2px] bg-mint transition-transform duration-300 origin-center ${
                        isActive ? "scale-y-100" : "scale-y-0"
                      }`}
                    />
                    {label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
        <Socials className="mt-auto mb-8 gap-2.5" />
      </aside>

      {/* Mobile top bar */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-line bg-black/90 px-4 backdrop-blur md:hidden">
        <Logo compact />
        <button
          ref={toggleRef}
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
          className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-[5px]"
        >
          <span className={`h-px w-6 bg-white transition-transform duration-200 ${open ? "translate-y-[3px] rotate-45" : ""}`} />
          <span className={`h-px w-6 bg-white transition-transform duration-200 ${open ? "-translate-y-[3px] -rotate-45" : ""}`} />
        </button>
      </header>

      {open && (
        <div
          id="mobile-menu"
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-30 flex flex-col bg-sidebar pt-14 md:hidden"
        >
          <nav aria-label="Mobile" className="mt-12">
            <ul className="border-b border-line">
              {nav.map(({ id, label }) => (
                <li key={id} className="border-t border-line">
                  <a
                    href={`#${id}`}
                    onClick={() => setOpen(false)}
                    aria-current={active === id ? "true" : undefined}
                    className={`flex h-14 items-center justify-center text-[15px] tracking-wide transition-colors hover:text-white ${
                      active === id ? "text-white" : "text-muted"
                    }`}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <Socials className="mt-auto mb-10 gap-6" />
        </div>
      )}
    </>
  );
}
