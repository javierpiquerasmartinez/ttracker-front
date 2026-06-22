interface PaginationProps {
  page: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, total, limit, onPageChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / limit));

  if (totalPages <= 1) return null;

  const getPages = (): (number | '...')[] => {
    const pages: (number | '...')[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);

    if (page > 3) {
      pages.push('...');
    }

    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (page < totalPages - 2) {
      pages.push('...');
    }

    pages.push(totalPages);

    return pages;
  };

  const btnBase =
    'h-8 min-w-8 px-2.5 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all duration-150';
  const btnActive =
    'h-8 min-w-8 px-2.5 text-sm border-brand-600 bg-brand-600 text-white rounded-lg cursor-default shadow-xs shadow-brand-600/20';

  return (
    <div className="flex items-center justify-between mt-5">
      <span className="text-sm text-slate-500">
        Total: <span className="font-medium text-slate-700">{total}</span> registros
      </span>
      <div className="flex gap-1 items-center">
        <button
          disabled={page <= 1}
          onClick={() => onPageChange(1)}
          className={btnBase}
          title="Primera página"
        >
          &laquo;
        </button>
        <button
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className={btnBase}
          title="Página anterior"
        >
          &lsaquo;
        </button>

        {getPages().map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} className="px-1.5 text-sm text-slate-400">
              ...
            </span>
          ) : (
            <button
              key={p}
              disabled={p === page}
              onClick={() => onPageChange(p)}
              className={p === page ? btnActive : btnBase}
            >
              {p}
            </button>
          ),
        )}

        <button
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className={btnBase}
          title="Página siguiente"
        >
          &rsaquo;
        </button>
        <button
          disabled={page >= totalPages}
          onClick={() => onPageChange(totalPages)}
          className={btnBase}
          title="Última página"
        >
          &raquo;
        </button>
      </div>
    </div>
  );
}
