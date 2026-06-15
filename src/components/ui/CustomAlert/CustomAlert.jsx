// CustomAlert.jsx
import React from 'react';
import './CustomAlert.css';

function CustomAlert({ message, onClose }) {
  return (
    <div className="alert-box">
      <span className="alert-text">{message}</span>
      <button className="alert-confirm-btn" onClick={onClose}>확인</button>
    </div>
  );
}
export default CustomAlert;