interface LoadingSpinnerProps {
  centered?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({
  centered = false,
  size = 'md',
  className = '',
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div
      className={`${centered ? 'absolute top-[49%] left-[49%]' : ''} animate-spin rounded-full border-4 border-purple-200 border-t-purple-600 ${sizeClasses[size]} ${className}`}
    />
  );
}
