import React, { useEffect, useState } from 'react';
import AdminSidebar from '@/Components/AdminSidebar';
import axiosService from '@/Services/Axios';
import { useNavigate } from 'react-router-dom';
import AddDiscount from '@/Components/AddDiscount';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { getAllBook } from '@/Store/Slice/AllBookSlice';
import ConfirmDialog from '@/Components/ConfirmDialog';



const AllBooks = () => {
  const [loading, setLoading] = useState(true);
  const bookState=useSelector(state=>state?.books);
  const {data:allBook}=bookState;
  const userState=useSelector(state=>state?.user);
  const {data:user}=userState;
  const navigate =useNavigate();
  const [handleDialog,setHandleDialog]=useState(false);
  const [toggleDialog,setToggleDialog]=useState(false);
  const [tempBookId,setTempBookId]=useState(null);
  const [bookIdToUpdate,setBookIdToUpdate]=useState(null);
  const dispatch=useDispatch();

  useEffect(()=>{
    if(allBook||allBook?.length>0){
      setLoading(false);
    }
  },[allBook,user]);

  const removeDiscount=async(bookId)=>{
    try{
      const response=await axiosService.patch('/api/book/end-discount',{bookId});
      if(response?.status>=200 && response?.status<300){

         dispatch(getAllBook());
         setToggleDialog(false);
         toast.success(response?.data?.message);
      }

    }
    catch(error){
      toast.error(error?.response?.data);
      console.log(error);
    }
  }


  const handleDelete = async (bookId) => {
    if (confirm('Are you sure you want to delete this book?')) {
      try {
        const response = await axiosService.delete(`/api/book/delete/${bookId}`);
        if (response?.status === 200) {
          toast.success(response?.data?.message || 'Book deleted');
          dispatch(getAllBook());
        }
      } catch (error) {
        console.error('Error deleting book:', error);
        toast.error(error?.response?.data || 'Delete failed');
      }
    }
  };


  const handleEdit = (bookId) => {
    navigate(`/admin/updatebook/${bookId}`);
  };

  return (
    <div className="flex min-h-screen overflow-hidden">
      <div className="hidden md:block w-64">
        <AdminSidebar />
      </div>
      <div className="flex-grow overflow-auto p-6">
        <div className="max-w-6xl mx-auto bg-white shadow-md rounded-md mt-8 p-6">
          <h2 className="text-2xl font-bold text-indigo-600 mb-6">All Books</h2>
          {loading ? (
            <p>Loading...</p>
          ) : allBook.length === 0 ? (
            <p>No books found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border">
                <thead>
                  <tr className="bg-indigo-100 text-left">
                    <th className="px-4 py-2 border">Title</th>
                    <th className="px-4 py-2 border">Author</th>
                    <th className="px-4 py-2 border">ISBN</th>
                    <th className="px-4 py-2 border">Price</th>
                    <th className="px-4 py-2 border">Discount</th>
                    <th className="px-4 py-2 border">Stock</th>
                    <th className="px-4 py-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allBook.map((book) => (
                    <tr key={book.bookId} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border">{book.title}</td>
                      <td className="px-4 py-2 border">{book.author}</td>
                      <td className="px-4 py-2 border">{book.isbn}</td>
                      <td className="px-4 py-2 border">${book.price}</td>
                      <td className="px-4 py-2 border">{book.discount} %</td>
                      <td className="px-4 py-2 border">{book.stock}</td>
                      <td className="px-4 py-2 border">
                        <button
                          onClick={() => handleEdit(book.bookId)}
                          className="bg-yellow-400 text-black px-3 py-1 rounded mr-2 hover:bg-yellow-500"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(book.bookId)}
                          className="bg-red-500 text-black px-3 py-1 rounded hover:bg-red-600 mr-2"
                        >
                          Delete
                        </button>
                        {
                          book?.discount>0 ? 
                          (
                            <>
                            <button
                            onClick={() =>{setToggleDialog(true)
                              setTempBookId(book?.bookId)
                            }}
                            className="bg-red-500 text-black px-3 py-1 rounded hover:bg-red-600"
                          >
                            Remove Discount
                          </button>
                          {
                            toggleDialog && 
                            <ConfirmDialog toggleDialog={toggleDialog} setToggleDialog={setToggleDialog}
                            title="Do you want to Remove Discount?"  func={()=>removeDiscount(tempBookId)} />
                          }
                            </>

                          ):(
                            <>
                            <button
                            onClick={() =>{
                              setHandleDialog(true);
                              setBookIdToUpdate(book.bookId);
                            } }
                            className="bg-red-500 text-black px-3 py-1 rounded hover:bg-red-600"
                          >
                            Add Discount
                          </button>
                          {
                            handleDialog && 
                            <AddDiscount  handleDialog={handleDialog} setHandleDialog={setHandleDialog} BookId={bookIdToUpdate}/>
                          }
                            </>

                          )
                        }
                       
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllBooks;
