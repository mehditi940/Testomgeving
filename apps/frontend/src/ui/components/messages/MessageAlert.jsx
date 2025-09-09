import React, { useEffect } from 'react';
import '../../styles/components/messages/MessageAlert.css'

const MessageAlert = ({ message, type = 'info', onClose, duration = 5000 }) => {
  useEffect(() => {
    if (!duration || !onClose) return;
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [duration, onClose]);

  if (!message) return null;

  return (
    <div
      className={`message-alert-container message-${type}`}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="message-content">
        <span className="message-icon">
          {type === 'success' && <i className="bi bi-check-circle-fill" aria-hidden="true"></i>}
          {type === 'error' && <i className="bi bi-exclamation-octagon-fill" aria-hidden="true"></i>}
          {type === 'warning' && <i className="bi bi-exclamation-triangle-fill" aria-hidden="true"></i>}
          {type === 'info' && <i className="bi bi-info-circle-fill" aria-hidden="true"></i>}
        </span>
        <span className="message-text">{message}</span>
      </div>
      {onClose && (
        <button className="message-close" onClick={onClose} aria-label="Sluiten">
          <i className="bi bi-x"></i>
        </button>
      )}
    </div>
  );
};

export default MessageAlert;
