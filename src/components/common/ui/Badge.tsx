import { type ReactNode } from 'react';

type Tone = 'brand' | 'amber' | 'green' | 'red' | 'gray';

interface BadgeProps {
  tone?: Tone;
  children: ReactNode;
}

const tones: Record<Tone, string> = {
  brand: 'bg-brand-100 text-brand-700',
  amber: 'bg-amber-100 text-amber-700',
  green: 'bg-green-100 text-green-700',
  red: 'bg-red-100 text-red-700',
  gray: 'bg-gray-100 text-gray-600',
};

export function Badge({ tone = 'gray', children }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}
