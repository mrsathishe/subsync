import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Tailwind CSS Components
const PageContainer = ({ children }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-600 to-brand-700 p-6">
    {children}
  </div>
);

const LoginCard = ({ children }) => (
  <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
    {children}
  </div>
);

const Logo = ({ children }) => (
  <h1 className="text-center text-3xl font-bold text-brand-600 mb-6">
    {children}
  </h1>
);

const Form = ({ children, ...props }) => (
  <form className="flex flex-col gap-4" {...props}>
    {children}
  </form>
);

const InputGroup = ({ children }) => (
  <div className="flex flex-col">
    {children}
  </div>
);

const Label = ({ children, ...props }) => (
  <label className="text-sm font-semibold text-gray-700 mb-2" {...props}>
    {children}
  </label>
);

const Input = ({ ...props }) => (
  <input 
    className="p-3 border border-gray-300 rounded-md text-base transition-all focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 invalid:border-red-500"
    {...props}
  />
);

const Button = ({ children, disabled, ...props }) => (
  <button 
    className={`p-3 rounded-md text-base font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-brand-400 ${
      disabled 
        ? 'bg-gray-400 text-white cursor-not-allowed' 
        : 'bg-brand-600 text-white cursor-pointer hover:bg-brand-700'
    }`}
    disabled={disabled}
    {...props}
  >
    {children}
  </button>
);

const ErrorMessage = ({ children }) => (
  <div className="bg-red-50 text-red-600 p-3 rounded-md border border-red-200 text-sm mb-4">
    {children}
  </div>
);

const LinkContainer = ({ children }) => (
  <div className="text-center mt-4">
    {children}
  </div>
);

const StyledLink = ({ children, ...props }) => (
  <Link className="text-brand-600 no-underline text-sm hover:underline" {...props}>
    {children}
  </Link>
);

function LoginPage() {
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsLoading(true);
    setError('');

    try {
      const result = await login(formData.emailOrPhone, formData.password);
      if (result.success) {
        navigate('/subscriptions');
      } else {
        setError(result.error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer>
      <LoginCard>
        <Logo>SubSync</Logo>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Form onSubmit={handleSubmit} noValidate>
          <InputGroup>
            <Label htmlFor="emailOrPhone">Email or Phone Number</Label>
            <Input
              id="emailOrPhone"
              name="emailOrPhone"
              type="text"
              value={formData.emailOrPhone}
              onChange={handleChange}
              required
              placeholder="Enter your email or phone number"
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </InputGroup>

          <Button type="submit" disabled={isLoading || !formData.emailOrPhone.trim() || !formData.password.trim()}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </Form>

        <LinkContainer>
          Don't have an account? <StyledLink to="/register">Sign up</StyledLink>
        </LinkContainer>
      </LoginCard>
    </PageContainer>
  );
}

export default LoginPage;