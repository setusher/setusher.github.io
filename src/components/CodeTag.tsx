/** Faint decorative HTML tag. Text comes from a CSS pseudo-element, so it is not readable DOM text. */
export function CodeTag({ tag, className = "" }: { tag: string; className?: string }) {
  return <span aria-hidden="true" className={`code-tag ${className}`} data-tag={tag} />;
}
