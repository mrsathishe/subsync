import React from 'react';
import { 
  SubscriptionItem, 
  SubscriptionInfo, 
  SubscriptionName, 
  SubscriptionDetails, 
  StatusBadge 
} from '../pages/styles';

function SubscriptionCard({ subscription, formatDate }) {
  return (
    <SubscriptionItem>
      <SubscriptionInfo>
        <SubscriptionName>{subscription.plan_name}</SubscriptionName>
        <SubscriptionDetails>
          ₹{subscription.price}/{subscription.billing_cycle} • 
          Expires {formatDate(subscription.end_date)}
        </SubscriptionDetails>
      </SubscriptionInfo>
      <StatusBadge status={subscription.status}>
        {subscription.status}
      </StatusBadge>
    </SubscriptionItem>
  );
}

export default SubscriptionCard;