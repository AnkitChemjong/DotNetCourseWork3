import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen min-w-screen flex flex-col items-center justify-center bg-gray-100 text-center px-4">
      <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
      <p className="text-lg text-gray-600 mb-6">Oops! The page you're looking for doesn't exist.</p>
      <button
        onClick={goBack}
        className="px-6 py-3 bg-blue-600 text-black rounded hover:bg-blue-700 transition duration-300"
      >
        Go Back
      </button>
    </div>
  );
};

export default NotFound;
