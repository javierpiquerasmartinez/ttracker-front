import { type HTMLAttributes, type ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ children, className = '', ...rest }: CardProps) {
  return (
    <div
      {...rest}
      className={`bg-white rounded-xl border border-gray-200 shadow-card ${className}`}
    >
      {children}
    </div>
  );
}
