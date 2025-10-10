import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  children: ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'medium',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-body font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gold-500/50 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary:
      'bg-[var(--color-accent)] text-[var(--color-primary)] hover:bg-gold-500 hover:scale-105 shadow-lg hover:shadow-xl',
    secondary:
      'bg-[var(--color-secondary)] text-[var(--color-background)] hover:bg-gold-600 hover:scale-105 shadow-lg hover:shadow-xl',
    outline:
      'border-2 border-[var(--color-secondary)] text-[var(--color-secondary)] hover:bg-[var(--color-secondary)] hover:text-[var(--color-background)] hover:scale-105',
  };

  const sizeStyles = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg md:px-10 md:py-5 md:text-xl',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

