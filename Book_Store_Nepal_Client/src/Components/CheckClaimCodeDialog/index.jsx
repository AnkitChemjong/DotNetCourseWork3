import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import axiosService from '@/Services/Axios';
import { getAllOrder } from '@/Store/Slice/AllOrderSlice';
import { useDispatch } from 'react-redux';

const CheckClaimCodeDialog = ({ toggleDialog, setToggleDialog, orderData,setTempOrderData }) => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch=useDispatch();


  const handleCheckClaimCode = async () => {
    if (!code.trim()) {
      alert("Please enter a claim code");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosService.post(
        `/api/order/verify/${orderData?.user?.userId}/${orderData.orderId}/${code}`);

      if (response?.status===200) {
        alert(response?.data?.message || "Order verified successfully");
        setToggleDialog(false);
        dispatch(getAllOrder());
        setTempOrderData(null);
      } else {
        alert(response?.data?.message || "Failed to verify order");
      }
    } catch (error) {
      alert(error?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={toggleDialog} onOpenChange={(value)=>{setToggleDialog(value)
        setTempOrderData(null);
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Verify Order Claim Code</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Input
              id="claimCode"
              placeholder="Enter claim code"
              className="col-span-4"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCheckClaimCode()}
            />
          </div>
        </div>
        <Button 
        className="text-black"
          type="submit"
          onClick={handleCheckClaimCode}
          disabled={isLoading}
        >
          {isLoading ? "Verifying..." : "Verify Code"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default CheckClaimCodeDialog;