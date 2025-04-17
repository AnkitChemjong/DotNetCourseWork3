import React from 'react';
import { useSelector } from 'react-redux';
import UserNavbar from '@/Components/UserNavbar';
import Footer from '@/Components/Footer';

function Profile() {
  const userState = useSelector(state => state?.user);
  const { data: user } = userState;

  const getInitial = (name) => name?.charAt(0)?.toUpperCase();

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <UserNavbar />

      <div className="flex-grow container mx-auto p-4 mt-20">
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex flex-col items-center gap-4">
            {/* Profile Image or Initial */}
            {
              user?.userImage ? (
                <img
                  src={user.userImage}
                  alt="User"
                  className="w-24 h-24 rounded-full object-cover border-2 border-black"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold border-2 border-black">
                  {getInitial(user?.name)}
                </div>
              )
            }

  
            <div className="text-center">
              <h2 className="text-xl font-semibold">{user?.name}</h2>
              <p className="text-gray-600">{user?.email}</p>
              <p className="text-sm font-medium text-blue-600 uppercase">{user?.role}</p>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Account Details</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p><span className="font-semibold">User ID:</span> {user?.userId}</p>
              <p><span className="font-semibold">Email:</span> {user?.email}</p>
              <p><span className="font-semibold">Role:</span> {user?.role}</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Profile;
