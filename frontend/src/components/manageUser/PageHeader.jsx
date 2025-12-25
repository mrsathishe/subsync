import React from 'react';
import { PageHeader, PageTitle, PageSubtitle } from '../../pages/styles/adminUsers.styles';

const ManageUsersPageHeader = ({ title = "User Dashboard", subtitle = "Manage users." }) => {
  return (
    <PageHeader>
      <PageTitle>{title}</PageTitle>
      <PageSubtitle>{subtitle}</PageSubtitle>
    </PageHeader>
  );
};

export default ManageUsersPageHeader;