import React from 'react';
import {
  PaginationContainer,
  PaginationInfo,
  PaginationControls,
  PaginationButton,
  PageNumber
} from '../../pages/styles/adminUsers.styles.jsx';

const UserPagination = ({ 
  currentPage, 
  totalPages, 
  totalUsers, 
  usersPerPage = 20, 
  onPageChange 
}) => {
  const startRecord = ((currentPage - 1) * usersPerPage) + 1;
  const endRecord = Math.min(currentPage * usersPerPage, totalUsers);

  return (
    <PaginationContainer>
      <PaginationInfo>
        Showing {startRecord} to {endRecord} of {totalUsers} users
      </PaginationInfo>
      
      {totalPages > 1 && (
        <PaginationControls>
          <PaginationButton 
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            &lt;
          </PaginationButton>
          
          <PageNumber current={true}>{currentPage}</PageNumber>
          <span style={{ padding: '0 0.5rem', color: '#6b7280', fontSize: '0.875rem' }}>of {totalPages}</span>
          
          <PaginationButton 
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            &gt;
          </PaginationButton>
        </PaginationControls>
      )}
    </PaginationContainer>
  );
};

export default UserPagination;