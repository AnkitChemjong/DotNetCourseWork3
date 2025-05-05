import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axiosService from "@/Services/Axios";

export const getAllOrder=createAsyncThunk("getAllOrder",async ()=>{
  try{
      const orders=await axiosService.get("/api/order/getAllOrders",{withCredentials:true});
      if (orders?.data) {
        return orders.data?.$values;
      } 
  }
  catch(error){
    return rejectWithValue(error.message);;
  }
});

const getAllOrdersSlice=createSlice({
    name:'carts',
    initialState:{
        status:"pending",
        data:null,
        error:null,
        loading:true
    },
    extraReducers:(builder)=>{
        builder.addCase(getAllOrder.fulfilled,(state,action)=>{
            state.status="fulfilled"
            state.data=action.payload;
            state.loading=false;
        })
        .addCase(getAllOrder.pending,(state,action)=>{
          state.status="pending";
          state.loading=true;
        })
        .addCase(getAllOrder.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.error.message;
            state.loading=false;
        });
    }


})
export default getAllOrdersSlice.reducer;