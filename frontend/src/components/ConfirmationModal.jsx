import React from 'react';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action", 
  message = "Are you sure you want to proceed?", 
  confirmText = "Confirm", 
  cancelText = "Cancel",
  variant = "danger" 
}) => {
  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      confirmButton: "bg-red-600 hover:bg-red-700 text-white",
      icon: "⚠️"
    },
    warning: {
      confirmButton: "bg-yellow-600 hover:bg-yellow-700 text-white",
      icon: "⚠️"
    },
    info: {
      confirmButton: "bg-blue-600 hover:bg-blue-700 text-white",
      icon: "ℹ️"
    }
  };

  const styles = variantStyles[variant] || variantStyles.danger;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999]">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">{styles.icon}</span>
          <h3 className="text-lg font-semibold text-gray-900">
            {title}
          </h3>
        </div>
        
        {/* Message */}
        <div className="mb-6">
          <p className="text-gray-600">
            {message}
          </p>
        </div>
        
        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${styles.confirmButton}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;