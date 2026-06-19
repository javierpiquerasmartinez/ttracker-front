interface EmptyStateProps {
  title: string;
  description?: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="text-center py-16 text-gray-500">
      <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl text-gray-400">
        ·
      </div>
      <p className="text-base font-medium text-gray-600 mb-1">{title}</p>
      {description && <p className="text-sm text-gray-400">{description}</p>}
    </div>
  );
}
