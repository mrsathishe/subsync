import React from 'react';
import { Section, SectionTitle, InputRow, InputGroup, Label, Input, Select } from '../styles.jsx';

const BasicInformation = ({ formData, errors, onChange }) => {
  return (
    <Section>
      <SectionTitle>📋 Basic Information</SectionTitle>
      
      <InputRow>
        <InputGroup>
          <Label htmlFor="serviceName">Service Name *</Label>
          <Input
            id="serviceName"
            name="serviceName"
            value={formData.serviceName}
            onChange={onChange}
            placeholder="e.g., Netflix Premium"
            error={errors.serviceName}
            required
          />
          {errors.serviceName && <div style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.serviceName}</div>}
        </InputGroup>

        <InputGroup>
          <Label htmlFor="category">Category *</Label>
          <Select
            id="category"
            name="category"
            value={formData.category}
            onChange={onChange}
            error={errors.category}
            required
          >
            <option value="">Select Category</option>
            <option value="OTT">📺 OTT</option>
            <option value="Mobile">📱 Mobile</option>
            <option value="Broadband">🌐 Broadband</option>
          </Select>
          {errors.category && <div style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.category}</div>}
        </InputGroup>
      </InputRow>

      <InputRow>
        <InputGroup>
          <Label htmlFor="ownerType">Owner</Label>
          <Select
            id="ownerType"
            name="ownerType"
            value={formData.ownerType}
            onChange={onChange}
          >
            <option value="Me">Me</option>
            <option value="Friend">Friend</option>
            <option value="Mom">Mom</option>
            <option value="Dad">Dad</option>
            <option value="Wife">Wife</option>
            <option value="Sister">Sister</option>
            <option value="Other">Other</option>
          </Select>
        </InputGroup>

        <InputGroup>
          <Label htmlFor="ownerName">Owner Name</Label>
          <Input
            id="ownerName"
            name="ownerName"
            value={formData.ownerName}
            onChange={onChange}
            placeholder="Optional custom name"
          />
        </InputGroup>
      </InputRow>
    </Section>
  );
};

export default BasicInformation;