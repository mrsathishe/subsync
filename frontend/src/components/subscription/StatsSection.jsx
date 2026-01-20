import React from 'react';

const DashboardGrid = ({ children }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
    {children}
  </div>
);

const StatCard = ({ children }) => (
  <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200 min-w-fit">
    {children}
  </div>
);

const StatIcon = ({ children }) => (
  <span className="text-xl">{children}</span>
);

const StatContent = ({ children }) => (
  <div className="flex items-center gap-2">
    {children}
  </div>
);

const StatLabel = ({ children }) => (
  <span className="text-sm font-medium text-gray-700">{children}</span>
);

const StatValue = ({ children }) => (
  <span className="text-lg font-bold text-brand-600">{children}</span>
);

const StatsSection = ({ statsCards }) => {
  // Show stats if we have statsCards
  if (!statsCards || statsCards.length === 0) return null;

  return (
    <DashboardGrid>
      {statsCards.map((stat, index) => (
        <StatCard key={index}>
          <StatIcon>{stat.icon}</StatIcon>
          <StatContent>
            <StatLabel>{stat.label}:</StatLabel>
            <StatValue>{stat.value}</StatValue>
          </StatContent>
        </StatCard>
      ))}
    </DashboardGrid>
  );
};

export default StatsSection;