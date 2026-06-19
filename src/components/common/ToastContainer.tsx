import { useToast } from '../../context/ToastContext';

const icons: Record<string, string> = {
  success: '✓',
  error: '✕',
  info: 'i',
};

const styles: Record<string, string> = {
  success: 'bg-green-600',
  error: 'bg-red-600',
  info: 'bg-brand-600',
};

export function ToastContainer() {
  const { toasts } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-pop text-white text-sm max-w-sm animate-in fade-in slide-in-from-top-2 duration-200 ${styles[toast.type] ?? styles.info}`}
        >
          <span className="flex items-center justify-center h-5 w-5 rounded-full bg-white/20 text-xs font-bold shrink-0">
            {icons[toast.type] ?? icons.info}
          </span>
          {toast.message}
        </div>
      ))}
    </div>
  );
}
