import React from 'react';
import { Modal, Button, Placeholder } from 'rsuite';

function CustomModal({ isOpen, onClose, children }) {
  if (!isOpen) return null;


  return (
    <Modal size={'full'} open={isOpen} onClose={onClose}>
      <Modal.Header>
        <Modal.Title>Modal Title</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {children}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} appearance="subtle">
          Cancel
        </Button>
        <Button onClick={onClose} appearance="primary">
          Ok
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CustomModal;
