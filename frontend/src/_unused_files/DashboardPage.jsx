import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useMySubscriptions, useSubscriptionPlans } from '../hooks/useApi';
import StatisticCard from '../components/StatisticCard';
import SubscriptionCard from '../components/SubscriptionCard';
import AlertNotification from '../components/AlertNotification';
import {
  PageContainer,
  PageHeader,
  PageTitle,
  PageSubtitle,
  StatsGrid,
  ContentGrid,
  AlertsGrid,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  EmptyState,
  LoadingState,
  QuickActionsContainer,
  ActionButton
} from './styles';

function DashboardPage() {
  const { user } = useAuth();
  const { data: subscriptions, isLoading: subscriptionsLoading } = useMySubscriptions();
  const { data: plans, isLoading: plansLoading } = useSubscriptionPlans();

  const activeSubscriptions = subscriptions?.filter(sub => sub.status === 'active') || [];
  const totalSubscriptions = subscriptions?.length || 0;
  const totalPlansAvailable = plans?.length || 0;

  // Calculate monthly expense
  const monthlyExpense = activeSubscriptions.reduce((total, sub) => {
    const price = parseFloat(sub.price) || 0;
    if (sub.billing_cycle === 'yearly') {
      return total + (price / 12);
    }
    return total + price;
  }, 0);

  // Get upcoming renewals (within next 30 days)
  const upcomingRenewals = activeSubscriptions.filter(sub => {
    if (!sub.end_date) return false;
    const endDate = new Date(sub.end_date);
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    return endDate >= today && endDate <= thirtyDaysFromNow;
  });

  // Get expiring subscriptions (within next 7 days)
  const expiringSubscriptions = activeSubscriptions.filter(sub => {
    if (!sub.end_date) return false;
    const endDate = new Date(sub.end_date);
    const today = new Date();
    const sevenDaysFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return endDate >= today && endDate <= sevenDaysFromNow;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Welcome back, {user?.firstName}!</PageTitle>
        <PageSubtitle>Here's an overview of your subscriptions and account activity.</PageSubtitle>
      </PageHeader>

      <StatsGrid>
        <StatisticCard
          icon="✓"
          value={activeSubscriptions.length}
          label="Active Subscriptions"
          color="#10b981"
        />
        <StatisticCard
          icon="💰"
          value={formatCurrency(monthlyExpense)}
          label="Monthly Expense"
          color="#3b82f6"
        />
        <StatisticCard
          icon="🔔"
          value={upcomingRenewals.length}
          label="Upcoming Renewals"
          color="#f59e0b"
        />
        <StatisticCard
          icon="⚠️"
          value={expiringSubscriptions.length}
          label="Expiring Soon"
          color="#ef4444"
        />
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
                <SubscriptionCard 
                  key={subscription.id} 
                  subscription={subscription}
                  formatDate={formatDate}
                />
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
            <CardTitle>Alerts & Renewals</CardTitle>
          </CardHeader>
          <CardContent>
            <AlertsGrid>
              {expiringSubscriptions.length > 0 && (
                <AlertNotification
                  variant="warning"
                  icon="⚠️"
                  title="Expiring Soon"
                  content={
                    expiringSubscriptions.length === 1 
                      ? `${expiringSubscriptions[0].plan_name} expires ${formatDate(expiringSubscriptions[0].end_date)}`
                      : `${expiringSubscriptions.length} subscriptions expire within 7 days`
                  }
                />
              )}
              
              {upcomingRenewals.length > 0 && (
                <AlertNotification
                  variant="info"
                  icon="🔔"
                  title="Upcoming Renewals"
                  content={`${upcomingRenewals.length} subscription${upcomingRenewals.length !== 1 ? 's' : ''} renewing in the next 30 days`}
                />
              )}

              {expiringSubscriptions.length === 0 && upcomingRenewals.length === 0 && (
                <EmptyState>
                  <p>No upcoming renewals or expiring subscriptions</p>
                </EmptyState>
              )}
            </AlertsGrid>
          </CardContent>
        </Card>
      </ContentGrid>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <QuickActionsContainer>
            <ActionButton
              variant="primary"
              onClick={() => window.location.href = '/subscriptions'}
            >
              Browse Plans
            </ActionButton>
            <ActionButton
              variant="secondary"
              onClick={() => window.location.href = '/profile'}
            >
              Update Profile
            </ActionButton>
            <ActionButton
              variant="success"
              onClick={() => window.location.href = '/subscriptions/manage'}
            >
              Manage Subscriptions
            </ActionButton>
          </QuickActionsContainer>
        </CardContent>
      </Card>
    </PageContainer>
  );
}

export default DashboardPage;