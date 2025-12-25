import React from 'react';
import { useAdminSubscription } from '../hooks/useApi';

// Tailwind CSS Components for AdminSubscriptionDetails
const Modal = ({ children, onClick }) => (
  <div 
    onClick={onClick}
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
  >
    {children}
  </div>
);

const ModalContent = ({ children }) => (
  <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
    {children}
  </div>
);

const ModalHeader = ({ children }) => (
  <div className="p-6 border-b border-gray-200 flex justify-between items-center">
    {children}
  </div>
);

const ModalTitle = ({ children }) => (
  <h2 className="text-2xl font-bold text-gray-900 m-0 flex items-center gap-2">
    {children}
  </h2>
);

const CloseButton = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="bg-none border-none text-2xl cursor-pointer text-gray-500 hover:text-gray-700 transition-colors"
  >
    {children}
  </button>
);

const ModalBody = ({ children }) => (
  <div className="p-6">
    {children}
  </div>
);

const DetailGrid = ({ children }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {children}
  </div>
);

const DetailSection = ({ children, className = "" }) => (
  <div className={`bg-gray-50 rounded-lg p-4 border border-gray-200 ${className}`}>
    {children}
  </div>
);

const SectionTitle = ({ children }) => (
  <h3 className="text-lg font-semibold text-gray-800 m-0 mb-4 flex items-center gap-2">
    {children}
  </h3>
);

const DetailRow = ({ children, isLast = false }) => (
  <div className={`flex justify-between items-center py-2 ${!isLast ? 'border-b border-gray-200' : ''}`}>
    {children}
  </div>
);

const DetailLabel = ({ children }) => (
  <span className="font-semibold text-gray-700 text-sm">
    {children}
  </span>
);

const DetailValue = ({ children, highlight = false, style = {} }) => (
  <span 
    style={style}
    className={`text-sm text-right ${
      highlight 
        ? 'bg-blue-100 text-blue-600 px-2 py-1 rounded font-semibold' 
        : 'text-gray-900'
    }`}
  >
    {children}
  </span>
);

const StatusBadge = ({ status, children }) => {
  const getStatusClasses = () => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-600';
      case 'expired':
        return 'bg-yellow-100 text-yellow-600';
      case 'cancelled':
        return 'bg-red-100 text-red-600';
      case 'paused':
        return 'bg-gray-200 text-gray-600';
      default:
        return 'bg-gray-200 text-gray-600';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getStatusClasses()}`}>
      {children}
    </span>
  );
};

const SharingTable = ({ children }) => (
  <table className="w-full border-collapse mt-4">
    {children}
  </table>
);

const TableHeader = ({ children }) => (
  <thead className="bg-gray-100">
    {children}
  </thead>
);

const TableRow = ({ children }) => (
  <tr className="border-b border-gray-200 hover:bg-gray-25 transition-colors">
    {children}
  </tr>
);

const TableCell = ({ children, style = {} }) => (
  <td className="p-3 text-left text-sm" style={style}>
    {children}
  </td>
);

const TableHeaderCell = ({ children }) => (
  <th className="p-3 text-left font-semibold text-gray-700 text-xs uppercase">
    {children}
  </th>
);

const PaymentStatusBadge = ({ status, children }) => {
  const getStatusClasses = () => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-600';
      case 'pending':
        return 'bg-yellow-100 text-yellow-600';
      case 'not_paid':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-200 text-gray-600';
    }
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${getStatusClasses()}`}>
      {children}
    </span>
  );
};

const ModalFooter = ({ children }) => (
  <div className="p-6 border-t border-gray-200 flex justify-end gap-4">
    {children}
  </div>
);

