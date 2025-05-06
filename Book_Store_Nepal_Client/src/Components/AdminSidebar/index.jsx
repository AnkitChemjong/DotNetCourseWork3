import React, { useState } from 'react';
import { Link, useLocation,useNavigate } from 'react-router-dom';
import { FaThLarge, FaBookMedical, FaSignOutAlt } from 'react-icons/fa';
import { getUser } from '@/Store/Slice/UserSlice';
import { useDispatch } from 'react-redux';
import axiosService from '@/Services/Axios';

const AdminSidebar = () => {
  const location = useLocation();
  const dispatch=useDispatch();
  const navigate=useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  //navitem for the navigation

  const navItems = [
    {
      pageName: "Dashboard",
      path: '/admin/dashboard',
      icon: <FaThLarge className="mr-2" />,
    },
    {
      pageName: "Add Book",
      path: '/admin/addbook',
      icon: <FaBookMedical className="mr-2" />,
    },

    {
      pageName: "Manage Book",
      path: '/admin/managebook',
      icon: <FaBookMedical className="mr-2" />,
    },
  ];
  const handleLogout=async()=>{
    try{
        const response=await axiosService.get('/api/user/logout');
        if(response?.status===200){
            dispatch(getUser());
            alert(response?.data?.message);
            navigate('/sign-in');
        }
    }
    catch(error){
        console.log(error);
        alert(error?.message);
    }

};

  return (
    <div
      className={`fixed inset-y-0 left-0 bg-white shadow-md transition-transform transform w-64 
                  ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 z-50`}
    >
      <div className="flex items-center justify-between px-4 py-4 border-b">
        <span className="text-xl font-bold text-indigo-600">Admin Panel</span>
        
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden focus:outline-none"
          aria-label="Toggle Sidebar"
        >
      
          <svg
            className="h-6 w-6 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {sidebarOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      <nav className="mt-4">
        {navItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-300
                        ${location.pathname === item.path ? 'bg-indigo-100 text-indigo-700' : ''}`}
          >
            {item.icon}
            <span>{item.pageName}</span>
          </Link>
        ))}
      </nav>
        <div onClick={handleLogout} className='flex items-center gap-2 text-indigo-700 cursor-pointer w-full p-4 rounded-b-lg hover:bg-indigo-50 hover:text-indigo-600'>
            <FaSignOutAlt className='w-5 h-5'/> Logout
        </div>
    </div>
  );
};

export default AdminSidebar;