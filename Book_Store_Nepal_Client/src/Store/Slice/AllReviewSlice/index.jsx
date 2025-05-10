import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axiosService from "@/Services/Axios";

export const getAllReview=createAsyncThunk("getAllReview",async ()=>{
  try{
      const reviews=await axiosService.get("/api/review/getallreview",{withCredentials:true});
      if (reviews?.data) {
        return reviews.data?.$values;
      } 
  }
  catch(error){
    return rejectWithValue(error.message);;
  }
});

const getAllReviewSlice=createSlice({
    name:'carts',
    initialState:{
        status:"pending",
        data:null,
        error:null,
        loading:true
    },
    extraReducers:(builder)=>{
        builder.addCase(getAllReview.fulfilled,(state,action)=>{
            state.status="fulfilled"
            state.data=action.payload;
            state.loading=false;
        })
        .addCase(getAllReview.pending,(state,action)=>{
          state.status="pending";
          state.loading=true;
        })
        .addCase(getAllReview.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.error.message;
            state.loading=false;
        });
    }


})
export default getAllReviewSlice.reducer;