import StaffSidebar from '@/Components/StaffSidebar';
import React,{useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CheckClaimCodeDialog from '@/Components/CheckClaimCodeDialog';
import ViewDetailsDrawerOrder from '@/Components/ViewDetailsDrawerOrder';
import axiosService from '@/Services/Axios';
import { getAllOrder } from '@/Store/Slice/AllOrderSlice';
import { toast } from 'sonner';

const StaffOrderList = () => {
    const userState = useSelector(state => state?.user);
    const { data: user, loading } = userState;
    const orderState = useSelector(state => state?.orders);
    const { data: allOrders, loading: loadingOrders } = orderState;
    const [toggleDialog,setToggleDialog]=useState(false);
    const [toggleDrawer,setToggleDrawer]=useState(false);
    const [tempOrderData,setTempOrderData]=useState(null);
    const [tempOrderForDetails,setTempOrderForDetails]=useState(null);
    const dispatch=useDispatch();

    const handleDelete=async(id)=>{
        try{
            const response=await axiosService.delete(`/api/order/deleteOrder/${id}`);
            if(response?.status===200){
                toast.success(response?.data?.message);
                dispatch(getAllOrder());
            }

        }
        catch(error){
            console.log(error);
            toast.error(error?.response?.data?.message);
        }
    }
    return (
        <div className="flex h-screen w-fit items-center">
            <StaffSidebar />
            
            <div className="flex-1 overflow-y-auto p-8 ml-72">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Order Management</h1>
                
                {loadingOrders ? (
                    <div className="flex justify-center items-center h-64">
                        <p>Loading orders...</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow overflow-auto max-h-96 max-w-[1000px]">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 overflow-auto">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Order ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Claim Code
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Customer
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Items
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Total Quantity
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {allOrders?.map((order) => (
                                        <tr key={order.$id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {order.orderId}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {order.claimCode || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {order?.user?.name || "Undefined"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {order?.orderItems?.$values?.map(item => `${item.book.title} (${item.quantity})`).join(', ')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {order?.orderItems?.$values?.reduce((sum, item) => sum + item.quantity, 0)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                    ${order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                                      'bg-red-100 text-red-800'}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() =>{
                                                        setTempOrderData(order);
                                                        setToggleDialog(true);
                                                    }}
                                                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                >
                                                    Check Code
                                                </button>
                                                {toggleDialog && 
                                                <CheckClaimCodeDialog
                                                toggleDialog={toggleDialog}
                                                setToggleDialog={setToggleDialog}
                                                orderData={tempOrderData}
                                                setTempOrderData={setTempOrderData}
                                                />}
                                                <button
                                                    onClick={() =>{
                                                        setToggleDrawer(true);
                                                        setTempOrderForDetails(order);
                                                    }}
                                                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                >
                                                    Details
                                                </button>
                                                {
                                                    toggleDrawer && <ViewDetailsDrawerOrder 
                                                    toggleDrawer={toggleDrawer}
                                                    setToggleDrawer={setToggleDrawer}
                                                    tempOrderForDetails={tempOrderForDetails}
                                                    setTempOrderForDetails={setTempOrderForDetails}
                                                    />
                                                }
                                                 <button
                                                    onClick={() =>handleDelete(order?.orderId)}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StaffOrderList;