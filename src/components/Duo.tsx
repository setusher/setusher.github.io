/** A single letter rendered in the split mint | pink "glitch" treatment. The real glyph stays in the DOM. */
export function Duo({ char, shift }: { char: string; shift?: string }) {
  return (
    <span
      className="duo"
      data-char={char}
      style={shift ? ({ "--duo-shift": shift } as React.CSSProperties) : undefined}
    >
      {char}
    </span>
  );
}
