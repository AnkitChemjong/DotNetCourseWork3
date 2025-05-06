import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

const ViewDetailsDrawerOrder = ({ toggleDrawer, setToggleDrawer, tempOrderForDetails,setTempOrderForDetails }) => {
  if (!tempOrderForDetails) return null;

  return (
    <Drawer open={toggleDrawer} onOpenChange={(value)=>{setToggleDrawer(value)
        setTempOrderForDetails(null);
    }}>
      <DrawerContent className="max-h-[90vh]">
        <div className="overflow-y-auto">
          <DrawerHeader>
            <DrawerTitle>Order #{tempOrderForDetails.orderId}</DrawerTitle>
            <DrawerDescription>
              Status: <span className={`font-medium ${tempOrderForDetails.status === 'Completed' ? 'text-green-500' : 'text-yellow-500'}`}>
                {tempOrderForDetails.status}
              </span>
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-4 space-y-6">
            {/* Customer Details */}
            <div className="space-y-2">
              <h3 className="font-semibold">Customer Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p>{tempOrderForDetails.user?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p>{tempOrderForDetails.user?.email || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-2">
              <h3 className="font-semibold">Order Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Order Date</p>
                  <p>{new Date(tempOrderForDetails.orderDate).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Claim Code</p>
                  <p className="font-mono">{tempOrderForDetails.claimCode}</p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-2">
              <h3 className="font-semibold">Items ({tempOrderForDetails.orderItems?.$values?.length || 0})</h3>
              <div className="border rounded-lg">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="p-2 text-left">Book</th>
                      <th className="p-2 text-left">Author</th>
                      <th className="p-2 text-center">Qty</th>
                      <th className="p-2 text-right">Price</th>
                      <th className="p-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tempOrderForDetails.orderItems?.$values?.map((item) => (
                      <tr key={item.orderItemId} className="border-t">
                        <td className="p-2">{item.book?.title || 'N/A'}</td>
                        <td className="p-2">{item.book?.author || 'N/A'}</td>
                        <td className="p-2 text-center">{item.quantity}</td>
                        <td className="p-2 text-right">NPR {item.unitPrice?.toFixed(2)}</td>
                        <td className="p-2 text-right">NPR {(item.quantity * item.unitPrice)?.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Order Total */}
            <div className="space-y-2 text-right">
              <div className="flex justify-end gap-4">
                <p className="text-sm text-muted-foreground">Subtotal:</p>
                <p>NPR {tempOrderForDetails.totalPrice?.toFixed(2)}</p>
              </div>
              {tempOrderForDetails.discountPercent > 0 && (
                <div className="flex justify-end gap-4">
                  <p className="text-sm text-muted-foreground">Discount ({tempOrderForDetails.discountPercent}%):</p>
                  <p>- NPR {(tempOrderForDetails.totalPrice * tempOrderForDetails.discountPercent / 100)?.toFixed(2)}</p>
                </div>
              )}
              <div className="flex justify-end gap-4 font-semibold">
                <p>Grand Total:</p>
                <p>NPR {(
                  tempOrderForDetails.totalPrice * 
                  (1 - (tempOrderForDetails.discountPercent || 0) / 100)
                )?.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ViewDetailsDrawerOrder;