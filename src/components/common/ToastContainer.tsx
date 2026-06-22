import { useToast } from '../../context/ToastContext';

const icons: Record<string, React.ReactNode> = {
  success: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
      <path fillRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-8 8a1 1 0 01-1.4 0l-4-4a1 1 0 011.4-1.4L8 12.6l7.3-7.3a1 1 0 011.4 0z" clipRule="evenodd" />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
      <path fillRule="evenodd" d="M5.3 5.3a1 1 0 011.4 0L10 8.6l3.3-3.3a1 1 0 111.4 1.4L11.4 10l3.3 3.3a1 1 0 01-1.4 1.4L10 11.4l-3.3 3.3a1 1 0 01-1.4-1.4L8.6 10 5.3 6.7a1 1 0 010-1.4z" clipRule="evenodd" />
    </svg>
  ),
  info: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-12a1 1 0 100 2 1 1 0 000-2zm-1 4a1 1 0 011-1h.01a1 1 0 011 1v3a1 1 0 11-2 0V10z" clipRule="evenodd" />
    </svg>
  ),
};

const styles: Record<string, string> = {
  success: 'bg-emerald-600',
  error: 'bg-rose-600',
  info: 'bg-brand-600',
};

export function ToastContainer() {
  const { toasts } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-2.5 pl-2.5 pr-4 py-2 rounded-xl shadow-lg text-white text-sm max-w-sm animate-slide-in-top ring-1 ring-white/10 ${styles[toast.type] ?? styles.info}`}
        >
          <span className="flex items-center justify-center h-6 w-6 rounded-lg bg-white/15 shrink-0">
            {icons[toast.type] ?? icons.info}
          </span>
          {toast.message}
        </div>
      ))}
    </div>
  );
}
