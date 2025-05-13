import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import UserNavbar from '@/Components/UserNavbar';
import Footer from '@/Components/Footer';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FiTrash2, FiShoppingCart, FiX } from 'react-icons/fi';
import axiosService from '@/Services/Axios';
import { getAllCart } from '@/Store/Slice/AllCartSlice';
import { useDispatch } from 'react-redux';
import { getAllBook } from '@/Store/Slice/AllBookSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { FiDollarSign } from 'react-icons/fi';


const Cart = () => {
  const cartState = useSelector(state => state?.carts);
  const { data: cartData} = cartState;
  const userState = useSelector(state => state?.user);
  const { data: user } = userState;
  const dispatch=useDispatch();
  const [userCart,setUserCart]=useState([]);
  const [loading,setLoading]=useState(false);
  const [loading1,setLoading1]=useState(false);
  const [loading2,setLoading2]=useState(false);
  const navigate=useNavigate();
  const [isCheckoutDialogOpen, setIsCheckoutDialogOpen] = useState(false);

  useEffect(()=>{
    if(user){
      const userCartData = cartData?.filter(cart => cart.userId === user?.userId);
      setUserCart(userCartData);
    }
    // console.log("usercart id haita",userCart);
  },[user,cartData]);

  
  const handleOrder=async()=>{
    try{
      setLoading(true);
      const response=await axiosService.post(`/api/order/place-from-cart/${user?.userId}`);
      console.log("response",response);
      if(response?.status===200){
        toast.success(response?.data?.message);
        dispatch(getAllCart());
        dispatch(getAllBook());
        setIsCheckoutDialogOpen(false);
      }
    }
    catch(error){
      console.log(error);
      toast.error(error?.response?.data?.message ||error?.response?.data);
    }
    finally{
      setLoading(false);
    }
  }




  const cancelCart=async(cartId)=>{
    try{
      setLoading1(true)
      const response=await axiosService.delete(`/api/cart/${cartId}`);
      //console.log(response);
      if(response?.status===200){
        toast.success(response?.data?.message);
        dispatch(getAllCart());
      }

    }
    catch(error){
      console.log(error);
    }
    finally{
      setLoading1(false);
    }
  }
  const clearAllCart=async()=>{
    try{
      setLoading2(true);
      const response=await axiosService.delete(`/api/cart/clear/${user?.userId}`);
      // console.log(response);
      if(response?.status===200){
        toast.success(response?.data?.message);
        dispatch(getAllCart());
      }

    }
    catch(error){
      console.log(error);
    }
    finally{
      setLoading2(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <UserNavbar/>
      
      <div className="container mx-auto px-4 py-8 flex-grow mt-15">
        <h1 className="text-2xl font-bold mb-6">Your Shopping Cart</h1>
        
        {userCart?.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <Table>
              <TableCaption>Your cart items</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Cart ID</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead> Discount</TableHead>
                  <TableHead>Discounted Price</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userCart.map((cart) => (
                  <TableRow key={cart.cartId}>
                    <TableCell className="font-medium">{cart.cartId}</TableCell>
                    <TableCell>{cart.book.title}-{cart.totalItems}</TableCell>
                    <TableCell>Rs {cart?.book?.price || cart.originalPrice}</TableCell>
                    <TableCell> {cart.discount} %</TableCell>
                    <TableCell>Rs {cart.discountedPrice||0}</TableCell>
                    <TableCell>Rs {cart.cartTotal.toFixed(2)}</TableCell>
                    <TableCell>
                      {new Date(cart.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button disabled={loading1} variant="outline" size="sm" className="text-red-600" onClick={()=>cancelCart(cart?.cartId)}>
                        <FiTrash2 className="mr-2 h-4 w-4" />
                        {loading1? "Loading...":"Remove"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

                 <div className="mt-6 flex justify-end items-center space-x-6">
              <div className="text-lg font-semibold">
                  <p>Total:{userCart?.reduce((acc,obj)=>acc+Number(obj?.cartTotal||0),0)}</p>
              </div>
              <div className="flex space-x-4">
                <Button disabled={loading2} onClick={clearAllCart} variant="outline" className="text-red-600">
                  <FiTrash2 className="mr-2 h-4 w-4" />
                  {loading2? "Loading...":"Clear Entire Cart"}
                </Button>
                <Button disabled={loading} className="text-black" onClick={() => setIsCheckoutDialogOpen(true)}>
                  <FiShoppingCart className="mr-2 h-4 w-4" />
                  {loading? "Loading...":"Checkout All Items"}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h2 className="text-xl text-black font-medium mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-4">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Button onClick={()=>navigate('/books')} className="text-black">
              Continue Shopping
            </Button>
          </div>
        )}
      </div>



        {/* Checkout Dialog with only Cash on Delivery */}
      <Dialog open={isCheckoutDialogOpen} onOpenChange={setIsCheckoutDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Your Order</DialogTitle>
            <DialogDescription>
              You'll pay when you receive your items
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="flex items-center p-4 border rounded-lg bg-gray-50">
              <FiDollarSign className="h-6 w-6 text-green-600 mr-3" />
              <div>
                <h3 className="font-medium">Cash on Delivery</h3>
                <p className="text-sm text-gray-500">Pay when you receive your order</p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between font-medium text-lg">
                <span>Total Amount</span>
                <span>Rs {userCart?.reduce((acc,obj)=>acc+Number(obj?.cartTotal||0),0)}</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button 
            className="text-black"
              variant="outline" 
              onClick={() => setIsCheckoutDialogOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
            className="text-black"
              onClick={handleOrder} 
              disabled={loading}
            >
              {loading ? "Processing..." : "Confirm Order"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer/>
    </div>
  );
};

export default Cart;