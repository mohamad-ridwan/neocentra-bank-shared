import React from 'react';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={twMerge(
          "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 active:scale-98 disabled:opacity-50 disabled:pointer-events-none",
          // Variants
          variant === 'primary' && "bg-gradient-to-r from-teal-500 to-indigo-500 text-white hover:from-teal-600 hover:to-indigo-600 shadow-md shadow-indigo-500/10 focus:ring-teal-500",
          variant === 'secondary' && "bg-slate-800 text-white hover:bg-slate-700 focus:ring-slate-500 border border-slate-700",
          variant === 'outline' && "bg-transparent text-slate-300 border border-slate-800 hover:bg-slate-800 hover:text-white focus:ring-slate-500",
          variant === 'danger' && "bg-red-600/90 text-white hover:bg-red-600 focus:ring-red-500",
          variant === 'ghost' && "bg-transparent text-slate-400 hover:bg-slate-900 hover:text-white",
          // Sizes
          size === 'sm' && "px-3 py-1.5 text-xs",
          size === 'md' && "px-4 py-2 text-sm",
          size === 'lg' && "px-6 py-3 text-base",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
