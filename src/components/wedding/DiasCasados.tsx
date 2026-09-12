export function DiasCasados({ dias }: { dias: number }) {
  return (
    <div className="text-center">
      <p className="text-4xl md:text-5xl font-heading text-primary tabular-nums">
        {dias}
      </p>
      <p className="text-xs uppercase tracking-widest text-black/40 mt-1">
        {dias === 1 ? "day married" : "days married"}
      </p>
    </div>
  );
}
