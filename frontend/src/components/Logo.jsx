import React from 'react';

const Logo = ({ 
  size = 'medium', 
  variant = 'sidebar', 
  className = '',
  showText = false,
  ...props 
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'h-6 w-auto';
      case 'medium':
        return 'h-8 w-auto';
      case 'large':
        return 'h-16 w-auto';
      case 'xl':
        return 'h-20 w-auto';
      default:
        return 'h-8 w-auto';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'sidebar':
        return 'text-brand-600';
      case 'auth':
        return 'mx-auto mb-6';
      case 'header':
        return 'text-brand-600';
      default:
        return 'text-brand-600';
    }
  };

  const containerClasses = `${getVariantClasses()} ${className}`;

  if (showText) {
    const textSizeClasses = {
      small: 'text-base font-bold',
      medium: 'text-xl font-bold', 
      large: 'text-3xl font-bold',
      xl: 'text-4xl font-bold'
    };

    return (
      <h1 className={`${textSizeClasses[size]} ${containerClasses} m-0`} {...props}>
        SubSync
      </h1>
    );
  }

  return (
    <div className={containerClasses} {...props}>
      <img 
        src="/subsync_logo.svg" 
        alt="SubSync"
        className={getSizeClasses()}
      />
    </div>
  );
};

export default Logo;