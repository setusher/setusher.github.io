// Runs the ribbon art off the main thread on an OffscreenCanvas transferred from RibbonCanvas.
import { createLoop, createRibbon, type RibbonSize } from "./ribbon";

export type RibbonMessage =
  | { type: "init"; canvas: OffscreenCanvas; size: RibbonSize }
  | { type: "resize"; size: RibbonSize }
  | { type: "run"; on: boolean }
  | { type: "pointer"; x: number; y: number };

let loop: ReturnType<typeof createLoop> | null = null;
let ribbon: ReturnType<typeof createRibbon> = null;

self.onmessage = (e: MessageEvent<RibbonMessage>) => {
  const msg = e.data;
  if (msg.type === "init") {
    ribbon = createRibbon(msg.canvas);
    if (!ribbon) return;
    ribbon.resize(msg.size);
    loop = createLoop(ribbon);
    loop.still();
  } else if (msg.type === "resize") {
    ribbon?.resize(msg.size);
    loop?.still();
  } else if (msg.type === "run") {
    if (msg.on) loop?.start();
    else loop?.stop();
  } else if (msg.type === "pointer") {
    loop?.pointer(msg.x, msg.y);
  }
};
