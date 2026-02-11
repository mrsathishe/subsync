import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Footer from '../components/Footer';
import {
  PageContainer,
  AuthMainContent,
  AuthCard,
  AuthLogo,
  AuthForm,
  AuthInputGroup,
  AuthInputRow,
  AuthLabel,
  AuthInput,
  AuthSelect,
  AuthButton,
  AuthErrorMessage,
  AuthLinkContainer,
  AuthStyledLink
} from '../components/styles';

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
      const { confirmPassword, dateOfBirth, gender, ...baseData } = formData;
      
      // Only include dateOfBirth and gender if they have values
      const registrationData = {
        ...baseData,
        ...(dateOfBirth && { dateOfBirth }),
        ...(gender && { gender })
      };
      
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
      <AuthMainContent>
        <AuthCard>
        <AuthLogo>SubSync</AuthLogo>
        
        {error && <AuthErrorMessage>{error}</AuthErrorMessage>}
        
        <AuthForm onSubmit={handleSubmit}>
          <AuthInputRow>
            <AuthInputGroup>
              <AuthLabel htmlFor="firstName">First Name</AuthLabel>
              <AuthInput
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                required
                placeholder="First name"
              />
            </AuthInputGroup>

            <AuthInputGroup>
              <AuthLabel htmlFor="lastName">Last Name</AuthLabel>
              <AuthInput
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                required
                placeholder="Last name"
              />
            </AuthInputGroup>
          </AuthInputRow>

          <AuthInputGroup>
            <AuthLabel htmlFor="email">Email Address</AuthLabel>
            <AuthInput
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </AuthInputGroup>

          <AuthInputGroup>
            <AuthLabel htmlFor="phone">Phone Number</AuthLabel>
            <AuthInput
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="Enter your phone number"
            />
          </AuthInputGroup>

          <AuthInputRow>
            <AuthInputGroup>
              <AuthLabel htmlFor="dateOfBirth">Date of Birth (Optional)</AuthLabel>
              <AuthInput
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </AuthInputGroup>

            <AuthInputGroup>
              <AuthLabel htmlFor="gender">Gender (Optional)</AuthLabel>
              <AuthSelect
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </AuthSelect>
            </AuthInputGroup>
          </AuthInputRow>

          <AuthInputGroup>
            <AuthLabel htmlFor="password">Password</AuthLabel>
            <AuthInput
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Create a password"
              minLength={6}
            />
          </AuthInputGroup>

          <AuthInputGroup>
            <AuthLabel htmlFor="confirmPassword">Confirm Password</AuthLabel>
            <AuthInput
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
              minLength={6}
            />
          </AuthInputGroup>

          <AuthButton type="submit" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </AuthButton>
        </AuthForm>

        <AuthLinkContainer>
          Already have an account? <AuthStyledLink to="/login">Sign in</AuthStyledLink>
        </AuthLinkContainer>
        </AuthCard>
      </AuthMainContent>
      <Footer />
    </PageContainer>
  );
}

export default RegisterPage;