interface EmptyStateProps {
  title: string;
  description?: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-6">
      <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 ring-1 ring-slate-200/80 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6 text-slate-400"
        >
          <path d="M12 6v6l4 2" />
          <circle cx="12" cy="12" r="9" />
        </svg>
      </div>
      <p className="text-sm font-semibold text-slate-700 mb-1">{title}</p>
      {description && <p className="text-sm text-slate-400">{description}</p>}
    </div>
  );
}
