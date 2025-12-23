# SubSync Frontend

React frontend application for the SubSync subscription management system.

## Features

- **User Authentication**: Login and registration with JWT tokens
- **Dashboard**: Overview of subscriptions and account activity
- **Subscription Management**: Browse plans, subscribe, and manage active subscriptions
- **Profile Management**: Update user profile information
- **Responsive Design**: Mobile-friendly interface
- **Modern UI**: Clean design with Shoelace components and Styled Components

## Technology Stack

- **React 19** with modern hooks and context
- **Vite** for fast development and building
- **TanStack Query** for server state management and caching
- **Styled Components** for component styling
- **Shoelace** UI component library
- **React Router** for navigation
- **Axios** for API communication

## Getting Started

### Prerequisites

- Node.js 18+ 
- Backend API running on `http://localhost:3000`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Layout.jsx      # Main application layout
├── contexts/           # React contexts
│   └── AuthContext.jsx # Authentication context and provider
├── hooks/              # Custom React hooks
│   └── useApi.js       # TanStack Query hooks for API calls
├── pages/              # Page components
│   ├── LoginPage.jsx   # User login
│   ├── RegisterPage.jsx # User registration
│   ├── DashboardPage.jsx # Main dashboard
│   ├── SubscriptionsPage.jsx # Subscription management
│   └── ProfilePage.jsx # User profile settings
├── services/           # API and external services
│   └── api.js          # Axios configuration and API functions
└── App.jsx             # Root application component
```

## Features Overview

### Authentication System
- JWT-based authentication with automatic token refresh
- Protected routes requiring authentication
- Persistent login state with localStorage
- Automatic logout on token expiration

### Dashboard
- Statistics overview (active subscriptions, total plans)
- Recent subscriptions list with status badges
- Quick action buttons
- Responsive cards layout

### Subscription Management
- Browse available subscription plans
- Interactive plan cards with pricing and features
- Subscribe to plans with loading states
- Manage active subscriptions
- Cancel subscriptions with confirmation
- Real-time subscription status updates

### Profile Management  
- View and edit user profile information
- Form validation with error handling
- Success/error message feedback
- Account information display
- Disabled email field (cannot be changed)

### Responsive Design
- Mobile-first approach
- Collapsible sidebar navigation on mobile
- Grid layouts that adapt to screen size
- Touch-friendly interface elements

## API Integration

The frontend integrates with the SubSync backend API:

- **Authentication**: `/api/auth/login`, `/api/auth/register`
- **Subscriptions**: `/api/subscriptions/plans`, `/api/subscriptions/subscribe`, `/api/subscriptions/my-subscriptions`
- **User Profile**: `/api/users/profile`
- **Health Check**: `/health`

### Request/Response Handling
- Automatic JWT token injection
- Global error handling for 401 responses
- Loading states for all API calls
- Optimistic updates with TanStack Query
- Smart caching and invalidation

## Styling

The application uses a combination of:

- **Styled Components** for component-level styling
- **Shoelace** for consistent UI components
- **Custom theme** with defined colors, spacing, and breakpoints
- **Global styles** for typography and base elements

### Theme Configuration
```javascript
const theme = {
  colors: {
    primary: '#3b82f6',
    success: '#10b981',
    danger: '#ef4444',
    // ... more colors
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    // ... more spacing
  }
}
```

## Environment Variables

- `VITE_API_URL`: Backend API base URL (default: http://localhost:3000)
- `VITE_APP_NAME`: Application name

## Browser Support

- Chrome (latest)
- Firefox (latest)  
- Safari (latest)
- Edge (latest)

## Development

### Code Structure
- Functional components with hooks
- Context for global state management
- Custom hooks for API logic
- Styled components for consistent styling

### Best Practices
- TypeScript-ready architecture
- Error boundary implementation
- Accessibility considerations
- Performance optimizations with React Query

## Production Build

Build the application for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory, ready for deployment to any static hosting service.