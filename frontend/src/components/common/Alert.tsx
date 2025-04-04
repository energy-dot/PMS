import React from 'react';

type AlertVariant = 'success' | 'warning' | 'error';

interface AlertProps {
  variant: AlertVariant;
  title?: string;
  message: string;
  onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({
  variant,
  title,
  message,
  onClose,
}) => {
  const alertClass = `alert alert-${variant}`;

  return (
    <div className={alertClass}>
      {title && <div className="font-bold mb-1">{title}</div>}
      <div>{message}</div>
      {onClose && (
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ×
        </button>
      )}
    </div>
  );
};

export default Alert;
