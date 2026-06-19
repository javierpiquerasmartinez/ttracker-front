interface AuthBrandPanelProps {
  tagline: string;
  description?: string;
}

export function AuthBrandPanel({ tagline, description }: AuthBrandPanelProps) {
  return (
    <div className="hidden md:flex flex-col justify-between bg-gray-950 p-12 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-950/40 via-transparent to-brand-900/30" />
      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-brand-600/20 blur-3xl" />
      <div className="absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-brand-500/15 blur-3xl" />

      <div className="relative">
        <div className="inline-flex items-center justify-center bg-white rounded-2xl p-3 shadow-lg">
          <img src="/slott-mark-large.png" alt="Slott" className="h-12 w-12" />
        </div>
      </div>

      <div className="relative">
        <h2 className="text-3xl font-bold tracking-tight leading-tight">{tagline}</h2>
        <p className="mt-4 text-gray-400 max-w-xs leading-relaxed">
          {description ?? 'Registra tu tiempo con un clic. Visualiza, analiza y exporta sin fricción.'}
        </p>
      </div>

      <div className="relative text-sm text-gray-600">Tu tiempo, claramente.</div>
    </div>
  );
}
