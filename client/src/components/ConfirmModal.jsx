import React from 'react';
import Modal from 'react-modal';

const customModalStyles = {
  content: {
    width: '350px',
    height: '200px',
    margin: 'auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

const ConfirmModal = ({ isOpen, message, onConfirm, onCancel }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onCancel}
      contentLabel="Confirm"
      ariaHideApp={false}
      style={customModalStyles}
    >
      <div>
        <h3>{message}</h3>
        <div className="auth__form-container_fields-content_button">
            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
            <button onClick={onConfirm}>Confirm</button>                        
            <p>&nbsp;&nbsp;</p>
            <button onClick={onCancel}>Cancel</button>
        </div>        
      </div>
    </Modal>
  );
};

export default ConfirmModal;
