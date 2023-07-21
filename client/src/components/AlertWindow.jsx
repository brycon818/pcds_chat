import React from 'react';
import Modal from 'react-modal';

const customModalStyles = {
    content: {
      width: '350px', // Set the desired width here
      height: '200px', // Set the desired height here
      margin: 'auto', // Centers the modal horizontally
      display: 'flex', // Ensures modal content is centered vertically
      justifyContent: 'center', // Centers the modal content vertically
      alignItems: 'center', // Centers the modal content horizontally
    },
  };

const AlertWindow = ({ isOpen, message, onClose }) => {
  return (
    <Modal      
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Alert"
      ariaHideApp={false}
      style={customModalStyles}
    >
      <div >
        <h3>{message}</h3>
        <div className="auth__form-container_fields-content_button">
            <button className="alert_button" onClick={onClose}>Okay</button>
        </div>
      </div>
    </Modal>
  );
};

export default AlertWindow;