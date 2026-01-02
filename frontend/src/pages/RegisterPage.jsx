import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Footer from '../components/Footer';

// Tailwind CSS Components
const PageContainer = ({ children }) => (
  <div className="min-h-screen flex flex-col justify-between bg-gray-50">
    {children}
  </div>
);

const MainContent = ({ children }) => (
  <div className="flex items-center justify-center flex-1 p-6">
    {children}
  </div>
);

const RegisterCard = ({ children }) => (
  <div className="bg-white p-8 rounded-lg border-2 border-brand-600 shadow-2xl shadow-brand-600/25 w-full max-w-md">
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

const InputRow = ({ children }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

const Select = ({ children, ...props }) => (
  <select 
    className="p-3 border border-gray-300 rounded-md text-base transition-all bg-white focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
    {...props}
  >
    {children}
  </select>
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

function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
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
    setIsLoading(true);
    setError('');

    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...registrationData } = formData;
      const result = await register(registrationData);
      
      if (result.success) {
        navigate('/subscriptions');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer>
      <MainContent>
        <RegisterCard>
        <Logo>SubSync</Logo>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Form onSubmit={handleSubmit}>
          <InputRow>
            <InputGroup>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                required
                placeholder="First name"
              />
            </InputGroup>

            <InputGroup>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                required
                placeholder="Last name"
              />
            </InputGroup>
          </InputRow>

          <InputGroup>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="Enter your phone number"
            />
          </InputGroup>

          <InputRow>
            <InputGroup>
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
              />
            </InputGroup>

            <InputGroup>
              <Label htmlFor="gender">Gender</Label>
              <Select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </Select>
            </InputGroup>
          </InputRow>

          <InputGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Create a password"
              minLength={6}
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
              minLength={6}
            />
          </InputGroup>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </Form>

        <LinkContainer>
          Already have an account? <StyledLink to="/login">Sign in</StyledLink>
        </LinkContainer>
        </RegisterCard>
      </MainContent>
      <Footer />
    </PageContainer>
  );
}

export default RegisterPage;