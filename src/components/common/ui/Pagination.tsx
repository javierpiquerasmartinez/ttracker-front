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

  const btnBase = 'px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors';
  const btnActive = 'px-3 py-1.5 text-sm border border-brand-500 bg-brand-500 text-white rounded-lg cursor-default';

  return (
    <div className="flex items-center justify-between mt-4">
      <span className="text-sm text-gray-500">
        Total: {total} registros
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
            <span key={`ellipsis-${i}`} className="px-2 py-1.5 text-sm text-gray-400">
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
          )
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
