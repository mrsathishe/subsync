import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useUsers } from '../contexts/UsersContext';
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
  const { usersData, loading: usersLoading, refetch } = useUsers(); // Add refetch from context
  const [currentPage, setCurrentPage] = useState(1);

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
              currentUserRole={user?.role}
              onDataChange={refetch}
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