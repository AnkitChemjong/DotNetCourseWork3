import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import axiosService from '@/Services/Axios';
import { useDispatch } from 'react-redux';
import { getAllReview } from '@/Store/Slice/AllReviewSlice';

const RateDialog = ({ toggleDialog, setToggleDialog, userId, bookId }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch=useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
     const response=await axiosService.post('/api/review/addreview',{userId,bookId,rating,comment});
     console.log(response);
     if(response?.status===200){
         alert(response?.data);
         setToggleDialog(false);
         dispatch(getAllReview());
     }
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert(error?.response?.data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={toggleDialog} onOpenChange={(value)=>{
        setToggleDialog(value);
        }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rate this book</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => {
                const ratingValue = i + 1;
                return (
                  <label key={i} className="cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      value={ratingValue}
                      onClick={() => setRating(ratingValue)}
                      className="hidden"
                    />
                    <FaStar
                      className="transition-colors"
                      color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                      size={28}
                      onMouseEnter={() => setHover(ratingValue)}
                      onMouseLeave={() => setHover(null)}
                    />
                  </label>
                );
              })}
            </div>
            <p className="text-sm text-muted-foreground">
              {rating ? `You rated this ${rating} star${rating > 1 ? 's' : ''}` : 'Select a rating'}
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="comment">Your review (optional)</Label>
            <Textarea
              id="comment"
              rows={4}
              placeholder="Share your thoughts about this book..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setToggleDialog(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="text-black"
              disabled={rating === 0 || isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Rating'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RateDialog;