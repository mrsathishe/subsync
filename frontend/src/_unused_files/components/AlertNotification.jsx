import React from 'react';
import { 
  AlertCard, 
  AlertHeader, 
  AlertIcon, 
  AlertTitle, 
  AlertContent 
} from '../pages/styles';

function AlertNotification({ variant = "info", icon, title, content }) {
  return (
    <AlertCard variant={variant}>
      <AlertHeader>
        <AlertIcon>{icon}</AlertIcon>
        <AlertTitle variant={variant}>{title}</AlertTitle>
      </AlertHeader>
      <AlertContent variant={variant}>
        {content}
      </AlertContent>
    </AlertCard>
  );
}

export default AlertNotification;