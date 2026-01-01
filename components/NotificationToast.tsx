
import React, { useEffect, useState } from 'react';

interface NotificationToastProps {
  message: string | null;
  onDismiss: () => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ message, onDismiss }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        // Allow time for fade-out animation before dismissing
        setTimeout(onDismiss, 300);
      }, 4000); // Show for 4 seconds

      return () => clearTimeout(timer);
    }
  }, [message, onDismiss]);

  return (
    <div
      className={`fixed bottom-5 right-5 z-[100] p-4 rounded-xl shadow-2xl bg-slate-900 text-white font-semibold text-sm transition-all duration-300 ease-in-out transform ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}
    >
      🎉 {message}
    </div>
  );
};

export default NotificationToast;
