import React, { useMemo, useState } from 'react';
import { Edit01, Trash01 } from '@untitledui/icons';
import { Collection, Table as AriaTable, TableBody, TableHeader, Column, Row, Cell } from 'react-aria-components';
import { cx } from '@/utils/cx';

// Table Card Component
export const TableCard = {
  Root: ({ children, size = 'md' }) => (
    <div className={cx(
      'bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden',
      size === 'sm' ? 'text-sm' : 'text-base'
    )}>
      {children}
    </div>
  ),
  
  Header: ({ title, badge, contentTrailing }) => (
    <div className="relative px-4 py-5 md:px-6">
      <div className="flex items-center gap-3">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {badge && (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            {badge}
          </span>
        )}
      </div>
      {contentTrailing}
    </div>
  )
};

// Table Components
export const Table = ({ children, sortDescriptor, onSortChange, ...props }) => (
  <AriaTable 
    className="w-full"
    sortDescriptor={sortDescriptor}
    onSortChange={onSortChange}
    {...props}
  >
    {children}
  </AriaTable>
);

Table.Header = ({ children }) => (
  <TableHeader className="bg-gray-50 border-b border-gray-200">
    {children}
  </TableHeader>
);

Table.Head = ({ children, label, allowsSorting, isRowHeader, tooltip, className, ...props }) => (
  <Column 
    isRowHeader={isRowHeader}
    allowsSorting={allowsSorting}
    className={cx(
      'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100',
      className
    )}
    {...props}
  >
    {({ allowsSorting, sortDirection }) => (
      <div className="flex items-center gap-2">
        {label || children}
        {allowsSorting && (
          <span className="text-gray-400">
            {sortDirection === 'ascending' ? '↑' : sortDirection === 'descending' ? '↓' : '↕'}
          </span>
        )}
        {tooltip && (
          <span className="text-gray-400" title={tooltip}>?</span>
        )}
      </div>
    )}
  </Column>
);

Table.Body = ({ children, items }) => (
  <TableBody className="divide-y divide-gray-200">
    <Collection items={items}>
      {children}
    </Collection>
  </TableBody>
);

Table.Row = ({ children, ...props }) => (
  <Row className="hover:bg-gray-50 transition-colors" {...props}>
    {children}
  </Row>
);

Table.Cell = ({ children, className, ...props }) => (
  <Cell className={cx('px-6 py-4 text-sm text-gray-900', className)} {...props}>
    {children}
  </Cell>
);

// Action Dropdown Component
export const TableRowActionsDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex justify-center items-center p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
      >
        <span className="sr-only">Open options</span>
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1">
            <button
              onClick={() => {
                console.log('Edit action');
                setIsOpen(false);
              }}
              className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              <Edit01 className="mr-3 h-4 w-4 text-gray-400 group-hover:text-gray-500" />
              Edit
            </button>
            <button
              onClick={() => {
                console.log('Delete action');
                setIsOpen(false);
              }}
              className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              <Trash01 className="mr-3 h-4 w-4 text-gray-400 group-hover:text-gray-500" />
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};