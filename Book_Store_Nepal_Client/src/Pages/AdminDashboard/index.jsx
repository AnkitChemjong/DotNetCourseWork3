import React, { useState } from 'react';
import AdminSidebar from '@/Components/AdminSidebar';
import axiosService from '@/Services/Axios';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const [message, setMessage] = useState('');
  const [startTime, setStartTime] = useState(() => 
    new Date().toLocaleString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(', ', 'T')
  );
  
  const [endTime, setEndTime] = useState(() => {
    const d = new Date();
    d.setHours(d.getHours() + 1);
    return d.toLocaleString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(', ', 'T');
  });
  const [status, setStatus] = useState(null);
  const userState = useSelector(state => state?.user);
  const { data: user } = userState;
 


  console.log("userId",user?.userId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const startUTC = new Date(startTime).toISOString(); 
    const endUTC = new Date(endTime).toISOString();

    try {
      await axiosService.post('/api/banner/create', {
        message,
        startTime: startUTC,
        endTime: endUTC,     
        userId: user?.userId,
      });
      setStatus({ type: 'success', text: 'Banner created successfully!' });
      setMessage(''); setStartTime(''); setEndTime('');
      toast.success("Banner created successfully.")
      setStartTime(new Date().toISOString().slice(0,16));            
      setEndTime(new Date(Date.now()+3600*1000).toISOString().slice(0,16)); 

    }catch (err) {
      console.log("Full error details:", err.response?.data?.errors);
      setStatus({ type: 'error', text: err.response?.data?.errors || err.message });
    }
  };


  console.log("user id", user?.userId);

  return (
    <div className="flex min-h-screen md:gap-80 justify-center items-center">
 
      <div className="w-64 flex-shrink-0">
        <AdminSidebar />
      </div>
      <main className="flex-1  p-6 bg-gray-100 rounded-3xl">
        <h1 className="text-2xl font-bold text-blue-600 mb-6">Create Timed Banner</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg p-6 max-w-lg mx-auto space-y-4"
        >
          {status && (
            <div
              className={`p-3 rounded ${
                status.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {status.text}
            </div>
          )}

          <div>
            <label className="block font-medium text-blue-600 mb-1">Message</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter banner message..."
              required
            />
          </div>

          <div>
            <label className="block font-medium text-blue-600 mb-1">
              Start Time
            </label>
            <input
              type="datetime-local"
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-600"
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
            />
          </div>
          <div>
            <label className="block font-medium text-blue-600 mb-1">
              End Time
            </label>
            <input
              type="datetime-local"
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-600"
              value={endTime}
              onChange={e => setEndTime(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-black font-medium py-2 rounded hover:bg-blue-700 transition"
          >
            Create Banner
          </button>
        </form>
      </main>
    </div>
  );
};

export default AdminDashboard;
