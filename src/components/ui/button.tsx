import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', children, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed shadow-sm';
    
    const variantClasses = {
      default: 'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 shadow-indigo-100 hover:shadow-indigo-200',
      destructive: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-red-100 hover:shadow-red-200',
      outline: 'border-2 border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-indigo-400 active:bg-slate-100',
      secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200 active:bg-slate-300 shadow-slate-100 hover:shadow-slate-200',
      ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200',
      link: 'text-indigo-600 underline-offset-4 hover:text-indigo-700 hover:underline'
    };
    
    const sizeClasses = {
      default: 'h-11 py-2.5 px-6',
      sm: 'h-9 px-4 py-2',
      lg: 'h-12 px-8 py-3 text-base',
      icon: 'h-11 w-11 p-0'
    };
    
    const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className || ''}`;
    
    return (
      <button className={classes} ref={ref} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button; 