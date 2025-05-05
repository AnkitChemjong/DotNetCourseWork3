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

const Cart = () => {
  const cartState = useSelector(state => state?.carts);
  const { data: cartData = [] } = cartState;
  const userState = useSelector(state => state?.user);
  const { data: user } = userState;
  const dispatch=useDispatch();
  const [userCart,setUserCart]=useState([]);


  useEffect(()=>{
    if(user){
      const userCartData = cartData?.filter(cart => cart.userId === user?.userId);
      setUserCart(userCartData);
    }
    console.log("usercart id haita",userCart);
  },[user]);

  
  const handleOrder=async()=>{
    try{
      const response=await axiosService.post(`/api/order/place-from-cart/${user?.userId}`);
      console.log(response);
      if(response?.status===200){
        alert(response?.data?.message);
        clearAllCart();
        dispatch(getAllCart());
        dispatch(getAllBook());
      }

    }
    catch(error){
      console.log(error);
    }
  }




  const cancelCart=async()=>{
    try{
      const response=await axiosService.delete(`/api/cart/${userCart[0].cartId}`);
      console.log(response);
      if(response?.status===200){
        alert(response?.data?.message);
        dispatch(getAllCart());
      }

    }
    catch(error){
      console.log(error);
    }
  }
  const clearAllCart=async()=>{
    try{
      const response=await axiosService.delete(`/api/cart/clear/${user?.userId}`);
      console.log(response);
      if(response?.status===200){
        alert(response?.data?.message);
        dispatch(getAllCart());
      }

    }
    catch(error){
      console.log(error);
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
                  <TableHead>Total</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userCart.map((cart) => (
                  <TableRow key={cart.cartId}>
                    <TableCell className="font-medium">{cart.cartId}</TableCell>
                    <TableCell>{cart.totalItems}</TableCell>
                    <TableCell>Rs {cart.cartTotal.toFixed(2)}</TableCell>
                    <TableCell>
                      {new Date(cart.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" className="text-red-600" onClick={cancelCart}>
                        <FiTrash2 className="mr-2 h-4 w-4" />
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-6 flex justify-end space-x-4">
                <p>Total:-{userCart?.reduce((acc,obj)=>acc+Number(obj?.cartTotal||0),0)}</p>
              <Button onClick={clearAllCart} variant="outline" className="text-red-600">
                <FiTrash2 className="mr-2 h-4 w-4" />
                Clear Entire Cart
              </Button>
              <Button className="text-black" onClick={handleOrder}>
                <FiShoppingCart className="mr-2 h-4 w-4" />
                Checkout All Items
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h2 className="text-xl font-medium mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-4">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Button>
              Continue Shopping
            </Button>
          </div>
        )}
      </div>

      <Footer/>
    </div>
  );
};

export default Cart;