import React from 'react';

const PageContainer = ({ children }) => (
  <div className="max-w-7xl mx-auto p-6">{children}</div>
);

const PageHeader = ({ children }) => (
  <div className="mb-8 flex justify-between items-center flex-wrap gap-4">
    {children}
  </div>
);

const PageTitle = ({ children }) => (
  <h1 className="text-3xl font-bold text-gray-900 m-0">{children}</h1>
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

const SubscriptionsPageHeader = ({ onCreateClick, showCreateButton = true }) => {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Subscription Management</PageTitle>
        {showCreateButton && (
          <Button 
            variant="primary" 
            onClick={onCreateClick}
          >
            Create Subscription
          </Button>
        )}
      </PageHeader>
    </PageContainer>
  );
};

export default SubscriptionsPageHeader;