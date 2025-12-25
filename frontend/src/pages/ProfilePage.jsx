import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useUserProfile, useUpdateProfile } from '../hooks/useApi';

const PageContainer = ({ children }) => (
  <div className="max-w-3xl mx-auto">
    {children}
  </div>
);

const PageHeader = ({ children }) => (
  <div className="mb-8">
    {children}
  </div>
);

const PageTitle = ({ children }) => (
  <h1 className="text-3xl font-bold text-gray-900 mb-1">
    {children}
  </h1>
);

const PageSubtitle = ({ children }) => (
  <p className="text-gray-600 text-lg">
    {children}
  </p>
);

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children }) => (
  <div className="p-6 border-b border-gray-200">
    {children}
  </div>
);

const CardTitle = ({ children }) => (
  <h2 className="text-xl font-semibold text-gray-900 m-0">
    {children}
  </h2>
);

const CardContent = ({ children }) => (
  <div className="p-6">
    {children}
  </div>
);

const Form = ({ children, onSubmit }) => (
  <form className="flex flex-col gap-6" onSubmit={onSubmit}>
    {children}
  </form>
);

const FormRow = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {children}
  </div>
);

const InputGroup = ({ children }) => (
  <div className="flex flex-col">
    {children}
  </div>
);

const Label = ({ children, htmlFor }) => (
  <label htmlFor={htmlFor} className="text-sm font-semibold text-gray-700 mb-2">
    {children}
  </label>
);

const Input = (props) => (
  <input
    {...props}
    className="p-3 border border-gray-300 rounded-md text-base transition-all focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100 invalid:border-red-500 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
  />
);

const ButtonGroup = ({ children }) => (
  <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
    {children}
  </div>
);

const Button = ({ children, variant, disabled, ...props }) => {
  const baseClasses = "px-6 py-3 rounded-md text-sm font-semibold transition-all focus:ring-2 focus:ring-brand-100";
  const primaryClasses = disabled 
    ? "bg-gray-400 text-white cursor-not-allowed" 
    : "bg-brand-600 text-white hover:bg-brand-700 cursor-pointer";
  const secondaryClasses = disabled 
    ? "border border-gray-300 bg-white text-gray-400 cursor-not-allowed" 
    : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 cursor-pointer";
  
  const classes = `${baseClasses} ${variant === 'secondary' ? secondaryClasses : primaryClasses}`;
  
  return (
    <button {...props} disabled={disabled} className={classes}>
      {children}
    </button>
  );
};

const SuccessMessage = ({ children }) => (
  <div className="bg-green-50 text-green-700 p-3 rounded-md border border-green-200 text-sm mb-4">
    {children}
  </div>
);

const ErrorMessage = ({ children }) => (
  <div className="bg-red-50 text-red-700 p-3 rounded-md border border-red-200 text-sm mb-4">
    {children}
  </div>
);

const LoadingState = ({ children }) => (
  <div className="flex items-center justify-center p-8 text-gray-500">
    {children}
  </div>
);

const InfoSection = ({ children }) => (
  <div className="bg-gray-50 p-4 rounded-md mb-6">
    {children}
  </div>
);

const InfoLabel = ({ children }) => (
  <span className="text-sm font-semibold text-gray-700">
    {children}
  </span>
);

const InfoValue = ({ children }) => (
  <span className="text-sm text-gray-900 ml-3">
    {children}
  </span>
);

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
              <div className="mb-2">
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

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Account Security</CardTitle>
        </CardHeader>
        <CardContent>
          <InfoSection>
            <p className="text-gray-500 m-0 text-sm leading-6">
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