import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useMySubscriptions, useSubscriptionPlans } from '../hooks/useApi';
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

const PageSubtitle = styled.p`
  color: ${props => props.theme.colors.gray[600]};
  font-size: 1.125rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const StatCard = styled.div`
  background: white;
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.sm};
  border: 1px solid ${props => props.theme.colors.gray[200]};
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  background: ${props => props.color}20;
  color: ${props => props.color};
  border-radius: ${props => props.theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const StatValue = styled.h3`
  font-size: 2rem;
  font-weight: bold;
  color: ${props => props.theme.colors.gray[900]};
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.p`
  color: ${props => props.theme.colors.gray[600]};
  font-size: 0.875rem;
  margin: 0;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${props => props.theme.spacing.xl};

  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.sm};
  border: 1px solid ${props => props.theme.colors.gray[200]};
  overflow: hidden;
`;

const CardHeader = styled.div`
  padding: ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.colors.gray[200]};
`;

const CardTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.gray[900]};
  margin: 0;
`;

const CardContent = styled.div`
  padding: ${props => props.theme.spacing.lg};
`;

const SubscriptionItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing.md};
  border-bottom: 1px solid ${props => props.theme.colors.gray[100]};

  &:last-child {
    border-bottom: none;
  }
`;

const SubscriptionInfo = styled.div``;

const SubscriptionName = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.gray[900]};
  margin: 0 0 0.25rem 0;
`;

const SubscriptionDetails = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.gray[600]};
  margin: 0;
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

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xl};
  color: ${props => props.theme.colors.gray[500]};
`;

const LoadingState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.xl};
  color: ${props => props.theme.colors.gray[500]};
`;

function DashboardPage() {
  const { user } = useAuth();
  const { data: subscriptions, isLoading: subscriptionsLoading } = useMySubscriptions();
  const { data: plans, isLoading: plansLoading } = useSubscriptionPlans();

  const activeSubscriptions = subscriptions?.filter(sub => sub.status === 'active') || [];
  const totalSubscriptions = subscriptions?.length || 0;
  const totalPlansAvailable = plans?.length || 0;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Welcome back, {user?.firstName}!</PageTitle>
        <PageSubtitle>Here's an overview of your subscriptions and account activity.</PageSubtitle>
      </PageHeader>

      <StatsGrid>
        <StatCard>
          <StatIcon color="#10b981">
            ✓
          </StatIcon>
          <StatValue>{activeSubscriptions.length}</StatValue>
          <StatLabel>Active Subscriptions</StatLabel>
        </StatCard>

        <StatCard>
          <StatIcon color="#3b82f6">
            📊
          </StatIcon>
          <StatValue>{totalSubscriptions}</StatValue>
          <StatLabel>Total Subscriptions</StatLabel>
        </StatCard>

        <StatCard>
          <StatIcon color="#f59e0b">
            💼
          </StatIcon>
          <StatValue>{totalPlansAvailable}</StatValue>
          <StatLabel>Available Plans</StatLabel>
        </StatCard>

        <StatCard>
          <StatIcon color="#8b5cf6">
            👤
          </StatIcon>
          <StatValue>Active</StatValue>
          <StatLabel>Account Status</StatLabel>
        </StatCard>
      </StatsGrid>

      <ContentGrid>
        <Card>
          <CardHeader>
            <CardTitle>Your Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            {subscriptionsLoading ? (
              <LoadingState>Loading subscriptions...</LoadingState>
            ) : subscriptions && subscriptions.length > 0 ? (
              subscriptions.map((subscription) => (
                <SubscriptionItem key={subscription.id}>
                  <SubscriptionInfo>
                    <SubscriptionName>{subscription.plan_name}</SubscriptionName>
                    <SubscriptionDetails>
                      ${subscription.price}/{subscription.billing_cycle} • 
                      Expires {formatDate(subscription.end_date)}
                    </SubscriptionDetails>
                  </SubscriptionInfo>
                  <StatusBadge status={subscription.status}>
                    {subscription.status}
                  </StatusBadge>
                </SubscriptionItem>
              ))
            ) : (
              <EmptyState>
                <p>No subscriptions found. Browse our plans to get started!</p>
              </EmptyState>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button
                style={{
                  padding: '0.75rem 1rem',
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
                onClick={() => window.location.href = '/subscriptions'}
              >
                Browse Plans
              </button>
              <button
                style={{
                  padding: '0.75rem 1rem',
                  background: 'white',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
                onClick={() => window.location.href = '/profile'}
              >
                Update Profile
              </button>
            </div>
          </CardContent>
        </Card>
      </ContentGrid>
    </PageContainer>
  );
}

export default DashboardPage;