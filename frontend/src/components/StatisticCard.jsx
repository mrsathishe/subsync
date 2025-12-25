import React from 'react';
import { StatCard, StatIcon, StatValue, StatLabel } from '../pages/styles';

function StatisticCard({ icon, value, label, color = "#3b82f6" }) {
  return (
    <StatCard>
      <StatIcon color={color}>
        {icon}
      </StatIcon>
      <StatValue>{value}</StatValue>
      <StatLabel>{label}</StatLabel>
    </StatCard>
  );
}

export default StatisticCard;