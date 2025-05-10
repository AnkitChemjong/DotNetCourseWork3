import React,{useState,useEffect} from 'react';
import { useSelector } from 'react-redux';
import UserNavbar from '@/Components/UserNavbar';
import Footer from '@/Components/Footer';
import { Link, Navigate } from 'react-router-dom';
import axiosService from '@/Services/Axios';
import { getAllMark } from '@/Store/Slice/GetAllBookMark';
import { useDispatch } from 'react-redux';
import { Button } from '@/Components/ui/button';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const [userMark,setUserMark]=useState([]);
  const userState = useSelector(state => state?.user);
  const { data: user } = userState;
  const markState = useSelector(state => state?.bookmarks);
  const { data: marks } = markState;
  const userMarks=marks?.filter(item=>item?.userId===user?.userId);
  useEffect(()=>{
    if(marks?.length>0){
      const userMarksData=marks?.filter(item=>item?.userId===user?.userId);
      setUserMark(userMarksData);
    }
  },[user,marks]);

  const getInitial = (name) => name?.charAt(0)?.toUpperCase();

  // Function to handle removing a bookmark
  const handleRemoveBookmark =async (listId) => {
    try{

      if(listId){
     const response=await axiosService.delete(`/api/whitelist/delete/${listId}`);
     if(response?.status===200){
      dispatch(getAllMark());
      alert(response?.data);
     }
    }
    }
    catch(error){
      console.log(error);
      alert(error?.response?.data)
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <UserNavbar />

      <div className="flex-grow container mx-auto p-4 mt-20">
        <div className="max-w-4xl mx-auto">
          {/* Profile Card */}
          <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
            <div className="flex flex-col items-center gap-4">
              {/* Profile Image or Initial */}
              {user?.userImage ? (
                <img
                  src={user.userImage}
                  alt="User"
                  className="w-24 h-24 rounded-full object-cover border-2 border-black"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold border-2 border-black">
                  {getInitial(user?.name)}
                </div>
              )}

              <div className="text-center">
                <h2 className="text-xl font-semibold">{user?.name}</h2>
                <p className="text-gray-600">{user?.email}</p>
                <p className="text-sm font-medium text-blue-600 uppercase">{user?.role}</p>
              </div>
            </div>
            <div className='flex justify-between'>
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Account Details</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p><span className="font-semibold">User ID:</span> {user?.userId}</p>
                <p><span className="font-semibold">Email:</span> {user?.email}</p>
                <p><span className="font-semibold">Role:</span> {user?.role}</p>
              </div>
            </div>
            <Button onClick={()=>navigate('/userorder')} className="text-black hover:bg-amber-400">My Orders</Button>
            </div>
          </div>

          {/* Bookmarked Books Section */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Bookmarked Books ({userMarks?.length || 0})</h3>
            
            {userMark?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userMark?.map((bookmark) => (
                  <div key={bookmark.book.bookId} className="border rounded-lg p-4 flex flex-col sm:flex-row gap-4">
                    <div className="flex-shrink-0">
                      <img 
                        src={bookmark.book.coverImage} 
                        alt={bookmark.book.title}
                        className="w-24 h-32 object-cover rounded"
                      />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-semibold text-lg">{bookmark.book.title}</h4>
                      <p className="text-gray-600 text-sm">by {bookmark.book.author}</p>
                      <p className="text-gray-700 mt-2 line-clamp-2">{bookmark.book.description}</p>
                      <div className="mt-3 flex gap-2">
                        <Link 
                          to={`/book-details/${bookmark.book.bookId}`}
                          className="px-3 py-1 text-center text-black rounded hover:bg-blue-600 text-lg"
                        >
                          View Book
                        </Link>
                        <button
                          onClick={() => handleRemoveBookmark(bookmark.listId)}
                          className="px-3 py-1 bg-red-500 text-black rounded hover:bg-red-600 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">You haven't bookmarked any books yet.</p>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Profile;