"use client";

import { useEffect, useRef } from "react";

type Pt = [number, number];

// Spine of the main ribbon in hero-normalised coordinates (0..1). The left tip sits in the middle
// of the headline; the ribbon sweeps right, loops back on itself and falls to the bottom-right corner.
const SPINE: Pt[] = [
  [0.3, 0.43],
  [0.42, 0.3],
  [0.58, 0.2],
  [0.76, 0.15],
  [0.9, 0.25],
  [0.93, 0.45],
  [0.81, 0.58],
  [0.67, 0.55],
  [0.67, 0.41],
  [0.81, 0.42],
  [0.94, 0.63],
  [0.97, 0.9],
  [0.9, 1.06],
];

// A thin tail peeling off the loop toward the lower left, ending in a glint.
const TAIL: Pt[] = [
  [0.82, 0.57],
  [0.74, 0.66],
  [0.64, 0.76],
  [0.56, 0.84],
];

const THREADS = 240;
const TAIL_THREADS = 14;
const SAMPLES = 170;
const PINK = [244, 63, 110] as const;
const PINK_LIGHT = [255, 150, 176] as const;

function catmullRom(points: Pt[], samples: number, out: Float32Array) {
  const n = points.length - 1;
  for (let k = 0; k < samples; k++) {
    const u = (k / (samples - 1)) * n;
    const i = Math.min(Math.floor(u), n - 1);
    const t = u - i;
    const p0 = points[Math.max(i - 1, 0)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(i + 2, n)];
    const t2 = t * t;
    const t3 = t2 * t;
    for (let d = 0; d < 2; d++) {
      out[k * 2 + d] =
        0.5 *
        (2 * p1[d] +
          (-p0[d] + p2[d]) * t +
          (2 * p0[d] - 5 * p1[d] + 4 * p2[d] - p3[d]) * t2 +
          (-p0[d] + 3 * p1[d] - 3 * p2[d] + p3[d]) * t3);
    }
  }
}

