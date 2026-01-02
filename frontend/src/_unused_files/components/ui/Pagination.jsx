import React from 'react';
import { cx } from '@/utils/cx';

export const PaginationPageMinimalCenter = ({ 
  page = 1, 
  total = 1, 
  className,
  onPageChange = () => {},
  ...props 
}) => {
  return (
    <div 
      className={cx(
        'flex items-center justify-center gap-2',
        className
      )}
      {...props}
    >
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      
      <span className="text-sm text-gray-700">
        Page {page} of {total}
      </span>
      
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= total}
        className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
};