import React, { useState } from 'react';
import AdminSidebar from '@/Components/AdminSidebar';
import axios from 'axios';
import axiosService from '@/Services/Axios';
import { toast } from 'sonner';

const AddBook = () => {
    const initialState={
        title: '',
        author: '',
        isbn: '',
        description: '',
        genre: '',
        format: '',
        language: '',
        price: '',
        stock: '',
        publisher: '',
        isOnSale: false,
        coverImage: null,
      };
  const [book, setBook] = useState(initialState);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBook((prevBook) => ({
      ...prevBook,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = async(e) => {

    try{
        const {value,files,name}=e.target;
        const formData=new FormData();
        formData.append('file',files[0]);
        formData.append('upload_preset',import.meta.env.VITE_CLOUD_PRESET);
        formData.append('cloud_name',import.meta.env.VITE_CLOUD_NAME);
        const response=await axios.post(import.meta.env.VITE_CLOUD_BASE_URL,formData);
        if(response?.status===200){
            setBook((prevBook) => ({
              ...prevBook,
              coverImage: response?.data?.url,
            }));
            e.target.value="";
        }
    }
    catch(error){
        console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    try{
        e.preventDefault();
        const response=await axiosService.post('/api/book/create',book);
       if(response?.status===201){
         toast.success(response?.data?.message);
        setBook(initialState);
       }
    }
    catch(error){
        console.log(error);
      toast.error(error?.response?.data);
    }
   
  };

  return (
    <div className="flex min-h-screen overflow-hidden">
      <div className="hidden md:block w-64">
        <AdminSidebar />
      </div>
      <div className="flex-grow overflow-auto p-6">
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-md mt-8 p-6">
          <h2 className="text-2xl font-bold text-indigo-600 mb-6">Add Book</h2>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-gray-700 font-medium">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={book.title}
                  onChange={handleInputChange}
                  maxLength="100"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              {/* Author */}
              <div>
                <label htmlFor="author" className="block text-gray-700 font-medium">
                  Author
                </label>
                <input
                  type="text"
                  name="author"
                  id="author"
                  value={book.author}
                  onChange={handleInputChange}
                  maxLength="50"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              {/* ISBN */}
              <div>
                <label htmlFor="isbn" className="block text-gray-700 font-medium">
                  ISBN
                </label>
                <input
                  type="text"
                  name="isbn"
                  id="isbn"
                  value={book.isbn}
                  onChange={handleInputChange}
                  pattern="^\d{10}(\d{3})?$"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              {/* Genre */}
              <div>
                <label htmlFor="genre" className="block text-gray-700 font-medium">
                  Genre
                </label>
                <input
                  type="text"
                  name="genre"
                  id="genre"
                  value={book.genre}
                  onChange={handleInputChange}
                  maxLength="30"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              {/* Format */}
              <div>
                <label htmlFor="format" className="block text-gray-700 font-medium">
                  Format
                </label>
                <input
                  type="text"
                  name="format"
                  id="format"
                  value={book.format}
                  onChange={handleInputChange}
                  maxLength="20"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              {/* Language */}
              
              <div>
                <label htmlFor="language" className="block text-gray-700 font-medium">
                  Language
                </label>
                <input
                  type="text"
                  name="language"
                  id="language"
                  value={book.language}
                  onChange={handleInputChange}
                  maxLength="20"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              {/* Price */}
              <div>
                <label htmlFor="price" className="block text-gray-700 font-medium">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  id="price"
                  value={book.price}
                  onChange={handleInputChange}
                  min="0.01"
                  max="10000"
                  step="0.01"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              {/* Stock */}
              <div>
                <label htmlFor="stock" className="block text-gray-700 font-medium">
                  Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  id="stock"
                  value={book.stock}
                  onChange={handleInputChange}
                  min="0"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              {/* Publisher */}
              <div>
                <label htmlFor="publisher" className="block text-gray-700 font-medium">
                  Publisher
                </label>
                <input
                  type="text"
                  name="publisher"
                  id="publisher"
                  value={book.publisher}
                  onChange={handleInputChange}
                  maxLength="50"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              {/* Is On Sale */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isOnSale"
                  id="isOnSale"
                  checked={book.isOnSale}
                  onChange={handleInputChange}
                  className="h-5 w-5 text-indigo-600"
                />
                <label htmlFor="isOnSale" className="ml-2 text-gray-700 font-medium">
                  Is on Sale
                </label>
              </div>
              {/* Description */}
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-gray-700 font-medium">
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  value={book.description}
                  onChange={handleInputChange}
                  maxLength="500"
                  rows="4"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                ></textarea>
              </div>
              {/* Cover Image */}
              <div className="md:col-span-2">
                <label htmlFor="coverImage" className="block text-gray-700 font-medium">
                  Cover Image
                </label>
                <input
                  type="file"
                  name="coverImage"
                  id="coverImage"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="mt-1 block w-full"
                />
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="w-full bg-indigo-600 text-black py-2 rounded-md hover:bg-indigo-700 transition-colors "
              >
                Add Book
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBook;