import React, { useState } from 'react';
import { useAdminUsers } from '../hooks/useApi';
import { useAuth } from '../contexts/AuthContext';
import ManageUsersPageHeader from '../components/manageUser/PageHeader';
import UserTable from '../components/manageUser/UserTable';
import UserPagination from '../components/manageUser/Pagination';
import { 
  PageContainer, 
  Card,
  CardContent
} from './styles/adminUsers.styles.jsx';

function ManageUsers() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const { data: usersData, loading: usersLoading } = useAdminUsers(currentPage, 20);

  if (user?.role !== 'admin') {
    return (
      <PageContainer>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>Access Denied</h2>
          <p>You don't have permission to access the admin dashboard.</p>
        </div>
      </PageContainer>
    );
  }

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const totalPages = usersData?.pagination?.totalPages || 0;
  const totalUsers = usersData?.pagination?.totalUsers || 0;

  return (
    <PageContainer>
      <ManageUsersPageHeader />

      <div style={{ width: '100%' }}>
        <Card>
          <CardContent>
            <UserTable 
              usersData={usersData} 
              isLoading={usersLoading} 
            />
            
            {!usersLoading && usersData?.users?.length > 0 && (
              <UserPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalUsers={totalUsers}
                usersPerPage={20}
                onPageChange={handlePageChange}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}

export default ManageUsers;