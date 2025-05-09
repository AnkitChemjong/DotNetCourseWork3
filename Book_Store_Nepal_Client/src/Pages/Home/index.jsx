import React from 'react';
import UserNavbar from '../../Components/UserNavbar';
import { FaStar, FaShippingFast, FaBookOpen, FaExchangeAlt } from 'react-icons/fa';
import { BsBookHalf } from 'react-icons/bs';
import Footer from '@/Components/Footer';
import { Button } from '@/Components/ui/button';
import { categories } from '@/lib/utils';
import SliderBanner from '@/Components/ui/banner';
import NotificationDisplay from '../NotificationDisplay/NotificationDisplay';
const Home = () => {
  // Dummy data for latest books
  const latestBooks = [
    {
      id: 1,
      title: "The Midnight Library",
      author: "Matt Haig",
      cover: "https://m.media-amazon.com/images/I/81bsw6fnUiL._AC_UF1000,1000_QL80_.jpg",
      price: 12.99,
      rating: 4.2
    },
    {
      id: 2,
      title: "Project Hail Mary",
      author: "Andy Weir",
      cover: "https://m.media-amazon.com/images/I/91p5b0U7MFL._AC_UF1000,1000_QL80_.jpg",
      price: 14.95,
      rating: 4.5
    },
    {
      id: 3,
      title: "Klara and the Sun",
      author: "Kazuo Ishiguro",
      cover: "https://m.media-amazon.com/images/I/71b6Uj5T1iL._AC_UF1000,1000_QL80_.jpg",
      price: 13.50,
      rating: 4.0
    },
    {
      id: 4,
      title: "The Sanatorium",
      author: "Sarah Pearse",
      cover: "https://m.media-amazon.com/images/I/81Jd2R3G+VL._AC_UF1000,1000_QL80_.jpg",
      price: 10.99,
      rating: 3.8
    }
  ];

  // Dummy data for highest reviewed books
  const topRatedBooks = [
    {
      id: 5,
      title: "The Song of Achilles",
      author: "Madeline Miller",
      cover: "https://m.media-amazon.com/images/I/91bNW5x+3FL._AC_UF1000,1000_QL80_.jpg",
      price: 11.25,
      rating: 4.7
    },
    {
      id: 6,
      title: "Educated",
      author: "Tara Westover",
      cover: "https://m.media-amazon.com/images/I/71rkg5x2WdL._AC_UF1000,1000_QL80_.jpg",
      price: 12.50,
      rating: 4.6
    },
    {
      id: 7,
      title: "Where the Crawdads Sing",
      author: "Delia Owens",
      cover: "https://m.media-amazon.com/images/I/81O1oy0y9eL._AC_UF1000,1000_QL80_.jpg",
      price: 9.99,
      rating: 4.5
    },
    {
      id: 8,
      title: "Atomic Habits",
      author: "James Clear",
      cover: "https://m.media-amazon.com/images/I/91bYsX41DVL._AC_UF1000,1000_QL80_.jpg",
      price: 14.99,
      rating: 4.5
    }
  ];


  const services = [
    {
      id: 1,
      title: "Fast Delivery",
      description: "Get your books delivered within 2-3 business days",
      icon: <FaShippingFast className="text-4xl text-blue-600 mx-auto" />
    },
    {
      id: 2,
      title: "Wide Selection",
      description: "Over 100,000 titles across all genres",
      icon: <BsBookHalf className="text-4xl text-blue-600 mx-auto" />
    },
    {
      id: 3,
      title: "Easy Returns",
      description: "30-day return policy for damaged books",
      icon: <FaExchangeAlt className="text-4xl text-blue-600 mx-auto" />
    },
    {
      id: 4,
      title: "Reading Community",
      description: "Join our book clubs and reading events",
      icon: <FaBookOpen className="text-4xl text-blue-600 mx-auto" />
    }
  ];


  return (
 
    <div className="bg-white">
      <nav className="bg-white shadow-sm z-50 relative">
      <UserNavbar />
      </nav>

 <div className="mt-16">
      <SliderBanner/>


     

    {/* <NotificationDisplay/> */}


      <section className="relative bg-blue-900 text-white py-32">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Welcome to Book Store Nepal</h1>
          <p className="text-xl md:text-2xl mb-8">Discover your next favorite book from our vast collection</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-black font-bold py-3 px-8 rounded-lg transition duration-300">
            Browse Collection
          </button>
        </div>
      </section>
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-blue-900 mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map(service => (
              <div key={service.id} className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition duration-300">
                {service.icon}
                <h3 className="text-xl font-semibold text-blue-900 mt-4">{service.title}</h3>
                <p className="text-gray-600 mt-2">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-blue-900 mb-12">Browse by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <div key={index} className="bg-blue-600 hover:bg-blue-700 text-white text-center py-4 px-2 rounded-lg cursor-pointer transition duration-300">
                <h3 className="font-medium">{category}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
      
  
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-blue-900 mb-12">Latest Releases</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {latestBooks.map(book => (
              <div key={book.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300">
                <img src={book.cover} alt={book.title} className="w-full h-80 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 truncate">{book.title}</h3>
                  <p className="text-gray-600 text-sm">{book.author}</p>
                  <div className="flex items-center mt-2">
                    {[...Array(5)].map((_, i) => (
                      <FaStar 
                        key={i} 
                        className={i < Math.floor(book.rating) ? "text-yellow-400" : "text-gray-300"} 
                      />
                    ))}
                    <span className="text-gray-600 ml-2">({book.rating})</span>
                  </div>
                  <p className="text-blue-700 font-bold mt-2">${book.price.toFixed(2)}</p>
                  <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition duration-300">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-blue-900 mb-12">Highest Rated Books</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {topRatedBooks.map(book => (
              <div key={book.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300 border border-blue-100">
                <img src={book.cover} alt={book.title} className="w-full h-80 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 truncate">{book.title}</h3>
                  <p className="text-gray-600 text-sm">{book.author}</p>
                  <div className="flex items-center mt-2">
                    {[...Array(5)].map((_, i) => (
                      <FaStar 
                        key={i} 
                        className={i < Math.floor(book.rating) ? "text-yellow-400" : "text-gray-300"} 
                      />
                    ))}
                    <span className="text-gray-600 ml-2">({book.rating})</span>
                  </div>
                  <p className="text-blue-700 font-bold mt-2">${book.price.toFixed(2)}</p>
                  <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition duration-300">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
   
      
    
      
      
      <section className="py-16 bg-blue-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Become Member</h2>
          <p className="text-xl mb-8">Subscribe to our newsletter for the latest releases and deals</p>
          <form className="max-w-md mx-auto flex gap-2 items-center">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-grow px-4 py-3 rounded-lg focus:outline-none bg-white text-black"
              required 
            />
            <Button
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-bold transition duration-300 text-black"
            >
              Get
            </Button>
          </form>
        </div>
      </section>
      </div>
     
  
      <Footer/>
    </div>

  );
 
}

export default Home;