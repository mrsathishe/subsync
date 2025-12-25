export const getUserCards = (usersData) => [
  {
    icon: "👥",
    color: "#f59e0b",
    value: usersData?.pagination?.totalUsers || 0,
    label: "Total Users"
  }
];

export const getUserTableConfig = (formatDate, formatGender) => ({
  headers: [
    { key: 'actions', label: 'Actions', type: 'actions' },
    { key: 'id', label: 'ID', type: 'text' },
    { key: 'first_name', label: 'First Name', type: 'text' },
    { key: 'last_name', label: 'Last Name', type: 'text' },
    { key: 'email', label: 'Email', type: 'text' },
    { key: 'phone', label: 'Phone', type: 'text' },
    { key: 'is_active', label: 'Status', type: 'badge' },
    { key: 'role', label: 'Role', type: 'role' },
    { key: 'date_of_birth', label: 'Date of Birth', type: 'date' },
    { key: 'gender', label: 'Gender', type: 'gender' }
  ],
  
  formatValue: (userData, column) => {
    switch (column.type) {
      case 'actions':
        return {
          userId: userData.id,
          actions: [
            { 
              label: userData.is_active ? 'Deactivate' : 'Activate', 
              action: 'toggle-status', 
              icon: userData.is_active ? '🚫' : '✅' 
            },
            { 
              label: userData.role === 'admin' ? 'Remove Admin' : 'Make as Admin', 
              action: 'toggle-role', 
              icon: userData.role === 'admin' ? '👤' : '👑' 
            }
          ]
        };
      
      case 'text':
        return userData[column.key] || 'N/A';
      
      case 'badge':
        return {
          status: userData.is_active ? 'active' : 'inactive',
          label: userData.is_active ? 'Active' : 'Inactive'
        };
      
      case 'role':
        return {
          role: userData.role,
          label: userData.role
        };
      
      case 'date':
        return formatDate(userData[column.key]);
      
      case 'gender':
        return formatGender(userData[column.key]);
      
      default:
        return userData[column.key] || 'N/A';
    }
  }
});

export const getSubscriptionStatsCards = (dashboardData, formatCurrency) => [
  {
    icon: "📊",
    value: dashboardData?.stats?.total_subscriptions || 0,
    label: "Total Subscriptions"
  },
  {
    icon: "✅",
    value: dashboardData?.stats?.active_subscriptions || 0,
    label: "Active"
  },
  {
    icon: "⏰",
    value: dashboardData?.stats?.expired_subscriptions || 0,
    label: "Expired"
  },
  {
    icon: "🤝",
    value: dashboardData?.stats?.shared_subscriptions || 0,
    label: "Shared"
  },
  {
    icon: "💰",
    value: formatCurrency ? formatCurrency(dashboardData?.stats?.total_amount || 0) : `₹${Number(dashboardData?.stats?.total_amount || 0).toFixed(2)}`,
    label: "Total Amount"
  }
];

export const getSubscriptionFilters = () => [
  {
    key: 'search',
    label: 'Search',
    type: 'input',
    placeholder: 'Service name, username, or comments...'
  },
  {
    key: 'category',
    label: 'Category',
    type: 'select',
    options: [
      { value: '', label: 'All Categories' },
      { value: 'OTT', label: '📺 OTT' },
      { value: 'Mobile', label: '📱 Mobile' },
      { value: 'Broadband', label: '🌐 Broadband' }
    ]
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: '', label: 'All Status' },
      { value: 'active', label: 'Active' },
      { value: 'expired', label: 'Expired' },
      { value: 'cancelled', label: 'Cancelled' },
      { value: 'paused', label: 'Paused' }
    ]
  },
  {
    key: 'owner_type',
    label: 'Owner',
    type: 'select',
    options: [
      { value: '', label: 'All Owners' },
      { value: 'Me', label: 'Me' },
      { value: 'Friend', label: 'Friend' },
      { value: 'Mom', label: 'Mom' },
      { value: 'Dad', label: 'Dad' },
      { value: 'Wife', label: 'Wife' },
      { value: 'Sister', label: 'Sister' },
      { value: 'Other', label: 'Other' }
    ]
  },
  {
    key: 'shared',
    label: 'Sharing',
    type: 'select',
    options: [
      { value: '', label: 'All' },
      { value: 'true', label: 'Shared' },
      { value: 'false', label: 'Not Shared' }
    ]
  }
];

export const getSubscriptionTableConfig = (formatCurrency, formatDate, categoryIcons, handleView, handleEdit, handleDelete) => ({
  headers: [
    { key: 'service', label: 'Service', type: 'service' },
    { key: 'category', label: 'Category', type: 'category' },
    { key: 'owner_type', label: 'Owner', type: 'text' },
    { key: 'amount', label: 'Amount', type: 'currency' },
    { key: 'status', label: 'Status', type: 'status' },
    { key: 'end_date', label: 'End Date', type: 'date' },
    { key: 'shared', label: 'Shared', type: 'shared' },
    { key: 'actions', label: 'Actions', type: 'actions' }
  ],
  
  formatValue: (subscription, column) => {
    switch (column.type) {
      case 'service':
        return {
          name: subscription.service_name,
          username: subscription.login_username_phone
        };
      
      case 'category':
        return {
          category: subscription.category,
          icon: categoryIcons[subscription.category]
        };
      
      case 'text':
        return subscription[column.key] || 'N/A';
      
      case 'currency':
        return formatCurrency(subscription.amount);
      
      case 'status':
        return {
          status: subscription.status,
          label: subscription.status
        };
      
      case 'date':
        return formatDate(subscription[column.key]);
      
      case 'shared':
        return {
          shared: subscription.shared,
          totalUsers: subscription.total_shared_users
        };
      
      case 'actions':
        return {
          subscriptionId: subscription.id,
          serviceName: subscription.service_name,
          actions: [
            { 
              label: '👁️ View', 
              variant: 'view',
              onClick: () => handleView(subscription.id)
            },
            { 
              label: '✏️ Edit', 
              variant: 'edit',
              onClick: () => handleEdit(subscription)
            },
            { 
              label: '🗑️ Delete', 
              variant: 'delete',
              onClick: () => handleDelete(subscription.id, subscription.service_name)
            }
          ]
        };
      
      default:
        return subscription[column.key] || 'N/A';
    }
  }
});