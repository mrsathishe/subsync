import React from 'react';
import { Section, SectionTitle, InputRow, InputGroup, Label, Input } from '../styles';

const LoginInformation = ({ formData, errors, onChange, isEditing }) => {
  return (
    <Section>
      <SectionTitle>🔐 Login Information</SectionTitle>
      
      <InputGroup standalone>
        <Label htmlFor="loginUsernamePhone">Login Username/Phone *</Label>
        <Input
          id="loginUsernamePhone"
          name="loginUsernamePhone"
          value={formData.loginUsernamePhone}
          onChange={onChange}
          placeholder="Username, email, or phone number"
          error={errors.loginUsernamePhone}
          required
        />
        {errors.loginUsernamePhone && <div style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.loginUsernamePhone}</div>}
      </InputGroup>

      <InputRow>
        <InputGroup>
          <Label htmlFor="password">Password {!isEditing && '*'}</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={onChange}
            placeholder={isEditing ? "Leave blank to keep current" : "Enter password"}
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="passwordHint">Password Hint</Label>
          <Input
            id="passwordHint"
            name="passwordHint"
            value={formData.passwordHint}
            onChange={onChange}
            placeholder="e.g., pet's name + birth year"
          />
        </InputGroup>
      </InputRow>
    </Section>
  );
};

export default LoginInformation;