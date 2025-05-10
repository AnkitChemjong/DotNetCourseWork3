import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { discountData } from '@/lib/utils';
import axiosService from '@/Services/Axios';
import { useDispatch } from 'react-redux';
import { getAllBook } from '@/Store/Slice/AllBookSlice';

function AddDiscount({ BookId,handleDialog,setHandleDialog }) {
 const [data,setData]=useState(discountData);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch=useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (parseFloat(data.discount) < 0 || parseFloat(data.discount) > 100) {
      toast.error("Discount must be between 0 and 100");
      return;
    }
    
    if (new Date(data.discountStartDate) >= new Date(data.discountEndDate)) {
      toast.error("End date must be after start date");
      return;
    }
  
    setIsLoading(true);
  
    try {
      const response = await axiosService.patch('/api/book/update-discount', {
        bookId: BookId, // Note: lowercase 'bookId' to match backend DTO
        discount: parseFloat(data.discount),
        discountStartDate: new Date(data.discountStartDate).toISOString(),
        discountEndDate: new Date(data.discountEndDate).toISOString()
      });
  
      if (response.status >= 200 && response.status < 300) {
        dispatch(getAllBook());
        toast.success(response.data?.message || "Discount updated successfully");
        setHandleDialog(false);
      } else {
        throw new Error(response.data?.message || 'Failed to update discount');
      }
    } catch (err) {
      console.error("Discount update error:", err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data ||
                          "Failed to update discount";
      toast.error(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={handleDialog} onOpenChange={setHandleDialog}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Discount</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Discount</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="discount">Discount Percentage</Label>
            <Input
              id="discount"
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={data.discount}
              name="discount"
              onChange={(e) =>setData(prev=>({...prev,[e.target.name]:e.target.value}))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="discountStartDate">Start Date</Label>
            <Input
              id="discountStartDate"
              type="date"
              value={data.discountStartDate}
              name="discountStartDate"
              onChange={(e) =>setData(prev=>({...prev,[e.target.name]:e.target.value}))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="discountEndDate">End Date</Label>
            <Input
              id="discountEndDate"
              type="date"
              value={data.discountEndDate}
              name="discountEndDate"
              onChange={(e) =>setData(prev=>({...prev,[e.target.name]:e.target.value}))}
              min={data.discountEndDate}
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setHandleDialog(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button className="text-black" type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Discount"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddDiscount;