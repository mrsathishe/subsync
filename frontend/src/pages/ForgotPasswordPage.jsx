import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Reusable Components (same as LoginPage)
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

const SuccessMessage = ({ children }) => (
  <div className="bg-green-50 text-green-600 p-3 rounded-md border border-green-200 text-sm mb-4">
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

function ForgotPasswordPage() {
  const [step, setStep] = useState('verify'); // 'verify' or 'reset'
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    dateOfBirth: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleVerifyUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/verify-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          phone: formData.phone,
          dateOfBirth: formData.dateOfBirth
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStep('reset');
        setSuccess('User verified successfully. Please enter your new password.');
      } else {
        setError(data.error || 'User verification failed. Please check your details.');
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          phone: formData.phone,
          dateOfBirth: formData.dateOfBirth,
          newPassword: formData.newPassword
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Password reset successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(data.error || 'Password reset failed. Please try again.');
      }
    } catch (err) {
      console.error('Reset password error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer>
      <LoginCard>
        <Logo>Reset Password</Logo>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}
        
        {step === 'verify' ? (
          <Form onSubmit={handleVerifyUser} noValidate>
            <div className="text-sm text-gray-600 mb-4">
              Please enter your account details to verify your identity:
            </div>
            
            <InputGroup>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email address"
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

            <Button 
              type="submit" 
              disabled={isLoading || !formData.email.trim() || !formData.phone.trim() || !formData.dateOfBirth}
            >
              {isLoading ? 'Verifying...' : 'Verify Identity'}
            </Button>
          </Form>
        ) : (
          <Form onSubmit={handleResetPassword} noValidate>
            <div className="text-sm text-gray-600 mb-4">
              Enter your new password:
            </div>
            
            <InputGroup>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleChange}
                required
                placeholder="Enter new password"
                minLength={6}
              />
            </InputGroup>

            <InputGroup>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm new password"
                minLength={6}
              />
            </InputGroup>

            <Button 
              type="submit" 
              disabled={isLoading || !formData.newPassword.trim() || !formData.confirmPassword.trim()}
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </Form>
        )}

        <LinkContainer>
          <StyledLink to="/login">Back to Login</StyledLink>
        </LinkContainer>
      </LoginCard>
    </PageContainer>
  );
}

export default ForgotPasswordPage;