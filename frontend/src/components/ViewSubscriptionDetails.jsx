import React from 'react';
import { useAdminSubscription } from '../hooks/useApi';
import { useAuth } from '../contexts/AuthContext';

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

const PasswordField = ({ password, showPassword, onToggle }) => (
  <div className="flex flex-col gap-2">
    <div className="text-sm text-gray-900 break-all max-w-xs">
      {showPassword ? (password || 'No password set') : '••••••••'}
    </div>
    <button
      onClick={onToggle}
      className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer bg-none border-none underline self-start"
      type="button"
    >
      {showPassword ? '🙈 Hide' : '👁️ Show'}
    </button>
  </div>
);

function ViewSubscriptionDetails({ subscriptionId, isOpen, onClose, onEdit, usersData }) {
  const { user } = useAuth();
  const { data, isLoading, error } = useAdminSubscription(subscriptionId);
  const isAdmin = user?.role === 'admin';
  const [showPassword, setShowPassword] = React.useState(false);

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

  const getCreatorName = (createdById) => {
    if (!createdById || !usersData?.users) return 'N/A';
    
    const creator = usersData.users.find(user => user.id === createdById);
    return creator ? `${creator.first_name} ${creator.last_name}` : `User ID: ${createdById}`;
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
                  {getCategoryIcon(data?.category)} Basic Information
                </SectionTitle>
                <DetailRow>
                  <DetailLabel>Service Name</DetailLabel>
                  <DetailValue highlight>{data?.service_name}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Category</DetailLabel>
                  <DetailValue>{data?.category}</DetailValue>
                </DetailRow>
                {isAdmin && (
                  <DetailRow>
                    <DetailLabel>Owner</DetailLabel>
                    <DetailValue>
                      {data?.owner_type}
                      {data?.owner_name && ` (${data.owner_name})`}
                    </DetailValue>
                  </DetailRow>
                )}
                <DetailRow>
                  <DetailLabel>Status</DetailLabel>
                  <DetailValue>
                    <StatusBadge status={data?.status}>
                      {data?.status || 'Active'}
                    </StatusBadge>
                  </DetailValue>
                </DetailRow>
                {isAdmin && (
                  <DetailRow isLast>
                    <DetailLabel>Created By</DetailLabel>
                    <DetailValue>{getCreatorName(data?.created_by)}</DetailValue>
                  </DetailRow>
                )}
              </DetailSection>

              {/* Login Information */}
              <DetailSection>
                <SectionTitle>🔐 Login Information</SectionTitle>
                <DetailRow>
                  <DetailLabel>Login Credential</DetailLabel>
                  <DetailValue>{data?.login_username_phone}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Password</DetailLabel>
                  <DetailValue>
                    <PasswordField 
                      password={data?.password}
                      showPassword={showPassword}
                      onToggle={() => setShowPassword(!showPassword)}
                    />
                  </DetailValue>
                </DetailRow>
                {
                  isAdmin &&
                  <DetailRow isLast>
                    <DetailLabel>Password Hint</DetailLabel>
                    <DetailValue>{data?.password_hint || 'Not provided'}</DetailValue>
                  </DetailRow>
                }
              </DetailSection>

              {/* Subscription Details */}
              <DetailSection>
                <SectionTitle>📅 Subscription Details</SectionTitle>
                <DetailRow>
                  <DetailLabel>Amount</DetailLabel>
                  <DetailValue highlight>{formatCurrency(data?.amount)}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Plan Type</DetailLabel>
                  <DetailValue>{data?.plan_type}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Purchased Date</DetailLabel>
                  <DetailValue>{formatDate(data?.purchased_date)}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Start Date</DetailLabel>
                  <DetailValue>{formatDate(data?.start_date)}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>End Date</DetailLabel>
                  <DetailValue>{formatDate(data?.end_date)}</DetailValue>
                </DetailRow>
                {isAdmin && (
                  <DetailRow>
                    <DetailLabel>Purchased Via</DetailLabel>
                    <DetailValue>{data?.purchased_via}</DetailValue>
                  </DetailRow>
                )}
                {isAdmin && (
                  <>
                    <DetailRow>
                      <DetailLabel>Auto Pay</DetailLabel>
                      <DetailValue>{data?.auto_pay ? '✅ Enabled' : '❌ Disabled'}</DetailValue>
                    </DetailRow>
                    {data?.next_purchase_date && (
                      <DetailRow>
                        <DetailLabel>Next Purchase</DetailLabel>
                        <DetailValue>{formatDate(data?.next_purchase_date)}</DetailValue>
                      </DetailRow>
                    )}
                  </>
                )}
              </DetailSection>

              {/* Device & Usage - Only for Admin */}
              {isAdmin && (
                <DetailSection>
                  <SectionTitle>📱 Device & Usage</SectionTitle>
                  <DetailRow>
                    <DetailLabel>Device Limit</DetailLabel>
                    <DetailValue>{data?.device_limit}</DetailValue>
                  </DetailRow>
                  <DetailRow>
                    <DetailLabel>Devices in Use</DetailLabel>
                    <DetailValue>{data?.devices_in_use}</DetailValue>
                  </DetailRow>
                  <DetailRow isLast={!data?.idsUsingDetails?.length && !data?.comments}>
                    <DetailLabel>Available Devices</DetailLabel>
                    <DetailValue>
                      {(data?.device_limit || 0) - (data?.devices_in_use || 0)}
                    </DetailValue>
                  </DetailRow>
                  {data?.idsUsingDetails && data.idsUsingDetails.length > 0 && (
                    <DetailRow isLast={!data?.comments}>
                      <DetailLabel>IDs Using</DetailLabel>
                      <DetailValue style={{ textAlign: 'left', maxWidth: '200px', wordBreak: 'break-word' }}>
                        {data.idsUsingDetails.map(user => 
                          user.isCustom ? user.name : `${user.name} (${user.email})`
                        ).join(', ')}
                      </DetailValue>
                    </DetailRow>
                  )}
                  {data?.comments && (
                    <DetailRow isLast>
                      <DetailLabel>Comments</DetailLabel>
                      <DetailValue style={{ textAlign: 'left', maxWidth: '200px', wordBreak: 'break-word' }}>
                        {data.comments}
                      </DetailValue>
                    </DetailRow>
                  )}
                </DetailSection>
              )}
            </DetailGrid>
          ) : null}

          {/* Payment Information - For regular users with shared subscriptions */}
          {!isAdmin && data?.userPaymentInfo && (
            <DetailSection className="mt-8">
              <SectionTitle>💳 Payment Information</SectionTitle>
              <DetailRow>
                <DetailLabel>Payment Status</DetailLabel>
                <DetailValue>
                  <PaymentStatusBadge status={data.userPaymentInfo.paymentStatus}>
                    {data.userPaymentInfo.paymentStatus.replace('_', ' ')}
                  </PaymentStatusBadge>
                </DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Payment Required</DetailLabel>
                <DetailValue>{data.userPaymentInfo.isPaid ? '✅ Paid' : '❌ Payment Due'}</DetailValue>
              </DetailRow>
              {data.userPaymentInfo.paymentDate && (
                <DetailRow isLast>
                  <DetailLabel>Payment Date</DetailLabel>
                  <DetailValue>{formatDate(data.userPaymentInfo.paymentDate)}</DetailValue>
                </DetailRow>
              )}
              {!data.userPaymentInfo.paymentDate && (
                <DetailRow isLast>
                  <DetailLabel>Payment Date</DetailLabel>
                  <DetailValue>Not paid yet</DetailValue>
                </DetailRow>
              )}
            </DetailSection>
          )}

          {/* Sharing Details - Only for Admin */}
          {isAdmin && data?.isSharing && (
            <DetailSection className="mt-8">
              <SectionTitle>🤝 Sharing Information</SectionTitle>
              
              <DetailRow>
                <DetailLabel>Total Shared Users</DetailLabel>
                <DetailValue highlight>{data?.sharingDetails?.length || 0}</DetailValue>
              </DetailRow>
              
              <DetailRow>
                <DetailLabel>Paid Users</DetailLabel>
                <DetailValue>
                  {data?.sharingDetails?.filter(user => user.paymentStatus === 'paid').length || 0}
                </DetailValue>
              </DetailRow>
              
              <DetailRow isLast>
                <DetailLabel>Subscription Sharing</DetailLabel>
                <DetailValue>
                  {data?.isSharing ? '✅ Enabled' : '❌ Disabled'}
                </DetailValue>
              </DetailRow>

              {data?.sharingDetails && data.sharingDetails.length > 0 ? (
                <SharingTable>
                  <TableHeader>
                    <TableRow>
                      <TableHeaderCell>Name</TableHeaderCell>
                      <TableHeaderCell>Email</TableHeaderCell>
                      <TableHeaderCell>Type</TableHeaderCell>
                      <TableHeaderCell>Status</TableHeaderCell>
                      <TableHeaderCell>Payment Date</TableHeaderCell>
                    </TableRow>
                  </TableHeader>
                  <tbody>
                    {data.sharingDetails.map((sharing, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {sharing.name || 'Unknown'}
                          {!sharing.isRegistered && <div className="text-xs text-gray-500 mt-1">Custom</div>}
                        </TableCell>
                        <TableCell>
                          {sharing.email || 'N/A'}
                        </TableCell>
                        <TableCell>
                          {sharing.isRegistered ? 'Registered' : 'Custom'}
                        </TableCell>
                        <TableCell>
                          <PaymentStatusBadge status={sharing.paymentStatus}>
                            {sharing.paymentStatus.replace('_', ' ')}
                          </PaymentStatusBadge>
                        </TableCell>
                        <TableCell>
                          {sharing.paymentDate ? formatDate(sharing.paymentDate) : 'N/A'}
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

          {/* For regular users, show simple sharing status */}
          {!isAdmin && data?.isSharing && (
            <DetailSection className="mt-8">
              <SectionTitle>🤝 Sharing Status</SectionTitle>
              <DetailRow>
                <DetailLabel>This subscription is shared</DetailLabel>
                <DetailValue>✅ You have access</DetailValue>
              </DetailRow>
            </DetailSection>
          )}
        </ModalBody>

        <ModalFooter>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          {isAdmin && data && (
            <Button variant="primary" onClick={() => onEdit(data)}>
              ✏️ Edit Subscription
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ViewSubscriptionDetails;