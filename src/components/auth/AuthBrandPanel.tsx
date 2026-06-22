interface AuthBrandPanelProps {
  tagline: string;
  description?: string;
}

export function AuthBrandPanel({ tagline, description }: AuthBrandPanelProps) {
  return (
    <div className="hidden md:flex flex-col justify-between bg-slate-950 p-12 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-950/50 via-slate-950 to-brand-900/20" />
      <div className="absolute -top-32 -right-24 h-80 w-80 rounded-full bg-brand-600/25 blur-3xl" />
      <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-brand-500/15 blur-3xl" />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative">
        <div className="inline-flex items-center justify-center bg-white rounded-2xl p-3 shadow-lg">
          <img src="/slott-mark-large.png" alt="Slott" className="h-11 w-11" />
        </div>
      </div>

      <div className="relative">
        <h2 className="text-[2rem] font-bold tracking-tight leading-[1.15]">{tagline}</h2>
        <p className="mt-4 text-slate-400 max-w-xs leading-relaxed">
          {description ?? 'Registra tu tiempo con un clic. Visualiza, analiza y exporta sin fricción.'}
        </p>
      </div>

      <div className="relative text-sm text-slate-600">Tu tiempo, claramente.</div>
    </div>
  );
}
