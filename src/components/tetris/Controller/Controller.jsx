// Controller.jsx
import React from 'react';
import './Controller.css';

function Controller({ onControl }) {
  return (
    <div className="control-grid">
      <button className="btn-up" onClick={() => onControl('rotate')}>▲ 회전</button>
      <button className="btn-left" onClick={() => onControl('left')}>◀ 좌</button>
      <button className="btn-right" onClick={() => onControl('right')}>▶ 우</button>
      <button className="btn-down" onClick={() => onControl('down')}>▼ 하강</button>
      <button className="btn-space" onClick={() => onControl('drop')}>SPACE (하드 드롭)</button>
    </div>
  );
}
export default Controller;