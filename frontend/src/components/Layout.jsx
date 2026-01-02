import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Footer from './Footer';
import {
  LayoutContainer,
  Sidebar,
  SidebarHeader,
  Logo,
  Navigation,
  NavItem,
  NavItemIcon,
  SidebarFooter,
  UserInfo,
  UserName,
  UserEmail,
  AdminBadge,
  LogoutButton,
  MainContent,
  TopBar,
  MobileMenuButton,
  ContentArea
} from './styles.jsx';


function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // Navigation items based on user role
  const getNavigationItems = () => {
    const baseItems = [
      { path: '/subscriptions', label: 'Subscriptions', icon: '💳' },
      { path: '/profile', label: 'Profile', icon: '👤' },
    ];

    if (user?.role === 'admin') {
      return [
        ...baseItems,
        { path: '/admin/users', label: 'Manage Users', icon: '👥' },
      ];
    }

    return baseItems;
  };

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
          {getNavigationItems().map((item) => (
            <NavItem
              key={item.path}
              active={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
            >
              <NavItemIcon>{item.icon}</NavItemIcon>
              {item.label}
            </NavItem>
          ))}
        </Navigation>

        <SidebarFooter>
          <UserInfo>
            <UserName>{user?.firstName} {user?.lastName}</UserName>
            <UserEmail>{user?.email}</UserEmail>
            {user?.role === 'admin' && (
              <AdminBadge>
                Administrator
              </AdminBadge>
            )}
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
          <Footer />
        </ContentArea>
      </MainContent>
    </LayoutContainer>
  );
}

export default Layout;