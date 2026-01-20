// Temporary placeholder components for admin users page during migration to Tailwind CSS
import React, { useState } from 'react';

export const AdminContainer = ({ children }) => (
  <div className="p-6">{children}</div>
);

export const AdminHeader = ({ children }) => (
  <div className="flex justify-between items-center mb-6">{children}</div>
);

export const AdminTitle = ({ children }) => (
  <h1 className="text-2xl font-bold text-gray-900">{children}</h1>
);

export const AdminActions = ({ children }) => (
  <div className="flex gap-3">{children}</div>
);

export const UserTable = ({ children }) => (
  <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
    {children}
  </div>
);

export const UserFilters = ({ children }) => (
  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
    {children}
  </div>
);

export const FilterRow = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">{children}</div>
);

export const ActionCell = ({ children }) => (
  <div className="flex gap-2">{children}</div>
);

export const StatusBadge = ({ children, status }) => {
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800'
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
      {children}
    </span>
  );
};

export const RoleBadge = ({ children, role }) => {
  const roleColors = {
    admin: 'bg-purple-100 text-purple-800',
    user: 'bg-blue-100 text-blue-800',
    moderator: 'bg-indigo-100 text-indigo-800'
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors[role] || 'bg-gray-100 text-gray-800'}`}>
      {children}
    </span>
  );
};

export const Pagination = ({ children }) => (
  <div className="flex justify-between items-center p-6 border-t border-gray-200">
    {children}
  </div>
);

export const PaginationInfo = ({ children }) => (
  <div className="text-sm text-gray-500">{children}</div>
);

export const PaginationControls = ({ children }) => (
  <div className="flex items-center gap-2">{children}</div>
);

// Additional missing components for ManageUsers
export const PageContainer = ({ children }) => (
  <div className="p-6">{children}</div>
);

export const PageHeader = ({ children }) => (
  <div className="mb-6">{children}</div>
);

export const PageTitle = ({ children }) => (
  <h1 className="text-2xl font-bold text-gray-900 mb-2">{children}</h1>
);

export const PageSubtitle = ({ children }) => (
  <p className="text-gray-600">{children}</p>
);

export const StatsGrid = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    {children}
  </div>
);

export const StatCard = ({ children }) => (
  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex items-center">
    {children}
  </div>
);

export const Card = ({ children }) => (
  <div className="bg-white rounded-lg shadow-sm">
    {children}
  </div>
);

export const CardHeader = ({ children }) => (
  <div className="mb-4">{children}</div>
);

export const CardTitle = ({ children }) => (
  <h3 className="text-lg font-semibold text-gray-900">{children}</h3>
);

export const CardContent = ({ children }) => (
  <div>{children}</div>
);

export const TableContainer = ({ children }) => (
  <div className="bg-white border border-gray-200 shadow-sm" style={{ position: 'relative', overflow: 'visible', zIndex: 1 }}>
    <div className="overflow-x-auto" style={{ position: 'relative' }}>
      {children}
    </div>
  </div>
);

export const Table = ({ children }) => (
  <table className="w-full min-w-full divide-y divide-gray-200">{children}</table>
);

export const Th = ({ children }) => (
  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
    {children}
  </th>
);

export const Td = ({ children }) => (
  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
    {children}
  </td>
);

export const LoadingState = ({ children }) => (
  <div className="text-center py-12 text-gray-500">
    {children || 'Loading...'}
  </div>
);

export const PaginationContainer = ({ children }) => (
  <div className="flex justify-between items-center p-4 border-t border-gray-200 bg-gray-50">
    {children}
  </div>
);

export const PaginationButton = ({ children, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center justify-center w-8 h-8 border rounded-md text-sm font-medium transition-colors ${
      disabled 
        ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' 
        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
    }`}
  >
    {children}
  </button>
);

export const PageNumber = ({ children, current, onClick }) => (
  <span
    className={`flex items-center justify-center min-w-8 h-8 px-2 border rounded-md text-sm font-medium ${
      current
        ? 'bg-blue-600 text-white border-blue-600'
        : 'bg-white text-gray-700 border-gray-300'
    }`}
  >
    {children}
  </span>
);

// Dropdown components with improved positioning and visibility
export const ActionDropdown = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  React.useEffect(() => {
    const handleClickOutside = () => setIsOpen(false);
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div 
      className="relative inline-block text-left" 
      style={{ 
        position: 'relative',
        display: 'inline-block'
      }}
    >
      {React.Children.map(children, child => 
        React.cloneElement(child, { isOpen, setIsOpen })
      )}
    </div>
  );
};

export const DropdownButton = ({ children, isOpen, setIsOpen }) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      setIsOpen(!isOpen);
    }}
    className="inline-flex justify-center items-center w-8 h-8 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
  >
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
    </svg>
  </button>
);

export const DropdownMenu = ({ children, isOpen }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="absolute right-0 top-8 w-48 rounded-lg shadow-xl border border-gray-300 z-[9999] bg-white"
      onClick={(e) => e.stopPropagation()}
      style={{
        zIndex: 9999,
        position: 'absolute',
        left: 0,
        top: '100%',
        marginTop: '4px',
        backgroundColor: 'white',
        opacity: 1,
        boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      }}
    >
      <div className="py-1 bg-white">
        {children}
      </div>
    </div>
  );
};

export const DropdownItem = ({ children, onClick, icon }) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      onClick?.(e);
    }}
    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition-colors"
  >
    {icon && <span className="text-base">{icon}</span>}
    <span>{children}</span>
  </button>
);