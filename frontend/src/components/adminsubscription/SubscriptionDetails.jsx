import React from 'react';
import { Section, SectionTitle, InputRow, InputGroup, Label, Input, Select, CheckboxContainer, Checkbox } from '../styles';

const SubscriptionDetails = ({ formData, errors, onChange }) => {
  return (
    <Section>
      <SectionTitle>📅 Subscription Details</SectionTitle>
      
      <InputRow>
        <InputGroup>
          <Label htmlFor="purchasedDate">Purchased Date *</Label>
          <Input
            id="purchasedDate"
            name="purchasedDate"
            type="date"
            value={formData.purchasedDate}
            onChange={onChange}
            error={errors.purchasedDate}
            required
          />
          {errors.purchasedDate && <div style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.purchasedDate}</div>}
        </InputGroup>

        <InputGroup>
          <Label htmlFor="startDate">Start Date *</Label>
          <Input
            id="startDate"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={onChange}
            error={errors.startDate}
            required
          />
          {errors.startDate && <div style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.startDate}</div>}
        </InputGroup>
      </InputRow>

      <InputRow>
        <InputGroup>
          <Label htmlFor="amount">Amount *</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={onChange}
            placeholder="0.00"
            error={errors.amount}
            required
          />
          {errors.amount && <div style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.amount}</div>}
        </InputGroup>

        <InputGroup>
          <Label htmlFor="planType">Plan Type</Label>
          <Select
            id="planType"
            name="planType"
            value={formData.planType}
            onChange={onChange}
          >
            <option value="Monthly">Monthly</option>
            <option value="3 Months">3 Months</option>
            <option value="6 Months">6 Months</option>
            <option value="Yearly">Yearly</option>
            <option value="Custom">Custom</option>
          </Select>
        </InputGroup>
      </InputRow>

      {formData.planType === 'Custom' && (
        <InputRow>
          <InputGroup>
            <Label htmlFor="customDurationValue">Duration Value *</Label>
            <Input
              id="customDurationValue"
              name="customDurationValue"
              type="number"
              min="1"
              value={formData.customDurationValue}
              onChange={onChange}
              placeholder="e.g., 18"
              error={errors.customDurationValue}
            />
            {errors.customDurationValue && <div style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.customDurationValue}</div>}
          </InputGroup>

          <InputGroup>
            <Label htmlFor="customDurationUnit">Duration Unit</Label>
            <Select
              id="customDurationUnit"
              name="customDurationUnit"
              value={formData.customDurationUnit}
              onChange={onChange}
            >
              <option value="days">Days</option>
              <option value="months">Months</option>
              <option value="years">Years</option>
            </Select>
          </InputGroup>
        </InputRow>
      )}

      <InputRow>
        <InputGroup>
          <Label htmlFor="purchasedVia">Purchased Via *</Label>
          <Select
            id="purchasedVia"
            name="purchasedVia"
            value={formData.purchasedVia}
            onChange={onChange}
            error={errors.purchasedVia}
            required
          >
            <option value="">Select Payment Method</option>
            <option value="GPay">GPay</option>
            <option value="Redeem Points">Redeem Points</option>
            <option value="Credit Card">Credit Card</option>
            <option value="UPI">UPI</option>
            <option value="Net Banking">Net Banking</option>
            <option value="Cash">Cash</option>
            <option value="Other">Other</option>
          </Select>
          {errors.purchasedVia && <div style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.purchasedVia}</div>}
        </InputGroup>

        <InputGroup>
          <Label>&nbsp;</Label> {/* Empty label for alignment */}
          <CheckboxContainer>
            <Checkbox
              id="autoPay"
              name="autoPay"
              type="checkbox"
              checked={formData.autoPay}
              onChange={onChange}
            />
            <Label htmlFor="autoPay">Auto Pay Enabled</Label>
          </CheckboxContainer>
        </InputGroup>
      </InputRow>
    </Section>
  );
};

export default SubscriptionDetails;