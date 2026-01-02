import React from 'react';
import { Section, SectionTitle, CheckboxContainer, Checkbox, Label, SharingSection as SharingContainer, SharingItem, InputGroup, Select, Input, Button } from '../styles.jsx';

const SharingSection = ({ 
  formData, 
  onChange, 
  usersData,
  onAddSharingPerson,
  onRemoveSharingPerson,
  onUpdateSharingPerson 
}) => {
  return (
    <Section>
      <SectionTitle>🤝 Sharing</SectionTitle>
      
      <CheckboxContainer>
        <Checkbox
          id="isSharing"
          name="isSharing"
          type="checkbox"
          checked={formData.isSharing}
          onChange={onChange}
        />
        <Label htmlFor="isSharing">This subscription is shared</Label>
      </CheckboxContainer>

      {formData.isSharing && (
        <SharingContainer>
          <div style={{ marginBottom: '1rem' }}>
            <strong>Shared Users</strong>
          </div>
          
          {formData.sharingDetails.map((person, index) => (
            <SharingItem key={index}>
              <InputGroup>
                <Label>Registered User</Label>
                <Select
                  value={person.userId}
                  onChange={(e) => onUpdateSharingPerson(index, 'userId', e.target.value)}
                >
                  <option value="">Not registered</option>
                  {usersData?.users?.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.first_name} {user.last_name} ({user.email})
                    </option>
                  ))}
                </Select>
              </InputGroup>

              <InputGroup>
                <Label>Name/Email</Label>
                <Input
                  placeholder="Name or email"
                  value={person.userId ? '' : person.nonRegisteredName || person.nonRegisteredEmail}
                  onChange={(e) => {
                    onUpdateSharingPerson(index, 'nonRegisteredName', e.target.value);
                    onUpdateSharingPerson(index, 'nonRegisteredEmail', e.target.value);
                  }}
                  disabled={!!person.userId}
                />
              </InputGroup>

              <InputGroup>
                <Label>Payment Status</Label>
                <Select
                  value={person.paymentStatus}
                  onChange={(e) => onUpdateSharingPerson(index, 'paymentStatus', e.target.value)}
                >
                  <option value="not_paid">Not Paid</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                </Select>
              </InputGroup>

              <InputGroup>
                <Label>Payment Date</Label>
                <Input
                  type="date"
                  value={person.paymentDate}
                  onChange={(e) => onUpdateSharingPerson(index, 'paymentDate', e.target.value)}
                  disabled={person.paymentStatus !== 'paid'}
                />
              </InputGroup>

              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={() => onRemoveSharingPerson(index)}
              >
                Remove
              </Button>
            </SharingItem>
          ))}

          <Button
            type="button"
            variant="secondary"
            onClick={onAddSharingPerson}
          >
            + Add Person
          </Button>
        </SharingContainer>
      )}
    </Section>
  );
};

export default SharingSection;