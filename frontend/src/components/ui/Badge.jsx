import React from 'react';
import { cx } from '@/utils/cx';

const badgeColors = {
  gray: 'bg-gray-100 text-gray-800',
  red: 'bg-red-100 text-red-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  green: 'bg-green-100 text-green-800',
  blue: 'bg-blue-100 text-blue-800',
  indigo: 'bg-indigo-100 text-indigo-800',
  purple: 'bg-purple-100 text-purple-800',
  pink: 'bg-pink-100 text-pink-800',
  success: 'bg-green-100 text-green-800',
  error: 'bg-red-100 text-red-800',
  warning: 'bg-yellow-100 text-yellow-800',
  info: 'bg-blue-100 text-blue-800',
};

const badgeSizes = {
  xs: 'px-2 py-0.5 text-xs',
  sm: 'px-2.5 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-3 py-1.5 text-sm',
};

export const Badge = ({ 
  children, 
  color = 'gray', 
  size = 'sm', 
  className,
  ...props 
}) => {
  return (
    <span
      className={cx(
        'inline-flex items-center rounded-full font-medium',
        badgeColors[color],
        badgeSizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export const BadgeWithDot = ({ 
  children, 
  color = 'gray', 
  size = 'sm', 
  className,
  type = 'modern',
  ...props 
}) => {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        badgeColors[color],
        badgeSizes[size],
        className
      )}
      {...props}
    >
      <span
        className={cx(
          'w-1.5 h-1.5 rounded-full',
          color === 'success' ? 'bg-green-600' : 
          color === 'error' ? 'bg-red-600' :
          color === 'warning' ? 'bg-yellow-600' :
          color === 'info' ? 'bg-blue-600' :
          'bg-gray-600'
        )}
      />
      {children}
    </span>
  );
};

export type BadgeColor = keyof typeof badgeColors;