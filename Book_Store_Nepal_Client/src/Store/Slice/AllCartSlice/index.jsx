import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axiosService from "@/Services/Axios";

export const getAllCart=createAsyncThunk("getAllCart",async ()=>{
  try{
      const carts=await axiosService.get("/api/cart/getAllCarts",{withCredentials:true});
      if (carts?.data) {
        return carts.data;
      } 
  }
  catch(error){
    return rejectWithValue(error.message);;
  }
});

const getAllCartSlice=createSlice({
    name:'carts',
    initialState:{
        status:"pending",
        data:null,
        error:null,
        loading:true
    },
    extraReducers:(builder)=>{
        builder.addCase(getAllCart.fulfilled,(state,action)=>{
            state.status="fulfilled"
            state.data=action.payload;
            state.loading=false;
        })
        .addCase(getAllCart.pending,(state,action)=>{
          state.status="pending";
          state.loading=true;
        })
        .addCase(getAllCart.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.error.message;
            state.loading=false;
        });
    }


})
export default getAllCartSlice.reducer;