import React from 'react';
import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalTitle, 
  CloseButton,
  ModalBody,
  ModalFooter,
  Button
} from './styles';

function ModalWrapper({ isOpen, onClose, title, children, footer }) {
  if (!isOpen) return null;

  return (
    <Modal onClick={(e) => e.target === e.currentTarget && onClose()}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>
        <ModalBody>{children}</ModalBody>
        {footer && <ModalFooter>{footer}</ModalFooter>}
      </ModalContent>
    </Modal>
  );
}

export default ModalWrapper;