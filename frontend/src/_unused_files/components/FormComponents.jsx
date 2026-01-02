import React from 'react';
import { 
  Section, 
  SectionTitle, 
  InputRow, 
  InputGroup, 
  Label, 
  Input, 
  Select, 
  TextArea, 
  CheckboxContainer, 
  Checkbox,
  ErrorText 
} from './styles';

function FormSection({ title, children }) {
  return (
    <Section>
      <SectionTitle>{title}</SectionTitle>
      {children}
    </Section>
  );
}

function InputField({ 
  label, 
  name, 
  type = "text", 
  value, 
  onChange, 
  placeholder, 
  error, 
  required = false, 
  ...props 
}) {
  return (
    <InputGroup>
      <Label htmlFor={name}>
        {label} {required && '*'}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        error={error}
        required={required}
        {...props}
      />
      {error && <ErrorText>{error}</ErrorText>}
    </InputGroup>
  );
}

function SelectField({ 
  label, 
  name, 
  value, 
  onChange, 
  options = [], 
  error, 
  required = false, 
  placeholder = "Select option",
  ...props 
}) {
  return (
    <InputGroup>
      <Label htmlFor={name}>
        {label} {required && '*'}
      </Label>
      <Select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        error={error}
        required={required}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
      {error && <ErrorText>{error}</ErrorText>}
    </InputGroup>
  );
}

function TextAreaField({ 
  label, 
  name, 
  value, 
  onChange, 
  placeholder, 
  rows = 3,
  ...props 
}) {
  return (
    <InputGroup>
      <Label htmlFor={name}>{label}</Label>
      <TextArea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        {...props}
      />
    </InputGroup>
  );
}

function CheckboxField({ name, checked, onChange, label }) {
  return (
    <CheckboxContainer>
      <Checkbox
        id={name}
        name={name}
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
      <Label htmlFor={name}>{label}</Label>
    </CheckboxContainer>
  );
}

export { FormSection, InputField, SelectField, TextAreaField, CheckboxField, InputRow };