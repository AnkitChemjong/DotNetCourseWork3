import React, { useEffect, useState } from 'react';
import UserNavbar from '@/Components/UserNavbar';
import { useSelector } from 'react-redux';
import { getAllOrder } from '@/Store/Slice/AllOrderSlice';
import { useDispatch } from 'react-redux';
import axiosService from '@/Services/Axios';

const UserOrders = () => {
    const dispatch=useDispatch();
    const orderState = useSelector(state => state?.orders);
    const { data: allOrders, loading } = orderState;
    const userState = useSelector(state => state?.user);
    const { data: user, loading1 } = userState;
    const [userOrders, setUserOrders] = useState([]);

    useEffect(() => {
        if (allOrders?.length > 0) {
            const filterOrder = allOrders?.filter(data => data?.userId === user?.userId);
            if (filterOrder?.length > 0) {
                setUserOrders(filterOrder);
            }
        }
    }, [user, orderState]);

    const handleCancelOrder = async (orderId) => {
        try{
            const response=await axiosService.patch(`/api/order/cancel/${orderId}/${user?.userId}`);
            console.log(response);
            if(response?.status===200){
              alert(response?.data);
              dispatch(getAllOrder());
            }
      
          }
        catch(error){
            alert(error?.response?.data);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="flex flex-col min-w-screen min-h-screen">
            <UserNavbar />
            <div className="flex-grow container mx-auto flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h1 className="text-2xl font-semibold text-gray-900">Your Orders</h1>
                    </div>
                    
                    {loading || loading1 ? (
                        <div className="p-6 text-center">
                            <p className="text-gray-500">Loading orders...</p>
                        </div>
                    ) : userOrders.length === 0 ? (
                        <div className="p-6 text-center">
                            <p className="text-gray-500">You have no orders yet.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Order ID
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Items
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Total
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {userOrders.map((order) => (
                                        <tr key={order.orderId}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                #{order.orderId}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(order.orderDate)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                <div className="space-y-1">
                                                    {order.orderItems?.$values?.map((item, index) => (
                                                        <div key={index} className="flex items-center">
                                                            <span className="mr-2">•</span>
                                                            <span>{item.productName || 'Unknown Item'} (Qty: {item.quantity})</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                ${order.totalPrice.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                    ${order.status === 'Placed' ? 'bg-yellow-100 text-yellow-800' : 
                                                      order.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 
                                                      'bg-green-100 text-green-800'}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                {order.status === 'Placed' && (
                                                    <button
                                                        onClick={() => handleCancelOrder(order.orderId)}
                                                        className="text-red-600 hover:text-red-900 font-medium"
                                                    >
                                                        Cancel Order
                                                    </button>
                                                )}
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

export default UserOrders;