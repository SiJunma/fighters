import React, { useState } from 'react';
import AvatarPicker from './AvatarPicker';
import { useTranslation } from 'react-i18next';
import { Modal, Button, Image } from 'react-bootstrap';

function CreateFighterForm({ onCreate, onCancel }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('strong');
  const [avatar, setAvatar] = useState('');
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  const { t } = useTranslation();

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
            {avatar && <Image src={`./images/${avatar}`} alt="avatar" width="120" height="120" className="d-block rounded-circle object-fit-cover" id="selectedAvatar" />}

            <Button id="openAvsModal" type="button" variant="secondary" onClick={() => setIsAvatarModalOpen(true)}>{avatar ? t('changeAvBtn') : t('chooseAvBtn')}</Button>
        </div>
        <div className="mb-3">
            <label htmlFor="fighterName" className="form-label">{t('createNamelabel')}</label>
            <input type="text" className="form-control" id="fighterName" placeholder={t('name')} value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="mb-3">
            <label htmlFor="fighterType" className="form-label">{t('selectFighterTypeLabel')}</label>
            <select className="form-select" aria-label="Fighter's type" id="fighterType" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="strong" defaultValue>{t('strong')}</option>
                <option value="sneaky">{t('sneaky')}</option>
                <option value="tank">{t('tank')}</option>
            </select>
        </div>
        <div className="d-flex justify-content-between">
            <button id="submitFighter" type="button" className="btn btn-primary" onClick={handleSubmit} disabled={!name || !avatar}>{t('create')}</button>
            <button id="cancelSubmitting" type="button" className="btn btn-secondary" onClick={onCancel}>{t('cancel')}</button>
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
