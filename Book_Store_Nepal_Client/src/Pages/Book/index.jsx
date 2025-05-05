import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiBookmark, FiShoppingCart, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import UserNavbar from '../../Components/UserNavbar';
import Footer from '@/Components/Footer';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axiosService from '@/Services/Axios';
import { getAllCart } from '@/Store/Slice/AllCartSlice';
import { getAllMark } from '@/Store/Slice/GetAllBookMark';

const BookPage = () => {
  const navigate = useNavigate();
  const dispatch=useDispatch();
  const bookState = useSelector(state => state?.books);
  const { data: allBooks = [], loading } = bookState;
const userState=useSelector(state=>state?.user);
const {data:user}=userState;
const markState=useSelector(state=>state?.bookmarks);
const {data:marks}=markState;
  // State management
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(8);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState({});
  const [tetikai,setTetikai]=useState("");
  const [filters, setFilters] = useState({

    genre: [],
    availability: [],
    priceRange: [0, 1000],
    rating: 0,
    language: [],
    format: [],
    publisher: [],
    category: 'all',
    sortBy: 'popularity'
  });

  // Extract filter options from actual data
  const filterOptions = {
    genres: [...new Set(allBooks?.map(book => book.genre))].filter(Boolean),
    languages: [...new Set(allBooks?.map(book => book.language))].filter(Boolean),
    formats: [...new Set(allBooks?.map(book => book.format))].filter(Boolean),
    publishers: [...new Set(allBooks?.map(book => book.publisher))].filter(Boolean),
    categories: [
      { value: 'all', label: 'All Books' },
      { value: 'onSale', label: 'On Sale' }
    ],
    availability: [
      { value: 'inStock', label: 'In Stock' }
    ],
    sortOptions: [
      { value: 'popularity', label: 'Popularity' },
      { value: 'title', label: 'Title (A-Z)' },
      { value: 'date', label: 'Publication Date (Newest)' },
      { value: 'priceLow', label: 'Price (Low to High)' },
      { value: 'priceHigh', label: 'Price (High to Low)' }
    ]
  };

  // Get current books for pagination
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Toggle filter section expansion
  const toggleFilterSection = (section) => {
    setExpandedFilters(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Apply filters
  useEffect(() => {
    let filtered = [...allBooks||[]];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(book => 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.isbn.includes(searchTerm) ||
        book.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    switch(filters.category) {
      case 'onSale':
        filtered = filtered.filter(book => book.isOnSale);
        break;
      default:
        // All books
        break;
    }

    // Other filters
    if (filters.genre.length > 0) {
      filtered = filtered.filter(book => 
        filters.genre.includes(book.genre)
      );
    }

    if (filters.availability.includes('inStock')) {
      filtered = filtered.filter(book => book.stock > 0);
    }

    filtered = filtered.filter(book => 
      book.price >= filters.priceRange[0] && 
      book.price <= filters.priceRange[1]
    );

    if (filters.rating > 0) {
      filtered = filtered.filter(book => book.rating >= filters.rating);
    }

    if (filters.language.length > 0) {
      filtered = filtered.filter(book => 
        filters.language.includes(book.language)
      );
    }

    if (filters.format.length > 0) {
      filtered = filtered.filter(book => 
        filters.format.includes(book.format)
      );
    }

    if (filters.publisher.length > 0) {
      filtered = filtered.filter(book => 
        filters.publisher.includes(book.publisher)
      );
    }

    // Sorting
    switch(filters.sortBy) {
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'date':
        filtered.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
        break;
      case 'priceLow':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'priceHigh':
        filtered.sort((a, b) => b.price - a.price);
        break;
      default:
        // popularity (default sorting)
        break;
    }

    setFilteredBooks(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, filters, allBooks]);

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      if (Array.isArray(prev[filterType])) {
        return {
          ...prev,
          [filterType]: prev[filterType].includes(value) 
            ? prev[filterType].filter(item => item !== value)
            : [...prev[filterType], value]
        };
      } else {
        return { ...prev, [filterType]: value };
      }
    });
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      genre: [],
      availability: [],
      priceRange: [0, 1000],
      rating: 0,
      language: [],
      format: [],
      publisher: [],
      category: 'all',
      sortBy: 'popularity'
    });
    setSearchTerm('');
  };

  // Render star rating
  const renderStars = (rating) => {
    if (!rating) return null;
    
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400 text-sm" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400 text-sm" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400 text-sm" />);
      }
    }
    
    return stars;
  };

  const handleNavigate = async(id) => {
    if (id) {
      navigate(`/book-details/${id}`);
    }
  }

  const handleAddToCart=async(data)=>{
    try{
      const finalData={totalItems:1,cartTotal:Number(data?.price),userId:user?.userId,bookId:data?.bookId};
      const response=await axiosService.post('/api/cart/addToCart',finalData);
      console.log(response);
      if(response?.status===200){
        dispatch(getAllCart());
        alert(response?.data?.message);
      }

    }
    catch(error){
      console.log(error);
    }
  }
  const handleBookMark=async(data)=>{
    try{

      const userMarks=marks?.find(item=>item?.userId===user?.userId&&item?.book?.bookId===data?.bookId);
      if(userMarks){
          alert("Book Already bookmarked");
      }
      else{
        const finalData={userId:user?.userId,bookId:data?.bookId};
        const response=await axiosService.post('/api/whitelist/addBookMark',finalData);
        // console.log(response);
        if(response?.status===200){
          dispatch(getAllMark());
          alert(response?.data?.message);
        }
      }

    }
    catch(error){
      console.log(error);
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <UserNavbar />
      
      <div className="container mx-auto px-4 py-8 mt-10">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search by title, author, ISBN or description..."
              className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch className="absolute right-3 top-3.5 text-gray-400" />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FiFilter />
            <span>Filters</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Panel */}
          {showFilters && (
            <ScrollArea className='max-h-96 overflow-auto max-w-fit'>
              <div className="w-full md:w-72 bg-white p-6 rounded-lg shadow-md h-fit sticky top-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg">Filters</h3>
                  <div className="flex gap-2">
                    <button 
                      onClick={resetFilters}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Reset All
                    </button>
                    <button 
                      onClick={() => setShowFilters(false)} 
                      className="md:hidden text-gray-500 hover:text-gray-700"
                    >
                      <IoClose size={20} />
                    </button>
                  </div>
                </div>

                {/* Category Tabs */}
                <div className="mb-6">
                  <div 
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleFilterSection('category')}
                  >
                    <h4 className="font-semibold">Categories</h4>
                    {expandedFilters.category ? <FiChevronUp /> : <FiChevronDown />}
                  </div>
                  {expandedFilters.category !== false && (
                    <div className="mt-2 space-y-2">
                      {filterOptions.categories.map(category => (
                        <button
                          key={category.value}
                          onClick={() => handleFilterChange('category', category.value)}
                          className={`block w-full text-left px-3 py-2 rounded text-sm ${filters.category === category.value ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                        >
                          {category.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <div 
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleFilterSection('price')}
                  >
                    <h4 className="font-semibold">Price Range</h4>
                    {expandedFilters.price ? <FiChevronUp /> : <FiChevronDown />}
                  </div>
                  {expandedFilters.price !== false && (
                    <div className="mt-2 px-2">
                      <input
                        type="range"
                        min="0"
                        max="1000"
                        step="50"
                        value={filters.priceRange[1]}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          priceRange: [prev.priceRange[0], parseInt(e.target.value)]
                        }))}
                        className="w-full mb-2"
                      />
                      <div className="flex justify-between text-sm">
                        <span>Rs {filters.priceRange[0]}</span>
                        <span>Rs {filters.priceRange[1]}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Rating */}
                <div className="mb-6">
                  <div 
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleFilterSection('rating')}
                  >
                    <h4 className="font-semibold">Minimum Rating</h4>
                    {expandedFilters.rating ? <FiChevronUp /> : <FiChevronDown />}
                  </div>
                  {expandedFilters.rating !== false && (
                    <div className="mt-2">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            onClick={() => handleFilterChange('rating', star)}
                            className="focus:outline-none"
                          >
                            {star <= filters.rating ? (
                              <FaStar className="text-yellow-400" />
                            ) : (
                              <FaRegStar className="text-yellow-400" />
                            )}
                          </button>
                        ))}
                        {filters.rating > 0 && (
                          <button 
                            onClick={() => handleFilterChange('rating', 0)}
                            className="ml-2 text-sm text-gray-500 hover:text-gray-700"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Availability */}
                <div className="mb-6">
                  <div 
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleFilterSection('availability')}
                  >
                    <h4 className="font-semibold">Availability</h4>
                    {expandedFilters.availability ? <FiChevronUp /> : <FiChevronDown />}
                  </div>
                  {expandedFilters.availability !== false && (
                    <div className="mt-2 space-y-2">
                      {filterOptions.availability.map(option => (
                        <label key={option.value} className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={filters.availability.includes(option.value)}
                            onChange={() => handleFilterChange('availability', option.value)}
                            className="rounded text-blue-600 focus:ring-blue-500"
                          />
                          {option.label}
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Genre */}
                <div className="mb-6">
                  <div 
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleFilterSection('genre')}
                  >
                    <h4 className="font-semibold">Genre</h4>
                    {expandedFilters.genre ? <FiChevronUp /> : <FiChevronDown />}
                  </div>
                  {expandedFilters.genre !== false && (
                    <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                      {filterOptions.genres.map(genre => (
                        <label key={genre} className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={filters.genre.includes(genre)}
                            onChange={() => handleFilterChange('genre', genre)}
                            className="rounded text-blue-600 focus:ring-blue-500"
                          />
                          {genre}
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Format */}
                <div className="mb-6">
                  <div 
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleFilterSection('format')}
                  >
                    <h4 className="font-semibold">Format</h4>
                    {expandedFilters.format ? <FiChevronUp /> : <FiChevronDown />}
                  </div>
                  {expandedFilters.format !== false && (
                    <div className="mt-2 space-y-2">
                      {filterOptions.formats.map(format => (
                        <label key={format} className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={filters.format.includes(format)}
                            onChange={() => handleFilterChange('format', format)}
                            className="rounded text-blue-600 focus:ring-blue-500"
                          />
                          {format}
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Language */}
                <div className="mb-6">
                  <div 
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleFilterSection('language')}
                  >
                    <h4 className="font-semibold">Language</h4>
                    {expandedFilters.language ? <FiChevronUp /> : <FiChevronDown />}
                  </div>
                  {expandedFilters.language !== false && (
                    <div className="mt-2 space-y-2">
                      {filterOptions.languages.map(language => (
                        <label key={language} className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={filters.language.includes(language)}
                            onChange={() => handleFilterChange('language', language)}
                            className="rounded text-blue-600 focus:ring-blue-500"
                          />
                          {language}
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Publisher */}
                <div className="mb-6">
                  <div 
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleFilterSection('publisher')}
                  >
                    <h4 className="font-semibold">Publisher</h4>
                    {expandedFilters.publisher ? <FiChevronUp /> : <FiChevronDown />}
                  </div>
                  {expandedFilters.publisher !== false && (
                    <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                      {filterOptions.publishers.map(publisher => (
                        <label key={publisher} className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={filters.publisher.includes(publisher)}
                            onChange={() => handleFilterChange('publisher', publisher)}
                            className="rounded text-blue-600 focus:ring-blue-500"
                          />
                          {publisher}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>
          )}

          {/* Book List */}
          <div className="flex-grow">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold">
                {filterOptions.categories.find(c => c.value === filters.category)?.label || 'All Books'} 
                <span className="text-gray-500 text-sm font-normal ml-2">({filteredBooks.length} books)</span>
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select 
                  className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                >
                  {filterOptions.sortOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p>Loading books...</p>
              </div>
            ) : filteredBooks.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-gray-500 mb-4">No books found matching your criteria.</p>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {currentBooks.map(book => (
                    <div 
                      key={book.bookId}  
                      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:scale-105 hover:shadow-lg transition duration-300 flex flex-col h-full"
                    >
                      <div className="relative">
                        <img 
                          src={book.coverImage} 
                          alt={book.title} 
                          className="w-full h-48 sm:h-56 object-cover"
                          loading="lazy"
                        />
                        {book.isOnSale && (
                          <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                            SALE
                          </div>
                        )}
                        <button onClick={()=>handleBookMark(book)} className="absolute top-2 left-2 p-2 bg-white rounded-full text-black shadow hover:bg-gray-100">
                          <FiBookmark className="text-gray-600" />
                        </button>
                      </div>
                      <div className="p-4 flex-grow flex flex-col">
                        <h3 className="font-semibold text-lg mb-1 line-clamp-2" title={book.title}>
                          {book.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">{book.author}</p>
                        {book.rating && (
                          <div className="flex items-center mb-2">
                            <div className="flex">
                              {renderStars(book.rating)}
                            </div>
                            {book.reviews && book.reviews.length > 0 && (
                              <span className="text-gray-500 text-xs ml-1">({book.reviews.length})</span>
                            )}
                          </div>
                        )}
                        <div className="mt-auto">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-bold">Rs {book.price.toFixed(2)}</span>
                            </div>
                            <button onClick={()=>handleAddToCart(book)} className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-black text-sm rounded hover:bg-blue-700 transition-colors">
                              <FiShoppingCart size={14} />
                              <span>Add</span>
                            </button>
                            <button onClick={() => handleNavigate(book.bookId)} className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-black text-sm rounded hover:bg-blue-700 transition-colors">
                    
                              <span className='text-sm'>View Details</span>
                            </button>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1 text-xs text-gray-500">
                            {book.stock > 0 ? (
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded">In Stock ({book.stock})</span>
                            ) : (
                              <span className="bg-red-100 text-red-800 px-2 py-1 rounded">Out of Stock</span>
                            )}
                            {book.genre && (
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{book.genre}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <nav className="inline-flex rounded-md shadow">
                      <button
                        onClick={() => paginate(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                        <button
                          key={number}
                          onClick={() => paginate(number)}
                          className={`px-3 py-1 border-t border-b border-gray-300 bg-white text-sm font-medium ${currentPage === number ? 'bg-blue-50 text-blue-600 border-blue-500' : 'text-gray-700 hover:bg-gray-50'}`}
                        >
                          {number}
                        </button>
                      ))}
                      <button
                        onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BookPage;