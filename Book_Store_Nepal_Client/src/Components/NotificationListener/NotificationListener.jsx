// src/components/NotificationsBell.jsx
import { useEffect, useState } from 'react';
import axiosService from '@/Services/Axios';
import { FaBell } from 'react-icons/fa';
import { HubConnectionBuilder } from '@microsoft/signalr';

export default function NotificationsBell({ userId, token }) {
  const [notifications, setNotifications] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);


  useEffect(() => {
    axiosService.get(`/api/notification?userId=${userId}`)
      .then(res => setNotifications(res.data))
      .catch(console.error);
  }, [userId]);


  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl('https://localhost:5001/notificationHub', { accessTokenFactory: () => token, withCredentials: true })
      .withAutomaticReconnect()
      .build();

    connection.start().catch(console.error);
    connection.on('ReceiveNotification', message => {
      setNotifications(prev => [{ id: Date.now(), message, createdAt: new Date().toISOString(), isRead: false }, ...prev]);
    });

    return () => connection.stop();
  }, [token]);


  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="relative">
      <button
        className="relative p-2 text-gray-700 hover:text-gray-900"
        onClick={() => setDropdownOpen(open => !open)}
      >
        <FaBell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-block w-4 h-4 bg-red-600 text-white text-xs rounded-full text-center">
            {unreadCount}
          </span>
        )}
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-auto bg-white shadow-lg rounded-lg">
          {notifications.length === 0
            ? <p className="p-4 text-gray-500">No notifications.</p>
            : notifications.map(n => (
                <div key={n.id} className="border-b last:border-none px-4 py-2 hover:bg-gray-50">
                  <p className="text-sm">{n.message}</p>
                  <p className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
              ))
          }
        </div>
      )}
    </div>
  );
}
