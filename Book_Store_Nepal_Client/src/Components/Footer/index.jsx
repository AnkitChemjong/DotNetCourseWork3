import React from 'react';
import { FaFacebook, FaInstagram, FaWhatsapp, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="min-w-screen bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Book Store Nepal</h3>
            <p className="text-gray-300">
              Your premier destination for books in Nepal. We offer a wide range of genres from local authors to international bestsellers.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-300  transition-colors">
                <FaFacebook className='hover:text-blue-900 hover:scale-105 transition-all duration-150' size={24} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-300  transition-colors">
                <FaInstagram className='hover:text-red-700 hover:scale-105 transition-all duration-150 ' size={24} />
              </a>
              <a href="https://wa.me/9779800000000" target="_blank" rel="noopener noreferrer" className="text-gray-300  transition-colors">
                <FaWhatsapp className='hover:text-green-700 hover:scale-105 transition-all duration-150' size={24} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-500 hover:text-white transition-colors">Home</a></li>
              <li><a href="/books" className="text-gray-500 hover:text-white transition-colors">Books</a></li>
             </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <FaMapMarkerAlt className="mt-1 text-gray-300" />
                <p className="text-gray-300">Itahari, Nepal</p>
              </div>
              <div className="flex items-center space-x-3">
                <FaPhone className="text-gray-300" />
                <p className="text-gray-300">+977 9800000000</p>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-gray-300" />
                <p className="text-gray-300">info@bookstorenepal.com</p>
              </div>
            </div>
          </div>
        </div>

     
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Book Store Nepal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;