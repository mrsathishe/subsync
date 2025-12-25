import React, { useState, useEffect } from 'react';
import { useCreateAdminSubscription, useAdminUsers } from '../hooks/useApi';
import ModalWrapper from './ModalWrapper';
import { FormSection, InputField, SelectField, TextAreaField, CheckboxField, InputRow } from './FormComponents';
import TagsInput from './TagsInput';
import { Form, Button, ErrorMessage, InputGroup, Label } from './styles';

function AddSubscriptionForm({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    serviceName: '',
    category: '',
    user: 'Me',
    loginId: '',
    password: '',
    purchasedDate: new Date().toISOString().split('T')[0],
    startDate: new Date().toISOString().split('T')[0],
    amount: '',
    planType: 'Monthly',
    customDuration: '',
    customDurationUnit: 'months',
    endDate: '',
    purchasedVia: '',
    autoPay: false,
    nextPurchaseDate: '',
    deviceLimit: 1,
    devicesInUse: 0,
    idsUsing: [],
    comments: '',
    shared: false
  });

  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [userSuggestions, setUserSuggestions] = useState([]);

  const { data: usersData } = useAdminUsers(1, 100);
  const createMutation = useCreateAdminSubscription();

  const categoryOptions = [
    { value: 'OTT', label: '📺 OTT' },
    { value: 'Mobile', label: '📱 Mobile' },
    { value: 'Broadband', label: '🌐 Broadband' }
  ];

  const userOptions = [
    { value: 'Me', label: 'Me' },
    { value: 'Friend', label: 'Friend' },
    { value: 'Mom', label: 'Mom' },
    { value: 'Dad', label: 'Dad' },
    { value: 'Wife', label: 'Wife' },
    { value: 'Sister', label: 'Sister' }
  ];

  const planTypeOptions = [
    { value: 'Monthly', label: 'Monthly' },
    { value: '3 Months', label: '3 Months' },
    { value: '6 Months', label: '6 Months' },
    { value: 'Yearly', label: 'Yearly' },
    { value: 'Custom', label: 'Custom' }
  ];

  const durationUnitOptions = [
    { value: 'days', label: 'Days' },
    { value: 'months', label: 'Months' },
    { value: 'years', label: 'Years' }
  ];

  const paymentMethodOptions = [
    { value: 'GPay', label: 'GPay' },
    { value: 'Redeem Points', label: 'Redeem Points' },
    { value: 'Credit Card', label: 'Credit Card' }
  ];

  // Auto-calculate end date based on plan type and start date
  useEffect(() => {
    if (formData.startDate && (formData.planType !== 'Custom' || (formData.planType === 'Custom' && formData.customDuration))) {
      const startDate = new Date(formData.startDate);
      let endDate = new Date(startDate);

      switch (formData.planType) {
        case 'Monthly':
          endDate.setMonth(endDate.getMonth() + 1);
          break;
        case '3 Months':
          endDate.setMonth(endDate.getMonth() + 3);
          break;
        case '6 Months':
          endDate.setMonth(endDate.getMonth() + 6);
          break;
        case 'Yearly':
          endDate.setFullYear(endDate.getFullYear() + 1);
          break;
        case 'Custom':
          const duration = parseInt(formData.customDuration);
          if (duration > 0) {
            switch (formData.customDurationUnit) {
              case 'days':
                endDate.setDate(endDate.getDate() + duration);
                break;
              case 'months':
                endDate.setMonth(endDate.getMonth() + duration);
                break;
              case 'years':
                endDate.setFullYear(endDate.getFullYear() + duration);
                break;
            }
          }
          break;
      }

      setFormData(prev => ({
        ...prev,
        endDate: endDate.toISOString().split('T')[0],
        nextPurchaseDate: endDate.toISOString().split('T')[0]
      }));
    }
  }, [formData.startDate, formData.planType, formData.customDuration, formData.customDurationUnit]);

  // Auto-fill start date when purchased date changes
  useEffect(() => {
    if (formData.purchasedDate) {
      setFormData(prev => ({
        ...prev,
        startDate: formData.purchasedDate
      }));
    }
  }, [formData.purchasedDate]);

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

  const handleUserSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setUserSuggestions([]);
      return;
    }

    const suggestions = [];
    
    // Add registered users
    if (usersData?.users) {
      usersData.users.forEach(user => {
        const fullName = `${user.first_name} ${user.last_name}`;
        const email = user.email;
        
        if (fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            email.toLowerCase().includes(searchTerm.toLowerCase())) {
          suggestions.push(`${fullName} (${email})`);
        }
      });
    }
    
    // Add the search term as a potential non-registered user
    if (!suggestions.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))) {
      suggestions.push(searchTerm);
    }
    
    setUserSuggestions(suggestions.slice(0, 10)); // Limit to 10 suggestions
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.serviceName.trim()) newErrors.serviceName = 'Service name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.loginId.trim()) newErrors.loginId = 'Login ID is required';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    if (!formData.purchasedDate) newErrors.purchasedDate = 'Purchased date is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = 'Valid amount is required';
    if (!formData.purchasedVia) newErrors.purchasedVia = 'Purchase method is required';

    if (formData.planType === 'Custom') {
      if (!formData.customDuration || parseInt(formData.customDuration) <= 0) {
        newErrors.customDuration = 'Valid duration is required for custom plan';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    try {
      const submitData = {
        serviceName: formData.serviceName,
        category: formData.category,
        ownerType: formData.user,
        loginUsernamePhone: formData.loginId,
        password: formData.password,
        purchasedDate: formData.purchasedDate,
        startDate: formData.startDate,
        amount: parseFloat(formData.amount),
        planType: formData.planType,
        customDurationValue: formData.planType === 'Custom' ? parseInt(formData.customDuration) : null,
        customDurationUnit: formData.planType === 'Custom' ? formData.customDurationUnit : null,
        purchasedVia: formData.purchasedVia,
        autoPay: formData.autoPay,
        deviceLimit: parseInt(formData.deviceLimit),
        devicesInUse: parseInt(formData.devicesInUse),
        idsUsing: formData.idsUsing,
        comments: formData.comments,
        shared: formData.shared
      };

      await createMutation.mutateAsync(submitData);
      onSuccess();
      
      // Reset form
      setFormData({
        serviceName: '',
        category: '',
        user: 'Me',
        loginId: '',
        password: '',
        purchasedDate: new Date().toISOString().split('T')[0],
        startDate: new Date().toISOString().split('T')[0],
        amount: '',
        planType: 'Monthly',
        customDuration: '',
        customDurationUnit: 'months',
        endDate: '',
        purchasedVia: '',
        autoPay: false,
        nextPurchaseDate: '',
        deviceLimit: 1,
        devicesInUse: 0,
        idsUsing: [],
        comments: '',
        shared: false
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create subscription');
    }
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="➕ Add New Subscription"
      footer={
        <>
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? 'Adding...' : 'Add Subscription'}
          </Button>
        </>
      }
    >
      <Form onSubmit={handleSubmit}>
        {error && <ErrorMessage>{error}</ErrorMessage>}

        <FormSection title="📋 Basic Information">
          <InputRow>
            <InputField
              label="Service Name"
              name="serviceName"
              value={formData.serviceName}
              onChange={handleChange}
              placeholder="e.g., Netflix, Airtel"
              error={errors.serviceName}
              required
            />
            <SelectField
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              options={categoryOptions}
              error={errors.category}
              placeholder="Select Category"
              required
            />
          </InputRow>

          <SelectField
            label="User (Owner)"
            name="user"
            value={formData.user}
            onChange={handleChange}
            options={userOptions}
          />
        </FormSection>

        <FormSection title="🔐 Login Information">
          <InputRow>
            <InputField
              label="Login ID"
              name="loginId"
              value={formData.loginId}
              onChange={handleChange}
              placeholder="Credential used for the service"
              error={errors.loginId}
              required
            />
            <InputField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password for the service"
              error={errors.password}
              required
            />
          </InputRow>
        </FormSection>

        <FormSection title="📅 Subscription Details">
          <InputRow>
            <InputField
              label="Purchased Date"
              name="purchasedDate"
              type="date"
              value={formData.purchasedDate}
              onChange={handleChange}
              error={errors.purchasedDate}
              required
            />
            <InputField
              label="Start Date"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              error={errors.startDate}
              required
            />
          </InputRow>

          <InputRow>
            <InputField
              label="Amount"
              name="amount"
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Total subscription amount"
              error={errors.amount}
              required
            />
            <SelectField
              label="Plan Type"
              name="planType"
              value={formData.planType}
              onChange={handleChange}
              options={planTypeOptions}
            />
          </InputRow>

          {formData.planType === 'Custom' && (
            <InputRow>
              <InputField
                label="Custom Duration"
                name="customDuration"
                type="number"
                min="1"
                value={formData.customDuration}
                onChange={handleChange}
                placeholder="e.g., 18"
                error={errors.customDuration}
                required
              />
              <SelectField
                label="Duration Unit"
                name="customDurationUnit"
                value={formData.customDurationUnit}
                onChange={handleChange}
                options={durationUnitOptions}
              />
            </InputRow>
          )}

          <InputRow>
            <InputField
              label="End Date"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              placeholder="Auto-calculated (editable)"
            />
            <InputField
              label="Next Purchase Date"
              name="nextPurchaseDate"
              type="date"
              value={formData.nextPurchaseDate}
              onChange={handleChange}
              placeholder="Auto-calculated from end date"
            />
          </InputRow>

          <InputRow>
            <SelectField
              label="Purchased Via"
              name="purchasedVia"
              value={formData.purchasedVia}
              onChange={handleChange}
              options={paymentMethodOptions}
              error={errors.purchasedVia}
              placeholder="Select Payment Method"
              required
            />
            <CheckboxField
              name="autoPay"
              checked={formData.autoPay}
              onChange={handleChange}
              label="Auto Pay Enabled"
            />
          </InputRow>
        </FormSection>

        <FormSection title="📱 Device & Usage">
          <InputRow>
            <InputField
              label="Device Limit"
              name="deviceLimit"
              type="number"
              min="1"
              value={formData.deviceLimit}
              onChange={handleChange}
              placeholder="Maximum number of devices allowed"
            />
            <InputField
              label="Devices in Use"
              name="devicesInUse"
              type="number"
              min="0"
              value={formData.devicesInUse}
              onChange={handleChange}
              placeholder="Number of devices currently in use"
            />
          </InputRow>

          <InputGroup>
            <Label>IDs Using</Label>
            <TagsInput
              tags={formData.idsUsing}
              onChange={(tags) => setFormData(prev => ({ ...prev, idsUsing: tags }))}
              suggestions={userSuggestions}
              onSearch={handleUserSearch}
              placeholder="Search users or add non-registered persons..."
            />
          </InputGroup>

          <TextAreaField
            label="Comments"
            name="comments"
            value={formData.comments}
            onChange={handleChange}
            placeholder="Free-text notes"
            rows={3}
          />
        </FormSection>

        <FormSection title="🤝 Sharing">
          <CheckboxField
            name="shared"
            checked={formData.shared}
            onChange={handleChange}
            label="This subscription is shared"
          />
        </FormSection>
      </Form>
    </ModalWrapper>
  );
}

export default AddSubscriptionForm;