import React, { useEffect, useState } from 'react';
import AdminSidebar from '@/Components/AdminSidebar';
import axiosService from '@/Services/Axios';
import { useNavigate } from 'react-router-dom';


const AllBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate =useNavigate();

  console.log("books",books);

  const fetchBooks = async () => {
    try {
      const response = await axiosService.get('/api/book/getAllBooks');

      console.log("response data",response?.data);
      if (response?.status === 200) {
        const vals = response.data.$values;
        setBooks(Array.isArray(vals) ? vals : []);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);


  const handleDelete = async (bookId) => {
    if (confirm('Are you sure you want to delete this book?')) {
      try {
        const response = await axiosService.delete(`/api/book/delete/${bookId}`);
        if (response?.status === 200) {
          alert(response?.data?.message || 'Book deleted');
          fetchBooks(); 
        }
      } catch (error) {
        console.error('Error deleting book:', error);
        alert(error?.response?.data || 'Delete failed');
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
          ) : books.length === 0 ? (
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
                    <th className="px-4 py-2 border">Stock</th>
                    <th className="px-4 py-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book) => (
                    <tr key={book.bookId} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border">{book.title}</td>
                      <td className="px-4 py-2 border">{book.author}</td>
                      <td className="px-4 py-2 border">{book.isbn}</td>
                      <td className="px-4 py-2 border">${book.price}</td>
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
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
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
