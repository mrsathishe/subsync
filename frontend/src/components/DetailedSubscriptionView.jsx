import React, { useState } from 'react';
import TagsInput from './TagsInput';

// Tailwind component functions
const DetailedSubscriptionCard = ({ expanded, children, onClick }) => (
  <div className={`
    bg-white overflow-hidden transition-all duration-300 mb-4 rounded-lg
    ${expanded ? 'border-2 border-blue-600 shadow-lg' : 'border-2 border-gray-200 shadow-sm'}
    hover:border-blue-600/50 hover:shadow-md
  `}>
    {children}
  </div>
);

const SubscriptionHeader = ({ expanded, onClick, children }) => (
  <div className={`
    p-6 cursor-pointer flex justify-between items-center
    ${expanded ? 'border-b border-gray-200' : ''}
  `} onClick={onClick}>
    {children}
  </div>
);

const HeaderContent = ({ children }) => (
  <div className="flex-1">
    {children}
  </div>
);

const ServiceName = ({ children }) => (
  <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
    {children}
  </h3>
);

const CategoryBadge = ({ category }) => {
  const getBadgeClasses = (cat) => {
    switch (cat?.toLowerCase()) {
      case 'ott':
        return 'bg-purple-500/20 text-purple-500';
      case 'mobile':
        return 'bg-amber-500/20 text-amber-500';
      case 'broadband':
        return 'bg-emerald-500/20 text-emerald-500';
      default:
        return 'bg-gray-200 text-gray-600';
    }
  };

  return (
    <span className={`
      px-3 py-1 rounded-full text-xs font-semibold uppercase
      ${getBadgeClasses(category)}
    `}>
      {category}
    </span>
  );
};

const BasicInfo = ({ children }) => (
  <div className="flex items-center gap-4 text-sm text-gray-600">
    {children}
  </div>
);

const PriceInfo = ({ children }) => (
  <span className="font-semibold text-gray-900">
    {children}
  </span>
);

const StatusBadge = ({ status }) => {
  const getBadgeClasses = (stat) => {
    switch (stat) {
      case 'active':
        return 'bg-green-500/20 text-green-500';
      case 'cancelled':
        return 'bg-red-500/20 text-red-500';
      case 'expired':
        return 'bg-yellow-500/20 text-yellow-500';
      default:
        return 'bg-gray-200 text-gray-600';
    }
  };

  return (
    <span className={`
      px-3 py-1 rounded-full text-xs font-semibold uppercase
      ${getBadgeClasses(status)}
    `}>
      {status}
    </span>
  );
};

const ExpandButton = ({ expanded, children }) => (
  <button className={`
    bg-transparent border-0 text-blue-600 cursor-pointer text-2xl p-2
    transition-transform duration-200 hover:bg-blue-600/10 hover:rounded-full
    ${expanded ? 'rotate-180' : 'rotate-0'}
  `}>
    {children}
  </button>
);

const DetailsContainer = ({ children }) => (
  <div className="p-6 bg-gray-50 border-t border-gray-200">
    {children}
  </div>
);

const DetailsGrid = ({ children }) => (
  <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
    {children}
  </div>
);

const DetailSection = ({ children }) => (
  <div className="bg-white border border-gray-200 rounded-md p-4">
    {children}
  </div>
);

const SectionTitle = ({ children }) => (
  <h4 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
    {children}
  </h4>
);

const DetailRow = ({ children }) => (
  <div className="flex justify-between items-start py-2 border-b border-gray-100 last:border-b-0">
    {children}
  </div>
);

const DetailLabel = ({ children }) => (
  <span className="text-sm font-semibold text-gray-600 flex-shrink-0 min-w-[120px]">
    {children}
  </span>
);

const DetailValue = ({ children, className = '' }) => (
  <span className={`text-sm text-gray-900 text-right break-words ${className}`}>
    {children}
  </span>
);

const TagsContainer = ({ children }) => (
  <div className="mt-2">
    {children}
  </div>
);

const Tag = ({ children }) => (
  <span className="inline-block bg-blue-600/20 text-blue-600 px-2 py-1 rounded-sm text-xs mr-1 mb-0.5">
    {children}
  </span>
);

const AutoPayBadge = ({ enabled }) => (
  <span className={`
    px-2 py-1 rounded-sm text-xs font-semibold
    ${enabled ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'}
  `}>
    {enabled ? '✓ Enabled' : '✗ Disabled'}
  </span>
);

const SharedBadge = ({ shared }) => (
  <span className={`
    px-2 py-1 rounded-sm text-xs font-semibold
    ${shared ? 'bg-purple-500/20 text-purple-500' : 'bg-gray-500/20 text-gray-500'}
  `}>
    {shared ? '🤝 Yes' : '👤 No'}
  </span>
);

