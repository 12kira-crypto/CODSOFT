import React from 'react';
import './Toast.css';

function Toast({ message }) {
  return (
    <div className="toast">
      <div className="toast-dot" />
      <span className="toast-msg">{message}</span>
    </div>
  );
}

export default Toast;
