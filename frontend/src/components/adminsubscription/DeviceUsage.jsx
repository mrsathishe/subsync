import React from 'react';
import { Section, SectionTitle, InputRow, InputGroup, Label, Input, TextArea } from '../styles';
import UserSearchInput from '../UserSearchInput';

const DeviceUsage = ({ formData, onChange }) => {
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
    // Convert users array to the expected format for the form
    const usersString = selectedUsers.map(user => {
      if (user.isCustom) {
        return user.name;
      } else {
        return `${user.name} (${user.email}) [ID: ${user.id}]`;
      }
    }).join(', ');

    onChange({
      target: {
        name: 'idsUsing',
        value: usersString
      }
    });

    // Also store the structured users data
    onChange({
      target: {
        name: 'selectedUsers',
        value: selectedUsers
      }
    });
  };

  // Parse existing idsUsing string back to users array for the search input
  const getSelectedUsers = () => {
    if (formData.selectedUsers && Array.isArray(formData.selectedUsers)) {
      return formData.selectedUsers;
    }

    // If no structured data, try to parse from idsUsing string
    if (!formData.idsUsing) return [];

    const users = [];
    const entries = formData.idsUsing.split(',').map(entry => entry.trim()).filter(entry => entry);
    
    entries.forEach((entry, index) => {
      // Try to extract structured data
      const idMatch = entry.match(/\[ID: (\d+)\]$/);
      const emailMatch = entry.match(/\(([^)]+@[^)]+)\)/);
      
      if (idMatch && emailMatch) {
        // Structured user entry
        const name = entry.replace(/ \([^)]+\) \[ID: \d+\]$/, '');
        users.push({
          id: parseInt(idMatch[1]),
          name: name,
          email: emailMatch[1],
          isCustom: false
        });
      } else {
        // Custom entry
        users.push({
          id: `custom_${index}`,
          name: entry,
          isCustom: true
        });
      }
    });

    return users;
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
            id="isShared"
            name="isShared"
            type="checkbox"
            checked={formData.isShared || false}
            onChange={handleCheckboxChange}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
          <Label htmlFor="isShared" className="mb-0 cursor-pointer">
            ID Shared
          </Label>
        </div>
      </InputGroup>

      {formData.isShared && (
        <InputGroup standalone>
          <Label htmlFor="idsUsing">IDs Using</Label>
          <UserSearchInput
            selectedUsers={getSelectedUsers()}
            onUsersChange={handleUsersChange}
            placeholder="Search users or enter custom names..."
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