// Pages
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import SubscriptionsPage from '../pages/SubscriptionsPage';
import ProfilePage from '../pages/ProfilePage';
import ManageUsers from '../pages/ManageUsers';
import Layout from '../components/Layout';

// Routes configuration
export const routesConfig = {
  public: [
    {
      path: "/login",
      component: LoginPage,
      key: "login"
    },
    {
      path: "/register", 
      component: RegisterPage,
      key: "register"
    }
  ],
  protected: {
    layout: Layout,
    children: [
      {
        path: "dashboard",
        component: DashboardPage,
        key: "dashboard"
      },
      {
        path: "subscriptions",
        component: SubscriptionsPage,
        key: "subscriptions"
      },
      {
        path: "profile",
        component: ProfilePage,
        key: "profile"
      },
      {
        path: "admin/users",
        component: ManageUsers,
        key: "admin-users"
      }
    ]
  }
};