import React, { useState } from 'react';
import { useSubscriptionPlans, useMySubscriptions, useSubscribe, useCancelSubscription } from '../hooks/useApi';
import styled from 'styled-components';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: ${props => props.theme.colors.gray[900]};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const TabContainer = styled.div`
  border-bottom: 1px solid ${props => props.theme.colors.gray[200]};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const TabList = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.lg};
`;

const Tab = styled.button`
  padding: ${props => props.theme.spacing.sm} 0;
  border: none;
  background: transparent;
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.gray[600]};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  border-bottom: 2px solid ${props => props.active ? props.theme.colors.primary : 'transparent'};
  transition: all 0.2s;

  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const PlansGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const PlanCard = styled.div`
  background: white;
  border: 2px solid ${props => props.featured ? props.theme.colors.primary : props.theme.colors.gray[200]};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.xl};
  position: relative;
  box-shadow: ${props => props.featured ? props.theme.shadows.lg : props.theme.shadows.sm};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
`;

const FeaturedBadge = styled.div`
  position: absolute;
  top: -1px;
  left: 50%;
  transform: translateX(-50%);
  background: ${props => props.theme.colors.primary};
  color: white;
  padding: 0.25rem 1rem;
  border-radius: 0 0 ${props => props.theme.borderRadius.md} ${props => props.theme.borderRadius.md};
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const PlanName = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => props.theme.colors.gray[900]};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const PlanDescription = styled.p`
  color: ${props => props.theme.colors.gray[600]};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const PlanPrice = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const Price = styled.span`
  font-size: 3rem;
  font-weight: bold;
  color: ${props => props.theme.colors.gray[900]};
`;

const PriceUnit = styled.span`
  font-size: 1rem;
  color: ${props => props.theme.colors.gray[600]};
  font-weight: normal;
`;

const FeaturesList = styled.ul`
  list-style: none;
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const Feature = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.gray[700]};

  &:before {
    content: '✓';
    color: ${props => props.theme.colors.success};
    font-weight: bold;
    margin-right: ${props => props.theme.spacing.sm};
  }
`;

const PlanButton = styled.button`
  width: 100%;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => {
    if (props.disabled) return props.theme.colors.gray[400];
    if (props.variant === 'primary') return props.theme.colors.primary;
    return 'white';
  }};
  color: ${props => {
    if (props.disabled) return 'white';
    if (props.variant === 'primary') return 'white';
    return props.theme.colors.primary;
  }};
  border: ${props => props.variant === 'primary' ? 'none' : `2px solid ${props.theme.colors.primary}`};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 1rem;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: ${props => props.variant === 'primary' ? props.theme.colors.primaryHover : props.theme.colors.primary};
    color: white;
  }
`;

const MySubscriptionsContainer = styled.div`
  background: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.sm};
  border: 1px solid ${props => props.theme.colors.gray[200]};
  overflow: hidden;
`;

const SubscriptionHeader = styled.div`
  padding: ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.colors.gray[200]};
`;

const SubscriptionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.gray[900]};
  margin: 0;
`;

const SubscriptionItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.colors.gray[100]};

  &:last-child {
    border-bottom: none;
  }
`;

const SubscriptionInfo = styled.div`
  flex: 1;
`;

const SubscriptionName = styled.h4`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.gray[900]};
  margin: 0 0 0.25rem 0;
`;

const SubscriptionDetails = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.gray[600]};
  margin: 0;
`;

const SubscriptionActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  align-items: center;
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  background: ${props => {
    switch (props.status) {
      case 'active': return props.theme.colors.success + '20';
      case 'cancelled': return props.theme.colors.danger + '20';
      case 'expired': return props.theme.colors.warning + '20';
      default: return props.theme.colors.gray[200];
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'active': return props.theme.colors.success;
      case 'cancelled': return props.theme.colors.danger;
      case 'expired': return props.theme.colors.warning;
      default: return props.theme.colors.gray[600];
    }
  }};
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  background: ${props => props.variant === 'danger' ? props.theme.colors.danger : 'white'};
  color: ${props => props.variant === 'danger' ? 'white' : props.theme.colors.gray[700]};
  border: 1px solid ${props => props.variant === 'danger' ? props.theme.colors.danger : props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.variant === 'danger' ? '#dc2626' : props.theme.colors.gray[50]};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LoadingState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.xl};
  color: ${props => props.theme.colors.gray[500]};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xl};
  color: ${props => props.theme.colors.gray[500]};
