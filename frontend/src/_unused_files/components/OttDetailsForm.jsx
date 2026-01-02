import React, { useState, useEffect } from 'react';
import { useOttDetails, useSaveOttDetails, useDeleteOttDetails } from '../hooks/useApi';

// Tailwind CSS Components for OttDetailsForm
const Modal = ({ children, onClick }) => (
  <div 
    onClick={onClick}
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
  >
    {children}
  </div>
);

const ModalContent = ({ children }) => (
  <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
    {children}
  </div>
);

const ModalHeader = ({ children }) => (
  <div className="p-6 border-b border-gray-200 flex justify-between items-center">
    {children}
  </div>
);

const ModalTitle = ({ children }) => (
  <h2 className="text-2xl font-bold text-gray-900 m-0 flex items-center gap-2">
    {children}
  </h2>
);

const CloseButton = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="bg-none border-none text-2xl cursor-pointer text-gray-500 hover:text-gray-700 transition-colors"
  >
    {children}
  </button>
);

const ModalBody = ({ children }) => (
  <div className="p-6">
    {children}
  </div>
);

const Form = ({ children, onSubmit }) => (
  <form onSubmit={onSubmit} className="flex flex-col gap-6">
    {children}
  </form>
);

const FormSection = ({ children, isLast = false }) => (
  <div className={`${!isLast ? 'border-b border-gray-200 pb-6' : ''}`}>
    {children}
  </div>
);

const SectionTitle = ({ children }) => (
  <h3 className="text-lg font-semibold text-gray-800 m-0 mb-4">
    {children}
  </h3>
);

const InputGroup = ({ children }) => (
  <div className="flex flex-col gap-2">
    {children}
  </div>
);

const InputRow = ({ children }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {children}
  </div>
);

const Label = ({ children, htmlFor }) => (
  <label htmlFor={htmlFor} className="text-sm font-semibold text-gray-700">
    {children}
  </label>
);

const Input = ({ id, name, type, value, onChange, placeholder, className = "" }) => (
  <input
    id={id}
    name={name}
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`p-2 border border-gray-300 rounded-md text-base transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${className}`}
  />
);

const Select = ({ id, name, value, onChange, children }) => (
  <select
    id={id}
    name={name}
    value={value}
    onChange={onChange}
    className="p-2 border border-gray-300 rounded-md text-base bg-white transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
  >
    {children}
  </select>
);

const TextArea = ({ id, name, value, onChange, placeholder }) => (
  <textarea
    id={id}
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="p-2 border border-gray-300 rounded-md text-base resize-y min-h-20 transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
  />
);

const CheckboxContainer = ({ children }) => (
  <div className="flex items-center gap-2">
    {children}
  </div>
);

const Checkbox = ({ id, name, type, checked, onChange }) => (
  <input
    id={id}
    name={name}
    type={type}
    checked={checked}
    onChange={onChange}
    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
  />
);

const SharedWithContainer = ({ children }) => (
  <div className="flex flex-col gap-2">
    {children}
  </div>
);

const SharedPersonInput = ({ children }) => (
  <div className="flex gap-2 items-center flex-wrap">
    {children}
  </div>
);

const RemoveButton = ({ type, onClick, children }) => (
  <button
    type={type}
    onClick={onClick}
    className="bg-red-500 text-white border-none rounded-md px-2 py-1 text-xs cursor-pointer hover:bg-red-600 transition-colors duration-200 whitespace-nowrap"
  >
    {children}
  </button>
);

const AddButton = ({ type, onClick, children }) => (
  <button
    type={type}
    onClick={onClick}
    className="bg-green-500 text-white border-none rounded-md px-4 py-2 text-sm cursor-pointer self-start hover:bg-green-600 transition-colors duration-200"
  >
    {children}
  </button>
);

const ModalFooter = ({ children }) => (
  <div className="p-6 border-t border-gray-200 flex justify-between gap-4">
    {children}
  </div>
);

