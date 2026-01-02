import React from 'react';
import { cx } from '@/utils/cx';

const avatarSizes = {
  xs: 'h-6 w-6 text-xs',
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-base',
  lg: 'h-12 w-12 text-lg',
  xl: 'h-14 w-14 text-xl',
};

export const Avatar = ({ 
  src, 
  alt = '', 
  size = 'md', 
  className,
  children,
  ...props 
}) => {
  const initials = alt ? alt.split(' ').map(n => n[0]).join('').toUpperCase() : '';

  return (
    <div 
      className={cx(
        'inline-flex items-center justify-center rounded-full bg-gray-100 font-medium text-gray-500 overflow-hidden',
        avatarSizes[size],
        className
      )}
      {...props}
    >
      {src ? (
        <img 
          src={src} 
          alt={alt}
          className="h-full w-full object-cover"
        />
      ) : (
        children || initials
      )}
    </div>
  );
};