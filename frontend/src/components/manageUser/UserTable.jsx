import React, { useState, useEffect, useRef } from 'react';
import { getUserTableConfig } from '../../utils/adminHelpers';
import { useUpdateUserRole, useUpdateUserStatus } from '../../hooks/useApi';
import {
  TableContainer,
  Table,
  Th,
  Td,
  StatusBadge,
  RoleBadge,
  LoadingState,
  ActionIconsContainer,
  IconButton
} from '../../pages/styles/adminUsers.styles.jsx';

const UserTable = ({ usersData, isLoading, currentUserRole, onDataChange }) => {
  const [notification, setNotification] = useState(null);
  const updateUserRole = useUpdateUserRole();
  const updateUserStatus = useUpdateUserStatus();

  const tableConfig = getUserTableConfig(
    (dateString) => {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },
    (gender) => {
      if (!gender) return 'N/A';
      return gender.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    },
    currentUserRole
  );

  const handleAction = async (action, userId) => {
    try {
      switch (action) {
        case 'toggle-status':
          const user = usersData?.users?.find(u => u.id === userId);
          if (user) {
            const response = await updateUserStatus.mutate({ userId, isActive: !user.is_active });
            setNotification({
              variant: 'success',
              icon: '✅',
              title: 'Success',
              content: `User status updated to ${!user.is_active ? 'Active' : 'Inactive'} successfully!`
            });
            setTimeout(() => setNotification(null), 5000);
            // Refresh the table data
            if (onDataChange) {
              onDataChange();
            }
          }
          break;
        case 'toggle-role':
          const targetUser = usersData?.users?.find(u => u.id === userId);
          if (targetUser) {
            const newRole = targetUser.role === 'admin' ? 'user' : 'admin';
            const response = await updateUserRole.mutate({ userId, role: newRole });
            setNotification({
              variant: 'success',
              icon: '🎉',
              title: 'Role Updated Successfully',
              content: `User role has been updated to ${newRole === 'admin' ? 'Administrator' : 'User'} successfully!`
            });
            setTimeout(() => setNotification(null), 5000);
            // Refresh the table data
            if (onDataChange) {
              onDataChange();
            }
          }
          break;
        default:
          console.log('Unknown action:', action);
      }
    } catch (error) {
      console.error('Action failed:', error);
      setNotification({
        variant: 'error',
        icon: '❌',
        title: 'Action Failed',
        content: 'Failed to update user. Please try again.'
      });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const renderCellValue = (userData, column) => {
    const value = tableConfig.formatValue(userData, column);
    
    switch (column.type) {
      case 'actions':
        return (
          <ActionIconsContainer>
            {value.actions.map((action, index) => (
              <IconButton
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAction(action.action, value.userId);
                }}
                title={action.label}
                variant={action.action === 'toggle-status' ? 'status' : 'role'}
              >
                {action.icon}
              </IconButton>
            ))}
          </ActionIconsContainer>
        );
      
      case 'badge':
        return (
          <StatusBadge status={value.status}>
            {value.label}
          </StatusBadge>
        );
      
      case 'role':
        return (
          <RoleBadge role={value.role}>
            {value.label}
          </RoleBadge>
        );
      
      default:
        return value;
    }
  };

  if (isLoading) {
    return <LoadingState>Loading users...</LoadingState>;
  }

  return (
    <>
      {notification && (
        <div style={{ 
          marginBottom: '1rem', 
          padding: '0.75rem 1rem', 
          borderRadius: '0.5rem', 
          backgroundColor: notification.variant === 'success' ? '#dcfce7' : '#fef2f2',
          color: notification.variant === 'success' ? '#166534' : '#dc2626',
          border: `1px solid ${notification.variant === 'success' ? '#bbf7d0' : '#fecaca'}`,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>{notification.icon}</span>
          <div>
            <strong>{notification.title}</strong>
            {notification.content && <div>{notification.content}</div>}
          </div>
        </div>
      )}
      
      <TableContainer>
      <Table>
        <thead>
          <tr>
            {tableConfig.headers.map((column) => (
              <Th key={column.key}>{column.label}</Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {usersData?.users?.map((userData) => (
            <tr key={userData.id}>
              {tableConfig.headers.map((column) => (
                <Td key={column.key}>
                  {renderCellValue(userData, column)}
                </Td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </TableContainer>
    </>
  );
};

export default UserTable;