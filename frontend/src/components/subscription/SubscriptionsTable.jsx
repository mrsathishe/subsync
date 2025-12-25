import React from 'react';

const SubscriptionsTable = ({ children }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    {children}
  </div>
);

const TableHeader = ({ children }) => (
  <div className="bg-gray-50 p-6 border-b border-gray-200 flex justify-between items-center">
    {children}
  </div>
);

const TableTitle = ({ children }) => (
  <h2 className="text-xl font-semibold text-gray-900 m-0">{children}</h2>
);

const Table = ({ children }) => (
  <table className="w-full border-collapse">{children}</table>
);

const TableHead = ({ children }) => (
  <thead className="bg-gray-50">{children}</thead>
);

const TableRow = ({ children }) => (
  <tr className="hover:bg-gray-25 transition-colors">{children}</tr>
);

const TableHeader2 = ({ children }) => (
  <th className="p-4 text-left font-semibold text-gray-700 border-b border-gray-200 text-sm">
    {children}
  </th>
);

const TableCell = ({ children }) => (
  <td className="p-4 border-b border-gray-100 text-sm align-middle">
    {children}
  </td>
);

const StatusBadge = ({ children, status }) => {
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

const CategoryBadge = ({ children, category }) => {
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

const ActionButtons = ({ children }) => (
  <div className="flex gap-2">{children}</div>
);

const ActionButton = ({ children, variant, ...props }) => {
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

const Pagination = ({ children }) => (
  <div className="flex justify-between items-center p-6 border-t border-gray-200">
    {children}
  </div>
);

const PaginationInfo = ({ children }) => (
  <div className="text-gray-600 text-sm">{children}</div>
);

const PaginationButtons = ({ children }) => (
  <div className="flex gap-2 ml-auto">{children}</div>
);

const Button = ({ children, variant = 'primary', disabled, ...props }) => {
  const baseClasses = "px-4 py-2 rounded-md text-sm font-semibold cursor-pointer transition-all border-none disabled:opacity-60 disabled:cursor-not-allowed";
  
  const variantClasses = {
    primary: "bg-brand-600 text-white hover:bg-brand-700",
    secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50",
    danger: "bg-red-600 text-white hover:bg-red-700"
  };

  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

const LoadingState = ({ children }) => (
  <div className="flex items-center justify-center p-8 text-gray-500">
    {children}
  </div>
);

const EmptyState = ({ children }) => (
  <div className="text-center p-8 text-gray-500">{children}</div>
);

const SubscriptionsTableComponent = ({ 
  subscriptionsData, 
  isLoading, 
  tableConfig, 
  renderCellValue,
  currentPage,
  pageSize,
  onPageChange,
  onCreateClick,
  showCreateButton = true
}) => {
  return (
    <SubscriptionsTable>
      <TableHeader>
        <TableTitle>All Subscriptions</TableTitle>
        <div className="text-gray-600 text-sm">
          {subscriptionsData?.pagination.totalSubscriptions || 0} total
        </div>
      </TableHeader>

      {isLoading ? (
        <LoadingState>Loading subscriptions...</LoadingState>
      ) : subscriptionsData?.subscriptions.length > 0 ? (
        <>
          <Table>
            <TableHead>
              <tr>
                {tableConfig.headers.map((column) => (
                  <TableHeader2 key={column.key}>{column.label}</TableHeader2>
                ))}
              </tr>
            </TableHead>
            <tbody>
              {subscriptionsData.subscriptions.map((subscription) => (
                <TableRow key={subscription.id}>
                  {tableConfig.headers.map((column) => (
                    <TableCell key={column.key}>
                      {renderCellValue(subscription, column)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </tbody>
          </Table>

          {/* Pagination */}
          <Pagination>
            <PaginationInfo>
              Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, subscriptionsData.pagination.totalSubscriptions)} of {subscriptionsData.pagination.totalSubscriptions} results
            </PaginationInfo>
            
            <PaginationButtons>
              <Button
                variant="secondary"
                disabled={currentPage <= 1}
                onClick={() => onPageChange(currentPage - 1)}
              >
                &lt;
              </Button>
              <span className="px-3 py-2 text-sm text-gray-600">
                {currentPage} of {subscriptionsData.pagination.totalPages}
              </span>
              <Button
                variant="secondary"
                disabled={currentPage >= subscriptionsData.pagination.totalPages}
                onClick={() => onPageChange(currentPage + 1)}
              >
                &gt;
              </Button>
            </PaginationButtons>
          </Pagination>
        </>
      ) : (
        <EmptyState>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No subscriptions found</h3>
          <p className="text-gray-600 mb-4">
            {showCreateButton 
              ? "Try adjusting your filters or create a new subscription." 
              : "Try adjusting your filters."}
          </p>
          {showCreateButton && (
            <Button 
              variant="primary" 
              onClick={onCreateClick}
            >
              Create First Subscription
            </Button>
          )}
        </EmptyState>
      )}
    </SubscriptionsTable>
  );
};

export default SubscriptionsTableComponent;