function DetailedSubscriptionView({ subscription }) {
  const [expanded, setExpanded] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'OTT': '📺',
      'Mobile': '📱',
      'Broadband': '🌐'
    };
    return icons[category] || '📋';
  };

  const getPlanDuration = (subscription) => {
    if (subscription.plan_type === 'Custom' && subscription.custom_duration_value && subscription.custom_duration_unit) {
      return `${subscription.custom_duration_value} ${subscription.custom_duration_unit}`;
    }
    return subscription.plan_type || 'Not specified';
  };

  const maskPassword = (password) => {
    if (!password) return 'Not set';
    return '●'.repeat(Math.min(password.length, 8));
  };

  return (
    <DetailedSubscriptionCard expanded={expanded}>
      <SubscriptionHeader onClick={() => setExpanded(!expanded)} expanded={expanded}>
        <HeaderContent>
          <ServiceName>
            {getCategoryIcon(subscription.category)}
            {subscription.service_name || subscription.plan_name}
            <CategoryBadge category={subscription.category} />
          </ServiceName>
          <BasicInfo>
            <PriceInfo>₹{subscription.amount || subscription.price}</PriceInfo>
            <span>•</span>
            <span>{getPlanDuration(subscription)}</span>
            <span>•</span>
            <span>Owner: {subscription.owner_type || subscription.user || 'Me'}</span>
          </BasicInfo>
        </HeaderContent>
        <StatusBadge status={subscription.status} />
        <ExpandButton expanded={expanded}>
          ▼
        </ExpandButton>
      </SubscriptionHeader>

      {expanded && (
        <DetailsContainer>
          <DetailsGrid>
            {/* Login Information */}
            <DetailSection>
              <SectionTitle>🔐 Login Information</SectionTitle>
              <DetailRow>
                <DetailLabel>Login ID:</DetailLabel>
                <DetailValue>{subscription.login_username_phone || subscription.login_id || 'Not provided'}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Password:</DetailLabel>
                <DetailValue>{maskPassword(subscription.password)}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Password Hint:</DetailLabel>
                <DetailValue>{subscription.password_hint || 'None'}</DetailValue>
              </DetailRow>
            </DetailSection>

            {/* Subscription Details */}
            <DetailSection>
              <SectionTitle>📅 Subscription Details</SectionTitle>
              <DetailRow>
                <DetailLabel>Purchased Date:</DetailLabel>
                <DetailValue>{formatDate(subscription.purchased_date)}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Start Date:</DetailLabel>
                <DetailValue>{formatDate(subscription.start_date)}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>End Date:</DetailLabel>
                <DetailValue>{formatDate(subscription.end_date)}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Next Purchase:</DetailLabel>
                <DetailValue>{formatDate(subscription.next_purchase_date)}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Purchased Via:</DetailLabel>
                <DetailValue>{subscription.purchased_via || 'Not specified'}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Auto Pay:</DetailLabel>
                <DetailValue>
                  <AutoPayBadge enabled={subscription.auto_pay} />
                </DetailValue>
              </DetailRow>
            </DetailSection>

            {/* Device & Usage */}
            <DetailSection>
              <SectionTitle>📱 Device & Usage</SectionTitle>
              <DetailRow>
                <DetailLabel>Device Limit:</DetailLabel>
                <DetailValue>{subscription.device_limit || 'Unlimited'}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Devices in Use:</DetailLabel>
                <DetailValue>
                  {subscription.devices_in_use || 0}
                  {subscription.device_limit && ` / ${subscription.device_limit}`}
                </DetailValue>
              </DetailRow>
              {subscription.ids_using && subscription.ids_using.length > 0 && (
                <DetailRow>
                  <DetailLabel>IDs Using:</DetailLabel>
                  <DetailValue>
                    <TagsContainer>
                      {(Array.isArray(subscription.ids_using) 
                        ? subscription.ids_using 
                        : JSON.parse(subscription.ids_using || '[]')
                      ).map((id, index) => (
                        <Tag key={index}>{id}</Tag>
                      ))}
                    </TagsContainer>
                  </DetailValue>
                </DetailRow>
              )}
              <DetailRow>
                <DetailLabel>Shared:</DetailLabel>
                <DetailValue>
                  <SharedBadge shared={subscription.shared} />
                </DetailValue>
              </DetailRow>
            </DetailSection>

            {/* Comments */}
            {subscription.comments && (
              <DetailSection>
                <SectionTitle>📝 Comments</SectionTitle>
                <DetailValue className="text-left mt-2">
                  {subscription.comments}
                </DetailValue>
              </DetailSection>
            )}
          </DetailsGrid>
        </DetailsContainer>
      )}
    </DetailedSubscriptionCard>
  );
}

export default DetailedSubscriptionView;