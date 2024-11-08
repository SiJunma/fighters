import React, { useState } from 'react';
import AvatarPicker from './AvatarPicker';
import { Modal, Button, Image } from 'react-bootstrap';

function CreateFighterForm({ onCreate, onCancel }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('strong');
  const [avatar, setAvatar] = useState('');
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  const handleSubmit = () => {
    onCreate(name, type, avatar);
    setName('');
    setType('strong');
    setAvatar('');
  };

  const handleAvatarSelect = (selectedAvatar) => {
    setAvatar(selectedAvatar);
    setIsAvatarModalOpen(false);
  };

  return (
    <div id="fighterForm" className="mb-3">
        <div className="mb-3 d-flex align-items-center gap-3" id="avatarContainer">
            {avatar && <Image src={`images/${avatar}`} alt="avatar" width="120" height="120" className="d-block rounded-circle object-fit-cover" id="selectedAvatar" />}

            <Button id="openAvsModal" type="button" variant="secondary" onClick={() => setIsAvatarModalOpen(true)}>{avatar ? 'Change Avatar' : 'Choose Avatar'}</Button>
        </div>
        <div className="mb-3">
            <label htmlFor="fighterName" className="form-label">Create a name</label>
            <input type="text" className="form-control" id="fighterName" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="mb-3">
            <label htmlFor="fighterType" className="form-label">Select a fighter's type</label>
            <select className="form-select" aria-label="Fighter's type" id="fighterType" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="strong" defaultValue>Strong</option>
                <option value="sneaky">Sneaky</option>
                <option value="tank">Tank</option>
            </select>
        </div>
        <div className="d-flex justify-content-between">
            <button id="submitFighter" type="button" className="btn btn-primary" onClick={handleSubmit} disabled={!name || !avatar}>Create</button>
            <button id="cancelSubmitting" type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        </div>

        <Modal show={isAvatarModalOpen} onHide={() => setIsAvatarModalOpen(false)} dialogClassName="modal-dialog-scrollable">
          <Modal.Header closeButton>
            <Modal.Title>Select an Avatar</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <AvatarPicker onSelect={handleAvatarSelect} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setIsAvatarModalOpen(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
    </div>
  );
}

export default CreateFighterForm;