const Button = ({ variant, type, onClick, disabled, children }) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-500 text-white hover:bg-blue-600 disabled:hover:bg-blue-500';
      case 'secondary':
        return 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50';
      case 'danger':
        return 'bg-red-500 text-white hover:bg-red-600 disabled:hover:bg-red-500';
      default:
        return 'bg-gray-500 text-white hover:bg-gray-600';
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-2 rounded-md text-base font-semibold cursor-pointer transition-all duration-200 border-none disabled:opacity-60 disabled:cursor-not-allowed ${getVariantClasses()}`}
    >
      {children}
    </button>
  );
};

const LoadingState = ({ children }) => (
  <div className="flex items-center justify-center p-6 text-gray-500">
    {children}
  </div>
);

const ErrorMessage = ({ children }) => (
  <div className="bg-red-50 text-red-600 p-2 rounded-md border border-red-200 text-sm mb-4">
    {children}
  </div>
);

function OttDetailsForm({ subscriptionId, planName, providerName, isOpen, onClose }) {
  const [formData, setFormData] = useState({
    accountEmail: '',
    accountPasswordHint: '',
    profileName: '',
    simultaneousStreams: 1,
    videoQuality: 'HD',
    downloadEnabled: false,
    sharedWith: [],
    notes: ''
  });
  
  const [error, setError] = useState('');

  const { data: existingDetails, isLoading } = useOttDetails(subscriptionId);
  const saveOttDetailsMutation = useSaveOttDetails();
  const deleteOttDetailsMutation = useDeleteOttDetails();

  useEffect(() => {
    if (existingDetails) {
      setFormData({
        accountEmail: existingDetails.account_email || '',
        accountPasswordHint: existingDetails.account_password_hint || '',
        profileName: existingDetails.profile_name || '',
        simultaneousStreams: existingDetails.simultaneous_streams || 1,
        videoQuality: existingDetails.video_quality || 'HD',
        downloadEnabled: existingDetails.download_enabled || false,
        sharedWith: existingDetails.shared_with || [],
        notes: existingDetails.notes || ''
      });
    }
  }, [existingDetails]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleAddSharedPerson = () => {
    setFormData(prev => ({
      ...prev,
      sharedWith: [...prev.sharedWith, { name: '', email: '', relationship: '' }]
    }));
  };

  const handleRemoveSharedPerson = (index) => {
    setFormData(prev => ({
      ...prev,
      sharedWith: prev.sharedWith.filter((_, i) => i !== index)
    }));
  };

  const handleSharedPersonChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      sharedWith: prev.sharedWith.map((person, i) => 
        i === index ? { ...person, [field]: value } : person
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await saveOttDetailsMutation.mutateAsync({
        subscriptionId,
        accountEmail: formData.accountEmail,
        accountPasswordHint: formData.accountPasswordHint,
        profileName: formData.profileName,
        simultaneousStreams: parseInt(formData.simultaneousStreams),
        videoQuality: formData.videoQuality,
        downloadEnabled: formData.downloadEnabled,
        sharedWith: formData.sharedWith,
        notes: formData.notes
      });
      
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save OTT details');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete these OTT details?')) {
      try {
        await deleteOttDetailsMutation.mutateAsync(subscriptionId);
        onClose();
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete OTT details');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <Modal onClick={(e) => e.target === e.currentTarget && onClose()}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>
            📺 OTT Details - {planName}
          </ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        <ModalBody>
          {isLoading ? (
            <LoadingState>Loading OTT details...</LoadingState>
          ) : (
            <Form onSubmit={handleSubmit}>
              {error && <ErrorMessage>{error}</ErrorMessage>}

              <FormSection>
                <SectionTitle>Account Information</SectionTitle>
                <InputGroup>
                  <Label htmlFor="accountEmail">Account Email</Label>
                  <Input
                    id="accountEmail"
                    name="accountEmail"
                    type="email"
                    value={formData.accountEmail}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                  />
                </InputGroup>
                
                <InputGroup>
                  <Label htmlFor="accountPasswordHint">Password Hint (Optional)</Label>
                  <Input
                    id="accountPasswordHint"
                    name="accountPasswordHint"
                    type="text"
                    value={formData.accountPasswordHint}
                    onChange={handleChange}
                    placeholder="e.g., pet's name + birth year"
                  />
                </InputGroup>
              </FormSection>

              <FormSection>
                <SectionTitle>Streaming Preferences</SectionTitle>
                <InputRow>
                  <InputGroup>
                    <Label htmlFor="profileName">Profile Name</Label>
                    <Input
                      id="profileName"
                      name="profileName"
                      type="text"
                      value={formData.profileName}
                      onChange={handleChange}
                      placeholder="Main, Kids, etc."
                    />
                  </InputGroup>
                  
                  <InputGroup>
                    <Label htmlFor="simultaneousStreams">Simultaneous Streams</Label>
                    <Select
                      id="simultaneousStreams"
                      name="simultaneousStreams"
                      value={formData.simultaneousStreams}
                      onChange={handleChange}
                    >
                      <option value={1}>1 Screen</option>
                      <option value={2}>2 Screens</option>
                      <option value={3}>3 Screens</option>
                      <option value={4}>4 Screens</option>
                      <option value={5}>5+ Screens</option>
                    </Select>
                  </InputGroup>
                </InputRow>
                
                <InputRow>
                  <InputGroup>
                    <Label htmlFor="videoQuality">Video Quality</Label>
                    <Select
                      id="videoQuality"
                      name="videoQuality"
                      value={formData.videoQuality}
                      onChange={handleChange}
                    >
                      <option value="SD">Standard Definition (SD)</option>
                      <option value="HD">High Definition (HD)</option>
                      <option value="FHD">Full HD (1080p)</option>
                      <option value="4K">Ultra HD (4K)</option>
                    </Select>
                  </InputGroup>
                  
                  <InputGroup>
                    <CheckboxContainer>
                      <Checkbox
                        id="downloadEnabled"
                        name="downloadEnabled"
                        type="checkbox"
                        checked={formData.downloadEnabled}
                        onChange={handleChange}
                      />
                      <Label htmlFor="downloadEnabled">Download Available</Label>
                    </CheckboxContainer>
                  </InputGroup>
                </InputRow>
              </FormSection>

              <FormSection>
                <SectionTitle>Shared Access</SectionTitle>
                <SharedWithContainer>
                  {formData.sharedWith.map((person, index) => (
                    <SharedPersonInput key={index}>
                      <Input
                        type="text"
                        placeholder="Name"
                        value={person.name}
                        onChange={(e) => handleSharedPersonChange(index, 'name', e.target.value)}
                        className="flex-1 min-w-0"
                      />
                      <Input
                        type="email"
                        placeholder="Email"
                        value={person.email}
                        onChange={(e) => handleSharedPersonChange(index, 'email', e.target.value)}
                        className="flex-1 min-w-0"
                      />
                      <Input
                        type="text"
                        placeholder="Relationship"
                        value={person.relationship}
                        onChange={(e) => handleSharedPersonChange(index, 'relationship', e.target.value)}
                        className="flex-1 min-w-0"
                      />
                      <RemoveButton 
                        type="button"
                        onClick={() => handleRemoveSharedPerson(index)}
                      >
                        Remove
                      </RemoveButton>
                    </SharedPersonInput>
                  ))}
                  <AddButton type="button" onClick={handleAddSharedPerson}>
                    Add Person
                  </AddButton>
                </SharedWithContainer>
              </FormSection>

              <FormSection isLast={true}>
                <SectionTitle>Additional Notes</SectionTitle>
                <InputGroup>
                  <Label htmlFor="notes">Notes</Label>
                  <TextArea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Any additional information about this subscription..."
                  />
                </InputGroup>
              </FormSection>
            </Form>
          )}
        </ModalBody>

        <ModalFooter>
          <div>
            {existingDetails && (
              <Button
                variant="danger"
                type="button"
                onClick={handleDelete}
                disabled={deleteOttDetailsMutation.isPending}
              >
                {deleteOttDetailsMutation.isPending ? 'Deleting...' : 'Delete'}
              </Button>
            )}
          </div>
          
          <div className="flex gap-3">
            <Button variant="secondary" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={saveOttDetailsMutation.isPending || isLoading}
            >
              {saveOttDetailsMutation.isPending ? 'Saving...' : 'Save Details'}
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default OttDetailsForm;