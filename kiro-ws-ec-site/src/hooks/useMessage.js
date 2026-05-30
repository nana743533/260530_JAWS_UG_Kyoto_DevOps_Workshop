import { useState } from 'react';

export const useMessage = () => {
  const [message, setMessage] = useState(null);
  
  const showMessage = (text, type = 'info', duration = 3000) => {
    setMessage({ text, type });
    if (duration > 0) {
      setTimeout(() => setMessage(null), duration);
    }
  };
  
  const hideMessage = () => setMessage(null);
  
  return { message, showMessage, hideMessage };
};
