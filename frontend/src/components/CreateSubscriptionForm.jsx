import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { 
  BasicInformation, 
  LoginInformation, 
  SubscriptionDetails, 
  DeviceUsage, 
  SharingSection 
} from './adminsubscription';
import { Form, Button, ErrorMessage, Modal, ModalContent, ModalHeader, ModalTitle, CloseButton, ModalBody, ModalFooter } from './styles.jsx';

function CreateSubscriptionForm({ isOpen, onClose, subscription, onSuccess, usersData }) {
  const [formData, setFormData] = useState({
    serviceName: '',
    category: '',
    ownerType: 'Me',
    ownerName: '',
    loginUsernamePhone: '',
    password: '',
    passwordHint: '',
    purchasedDate: '',
    startDate: '',
    amount: '',
    planType: 'Monthly',
    customDurationValue: '',
    customDurationUnit: 'months',
    purchasedVia: '',
    autoPay: false,
    deviceLimit: 1,
    devicesInUse: 0,
    idsUsing: false, // boolean for sharing status
    comments: '',
    isSharing: false,
    includeMe: false,
    sharingDetails: [],
    idsUsingDetails: []
  });

  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!subscription;

  const resetForm = () => {
    const today = new Date().toISOString().split('T')[0];
    setFormData({
      serviceName: '',
      category: '',
      ownerType: 'Me',
      ownerName: '',
      loginUsernamePhone: '',
      password: '',
      passwordHint: '',
      purchasedDate: today,
      startDate: today,
      amount: '',
      planType: 'Monthly',
      customDurationValue: '',
      customDurationUnit: 'months',
      purchasedVia: '',
      autoPay: false,
      deviceLimit: 1,
      devicesInUse: 0,
      idsUsing: false, // boolean for sharing status
      comments: '',
      isSharing: false,
      includeMe: false,
      sharingDetails: [],
      idsUsingDetails: []
    });
    setErrors({});
    setError('');
  };

  const handleCancel = () => {
    if (!isEditing) {
      resetForm();
    }
    onClose();
  };

  useEffect(() => {
    if (subscription) {
      setFormData({
        serviceName: subscription.service_name || '',
        category: subscription.category || '',
        ownerType: subscription.owner_type || 'Me',
        ownerName: subscription.owner_name || '',
        loginUsernamePhone: subscription.login_username_phone || '',
        password: '', // Don't populate password for security
        passwordHint: subscription.password_hint || '',
        purchasedDate: subscription.purchased_date ? subscription.purchased_date.split('T')[0] : '',
        startDate: subscription.start_date ? subscription.start_date.split('T')[0] : '',
        amount: subscription.amount || '',
        planType: subscription.plan_type || 'Monthly',
        customDurationValue: subscription.custom_duration_value || '',
        customDurationUnit: subscription.custom_duration_unit || 'months',
        purchasedVia: subscription.purchased_via || '',
        autoPay: subscription.auto_pay || false,
        deviceLimit: subscription.device_limit || 1,
        devicesInUse: subscription.devices_in_use || 0,
        idsUsing: subscription.ids_using || false, // Already boolean from API
        comments: subscription.comments || '',
        isSharing: subscription.isSharing || false, // Use isSharing field from API
        includeMe: subscription.includeMe || false, // Add includeMe field
        sharingDetails: subscription.sharingDetails || [], // Use sharingDetails from API
        idsUsingDetails: subscription.idsUsingDetails || [] // Use idsUsingDetails from API
      });
    } else {
      // Set default start date to today
      const today = new Date().toISOString().split('T')[0];
      setFormData(prev => ({
        ...prev,
        purchasedDate: today,
        startDate: today
      }));
    }
  }, [subscription]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
    setError('');
  };

  const addSharingPerson = () => {
    setFormData(prev => ({
      ...prev,
      sharingDetails: [...prev.sharingDetails, {
        userId: '',
        nonRegisteredName: '',
        nonRegisteredEmail: '',
        paymentStatus: 'not_paid',
        paymentDate: ''
      }]
    }));
  };

  const removeSharingPerson = (index) => {
    setFormData(prev => ({
      ...prev,
      sharingDetails: prev.sharingDetails.filter((_, i) => i !== index)
    }));
  };

  const updateSharingPerson = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      sharingDetails: prev.sharingDetails.map((person, i) => 
        i === index ? { ...person, [field]: value } : person
      )
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.serviceName.trim()) newErrors.serviceName = 'Service name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.loginUsernamePhone.trim()) newErrors.loginUsernamePhone = 'Login credential is required';
    if (!formData.purchasedDate) newErrors.purchasedDate = 'Purchased date is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = 'Valid amount is required';
    if (!formData.purchasedVia) newErrors.purchasedVia = 'Purchase method is required';

    if (formData.planType === 'Custom') {
      if (!formData.customDurationValue || parseInt(formData.customDurationValue) <= 0) {
        newErrors.customDurationValue = 'Valid duration is required for custom plan';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const submitData = {
        ...formData,
        amount: parseFloat(formData.amount),
        deviceLimit: parseInt(formData.deviceLimit),
        devicesInUse: parseInt(formData.devicesInUse),
        customDurationValue: formData.customDurationValue ? parseInt(formData.customDurationValue) : null,
        idsUsing: formData.idsUsing, // Use idsUsing boolean field
        idsUsingDetails: (formData.idsUsingDetails || []).map(user => ({
          userId: user.isCustom ? null : user.id,
          name: user.name,
          email: user.isCustom ? user.name : user.email,
          isCustom: user.isCustom
        }))
      };

      // Remove unused fields (keep shared field in payload)
      // delete submitData.shared; // Keep this field

      if (isEditing) {
        await adminAPI.updateAdminSubscription(subscription.id, submitData);
      } else {
        await adminAPI.createSubscription(submitData);
        resetForm(); // Reset form only for new subscriptions
      }

      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || `Failed to ${isEditing ? 'update' : 'create'} subscription`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal onClick={(e) => e.target === e.currentTarget && handleCancel()}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>
            {isEditing ? 'Edit Subscription' : 'Create New Subscription'}
          </ModalTitle>
          <CloseButton onClick={handleCancel}>×</CloseButton>
        </ModalHeader>

        <ModalBody>
          <Form onSubmit={handleSubmit}>
            {error && <ErrorMessage>{error}</ErrorMessage>}

            <BasicInformation 
              formData={formData}
              errors={errors}
              onChange={handleChange}
            />

            <LoginInformation 
              formData={formData}
              errors={errors}
              onChange={handleChange}
              isEditing={isEditing}
            />

            <SubscriptionDetails 
              formData={formData}
              errors={errors}
              onChange={handleChange}
            />

            <DeviceUsage 
              formData={formData}
              onChange={handleChange}
              usersData={usersData}
            />

            <SharingSection 
              formData={formData}
              onChange={handleChange}
              usersData={usersData}
              onAddSharingPerson={addSharingPerson}
              onRemoveSharingPerson={removeSharingPerson}
              onUpdateSharingPerson={updateSharingPerson}
            />
          </Form>
        </ModalBody>

        <ModalFooter>
          <Button variant="secondary" type="button" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? (isEditing ? 'Updating...' : 'Creating...') 
              : (isEditing ? 'Update Subscription' : 'Create Subscription')
            }
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default CreateSubscriptionForm;