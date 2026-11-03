"use client";

import { useEffect, useRef } from "react";
import { createLoop, createRibbon, type RibbonSize } from "@/lib/ribbon";
import type { RibbonMessage } from "@/lib/ribbon.worker";

/**
 * Hero line art. Drawing happens in a Web Worker on an OffscreenCanvas when the browser supports
 * it, so the animation never blocks the main thread; otherwise it falls back to the main thread.
 * The canvas is created inside the effect because a canvas can only be transferred once.
 */
export function RibbonCanvas() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const canvas = document.createElement("canvas");
    canvas.className = "absolute inset-0 h-full w-full";
    host.appendChild(canvas);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const measure = (): RibbonSize => {
      const rect = host.getBoundingClientRect();
      const text = host.parentElement?.querySelector("[data-hero-content]");
      return {
        width: rect.width,
        height: rect.height,
        dpr: Math.min(window.devicePixelRatio || 1, 2),
        artTop: text ? text.getBoundingClientRect().bottom - rect.top : rect.height * 0.5,
      };
    };

    // One small interface over the two backends.
    let api: { resize(s: RibbonSize): void; run(on: boolean): void; pointer(x: number, y: number): void; dispose(): void };

    if ("transferControlToOffscreen" in canvas) {
      const worker = new Worker(new URL("../lib/ribbon.worker.ts", import.meta.url), { type: "module" });
      const post = (m: RibbonMessage, transfer?: Transferable[]) => worker.postMessage(m, transfer ?? []);
      const offscreen = canvas.transferControlToOffscreen();
      post({ type: "init", canvas: offscreen, size: measure() }, [offscreen]);
      api = {
        resize: (size) => post({ type: "resize", size }),
        run: (on) => post({ type: "run", on }),
        pointer: (x, y) => post({ type: "pointer", x, y }),
        dispose: () => worker.terminate(),
      };
    } else {
      const ribbon = createRibbon(canvas);
      if (!ribbon) return;
      const loop = createLoop(ribbon);
      api = {
        resize: (size) => {
          ribbon.resize(size);
          loop.still();
        },
        run: (on) => (on ? loop.start() : loop.stop()),
        pointer: (x, y) => loop.pointer(x, y),
        dispose: () => loop.stop(),
      };
      api.resize(measure());
    }

    let ready = false; // motion waits until the page has loaded and gone idle
    let onScreen = true;
    const sync = () => api.run(!reduceMotion && ready && onScreen && !document.hidden);

    const ro = new ResizeObserver(() => api.resize(measure()));
    ro.observe(host);

    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      sync();
    });
    io.observe(host);

    document.addEventListener("visibilitychange", sync);

    const onPointer = (e: PointerEvent) =>
      api.pointer((e.clientX / window.innerWidth - 0.5) * -10, (e.clientY / window.innerHeight - 0.5) * -10);
    if (!reduceMotion) window.addEventListener("pointermove", onPointer, { passive: true });

    let idle = 0;
    const begin = () => {
      const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
      idle = ric(() => {
        ready = true;
        sync();
      });
    };
    if (document.readyState === "complete") begin();
    else window.addEventListener("load", begin, { once: true });

    return () => {
      window.removeEventListener("load", begin);
      (window.cancelIdleCallback ?? window.clearTimeout)(idle);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("pointermove", onPointer);
      api.dispose();
      canvas.remove();
    };
  }, []);

  return <div ref={hostRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-0" />;
}
