import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${props => props.theme.colors.gray[50]};
`;

const Sidebar = styled.aside`
  width: 250px;
  background: white;
  border-right: 1px solid ${props => props.theme.colors.gray[200]};
  box-shadow: ${props => props.theme.shadows.sm};
  display: flex;
  flex-direction: column;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    display: none;
  }
`;

const SidebarHeader = styled.div`
  padding: ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.colors.gray[200]};
`;

const Logo = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
  margin: 0;
`;

const Navigation = styled.nav`
  flex: 1;
  padding: ${props => props.theme.spacing.sm} 0;
`;

const NavItem = styled.button`
  width: 100%;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  border: none;
  background: ${props => props.active ? props.theme.colors.gray[100] : 'transparent'};
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.gray[700]};
  text-align: left;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: ${props => props.active ? '600' : '400'};
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.theme.colors.gray[100]};
    color: ${props => props.theme.colors.primary};
  }

  &:focus {
    outline: none;
    box-shadow: inset 2px 0 0 ${props => props.theme.colors.primary};
  }
`;

const SidebarFooter = styled.div`
  padding: ${props => props.theme.spacing.lg};
  border-top: 1px solid ${props => props.theme.colors.gray[200]};
`;

const UserInfo = styled.div`
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const UserName = styled.p`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.gray[900]};
  margin: 0 0 0.25rem 0;
`;

const UserEmail = styled.p`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.gray[500]};
  margin: 0;
`;

const LogoutButton = styled.button`
  width: 100%;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.gray[300]};
  background: white;
  color: ${props => props.theme.colors.gray[700]};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  font-size: 0.75rem;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.theme.colors.gray[50]};
    border-color: ${props => props.theme.colors.gray[400]};
  }
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const TopBar = styled.header`
  background: white;
  border-bottom: 1px solid ${props => props.theme.colors.gray[200]};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.shadows.sm};

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    display: none;
  }
`;

const MobileMenuButton = styled.button`
  padding: ${props => props.theme.spacing.xs};
  border: none;
  background: transparent;
  color: ${props => props.theme.colors.gray[700]};
  cursor: pointer;
`;

const ContentArea = styled.div`
  flex: 1;
  padding: ${props => props.theme.spacing.lg};
  overflow-y: auto;
`;

const navigationItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/subscriptions', label: 'Subscriptions', icon: '💳' },
  { path: '/profile', label: 'Profile', icon: '👤' },
];

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <LayoutContainer>
      <Sidebar>
        <SidebarHeader>
          <Logo>SubSync</Logo>
        </SidebarHeader>
        
        <Navigation>
          {navigationItems.map((item) => (
            <NavItem
              key={item.path}
              active={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
            >
              <span style={{ marginRight: '8px' }}>{item.icon}</span>
              {item.label}
            </NavItem>
          ))}
        </Navigation>

        <SidebarFooter>
          <UserInfo>
            <UserName>{user?.firstName} {user?.lastName}</UserName>
            <UserEmail>{user?.email}</UserEmail>
          </UserInfo>
          <LogoutButton onClick={handleLogout}>
            Sign Out
          </LogoutButton>
        </SidebarFooter>
      </Sidebar>

      <MainContent>
        <TopBar>
          <MobileMenuButton>
            ☰ Menu
          </MobileMenuButton>
        </TopBar>
        
        <ContentArea>
          <Outlet />
        </ContentArea>
      </MainContent>
    </LayoutContainer>
  );
}

export default Layout;