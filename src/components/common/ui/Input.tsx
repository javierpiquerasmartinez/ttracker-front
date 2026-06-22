import { type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes, type ReactNode } from 'react';

const fieldBase =
  'w-full h-9 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-150 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed';

interface FieldProps {
  label?: string;
  error?: string;
  children: ReactNode;
}

export function Field({ label, error, children }: FieldProps) {
  return (
    <div>
      {label && (
        <label className="block text-xs font-medium text-slate-600 mb-1.5 tracking-wide">
          {label}
        </label>
      )}
      {children}
      {error && <p className="mt-1.5 text-xs text-rose-600">{error}</p>}
    </div>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className = '', ...rest }: InputProps) {
  const input = <input {...rest} className={`${fieldBase} ${className}`} />;
  if (label) return <Field label={label}>{input}</Field>;
  return input;
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function Textarea({ label, className = '', ...rest }: TextareaProps) {
  const ta = (
    <textarea {...rest} className={`${fieldBase} auto leading-relaxed py-2 resize-none ${className}`} />
  );
  if (label) return <Field label={label}>{ta}</Field>;
  return ta;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export function Select({ label, className = '', children, ...rest }: SelectProps) {
  const sel = (
    <select
      {...rest}
      className={`${fieldBase} cursor-pointer appearance-none bg-[length:16px] bg-[right_0.5rem_center] bg-no-repeat pr-8 ${className}`}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%2394a3b8'%3E%3Cpath fill-rule='evenodd' d='M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z' clip-rule='evenodd'/%3E%3C/svg%3E\")",
      }}
    >
      {children}
    </select>
  );
  if (label) return <Field label={label}>{sel}</Field>;
  return sel;
}