const Button = ({ children, variant, onClick, disabled, ...props }) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60';
      case 'secondary':
        return 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50';
      default:
        return 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60';
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-md text-sm font-semibold cursor-pointer transition-all border-none ${
        getVariantClasses()
      } ${disabled ? 'cursor-not-allowed' : ''}`}
      {...props}
    >
      {children}
    </button>
  );
};

const LoadingState = ({ children }) => (
  <div className="flex items-center justify-center p-6 text-gray-500">
    {children}
  </div>
);

const EmptyState = ({ children }) => (
  <div className="text-center p-4 text-gray-500 italic">
    {children}
  </div>
);

function AdminSubscriptionDetails({ subscriptionId, isOpen, onClose, onEdit }) {
  const { data, isLoading, error } = useAdminSubscription(subscriptionId);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'OTT': return '📺';
      case 'Mobile': return '📱';
      case 'Broadband': return '🌐';
      default: return '📋';
    }
  };

  if (!isOpen) return null;

  return (
    <Modal onClick={(e) => e.target === e.currentTarget && onClose()}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>
            📋 Subscription Details
          </ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        <ModalBody>
          {isLoading ? (
            <LoadingState>Loading subscription details...</LoadingState>
          ) : error ? (
            <EmptyState>Failed to load subscription details</EmptyState>
          ) : data ? (
            <DetailGrid>
              {/* Basic Information */}
              <DetailSection>
                <SectionTitle>
                  {getCategoryIcon(data.subscription?.category)} Basic Information
                </SectionTitle>
                <DetailRow>
                  <DetailLabel>Service Name</DetailLabel>
                  <DetailValue highlight>{data.subscription?.service_name}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Category</DetailLabel>
                  <DetailValue>{data.subscription?.category}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Owner</DetailLabel>
                  <DetailValue>
                    {data.subscription?.owner_type}
                    {data.subscription?.owner_name && ` (${data.subscription.owner_name})`}
                  </DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Status</DetailLabel>
                  <DetailValue>
                    <StatusBadge status={data.subscription?.status}>
                      {data.subscription?.status}
                    </StatusBadge>
                  </DetailValue>
                </DetailRow>
                <DetailRow isLast>
                  <DetailLabel>Created By</DetailLabel>
                  <DetailValue>{data.subscription?.created_by_name}</DetailValue>
                </DetailRow>
              </DetailSection>

              {/* Login Information */}
              <DetailSection>
                <SectionTitle>🔐 Login Information</SectionTitle>
                <DetailRow>
                  <DetailLabel>Login Credential</DetailLabel>
                  <DetailValue>{data.subscription?.login_username_phone}</DetailValue>
                </DetailRow>
                <DetailRow isLast>
                  <DetailLabel>Password Hint</DetailLabel>
                  <DetailValue>{data.subscription?.password_hint || 'Not provided'}</DetailValue>
                </DetailRow>
              </DetailSection>

              {/* Subscription Details */}
              <DetailSection>
                <SectionTitle>📅 Subscription Details</SectionTitle>
                <DetailRow>
                  <DetailLabel>Amount</DetailLabel>
                  <DetailValue highlight>{formatCurrency(data.subscription?.amount)}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Plan Type</DetailLabel>
                  <DetailValue>{data.subscription?.plan_type}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Purchased Date</DetailLabel>
                  <DetailValue>{formatDate(data.subscription?.purchased_date)}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Start Date</DetailLabel>
                  <DetailValue>{formatDate(data.subscription?.start_date)}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>End Date</DetailLabel>
                  <DetailValue>{formatDate(data.subscription?.end_date)}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Purchased Via</DetailLabel>
                  <DetailValue>{data.subscription?.purchased_via}</DetailValue>
                </DetailRow>
                <DetailRow isLast={!data.subscription?.next_purchase_date}>
                  <DetailLabel>Auto Pay</DetailLabel>
                  <DetailValue>{data.subscription?.auto_pay ? '✅ Enabled' : '❌ Disabled'}</DetailValue>
                </DetailRow>
                {data.subscription?.next_purchase_date && (
                  <DetailRow isLast>
                    <DetailLabel>Next Purchase</DetailLabel>
                    <DetailValue>{formatDate(data.subscription?.next_purchase_date)}</DetailValue>
                  </DetailRow>
                )}
              </DetailSection>

              {/* Device & Usage */}
              <DetailSection>
                <SectionTitle>📱 Device & Usage</SectionTitle>
                <DetailRow>
                  <DetailLabel>Device Limit</DetailLabel>
                  <DetailValue>{data.subscription?.device_limit}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Devices in Use</DetailLabel>
                  <DetailValue>{data.subscription?.devices_in_use}</DetailValue>
                </DetailRow>
                <DetailRow isLast={!data.subscription?.ids_using?.length && !data.subscription?.comments}>
                  <DetailLabel>Available Devices</DetailLabel>
                  <DetailValue>
                    {data.subscription?.device_limit - data.subscription?.devices_in_use}
                  </DetailValue>
                </DetailRow>
                {data.subscription?.ids_using && data.subscription.ids_using.length > 0 && (
                  <DetailRow isLast={!data.subscription?.comments}>
                    <DetailLabel>IDs Using</DetailLabel>
                    <DetailValue style={{ textAlign: 'left', maxWidth: '200px', wordBreak: 'break-word' }}>
                      {data.subscription.ids_using.join(', ')}
                    </DetailValue>
                  </DetailRow>
                )}
                {data.subscription?.comments && (
                  <DetailRow isLast>
                    <DetailLabel>Comments</DetailLabel>
                    <DetailValue style={{ textAlign: 'left', maxWidth: '200px', wordBreak: 'break-word' }}>
                      {data.subscription.comments}
                    </DetailValue>
                  </DetailRow>
                )}
              </DetailSection>
            </DetailGrid>
          ) : null}

          {/* Sharing Details */}
          {data?.subscription?.shared && (
            <DetailSection className="mt-8">
              <SectionTitle>🤝 Sharing Information</SectionTitle>
              
              <DetailRow>
                <DetailLabel>Total Shared Users</DetailLabel>
                <DetailValue highlight>{data.subscription?.total_shared_users || 0}</DetailValue>
              </DetailRow>
              
              <DetailRow>
                <DetailLabel>Paid Users</DetailLabel>
                <DetailValue>{data.subscription?.paid_shared_users || 0}</DetailValue>
              </DetailRow>
              
              <DetailRow isLast>
                <DetailLabel>Shared Amount per User</DetailLabel>
                <DetailValue>
                  {data.sharingDetails?.length > 0 
                    ? formatCurrency(data.sharingDetails[0]?.shared_amount || 0)
                    : 'N/A'
                  }
                </DetailValue>
              </DetailRow>

              {data.sharingDetails && data.sharingDetails.length > 0 ? (
                <SharingTable>
                  <TableHeader>
                    <TableRow>
                      <TableHeaderCell>Name</TableHeaderCell>
                      <TableHeaderCell>Email</TableHeaderCell>
                      <TableHeaderCell>Amount</TableHeaderCell>
                      <TableHeaderCell>Status</TableHeaderCell>
                      <TableHeaderCell>Payment Date</TableHeaderCell>
                    </TableRow>
                  </TableHeader>
                  <tbody>
                    {data.sharingDetails.map((sharing, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {sharing.first_name 
                            ? `${sharing.first_name} ${sharing.last_name}`
                            : sharing.non_registered_name || 'Unknown'
                          }
                          {sharing.first_name && <div className="text-xs text-gray-500 mt-1">Registered</div>}
                        </TableCell>
                        <TableCell>
                          {sharing.email || sharing.non_registered_email || 'N/A'}
                        </TableCell>
                        <TableCell>{formatCurrency(sharing.shared_amount)}</TableCell>
                        <TableCell>
                          <PaymentStatusBadge status={sharing.payment_status}>
                            {sharing.payment_status.replace('_', ' ')}
                          </PaymentStatusBadge>
                        </TableCell>
                        <TableCell>
                          {sharing.payment_date ? formatDate(sharing.payment_date) : 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </tbody>
                </SharingTable>
              ) : (
                <EmptyState>No sharing details available</EmptyState>
              )}
            </DetailSection>
          )}
        </ModalBody>

        <ModalFooter>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          {data?.subscription && (
            <Button variant="primary" onClick={() => onEdit(data.subscription)}>
              ✏️ Edit Subscription
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default AdminSubscriptionDetails;