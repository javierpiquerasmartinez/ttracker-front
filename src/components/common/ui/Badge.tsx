import { type ReactNode } from 'react';

type Tone = 'brand' | 'amber' | 'green' | 'red' | 'gray';

interface BadgeProps {
  tone?: Tone;
  children: ReactNode;
}

const tones: Record<Tone, string> = {
  brand: 'bg-brand-50 text-brand-700 ring-brand-200/60',
  amber: 'bg-amber-50 text-amber-700 ring-amber-200/60',
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-200/60',
  red: 'bg-rose-50 text-rose-700 ring-rose-200/60',
  gray: 'bg-slate-100 text-slate-600 ring-slate-200/60',
};

export function Badge({ tone = 'gray', children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ring-1 ring-inset ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
