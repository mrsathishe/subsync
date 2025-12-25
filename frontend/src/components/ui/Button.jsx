import React from 'react';
import { Button as AriaButton } from 'react-aria-components';
import { cx } from '@/utils/cx';

const buttonStyles = {
  base: "inline-flex items-center justify-center gap-2 rounded-md border font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  sizes: {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
  },
  variants: {
    primary: "bg-brand-600 text-white border-brand-600 hover:bg-brand-700 hover:border-brand-700",
    secondary: "bg-gray-50 text-gray-900 border-gray-300 hover:bg-gray-100",
    destructive: "bg-error-600 text-white border-error-600 hover:bg-error-700 hover:border-error-700",
    outline: "bg-transparent text-gray-700 border-gray-300 hover:bg-gray-50",
    ghost: "bg-transparent text-gray-700 border-transparent hover:bg-gray-100",
  }
};

export function Button({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  children, 
  ...props 
}) {
  return (
    <AriaButton
      className={cx(
        buttonStyles.base,
        buttonStyles.sizes[size],
        buttonStyles.variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </AriaButton>
  );
}