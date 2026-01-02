import React, { useState } from 'react';
import { useAdminSubscriptions, useDeleteAdminSubscription } from '../hooks/useApi';
import { useAuth } from '../contexts/AuthContext';
import { useUsers } from '../contexts/UsersContext';
import CreateSubscriptionForm from '../components/CreateSubscriptionForm';
import ViewSubscriptionDetails from '../components/ViewSubscriptionDetails';
import SubscriptionsPageHeader from '../components/subscription/PageHeader';
import StatsSection from '../components/subscription/StatsSection';
import FiltersSection from '../components/subscription/FiltersSection';
import SubscriptionsTableComponent from '../components/subscription/SubscriptionsTable';
import { StatusBadge, CategoryBadge, ActionButtons, ActionButton } from '../components/subscription/CellRenderers';
import { getSubscriptionStatsCards, getSubscriptionFilters, getSubscriptionTableConfig } from '../utils/adminHelpers';

const PageContainer = ({ children }) => (
  <div className="max-w-7xl mx-auto p-6">{children}</div>
);

function SubscriptionsPage() {
  const { user } = useAuth();
  const { usersData } = useUsers(); // Use context instead of hook
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    shared: '',
    owner_type: '',
    search: ''
  });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [viewingSubscription, setViewingSubscription] = useState(null);

  const pageSize = 20;
  
  const { data: subscriptionsData, isLoading, refetch } = useAdminSubscriptions(
    currentPage, 
    pageSize, 
    Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ''))
  );
  
  const deleteSubscriptionMutation = useDeleteAdminSubscription();

  // Debug: Log the subscriptions data
  console.log('Subscriptions data:', subscriptionsData);
  console.log('Is loading:', isLoading);
  console.log('User role:', user?.role);

  const categoryIcons = {
    'OTT': '📺',
    'Mobile': '📱',
    'Broadband': '🌐'
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleView = (subscriptionId) => {
    setViewingSubscription(subscriptionId);
  };

  const handleEdit = (subscription) => {
    setEditingSubscription(subscription);
  };

  const handleDelete = async (id, serviceName) => {
    if (window.confirm(`Are you sure you want to delete "${serviceName}"? This action cannot be undone.`)) {
      try {
        await deleteSubscriptionMutation.mutateAsync(id);
        refetch();
      } catch (error) {
        console.error('Error deleting subscription:', error);
      }
    }
  };

  // Get data objects from helper functions
  const statsCards = getSubscriptionStatsCards(subscriptionsData, formatCurrency, user?.role);
  const filterConfig = getSubscriptionFilters(user?.role);
  const tableConfig = getSubscriptionTableConfig(formatCurrency, formatDate, categoryIcons, handleView, handleEdit, handleDelete, user?.role);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      status: '',
      shared: '',
      owner_type: '',
      search: ''
    });
    setCurrentPage(1);
  };

  const renderCellValue = (subscription, column) => {
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

  return (
    <PageContainer>
      <SubscriptionsPageHeader 
        onCreateClick={() => setShowCreateForm(true)}
        showCreateButton={user?.role === 'admin'}
      />

      <StatsSection 
        dashboardData={null}
        statsCards={statsCards}
      />

      <FiltersSection
        filterConfig={filterConfig}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
      />

      <SubscriptionsTableComponent
        subscriptionsData={subscriptionsData}
        isLoading={isLoading}
        tableConfig={tableConfig}
        renderCellValue={renderCellValue}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onCreateClick={() => setShowCreateForm(true)}
        showCreateButton={user?.role === 'admin'}
      />

      {/* Modals */}
      <CreateSubscriptionForm
        isOpen={showCreateForm || !!editingSubscription}
        onClose={() => {
          setShowCreateForm(false);
          setEditingSubscription(null);
        }}
        subscription={editingSubscription}
        onSuccess={() => {
          setShowCreateForm(false);
          setEditingSubscription(null);
          refetch();
        }}
        usersData={usersData}
      />

      <ViewSubscriptionDetails
        subscriptionId={viewingSubscription}
        isOpen={!!viewingSubscription}
        onClose={() => setViewingSubscription(null)}
        onEdit={(subscription) => {
          setViewingSubscription(null);
          setEditingSubscription(subscription);
        }}
        usersData={usersData}
      />
    </PageContainer>
  );
}

export default SubscriptionsPage;