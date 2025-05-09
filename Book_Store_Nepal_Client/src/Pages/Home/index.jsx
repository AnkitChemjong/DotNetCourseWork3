import React,{useState,useEffect} from 'react';
import UserNavbar from '../../Components/UserNavbar';
import { FaStar, FaShippingFast, FaBookOpen, FaExchangeAlt } from 'react-icons/fa';
import { BsBookHalf } from 'react-icons/bs';
import Footer from '@/Components/Footer';
import { Button } from '@/Components/ui/button';
import { categories } from '@/lib/utils';
import SliderBanner from '@/Components/SliderBanner/banner';
import { useSelector } from 'react-redux';
import renderStars from '@/Components/RenderStar';
import { useNavigate } from 'react-router-dom';
const Home = () => {
  const navigate=useNavigate();
  const bookState=useSelector(state=>state?.books);
  const {data:allBook,loading}=bookState;
  const reviewState=useSelector(state=>state?.reviews);
  const {data:allReview}=reviewState;
  const userState=useSelector(state=>state?.user);
  const {data:user}=userState;
  const [topFourBooks,setTopFourBooks]=useState([]);
  const [highestRatedBooks,setHighestRatedBooks]=useState([]);
   console.log(allBook)
  useEffect(()=>{
    if(allBook?.length>0 && !loading){
      const allBooksCopy=[...allBook]||[];
      const top4Books=allBooksCopy?.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate))?.slice(0,4);
      const top4RatedBooks = allBooksCopy
      ?.map(book => {
        const reviews = book?.reviews?.$values || [];
        const totalRating = reviews.reduce((sum, review) => sum + (review?.rating || 0), 0);
        const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
        return { ...book, averageRating };
      })
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, 4);
      if(top4RatedBooks?.length>0){
        setHighestRatedBooks(top4RatedBooks);
      }
      if (top4Books.length > 0) {
        setTopFourBooks(top4Books);
      }
      }
    },[user,allBook,allReview]);
    const handleNavigate=(bookId)=>{
      if(user && bookId){
            navigate(`/book-details/${bookId}`);
      }
      else{
        alert("Become Member first.")
        navigate('/sign-in');
      }
    }

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
      {topFourBooks.map(book => (
        <div key={book?.bookId} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300 relative">
          {/* Discount Flag */}
          {book.discount > 0 && new Date(book.discountEndDate) > new Date() && (
            <div className="absolute top-0 left-0 bg-red-600 text-white px-2 py-1 text-sm font-bold rounded-br-lg">
              {book.discount}% OFF
            </div>
          )}
          
          <img src={book.coverImage} alt={book.title} className="w-full h-80 object-cover" />
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800 truncate">{book.title}</h3>
            <p className="text-gray-600 text-sm">{book.author}</p>
            <div className="flex items-center mt-2">
              {/* Rating code remains the same */}
            </div>
            
            {/* Price with discount */}
            <div className="mt-2">
              {book.discount > 0 && new Date(book.discountEndDate) > new Date() ? (
                <>
                  <span className="text-gray-500 line-through mr-2">${book.price.toFixed(2)}</span>
                  <span className="text-blue-700 font-bold">
                    ${(book.price * (1 - book.discount/100)).toFixed(2)}
                  </span>
                  <div className="text-xs text-gray-500 mt-1">
                    Offer valid: {new Date(book.discountStartDate).toLocaleDateString()} - {new Date(book.discountEndDate).toLocaleDateString()}
                  </div>
                </>
              ) : (
                <span className="text-blue-700 font-bold">${book.price.toFixed(2)}</span>
              )}
            </div>
            
            <button onClick={() => handleNavigate(book?.bookId)} className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-black py-2 rounded transition duration-300">
              View Details
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
      {highestRatedBooks.map(book => (
        <div key={book.bookId} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300 border border-blue-100 relative">
          {/* Discount Flag */}
          {book.discount > 0 && new Date(book.discountEndDate) > new Date() && (
            <div className="absolute top-0 left-0 bg-red-600 text-white px-2 py-1 text-sm font-bold rounded-br-lg">
              {book.discount}% OFF
            </div>
          )}
          
          <img src={book.coverImage} alt={book.title} className="w-full h-80 object-cover" />
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800 truncate">{book.title}</h3>
            <p className="text-gray-600 text-sm">{book.author}</p>
            <div className="flex items-center mt-2">
              {/* Rating code remains the same */}
            </div>
            
            {/* Price with discount */}
            <div className="mt-2">
              {book.discount > 0 && new Date(book.discountEndDate) > new Date() ? (
                <>
                  <span className="text-gray-500 line-through mr-2">${book.price.toFixed(2)}</span>
                  <span className="text-blue-700 font-bold">
                    ${(book.price * (1 - book.discount/100)).toFixed(2)}
                  </span>
                  <div className="text-xs text-gray-500 mt-1">
                    Offer valid: {new Date(book.discountStartDate).toLocaleDateString()} - {new Date(book.discountEndDate).toLocaleDateString()}
                  </div>
                </>
              ) : (
                <span className="text-blue-700 font-bold">${book.price.toFixed(2)}</span>
              )}
            </div>
            
            <button onClick={() => handleNavigate(book?.bookId)} className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-black py-2 rounded transition duration-300">
              View Details
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