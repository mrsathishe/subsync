import React, { useState, useEffect, useRef } from 'react';
import { getUserTableConfig } from '../../utils/adminHelpers';
import { useUpdateUserRole, useUpdateUserStatus } from '../../hooks/useApi';
import AlertNotification from '../AlertNotification';
import {
  TableContainer,
  Table,
  Th,
  Td,
  StatusBadge,
  RoleBadge,
  LoadingState,
  ActionDropdown,
  DropdownButton,
  DropdownMenu,
  DropdownItem
} from '../../pages/styles/adminUsers.styles';

const UserTable = ({ usersData, isLoading }) => {
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [notification, setNotification] = useState(null);
  const tableRef = useRef(null);
  const updateUserRole = useUpdateUserRole();
  const updateUserStatus = useUpdateUserStatus();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tableRef.current && !tableRef.current.contains(event.target)) {
        setOpenDropdowns({});
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
    }
  );

  const toggleDropdown = (userId) => {
    console.log('Toggle dropdown for userId:', userId);
    console.log('Current openDropdowns:', openDropdowns);
    
    setOpenDropdowns(prev => {
      const isCurrentlyOpen = prev[userId];
      console.log('Is currently open:', isCurrentlyOpen);
      const newState = isCurrentlyOpen ? {} : { [userId]: true };
      console.log('New state:', newState);
      return newState;
    });
  };

  const handleAction = async (action, userId) => {
    setOpenDropdowns({});

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
          <ActionDropdown>
            <DropdownButton 
              onClick={(e) => {
                e.stopPropagation();
                toggleDropdown(value.userId);
              }}
            />
            <DropdownMenu isOpen={openDropdowns[value.userId]}>
              {value.actions.map((action, index) => (
                <DropdownItem 
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAction(action.action, value.userId);
                  }}
                  icon={action.icon}
                >
                  {action.label}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </ActionDropdown>
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
        <div style={{ marginBottom: '1rem' }}>
          <AlertNotification
            variant={notification.variant}
            icon={notification.icon}
            title={notification.title}
            content={notification.content}
          />
        </div>
      )}
      
      <TableContainer ref={tableRef}>
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