`;

function SubscriptionsPage() {
  const [activeTab, setActiveTab] = useState('browse');
  const [loadingPlan, setLoadingPlan] = useState(null);

  const { data: plans, isLoading: plansLoading } = useSubscriptionPlans();
  const { data: mySubscriptions, isLoading: subscriptionsLoading } = useMySubscriptions();
  const subscribeMutation = useSubscribe();
  const cancelMutation = useCancelSubscription();

  const handleSubscribe = async (planId) => {
    setLoadingPlan(planId);
    try {
      await subscribeMutation.mutateAsync(planId);
      setActiveTab('my-subscriptions');
    } catch (error) {
      console.error('Subscription error:', error);
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleCancel = async (subscriptionId) => {
    if (window.confirm('Are you sure you want to cancel this subscription?')) {
      try {
        await cancelMutation.mutateAsync(subscriptionId);
      } catch (error) {
        console.error('Cancel error:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isSubscribed = (planId) => {
    return mySubscriptions?.some(sub => sub.plan_id === planId && sub.status === 'active');
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Subscription Plans</PageTitle>
      </PageHeader>

      <TabContainer>
        <TabList>
          <Tab
            active={activeTab === 'browse'}
            onClick={() => setActiveTab('browse')}
          >
            Browse Plans
          </Tab>
          <Tab
            active={activeTab === 'my-subscriptions'}
            onClick={() => setActiveTab('my-subscriptions')}
          >
            My Subscriptions
          </Tab>
        </TabList>
      </TabContainer>

      {activeTab === 'browse' && (
        <>
          {plansLoading ? (
            <LoadingState>Loading subscription plans...</LoadingState>
          ) : (
            <PlansGrid>
              {plans?.map((plan, index) => (
                <PlanCard key={plan.id} featured={index === 1}>
                  {index === 1 && <FeaturedBadge>Most Popular</FeaturedBadge>}
                  
                  <PlanName>{plan.name}</PlanName>
                  <PlanDescription>{plan.description}</PlanDescription>
                  
                  <PlanPrice>
                    <Price>${plan.price}</Price>
                    <PriceUnit>/{plan.billing_cycle}</PriceUnit>
                  </PlanPrice>

                  <FeaturesList>
                    {plan.features?.map((feature, idx) => (
                      <Feature key={idx}>{feature}</Feature>
                    ))}
                  </FeaturesList>

                  <PlanButton
                    variant={index === 1 ? 'primary' : 'secondary'}
                    disabled={loadingPlan === plan.id || isSubscribed(plan.id)}
                    onClick={() => handleSubscribe(plan.id)}
                  >
                    {loadingPlan === plan.id 
                      ? 'Subscribing...' 
                      : isSubscribed(plan.id) 
                        ? 'Already Subscribed'
                        : 'Subscribe Now'
                    }
                  </PlanButton>
                </PlanCard>
              ))}
            </PlansGrid>
          )}
        </>
      )}

      {activeTab === 'my-subscriptions' && (
        <MySubscriptionsContainer>
          <SubscriptionHeader>
            <SubscriptionTitle>Your Active Subscriptions</SubscriptionTitle>
          </SubscriptionHeader>

          {subscriptionsLoading ? (
            <LoadingState>Loading your subscriptions...</LoadingState>
          ) : mySubscriptions && mySubscriptions.length > 0 ? (
            mySubscriptions.map((subscription) => (
              <SubscriptionItem key={subscription.id}>
                <SubscriptionInfo>
                  <SubscriptionName>{subscription.plan_name}</SubscriptionName>
                  <SubscriptionDetails>
                    ${subscription.price}/{subscription.billing_cycle} • 
                    {subscription.status === 'active' ? (
                      ` Renews on ${formatDate(subscription.end_date)}`
                    ) : (
                      ` Expires on ${formatDate(subscription.end_date)}`
                    )}
                    {subscription.auto_renew && ' • Auto-renewal enabled'}
                  </SubscriptionDetails>
                </SubscriptionInfo>
                
                <SubscriptionActions>
                  <StatusBadge status={subscription.status}>
                    {subscription.status}
                  </StatusBadge>
                  
                  {subscription.status === 'active' && (
                    <ActionButton
                      variant="danger"
                      disabled={cancelMutation.isPending}
                      onClick={() => handleCancel(subscription.id)}
                    >
                      Cancel
                    </ActionButton>
                  )}
                </SubscriptionActions>
              </SubscriptionItem>
            ))
          ) : (
            <EmptyState>
              <p>You don't have any subscriptions yet.</p>
              <button
                style={{
                  marginTop: '1rem',
                  padding: '0.75rem 1.5rem',
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
                onClick={() => setActiveTab('browse')}
              >
                Browse Plans
              </button>
            </EmptyState>
          )}
        </MySubscriptionsContainer>
      )}
    </PageContainer>
  );
}

export default SubscriptionsPage;