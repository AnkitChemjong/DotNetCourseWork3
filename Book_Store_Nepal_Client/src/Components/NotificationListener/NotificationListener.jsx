import { useEffect, useState } from 'react';
import axiosService from '@/Services/Axios';
import { HubConnectionBuilder, LogLevel, HttpTransportType } from '@microsoft/signalr';
import { useDispatch } from 'react-redux';
import { setNotification,addNotification } from '@/Store/Slice/NotificationSlice';

export default function NotificationsBell({ userId, token }) {
  const [notifications, setNotifications] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const dispatch =useDispatch();

useEffect(() => {
  const fetchNotifications = async () => {
    try {
      const response = await axiosService.get(
        '/api/notification',
        { params: { userId } }
      );
   

      const raw = Array.isArray(response.data?.$values)
        ? response.data.$values
        : [];


      const formatted = raw.map(n => ({
        id: n.id,                
        message: n.message,      
        createdAt: n.createdAt,  
        isRead: n.isRead         
      }));

      // 3) Push into state
      setNotifications(formatted);

      dispatch(setNotification(formatted));
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
       dispatch(setNotifications([]));
    }
  };

  if (userId) {
    fetchNotifications();
  }
}, [userId]);


  console.log("token",token);

useEffect(() => {
  let connection;
  let isMounted = true;

  const startConnection = async () => {
    if (!token || !isMounted) return;

    try {
      connection = new HubConnectionBuilder()
        .withUrl('http://localhost:5247/notificationHub', {
          accessTokenFactory: () => token,
          transport: HttpTransportType.WebSockets,
          skipNegotiation: true,
        })
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: (retryContext) =>
            retryContext.elapsedMilliseconds < 60_000 ? 5_000 : null,
        })
        .configureLogging(LogLevel.Information)
        .build();



         connection.onreconnecting(err => {
    console.warn('[SignalR] Reconnecting:', err);
    if (isMounted) setConnectionStatus('Reconnecting');
  });
  connection.onreconnected(id => {
    console.log('[SignalR] Reconnected with ID:', id);
    if (isMounted) setConnectionStatus('Connected');
  });
  connection.onclose(err => {
    console.error('[SignalR] Connection closed:', err);
    if (isMounted) setConnectionStatus('Disconnected');
  });

connection.on('ReceiveNotification', payload => {
      const dto = {
        id: Date.now(),
        message: payload.message ?? payload,   
        createdAt: payload.createdAt ?? new Date().toISOString(),
        isRead: false
      };
      dispatch(addNotification(dto));
    });





      setConnectionStatus('Connecting');
      await connection.start();
      if (isMounted) setConnectionStatus('Connected');
    } catch (error) {
      if (isMounted) {
        console.error('SignalR connection error:', error);
        setConnectionStatus('Disconnected');
      }
    }
  };

  

  startConnection();

  console.log("notificaiton",notifications);

  return () => {
    isMounted = false;
    // if (connection) {
    //   connection.stop().catch(console.error);
    // }
  };
}, [token]);

const markAllRead = async () => {
    await axiosService.patch(`/api/notification/mark-all-as-read/${userId}`);
    dispatch(
      setNotifications(notifications.map(n => ({ ...n, isRead: true })))
    );
  };

return (
  <div className="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden">
    <div className="px-6 py-4">

       <div className="flex justify-between items-center mb-4">
          <p className="text-sm">Status: {status}</p>
          <button
            onClick={markAllRead}
            className="text-xs text-blue-600 hover:underline"
          >
            Mark all as read
          </button>
        </div>
      <p className="text-sm mb-4">
        Connection Status:{' '}
        <span
          className={
            connectionStatus === 'Connected'
              ? 'text-green-600 font-semibold'
              : connectionStatus === 'Reconnecting'
              ? 'text-yellow-600 font-semibold'
              : 'text-red-600 font-semibold'
          }
        >
          {connectionStatus}
        </span>
      </p>

      <ul className="divide-y divide-gray-200">
        {notifications.length === 0 ? (
          <li className="py-3 text-gray-500 italic">
            (no notifications yet)
          </li>
        ) : (
          notifications.map((n) => (
            <li
              key={n.id}
              className="flex justify-between items-center py-3 hover:bg-gray-50 transition"
            >
              <span className="text-gray-800">{n.message}</span>
              <span className="text-xs text-gray-400">
                {new Date(n.createdAt).toLocaleString()}
              </span>
            </li>
          ))
        )}
      </ul>
    </div>
  </div>
);

}


