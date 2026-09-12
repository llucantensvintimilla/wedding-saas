export function Monograma({
  inicialNovia,
  inicialNovio,
  className = "",
}: {
  inicialNovia: string;
  inicialNovio: string;
  className?: string;
}) {
  return (
    <div
      className={`select-none pointer-events-none font-heading text-secondary/[0.045] leading-none ${className}`}
      style={{ fontSize: "clamp(8rem, 22vw, 16rem)" }}
      aria-hidden="true"
    >
      {inicialNovia}
      <span className="italic">&amp;</span>
      {inicialNovio}
    </div>
  );
}