// Deterministic per-thread randomness so the static frame is stable between renders.
function hash(i: number) {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export function RibbonCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let artTop = 0; // narrow screens: y where the hero text ends and the art may begin
    let raf = 0;
    let running = false;
    let onScreen = true;
    const pointer = { x: 0, y: 0, sx: 0, sy: 0 };

    const spine = new Float32Array(SAMPLES * 2);
    const tail = new Float32Array(SAMPLES * 2);
    const moved: Pt[] = SPINE.map((p) => [p[0], p[1]]);
    const movedTail: Pt[] = TAIL.map((p) => [p[0], p[1]]);

    const thread = Array.from({ length: THREADS }, (_, i) => {
      const r = hash(i);
      const highlight = i % 41 === 7;
      return {
        u: -1 + (2 * i) / (THREADS - 1),
        alpha: highlight ? 0.85 : 0.07 + 0.68 * Math.pow(r, 2.8),
        width: highlight ? 0.9 : 0.45 + 0.35 * hash(i + 99),
        color: highlight ? PINK_LIGHT : PINK,
        jitter: (hash(i + 7) - 0.5) * 0.6,
      };
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const text = canvas.parentElement?.querySelector("[data-hero-content]");
      artTop = text ? text.getBoundingClientRect().bottom - rect.top : h * 0.5;
      if (!running) draw(reduceMotion ? 4 : performance.now() / 1000);
    };

    // Map normalised spine coordinates into pixels. On narrow screens the art moves into the
    // space below the hero text so it never sits on top of the headline or button.
    const mapX = (x: number) => (w < 768 ? (0.02 + (x - 0.28) * 1.35) * w : x * w);
    const mapY = (y: number) => (w < 768 ? artTop + (y - 0.1) * (h - artTop) * 1.05 : y * h);

    function strokeBand(
      path: Float32Array,
      threads: typeof thread,
      bandWidth: number,
      twist: number,
      phase: number,
      taperEnd: boolean,
    ) {
      for (const th of threads) {
        ctx!.beginPath();
        for (let k = 0; k < SAMPLES; k++) {
          const s = k / (SAMPLES - 1);
          const x = mapX(path[k * 2]);
          const y = mapY(path[k * 2 + 1]);
          // Tangent from neighbouring samples gives the band normal.
          const ka = Math.max(k - 1, 0);
          const kb = Math.min(k + 1, SAMPLES - 1);
          const tx = mapX(path[kb * 2]) - mapX(path[ka * 2]);
          const ty = mapY(path[kb * 2 + 1]) - mapY(path[ka * 2 + 1]);
          const len = Math.hypot(tx, ty) || 1;
          const nx = -ty / len;
          const ny = tx / len;
          const env = Math.pow(Math.sin(Math.PI * (taperEnd ? s : 0.5 + s * 0.5)), 0.75);
          const theta = twist * Math.PI * 2 * s + phase;
          const off =
            bandWidth *
            env *
            (th.u * Math.cos(theta) + 0.28 * Math.sin(Math.PI * 3 * s + th.u * 1.4 + phase * 0.7) + th.jitter * 0.08);
          const px = x + nx * off;
          const py = y + ny * off;
          if (k === 0) ctx!.moveTo(px, py);
          else ctx!.lineTo(px, py);
        }
        const [r, g, b] = th.color;
        ctx!.strokeStyle = `rgba(${r},${g},${b},${th.alpha})`;
        ctx!.lineWidth = th.width;
        ctx!.stroke();
      }
    }

    function draw(time: number) {
      ctx!.clearRect(0, 0, w, h);
      ctx!.save();
      ctx!.translate(pointer.sx, pointer.sy);

      // Slowly drift the control points so the ribbon breathes.
      for (let i = 0; i < SPINE.length; i++) {
        moved[i][0] = SPINE[i][0] + 0.012 * Math.sin(time * 0.31 + i * 1.7);
        moved[i][1] = SPINE[i][1] + 0.014 * Math.cos(time * 0.27 + i * 1.3);
      }
      for (let i = 0; i < TAIL.length; i++) {
        movedTail[i][0] = TAIL[i][0] + 0.01 * Math.sin(time * 0.4 + i);
        movedTail[i][1] = TAIL[i][1] + 0.01 * Math.cos(time * 0.35 + i * 2);
      }
      catmullRom(moved, SAMPLES, spine);
      catmullRom(movedTail, SAMPLES, tail);

      const unit = Math.min(w, h * 1.4);
      ctx!.globalCompositeOperation = "lighter";
      strokeBand(spine, thread, unit * 0.085, 2.2, time * 0.22, true);
      strokeBand(tail, thread.slice(0, TAIL_THREADS), unit * 0.012, 1.2, time * 0.3, false);

      // White-to-pink glint at the tip of the tail.
      const gx = mapX(tail[(SAMPLES - 1) * 2]);
      const gy = mapY(tail[(SAMPLES - 1) * 2 + 1]);
      const glow = ctx!.createRadialGradient(gx, gy, 0, gx, gy, 9);
      glow.addColorStop(0, "rgba(255,255,255,0.95)");
      glow.addColorStop(0.35, "rgba(255,160,185,0.6)");
      glow.addColorStop(1, "rgba(244,63,110,0)");
      ctx!.fillStyle = glow;
      ctx!.beginPath();
      ctx!.arc(gx, gy, 9, 0, Math.PI * 2);
      ctx!.fill();

      ctx!.restore();
      ctx!.globalCompositeOperation = "source-over";
    }

    const frame = (now: number) => {
      pointer.sx += (pointer.x - pointer.sx) * 0.05;
      pointer.sy += (pointer.y - pointer.sy) * 0.05;
      draw(now / 1000);
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (reduceMotion || running || document.hidden || !onScreen) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      if (onScreen) start();
      else stop();
    });
    io.observe(canvas);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    const onPointer = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth - 0.5) * -10;
      pointer.y = (e.clientY / window.innerHeight - 0.5) * -10;
    };
    if (!reduceMotion) window.addEventListener("pointermove", onPointer, { passive: true });

    start();
    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
    />
  );
}
