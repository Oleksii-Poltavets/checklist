interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'emerald' | 'blue' | 'white' | 'slate';
  className?: string;
}

export default function Spinner({ 
  size = 'md', 
  color = 'emerald',
  className = '' 
}: SpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  };

  const colorClasses = {
    emerald: 'border-emerald-500',
    blue: 'border-blue-500',
    white: 'border-white',
    slate: 'border-slate-400'
  };

  return (
    <div className={`inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] ${sizeClasses[size]} ${colorClasses[color]} ${className}`} role="status">
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Loading...
      </span>
    </div>
  );
}