// Temporary placeholder components for pages during migration to Tailwind CSS
import React from 'react';

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

export const PageDescription = ({ children }) => (
  <p className="text-gray-600">{children}</p>
);

export const ContentGrid = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {children}
  </div>
);

export const AlertsGrid = ({ children }) => (
  <div className="grid grid-cols-1 gap-4 mb-6">
    {children}
  </div>
);

export const Card = ({ children }) => (
  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
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

export const StatIcon = ({ children, color }) => (
  <div 
    className="w-12 h-12 rounded-lg flex items-center justify-center mr-4 text-white text-xl"
    style={{ backgroundColor: color }}
  >
    {children}
  </div>
);

export const StatValue = ({ children }) => (
  <div className="flex-1">
    <div className="text-2xl font-bold text-gray-900">{children}</div>
  </div>
);

export const StatLabel = ({ children }) => (
  <div className="text-sm text-gray-500 mt-1">{children}</div>
);

export const EmptyState = ({ children }) => (
  <div className="text-center py-12 text-gray-500">
    {children}
  </div>
);

export const LoadingState = ({ children }) => (
  <div className="text-center py-12 text-gray-500">
    {children || 'Loading...'}
  </div>
);

export const QuickActionsContainer = ({ children }) => (
  <div className="flex gap-4 mb-6">
    {children}
  </div>
);

export const ActionButton = ({ children, onClick, variant = 'primary' }) => {
  const variants = {
    primary: 'bg-brand-600 text-white hover:bg-brand-700',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  };

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md font-medium transition-colors ${variants[variant]}`}
    >
      {children}
    </button>
  );
};

export const FilterSection = ({ children }) => (
  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
    {children}
  </div>
);

export const FilterGrid = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {children}
  </div>
);

export const TableContainer = ({ children }) => (
  <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
    {children}
  </div>
);

export const Table = ({ children }) => (
  <table className="w-full">{children}</table>
);

export const TableHeader = ({ children }) => (
  <thead className="bg-gray-50 border-b border-gray-200">{children}</thead>
);

export const TableBody = ({ children }) => (
  <tbody className="divide-y divide-gray-200">{children}</tbody>
);

export const TableRow = ({ children }) => (
  <tr className="hover:bg-gray-50">{children}</tr>
);

export const TableCell = ({ children }) => (
  <td className="px-6 py-4 text-sm text-gray-900">{children}</td>
);

export const TableHeaderCell = ({ children }) => (
  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    {children}
  </th>
);

// Subscription Card Components
export const SubscriptionItem = ({ children }) => (
  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex justify-between items-center">
    {children}
  </div>
);

export const SubscriptionInfo = ({ children }) => (
  <div className="flex-1">
    {children}
  </div>
);

export const SubscriptionName = ({ children }) => (
  <h3 className="text-lg font-semibold text-gray-900 mb-1">
    {children}
  </h3>
);

export const SubscriptionDetails = ({ children }) => (
  <p className="text-sm text-gray-500">
    {children}
  </p>
);

export const StatusBadge = ({ children, status }) => {
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-red-100 text-red-800',
    expired: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-gray-100 text-gray-800'
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
      {children || status}
    </span>
  );
};

// Alert Notification Components
export const AlertCard = ({ children, variant = 'info' }) => {
  const variantStyles = {
    info: 'bg-blue-50 border-blue-200',
    success: 'bg-green-50 border-green-200',
    warning: 'bg-yellow-50 border-yellow-200',
    error: 'bg-red-50 border-red-200'
  };

  return (
    <div className={`rounded-lg border p-4 ${variantStyles[variant] || variantStyles.info}`}>
      {children}
    </div>
  );
};

export const AlertHeader = ({ children }) => (
  <div className="flex items-center mb-2">
    {children}
  </div>
);

export const AlertIcon = ({ children }) => (
  <div className="mr-3 text-lg">
    {children}
  </div>
);

export const AlertTitle = ({ children, variant = 'info' }) => {
  const variantColors = {
    info: 'text-blue-800',
    success: 'text-green-800',
    warning: 'text-yellow-800',
    error: 'text-red-800'
  };

  return (
    <h4 className={`font-medium ${variantColors[variant] || variantColors.info}`}>
      {children}
    </h4>
  );
};

export const AlertContent = ({ children, variant = 'info' }) => {
  const variantColors = {
    info: 'text-blue-700',
    success: 'text-green-700',
    warning: 'text-yellow-700',
    error: 'text-red-700'
  };

  return (
    <div className={`text-sm ${variantColors[variant] || variantColors.info}`}>
      {children}
    </div>
  );
};