import React from 'react';

const CustomNotification = ({ notification, onClose }) => {
  if (!notification) return null;

  const getNotificationConfig = (type, isReactivated) => {
    if (isReactivated) {
      return {
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        headerBg: 'bg-red-100',
        textColor: 'text-red-800',
        title: 'Re-activated Warning',
        icon: '🔄',
        iconBg: 'bg-red-200'
      };
    } else if (type === 'warning') {
      return {
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        headerBg: 'bg-red-100',
        textColor: 'text-red-800',
        title: 'New Warning',
        icon: '⚠️',
        iconBg: 'bg-red-200'
      };
    } else {
      return {
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        headerBg: 'bg-yellow-100',
        textColor: 'text-yellow-800',
        title: 'New Notification',
        icon: '📢',
        iconBg: 'bg-yellow-200'
      };
    }
  };

  const config = getNotificationConfig(notification.type, notification.isReactivated);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className={`max-w-lg w-full rounded-lg shadow-xl border-2 ${config.bgColor} ${config.borderColor} overflow-hidden`}>
        {/* Header */}
        <div className={`${config.headerBg} px-6 py-4 border-b ${config.borderColor}`}>
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full ${config.iconBg} flex items-center justify-center mr-4`}>
              <span className="text-xl">{config.icon}</span>
            </div>
            <div>
              <h3 className={`text-lg font-bold ${config.textColor}`}>{config.title}</h3>
              <p className={`text-sm ${config.textColor} opacity-75`}>
                {new Date(notification.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          <div className={`${config.textColor}`}>
            <h4 className="text-lg font-semibold mb-3">{notification.title}</h4>
            <p className="text-sm leading-relaxed mb-4">{notification.message}</p>
            
            {notification.policeStation && (
              <div className={`${config.headerBg} rounded-lg p-3 border ${config.borderColor}`}>
                <p className="text-sm">
                  <span className="font-semibold">Police Station:</span>
                  <span className="ml-2">{notification.policeStation}</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="bg-[#003366] text-white px-6 py-2 rounded-md hover:bg-[#004080] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Acknowledge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomNotification; 