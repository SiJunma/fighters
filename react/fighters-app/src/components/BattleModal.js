import React from 'react';
import { Modal } from 'react-bootstrap';

function BattleModal({ log, onClose }) {
  return (
    <Modal show={true} onHide={onClose} dialogClassName="modal-dialog-scrollable">
      <Modal.Header closeButton>
        <Modal.Title>Battle Log</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div dangerouslySetInnerHTML={{ __html: log }} />
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-secondary" onClick={onClose}>Close</button>
      </Modal.Footer>
    </Modal>
  );
}

export default BattleModal;
