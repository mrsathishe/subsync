import React from 'react';
import { Section, SectionTitle, InputRow, InputGroup, Label, Input, TextArea } from '../styles.jsx';
import UserSearchInput from '../UserSearchInput';

const DeviceUsage = ({ formData, onChange, usersData }) => {
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    onChange({
      target: {
        name,
        value: checked
      }
    });
  };

  const handleUsersChange = (selectedUsers) => {
    // Store the structured users data
    onChange({
      target: {
        name: 'idsUsingDetails',
        value: selectedUsers
      }
    });
  };

  // Get selected users from structured data
  const getSelectedUsers = () => {
    return formData.idsUsingDetails || [];
  };

  return (
    <Section>
      <SectionTitle>📱 Device & Usage</SectionTitle>
      
      <InputRow>
        <InputGroup>
          <Label htmlFor="deviceLimit">Device Limit</Label>
          <Input
            id="deviceLimit"
            name="deviceLimit"
            type="number"
            min="1"
            value={formData.deviceLimit}
            onChange={onChange}
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="devicesInUse">Devices in Use</Label>
          <Input
            id="devicesInUse"
            name="devicesInUse"
            type="number"
            min="0"
            value={formData.devicesInUse}
            onChange={onChange}
          />
        </InputGroup>
      </InputRow>

      <InputGroup standalone>
        <div className="flex items-center gap-2">
          <input
            id="idsUsing"
            name="idsUsing"
            type="checkbox"
            checked={formData.idsUsing || false}
            onChange={handleCheckboxChange}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
          <Label htmlFor="idsUsing" className="mb-0 cursor-pointer">
            ID Shared
          </Label>
        </div>
      </InputGroup>

      {formData.idsUsing && (
        <InputGroup standalone>
          <Label htmlFor="idsUsing">IDs Using</Label>
          <UserSearchInput
            selectedUsers={getSelectedUsers()}
            onUsersChange={handleUsersChange}
            placeholder="Search users or enter custom names..."
            usersData={usersData}
          />
          <div className="text-xs text-gray-500 mt-1">
            Search for registered users or press Enter to add custom entries
          </div>
        </InputGroup>
      )}

      <InputGroup standalone>
        <Label htmlFor="comments">Comments</Label>
        <TextArea
          id="comments"
          name="comments"
          value={formData.comments}
          onChange={onChange}
          placeholder="Any additional notes..."
          rows={3}
        />
      </InputGroup>
    </Section>
  );
};

export default DeviceUsage;