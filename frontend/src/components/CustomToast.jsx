// ==================== frontend/src/components/CustomToast.jsx ====================
import React, { useEffect, useState } from 'react';

const Toast = ({ message, type = 'info', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: '#10b981',
    error: '#ef4444',
    info: '#3b82f6'
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: colors[type],
      color: 'white',
      padding: '16px 24px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 10000,
      animation: 'slideIn 0.3s ease-out',
      maxWidth: '400px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span>{message}</span>
        <button onClick={onClose} style={{
          background: 'none',
          border: 'none',
          color: 'white',
          cursor: 'pointer',
          fontSize: '18px'
        }}>×</button>
      </div>
    </div>
  );
};

export const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    window.toast = {
      success: (msg) => setToasts(prev => [...prev, { id: Date.now(), message: msg, type: 'success' }]),
      error: (msg) => setToasts(prev => [...prev, { id: Date.now(), message: msg, type: 'error' }]),
      info: (msg) => setToasts(prev => [...prev, { id: Date.now(), message: msg, type: 'info' }])
    };
  }, []);

  return (
    <>
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
        />
      ))}
    </>
  );
};