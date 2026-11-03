// Generative "silk ribbon" line art. Pure drawing code with no DOM access, so it runs either
// on the main thread or inside a Web Worker on an OffscreenCanvas.

type Pt = [number, number];
type Ctx = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
type Surface = HTMLCanvasElement | OffscreenCanvas;

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
const SAMPLES = 150;
const PINK = [244, 63, 110] as const;
const PINK_LIGHT = [255, 150, 176] as const;

export type RibbonSize = { width: number; height: number; dpr: number; artTop: number };

type Thread = { u: number; cosB: number; sinB: number; jitter: number };
type Bucket = { alpha: number; width: number; color: readonly number[]; threads: Thread[] };

function catmullRom(points: Pt[], out: Float32Array) {
  const n = points.length - 1;
  for (let k = 0; k < SAMPLES; k++) {
    const u = (k / (SAMPLES - 1)) * n;
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

// Threads are grouped into a few alpha buckets so each bucket is a single path and one stroke().
function makeBuckets(count: number): Bucket[] {
  const levels = 6;
  const buckets: Bucket[] = Array.from({ length: levels }, (_, l) => ({
    alpha: 0.07 + 0.68 * Math.pow((l + 0.5) / levels, 2.2),
    width: 0.45 + 0.35 * (l / (levels - 1)),
    color: PINK,
    threads: [],
  }));
  const highlight: Bucket = { alpha: 0.85, width: 0.9, color: PINK_LIGHT, threads: [] };
  for (let i = 0; i < count; i++) {
    const u = -1 + (2 * i) / (count - 1);
    const t = { u, cosB: Math.cos(u * 1.4), sinB: Math.sin(u * 1.4), jitter: (hash(i + 7) - 0.5) * 0.6 };
    if (i % 41 === 7) highlight.threads.push(t);
    else buckets[Math.min(levels - 1, Math.floor(Math.pow(hash(i), 1.3) * levels))].threads.push(t);
  }
  return [...buckets, highlight].filter((b) => b.threads.length);
}

export function createRibbon(surface: Surface) {
  const ctx = surface.getContext("2d") as Ctx | null;
  if (!ctx) return null;

  let w = 0;
  let h = 0;
  let artTop = 0;

  const spine = new Float32Array(SAMPLES * 2);
  const tail = new Float32Array(SAMPLES * 2);
  const moved: Pt[] = SPINE.map((p) => [p[0], p[1]]);
  const movedTail: Pt[] = TAIL.map((p) => [p[0], p[1]]);
  const mainBuckets = makeBuckets(THREADS);
  const tailBuckets = makeBuckets(TAIL_THREADS);

  // Per-sample scratch arrays, shared by both bands.
  const X = new Float32Array(SAMPLES);
  const Y = new Float32Array(SAMPLES);
  const NX = new Float32Array(SAMPLES);
  const NY = new Float32Array(SAMPLES);
  const BW = new Float32Array(SAMPLES);
  const COS = new Float32Array(SAMPLES);
  const SA = new Float32Array(SAMPLES);
  const CA = new Float32Array(SAMPLES);

  // Map normalised coordinates into pixels. On narrow screens the art moves into the space below
  // the hero text (artTop) so it never sits on top of the headline or button.
  const mapX = (x: number) => (w < 768 ? (0.02 + (x - 0.28) * 1.35) * w : x * w);
  const mapY = (y: number) => (w < 768 ? artTop + (y - 0.1) * (h - artTop) * 1.05 : y * h);

  function strokeBand(path: Float32Array, buckets: Bucket[], bandWidth: number, twist: number, phase: number, taperEnd: boolean) {
    // Geometry shared by every thread: spine position, normal, envelope and twist terms.
    for (let k = 0; k < SAMPLES; k++) {
      X[k] = mapX(path[k * 2]);
      Y[k] = mapY(path[k * 2 + 1]);
    }
    for (let k = 0; k < SAMPLES; k++) {
      const ka = Math.max(k - 1, 0);
      const kb = Math.min(k + 1, SAMPLES - 1);
      const tx = X[kb] - X[ka];
      const ty = Y[kb] - Y[ka];
      const len = Math.hypot(tx, ty) || 1;
      NX[k] = -ty / len;
      NY[k] = tx / len;
      const s = k / (SAMPLES - 1);
      BW[k] = bandWidth * Math.pow(Math.sin(Math.PI * (taperEnd ? s : 0.5 + s * 0.5)), 0.75);
      COS[k] = Math.cos(twist * Math.PI * 2 * s + phase);
      const a = Math.PI * 3 * s + phase * 0.7;
      SA[k] = Math.sin(a);
      CA[k] = Math.cos(a);
    }
    for (const b of buckets) {
      ctx!.beginPath();
      for (const th of b.threads) {
        const j = th.jitter * 0.08;
        for (let k = 0; k < SAMPLES; k++) {
          // u·cosθ spreads threads across the twisting band; the sin(a + 1.4u) term fans them out.
          const off = BW[k] * (th.u * COS[k] + 0.28 * (SA[k] * th.cosB + CA[k] * th.sinB) + j);
          const px = X[k] + NX[k] * off;
          const py = Y[k] + NY[k] * off;
          if (k === 0) ctx!.moveTo(px, py);
          else ctx!.lineTo(px, py);
        }
      }
      const [r, g, bl] = b.color;
      ctx!.strokeStyle = `rgba(${r},${g},${bl},${b.alpha})`;
      ctx!.lineWidth = b.width;
      ctx!.stroke();
    }
  }

  return {
    resize(size: RibbonSize) {
      w = size.width;
      h = size.height;
      artTop = size.artTop;
      surface.width = Math.round(w * size.dpr);
      surface.height = Math.round(h * size.dpr);
      ctx.setTransform(size.dpr, 0, 0, size.dpr, 0, 0);
    },

    /** Draws one frame. `time` in seconds; (ox, oy) is a small parallax offset in px. */
    draw(time: number, ox = 0, oy = 0) {
      if (!w || !h) return;
      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.translate(ox, oy);

      // Slowly drift the control points so the ribbon breathes.
      for (let i = 0; i < SPINE.length; i++) {
        moved[i][0] = SPINE[i][0] + 0.012 * Math.sin(time * 0.31 + i * 1.7);
        moved[i][1] = SPINE[i][1] + 0.014 * Math.cos(time * 0.27 + i * 1.3);
      }
      for (let i = 0; i < TAIL.length; i++) {
        movedTail[i][0] = TAIL[i][0] + 0.01 * Math.sin(time * 0.4 + i);
        movedTail[i][1] = TAIL[i][1] + 0.01 * Math.cos(time * 0.35 + i * 2);
      }
      catmullRom(moved, spine);
      catmullRom(movedTail, tail);

      const unit = Math.min(w, h * 1.4);
      ctx.globalCompositeOperation = "lighter";
      strokeBand(spine, mainBuckets, unit * 0.085, 2.2, time * 0.22, true);
      strokeBand(tail, tailBuckets, unit * 0.012, 1.2, time * 0.3, false);

      // White-to-pink glint at the tip of the tail.
      const gx = mapX(tail[(SAMPLES - 1) * 2]);
      const gy = mapY(tail[(SAMPLES - 1) * 2 + 1]);
      const glow = ctx.createRadialGradient(gx, gy, 0, gx, gy, 9);
      glow.addColorStop(0, "rgba(255,255,255,0.95)");
      glow.addColorStop(0.35, "rgba(255,160,185,0.6)");
      glow.addColorStop(1, "rgba(244,63,110,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(gx, gy, 9, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
      ctx.globalCompositeOperation = "source-over";
    },
  };
}

export type Ribbon = NonNullable<ReturnType<typeof createRibbon>>;

/** Animation loop with ~30fps cap and eased parallax. Works on the main thread and in workers. */
export function createLoop(ribbon: Ribbon) {
  const raf: (cb: (t: number) => void) => number =
    typeof requestAnimationFrame === "function" ? requestAnimationFrame : (cb) => setTimeout(() => cb(performance.now()), 33) as unknown as number;
  const caf: (id: number) => void = typeof cancelAnimationFrame === "function" ? cancelAnimationFrame : (id) => clearTimeout(id);
  const pointer = { x: 0, y: 0, sx: 0, sy: 0 };
  let id = 0;
  let running = false;
  let last = 0;
  let t = 4; // seconds; the still frame used before animation starts and under reduced motion

  const frame = (now: number) => {
    id = raf(frame);
    if (now - last < 1000 / 30 - 2) return; // ~30fps is plenty for a slow drift
    last = now;
    pointer.sx += (pointer.x - pointer.sx) * 0.08;
    pointer.sy += (pointer.y - pointer.sy) * 0.08;
    t = now / 1000;
    ribbon.draw(t, pointer.sx, pointer.sy);
  };

  return {
    start() {
      if (running) return;
      running = true;
      id = raf(frame);
    },
    stop() {
      running = false;
      caf(id);
    },
    pointer(x: number, y: number) {
      pointer.x = x;
      pointer.y = y;
    },
    /** Redraw once without animating (resize while paused, reduced motion). */
    still() {
      ribbon.draw(t, pointer.sx, pointer.sy);
    },
  };
}
