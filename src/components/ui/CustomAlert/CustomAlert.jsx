// CustomAlert.jsx
import React, { useEffect } from 'react';
import './CustomAlert.css';

function CustomAlert({ message, onClose, duration = 2500 }) {
  // duration(ms) 후 자동으로 닫힘
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  return (
    <div className="alert-box">
      <span className="alert-text">{message}</span>
    </div>
  );
}

export default CustomAlert;