import React, { useState, useEffect } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiShoppingCart, FiBookmark, FiShare2, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import UserNavbar from '@/Components/UserNavbar';
import Footer from '@/Components/Footer';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from "@/components/ui/tabs";
import axiosService from '@/Services/Axios';
import { getAllCart } from '@/Store/Slice/AllCartSlice';
import { getAllMark } from '@/Store/Slice/GetAllBookMark';
import RateDialog from '@/Components/RateDialog';
import renderStars from '@/Components/RenderStar';
import { getAllBook } from '@/Store/Slice/AllBookSlice';
import { toast } from 'sonner';
const BookDetails = () => {
  const userState=useSelector(state=>state?.user);
  const {data:user}=userState;
  const markState=useSelector(state=>state?.bookmarks);
  const {data:marks}=markState;
  const orderState=useSelector(state=>state?.orders);
  const {data:allOrders}=orderState;
  const reviewState=useSelector(state=>state?.reviews);
  const {data:allReviews}=reviewState;
  const dispatch=useDispatch();
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate=useNavigate();
  const [userCompletedOrders,setUserCompletedOrders]=useState([]);
  const [checkReview,setCheckReview]=useState(false);
  const [isDialogOpen,setIsDialogOpen]=useState(false);
  const [userBookReview,setUserBookReview]=useState(false);
  const [bookReview,setBookReview]=useState([]);
 

  useEffect(()=>{
    if(user && book && allReviews?.length>0){
      const data=allReviews?.find(item=>item?.bookId===book?.bookId&&item?.userId===user?.userId);
      const bookData=allReviews?.filter(item=>item?.bookId===book?.bookId);
      if(bookData?.length>0){
        setBookReview(bookData);
      }
      if(data){
        setUserBookReview(true);
      }
    }
  },[user,book,allReviews]);
  useEffect(()=>{
   if(user && allOrders?.length>0){
    const userOrderData=allOrders?.filter(data=>data?.userId===user?.userId && data?.status==="Completed");
    setUserCompletedOrders(userOrderData);
   }
  },[user]);
  useEffect(()=>{
   if(userCompletedOrders?.length>0){
    const matchingOrders = userCompletedOrders.filter(order => {
      return (
        order.user?.userId === user?.userId &&
        order.orderItems?.$values?.some(item => item.bookId === book?.bookId)
      );
    });
    if(matchingOrders?.length>0){
      setCheckReview(true);
    }
   }
  },[userCompletedOrders]);
  
  // Get books from Redux store
  const bookState = useSelector(state => state?.books);
  const { data: allBooks = [] } = bookState;

  // Find the specific book by id
  useEffect(() => {
    if (allBooks?.length > 0) {
      const foundBook = allBooks?.find(book => book.bookId === parseInt(id));
      setBook(foundBook);
      setLoading(false);
    }
  }, [id, allBooks]);

  const handleAddToCart = async () => {
    try {
      // Calculate the actual price (considering discount if applicable)
      const currentPrice = book.discount > 0 && new Date(book.discountEndDate) > new Date()
        ? book.price * (1 - book.discount / 100)
        : book.price;
  
      const finalData = {
        totalItems: quantity,
        cartTotal: quantity * Number(currentPrice),
        userId: user?.userId,
        bookId: book?.bookId,
        originalPrice: book.price, // Include original price
        discount: book.discount,   // Include discount percentage
        discountedPrice: currentPrice // Include the actual price being charged
      };
  
      if (quantity <= Number(book?.stock)) {
        const response = await axiosService.post('/api/cart/addToCart', finalData);
        if (response?.status === 200) {
          dispatch(getAllCart());
          dispatch(getAllBook());
          toast.success(response?.data?.message || "Added to cart successfully");
        }
      } else if( Number(book?.stock)===0) {
        toast.error("Book out of stock.");
      }
      else{
        toast.error("Quantity exceeds available stock");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(error.response?.data?.message || "Failed to add to cart");
    }
  };
  const handleBookMark=async(data)=>{
    try{
      const userMarks=marks?.find(item=>item?.userId===user?.userId&&item?.book?.bookId===data?.bookId);
      if(userMarks){
        toast.info("Book already Bookmarked.")
      }
      else{

        const finalData={userId:user?.userId,bookId:data?.bookId};
        const response=await axiosService.post('/api/whitelist/addBookMark',finalData);
        // console.log(response);
        if(response?.status===200){
        dispatch(getAllMark());
          toast.success(response?.data?.message);
        }
      }
    }
    catch(error){
      console.log(error);
    }
  }



  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <UserNavbar />
        <div className="container mx-auto px-4 py-8 mt-10 text-center">
          <p>Loading book details...</p>
        </div>
        <Footer />
      </div>
    );
  }


  if (!book) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <UserNavbar />
        <div className="container mx-auto px-4 py-8 mt-10 text-center">
          <p>Book not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <UserNavbar />
      
      <div className="container mx-auto px-4 py-8 mt-14">

        {/* Main Book Details */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          {/* Book Image */}
          <div className="lg:w-1/3">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <img 
                src={book.coverImage} 
                alt={book.title} 
                className="w-full h-auto max-h-96 object-contain"
              />
              {book.isOnSale && (
                <div className="mt-2 text-center">
                  <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                    ON SALE
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Book Info */}
          {/* Book Info */}
<div className="lg:w-2/3">
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h1 className="text-2xl md:text-3xl font-bold mb-2">{book.title}</h1>
    <p className="text-lg text-gray-600 mb-4">by {book.author}</p>
    
    {bookReview?.length>0 ? (
      <div className="flex items-center mb-4">
        <div className="flex mr-2">
          {renderStars(bookReview?.length > 0 
            ? bookReview.reduce((sum, review) => sum + (review?.rating || 0), 0) / bookReview.length
            : 0)}
        </div>
        <span className="text-black text-sm">
          {book.rating} ({book.reviews?.length || 0} reviews)
        </span>
      </div>
    ):(
      <div className="flex items-center mb-4">
        <div className="flex mr-2">
          {renderStars(0)}
        </div>
        <span className="text-black text-sm">
          (0 reviews)
        </span>
      </div>
    )}

    <div className="mb-6">
      <div className="flex items-center gap-4 mb-3">
        <span className="text-lg font-semibold">Format:</span>
        <select className="border border-gray-300 rounded px-3 py-1">
          <option value="paperback">
            Paperback {book.stock > 0 ? '(In Stock)' : '(Out of Stock)'}
          </option>
        </select>
      </div>
    </div>

    {/* Discount Price Display */}
    {book.discount > 0 && new Date(book.discountEndDate) > new Date() ? (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-gray-500 line-through text-xl">Rs {book.price.toFixed(2)}</span>
          <span className="bg-red-600 text-white text-sm font-bold px-2 py-0.5 rounded">
            {book.discount}% OFF
          </span>
        </div>
        <span className="text-3xl font-bold text-red-600">
          Rs {(book.price * (1 - book.discount/100)).toFixed(2)}
        </span>
        <div className="text-sm text-gray-600 mt-1">
          You save Rs {(book.price * (book.discount/100)).toFixed(2)} • 
          Offer valid: {new Date(book.discountStartDate).toLocaleDateString()} - {new Date(book.discountEndDate).toLocaleDateString()}
        </div>
      </div>
    ) : (
      <div className="mb-6">
        <span className="text-3xl font-bold">
          Rs {book.price.toFixed(2)}
        </span>
      </div>
    )}

    {/* Countdown Timer for Discount (if active) */}
    {book.discount > 0 && new Date(book.discountEndDate) > new Date() && (
      <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded p-3">
        <div className="flex items-center gap-2">
          <span className="text-yellow-800 font-medium">⏰ Limited Time Offer:</span>
          <span className="text-yellow-600 text-sm">
            Ends in {Math.ceil((new Date(book.discountEndDate) - new Date()) / (1000 * 60 * 60 * 24))} days
          </span>
        </div>
      </div>
    )}

    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex items-center gap-2">
        <span className="font-medium">Quantity:</span>
        <div className="flex border border-gray-300 rounded">
          <button 
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
          >
            -
          </button>
          <span className="px-4 py-1">{quantity}</span>
          <button 
            onClick={() => setQuantity(quantity + 1)}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col sm:flex-row gap-2">
        <button onClick={handleAddToCart} className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-black py-2 px-4 rounded">
          <FiShoppingCart />
          <span className='text-black'>Add to Cart</span>
        </button>
        <button onClick={()=>handleBookMark(book)} className="flex items-center justify-center gap-2 border text-black border-blue-600  hover:bg-blue-50 py-2 px-4 rounded">
          <FiBookmark />
          <span >Save for Later</span>
        </button>
      </div>
    </div>

    <div className="border-t border-gray-200 pt-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="font-medium">Availability:</span>
        {book.stock > 0 ? (
          <span className="text-green-600">In Stock ({book.stock} available)</span>
        ) : (
          <span className="text-red-600">Out of Stock</span>
        )}
      </div>
      {checkReview && !userBookReview &&
        <button className='text-black hover:text-blue-800'
          onClick={()=>setIsDialogOpen(true)}
        >
          Give Review
        </button>
      }
      {isDialogOpen && 
        <RateDialog 
          toggleDialog={isDialogOpen} 
          setToggleDialog={setIsDialogOpen}
          userId={user?.userId}
          bookId={book?.bookId}
        />
      }
      <div className="text-sm text-gray-600">
        <p>Only available for in-store pickup. You'll receive a claim code after purchase.</p>
      </div>
    </div>
  </div>
</div>
        </div>

        {/* Additional Information */}
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
            <TabsTrigger value="returns">Returns</TabsTrigger>
          </TabsList>

          <TabsContent value="description">
            <p className="text-gray-700">{book.description}</p>
          </TabsContent>

          <TabsContent value="details">
            <ul className="list-disc ml-6 text-gray-700 space-y-1">
              <li><strong>ISBN:</strong> {book.isbn}</li>
              <li><strong>Publisher:</strong> {book.publisher}</li>
              <li><strong>Published:</strong> {new Date(book.publishedDate).toLocaleDateString()}</li>
              <li><strong>Language:</strong> {book.language}</li>
              <li><strong>Genre:</strong> {book.genre}</li>
              <li><strong>Format:</strong> {book.format}</li>
            </ul>
          </TabsContent>

          <TabsContent value="shipping">
            <p className="text-gray-700">Ships within 2–3 business days via standard shipping. Expedited options available at checkout.</p>
          </TabsContent>

          <TabsContent value="returns">
            <p className="text-gray-700">We offer a 30-day return policy for unused and unopened books. See our return policy for more information.</p>
          </TabsContent>
        </Tabs>

        {/* Similar Books */}
<div className="mb-12 mt-3">
  <h2 className="text-xl font-bold mb-6">You May Also Like</h2>
  {allBooks.length > 0 && (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {allBooks
        .filter(b => 
          b.bookId !== book.bookId && // Exclude the current book
          b.genre === book.genre // Match the same genre
        )?.length>0?
        (allBooks
        .filter(b => 
          b.bookId !== book.bookId && // Exclude the current book
          b.genre === book.genre // Match the same genre
        )
        .slice(0, 3) // Get only 3 similar books
        .map(similarBook => (
          <div 
            key={similarBook.bookId} 
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 cursor-pointer"
            onClick={() => navigate(`/book-details/${similarBook.bookId}`)}
          >
            <img 
              src={similarBook.coverImage} 
              alt={similarBook.title} 
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-sm line-clamp-2 mb-1">{similarBook.title}</h3>
              <p className="text-gray-600 text-xs">{similarBook.author}</p>
            </div>
          </div>
        ))):(
          <div className="p-4">
              <h3 className="font-semibold text-sm line-clamp-2 mb-1">No Similer Books.</h3>
            </div>
        )
      }
    </div>
  )}
</div>

        {/* Discount Banner */}
        <div className="bg-blue-100 border border-blue-200 rounded-lg p-4 mb-12">
          <h3 className="font-bold text-lg text-blue-800 mb-2">Member Discounts</h3>
          <p className="text-blue-700 mb-2">Order 5+ books and get 5% off your entire purchase!</p>
          <p className="text-blue-700">After 10 successful orders, earn a 10% stackable discount on your next order.</p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BookDetails;