import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useUserProfile, useUpdateProfile } from '../hooks/useApi';
import styled from 'styled-components';

const PageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: ${props => props.theme.colors.gray[900]};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const PageSubtitle = styled.p`
  color: ${props => props.theme.colors.gray[600]};
  font-size: 1.125rem;
`;

const Card = styled.div`
  background: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.sm};
  border: 1px solid ${props => props.theme.colors.gray[200]};
  overflow: hidden;
`;

const CardHeader = styled.div`
  padding: ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.colors.gray[200]};
`;

const CardTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.gray[900]};
  margin: 0;
`;

const CardContent = styled.div`
  padding: ${props => props.theme.spacing.lg};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing.md};

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.gray[700]};
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  padding: ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 1rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  &:invalid {
    border-color: ${props => props.theme.colors.danger};
  }

  &:disabled {
    background-color: ${props => props.theme.colors.gray[100]};
    color: ${props => props.theme.colors.gray[500]};
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  justify-content: flex-end;
  padding-top: ${props => props.theme.spacing.md};
  border-top: 1px solid ${props => props.theme.colors.gray[200]};
`;

const Button = styled.button`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  border: ${props => props.variant === 'secondary' ? `1px solid ${props.theme.colors.gray[300]}` : 'none'};
  background: ${props => {
    if (props.disabled) return props.theme.colors.gray[400];
    if (props.variant === 'secondary') return 'white';
    return props.theme.colors.primary;
  }};
  color: ${props => {
    if (props.disabled) return 'white';
    if (props.variant === 'secondary') return props.theme.colors.gray[700];
    return 'white';
  }};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: ${props => {
      if (props.variant === 'secondary') return props.theme.colors.gray[50];
      return props.theme.colors.primaryHover;
    }};
  }
`;

const SuccessMessage = styled.div`
  background: ${props => props.theme.colors.success}10;
  color: ${props => props.theme.colors.success};
  padding: ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.success}30;
  font-size: 0.875rem;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const ErrorMessage = styled.div`
  background: ${props => props.theme.colors.danger}10;
  color: ${props => props.theme.colors.danger};
  padding: ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.danger}30;
  font-size: 0.875rem;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const LoadingState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.xl};
  color: ${props => props.theme.colors.gray[500]};
`;

const InfoSection = styled.div`
  background: ${props => props.theme.colors.gray[50]};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const InfoLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.gray[700]};
`;

const InfoValue = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.gray[900]};
  margin-left: ${props => props.theme.spacing.sm};
`;

function ProfilePage() {
  const { user } = useAuth();
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const updateProfileMutation = useUpdateProfile();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Update form when profile data loads
  React.useEffect(() => {
    if (profile) {
      const newFormData = {
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        phone: profile.phone || '',
      };
      setFormData(newFormData);
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setHasChanges(true);
    
    // Clear messages when user starts typing
    if (successMessage) setSuccessMessage('');
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    try {
      await updateProfileMutation.mutateAsync(formData);
      setSuccessMessage('Profile updated successfully!');
      setHasChanges(false);
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'Failed to update profile. Please try again.');
    }
  };

  const handleReset = () => {
    if (profile) {
      setFormData({
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        phone: profile.phone || '',
      });
      setHasChanges(false);
      setSuccessMessage('');
      setErrorMessage('');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (profileLoading) {
    return (
      <PageContainer>
        <LoadingState>Loading your profile...</LoadingState>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Profile Settings</PageTitle>
        <PageSubtitle>Manage your account information and preferences.</PageSubtitle>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          {profile && (
            <InfoSection>
              <div style={{ marginBottom: '0.5rem' }}>
                <InfoLabel>Member since:</InfoLabel>
                <InfoValue>{formatDate(profile.created_at)}</InfoValue>
              </div>
              <div>
                <InfoLabel>Account ID:</InfoLabel>
                <InfoValue>#{profile.id}</InfoValue>
              </div>
            </InfoSection>
          )}

          {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

          <Form onSubmit={handleSubmit}>
            <FormRow>
              <InputGroup>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  placeholder="Enter your first name"
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
                  placeholder="Enter your last name"
                />
              </InputGroup>
            </FormRow>

            <InputGroup>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={profile?.email || ''}
                disabled
                placeholder="Email cannot be changed"
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
                placeholder="Enter your phone number"
              />
            </InputGroup>

            <ButtonGroup>
              <Button
                type="button"
                variant="secondary"
                onClick={handleReset}
                disabled={!hasChanges || updateProfileMutation.isPending}
              >
                Reset Changes
              </Button>
              <Button
                type="submit"
                disabled={!hasChanges || updateProfileMutation.isPending}
              >
                {updateProfileMutation.isPending ? 'Updating...' : 'Save Changes'}
              </Button>
            </ButtonGroup>
          </Form>
        </CardContent>
      </Card>

      <Card style={{ marginTop: '2rem' }}>
        <CardHeader>
          <CardTitle>Account Security</CardTitle>
        </CardHeader>
        <CardContent>
          <InfoSection>
            <p style={{ 
              color: '#6b7280', 
              margin: 0,
              fontSize: '0.875rem',
              lineHeight: '1.5'
            }}>
              To change your password or update security settings, please contact our support team. 
              We take account security seriously and require additional verification for these changes.
            </p>
          </InfoSection>
          
          <Button variant="secondary" disabled>
            Change Password (Coming Soon)
          </Button>
        </CardContent>
      </Card>
    </PageContainer>
  );
}

export default ProfilePage;