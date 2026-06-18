interface AuthBrandPanelProps {
  tagline: string;
  description?: string;
}

export function AuthBrandPanel({ tagline, description }: AuthBrandPanelProps) {
  return (
    <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 p-12 text-white relative overflow-hidden">
      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-brand-400/30 blur-3xl" />

      <div className="relative">
        <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 inline-flex">
          <img src="/slott-mark-large.png" alt="Slott" className="h-14 w-14" />
        </div>
      </div>

      <div className="relative">
        <h2 className="text-3xl font-bold tracking-tight leading-tight">{tagline}</h2>
        <p className="mt-4 text-white/70 max-w-xs">
          {description ?? 'Registra tu tiempo con un clic. Visualiza, analiza y exporta sin fricción.'}
        </p>
      </div>

      <div className="relative text-sm text-white/50">Tu tiempo, claramente.</div>
    </div>
  );
}
