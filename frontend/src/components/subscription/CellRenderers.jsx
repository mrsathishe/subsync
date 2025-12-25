import React from 'react';

export const StatusBadge = ({ children, status }) => {
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    expired: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-red-100 text-red-800',
    paused: 'bg-gray-100 text-gray-800'
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
      {children}
    </span>
  );
};

export const CategoryBadge = ({ children, category }) => {
  const categoryColors = {
    OTT: 'bg-amber-100 text-amber-800',
    Mobile: 'bg-blue-100 text-blue-800',
    Broadband: 'bg-green-100 text-green-800'
  };

  return (
    <span className={`px-2 py-1 rounded-md text-xs font-semibold ${categoryColors[category] || 'bg-gray-100 text-gray-800'}`}>
      {children}
    </span>
  );
};

export const ActionButtons = ({ children }) => (
  <div className="flex gap-2">{children}</div>
);

export const ActionButton = ({ children, variant, ...props }) => {
  const variantColors = {
    view: 'bg-brand-100 text-brand-600 hover:bg-brand-200',
    edit: 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200',
    delete: 'bg-red-100 text-red-600 hover:bg-red-200'
  };

  return (
    <button 
      className={`px-2 py-1 border-none rounded-sm text-xs cursor-pointer transition-all ${variantColors[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const renderCellValue = (subscription, column, tableConfig, CategoryBadge, StatusBadge, ActionButtons, ActionButton) => {
  const value = tableConfig.formatValue(subscription, column);
  
  switch (column.type) {
    case 'service':
      return (
        <div>
          <div className="font-semibold">{value.name}</div>
          <div className="text-gray-600 text-xs">{value.username}</div>
        </div>
      );
    
    case 'category':
      return (
        <CategoryBadge category={value.category}>
          {value.icon} {value.category}
        </CategoryBadge>
      );
    
    case 'status':
      return (
        <StatusBadge status={value.status}>
          {value.label}
        </StatusBadge>
      );
    
    case 'shared':
      return value.shared ? (
        <span className="text-green-600 font-semibold">
          Yes ({value.totalUsers})
        </span>
      ) : (
        <span className="text-gray-500">No</span>
      );
    
    case 'actions':
      return (
        <ActionButtons>
          {value.actions.map((action, index) => (
            <ActionButton
              key={index}
              variant={action.variant}
              onClick={action.onClick}
            >
              {action.label}
            </ActionButton>
          ))}
        </ActionButtons>
      );
    
    default:
      return value;
  }
};