import React, { useCallback, useEffect } from 'react';

import {
  FiAlertCircle, FiCheckCircle, FiInfo, FiXCircle,
} from 'react-icons/fi';
import { Toast } from './styles';

import { ToastMessage, useToast } from '../../../hooks/toast';

interface ToastItemProps {
  message: ToastMessage;
  style: object
}

const ToastItem: React.FC<ToastItemProps> = ({ message, style }) => {
  const { removeToast } = useToast();

  const handleRemoveToast = useCallback(() => {
    removeToast(message.id);
  }, [removeToast, message.id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleRemoveToast();
    }, 3000);

    return () => { clearTimeout(timer); };
  }, [message.id, handleRemoveToast]);

  const icons = {
    info: <FiInfo size={24} />,
    error: <FiAlertCircle size={24} />,
    success: <FiCheckCircle size={24} />,
  };

  return (
    <Toast hasDescription={!!message.description} type={message.type} style={style}>
      {icons[message.type || 'info']}

      <div>
        <strong>{message.title}</strong>
        {message.description && <p>{message.description}</p>}
      </div>

      <button onClick={handleRemoveToast} type="button">
        <FiXCircle size={18} />
      </button>
    </Toast>
  );
};

export default ToastItem;
