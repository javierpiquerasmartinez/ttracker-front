import { type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes, type ReactNode } from 'react';

const fieldBase =
  'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed';

interface FieldProps {
  label?: string;
  error?: string;
  children: ReactNode;
}

export function Field({ label, error, children }: FieldProps) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      {children}
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
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
  const ta = <textarea {...rest} className={`${fieldBase} resize-none ${className}`} />;
  if (label) return <Field label={label}>{ta}</Field>;
  return ta;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export function Select({ label, className = '', children, ...rest }: SelectProps) {
  const sel = (
    <select {...rest} className={`${fieldBase} ${className}`}>
      {children}
    </select>
  );
  if (label) return <Field label={label}>{sel}</Field>;
  return sel;
}
