import React from 'react';
import { Modal, Button, Placeholder } from 'rsuite';

function CustomModal({ title, isOpen, onClose, children }) {
  if (!isOpen) return null;


  return (
    <Modal size={'full'} open={isOpen} onClose={onClose} full>
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {children}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} appearance="primary">
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CustomModal;
