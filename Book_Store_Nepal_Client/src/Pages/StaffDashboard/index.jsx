import React from 'react';
import StaffSidebar from '@/Components/StaffSidebar';
import { Button } from '@/Components/ui/button';
import { FiUsers, FiBook, FiDollarSign, FiCalendar, FiBarChart2, FiMail } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const StaffDashboard = () => {
  const navigate=useNavigate();
  return (
    <div className="flex h-screen w-screen justify-between items-center flex-row">
      <StaffSidebar />
      
      <div className="flex-1 p-8 overflow-auto ml-64 w-fit">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Staff Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
          <Button onClick={()=>navigate('/')} className="text-black hover:bg-amber-400">Go Home</Button>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Card 1 */}
          <div className="bg-white rounded-lg shadow p-6 flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <FiUsers className="text-2xl" />
            </div>
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Total Members</h3>
              <p className="text-2xl font-bold text-gray-800">1,248</p>
              <p className="text-green-500 text-xs">+12% from last month</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-lg shadow p-6 flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <FiBook className="text-2xl" />
            </div>
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Books Checked Out</h3>
              <p className="text-2xl font-bold text-gray-800">342</p>
              <p className="text-red-500 text-xs">-5% from last week</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-lg shadow p-6 flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <FiDollarSign className="text-2xl" />
            </div>
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Overdue Fees</h3>
              <p className="text-2xl font-bold text-gray-800">$1,420</p>
              <p className="text-green-500 text-xs">+8% from last month</p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-lg shadow p-6 flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <FiCalendar className="text-2xl" />
            </div>
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Upcoming Events</h3>
              <p className="text-2xl font-bold text-gray-800">3</p>
              <p className="text-blue-500 text-xs">View schedule</p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Activity Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Library Activity</h2>
              <select className="bg-gray-100 border border-gray-300 text-gray-700 py-1 px-3 rounded focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option>This Week</option>
                <option>This Month</option>
                <option>This Year</option>
              </select>
            </div>
            <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
              <p className="text-gray-500">Chart visualization would go here</p>
            </div>
          </div>

          {/* Recent Notifications */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
                  <FiMail className="text-lg" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">New membership application</p>
                  <p className="text-sm text-gray-600">John Doe applied for a library membership</p>
                  <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="p-2 rounded-full bg-yellow-100 text-yellow-600 mr-3">
                  <FiBook className="text-lg" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Book return reminder</p>
                  <p className="text-sm text-gray-600">"The Great Gatsby" is due tomorrow</p>
                  <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="p-2 rounded-full bg-red-100 text-red-600 mr-3">
                  <FiDollarSign className="text-lg" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Overdue fee payment</p>
                  <p className="text-sm text-gray-600">Jane Smith paid $15 in overdue fees</p>
                  <p className="text-xs text-gray-500 mt-1">3 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StaffDashboard;