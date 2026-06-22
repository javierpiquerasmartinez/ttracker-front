import { type ButtonHTMLAttributes, type ReactNode } from 'react';

type Variant = 'primary' | 'success' | 'danger' | 'ghost' | 'outline' | 'dark';
type Size = 'sm' | 'md';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  loading?: boolean;
  children: ReactNode;
}

const variants: Record<Variant, string> = {
  primary:
    'bg-brand-600 text-white hover:bg-brand-700 shadow-xs shadow-brand-600/20 focus-visible:ring-brand-500/40',
  success:
    'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs shadow-emerald-600/20 focus-visible:ring-emerald-500/40',
  danger:
    'bg-rose-600 text-white hover:bg-rose-700 shadow-xs shadow-rose-600/20 focus-visible:ring-rose-500/40',
  dark: 'bg-slate-900 text-white hover:bg-slate-800 shadow-xs focus-visible:ring-slate-500/40',
  ghost: 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus-visible:ring-slate-500/30',
  outline:
    'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 focus-visible:ring-slate-500/30',
};

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-9 px-4 text-sm gap-2',
};

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth,
  loading,
  children,
  className = '',
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-all duration-150 cursor-pointer outline-none focus-visible:ring-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {loading ? (
        <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      ) : (
        children
      )}
    </button>
  );
}
