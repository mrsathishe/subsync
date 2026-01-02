import React from 'react';
import { Button as AriaButton } from 'react-aria-components';
import { cx } from '@/utils/cx';

const buttonSizes = {
  xs: 'p-1.5 text-xs',
  sm: 'p-2 text-sm',
  md: 'p-2.5 text-sm',
  lg: 'p-3 text-base',
};

const buttonColors = {
  primary: 'text-white bg-brand-600 hover:bg-brand-700 border-brand-600',
  secondary: 'text-gray-700 bg-white hover:bg-gray-50 border-gray-300',
  tertiary: 'text-gray-500 bg-transparent hover:text-gray-700 hover:bg-gray-100 border-transparent',
  danger: 'text-white bg-red-600 hover:bg-red-700 border-red-600',
};

export const ButtonUtility = ({ 
  children,
  icon: Icon,
  size = 'md',
  color = 'secondary',
  tooltip,
  className,
  ...props 
}) => {
  const button = (
    <AriaButton
      className={cx(
        'inline-flex items-center justify-center rounded-md border font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        buttonSizes[size],
        buttonColors[color],
        className
      )}
      {...props}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {children}
    </AriaButton>
  );

  if (tooltip) {
    return (
      <span title={tooltip}>
        {button}
      </span>
    );
  }

  return button;
};