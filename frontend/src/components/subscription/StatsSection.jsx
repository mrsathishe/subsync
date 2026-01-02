import React from 'react';

const DashboardGrid = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
    {children}
  </div>
);

const StatCard = ({ children }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
    {children}
  </div>
);

const StatIcon = ({ children }) => (
  <div className="text-3xl mb-2">{children}</div>
);

const StatValue = ({ children }) => (
  <div className="text-2xl font-bold text-brand-600 mb-1">{children}</div>
);

const StatLabel = ({ children }) => (
  <div className="text-gray-600 text-sm">{children}</div>
);

const StatsSection = ({ dashboardData, statsCards }) => {
  // Show stats if we have statsCards, regardless of dashboardData
  if (!statsCards || statsCards.length === 0) return null;

  return (
    <DashboardGrid>
      {statsCards.map((stat, index) => (
        <StatCard key={index}>
          <StatIcon>{stat.icon}</StatIcon>
          <StatValue>{stat.value}</StatValue>
          <StatLabel>{stat.label}</StatLabel>
        </StatCard>
      ))}
    </DashboardGrid>
  );
};

export default StatsSection;