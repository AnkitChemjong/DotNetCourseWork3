import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axiosService from "@/Services/Axios";

export const getAllBook=createAsyncThunk("getAllBook",async ()=>{
  try{
      const books=await axiosService.get("/api/book/getAllBooks",{withCredentials:true});
      if (books?.data) {
        return books.data;
      } 
  }
  catch(error){
    return rejectWithValue(error.message);;
  }
});

const getAllBookSlice=createSlice({
    name:'books',
    initialState:{
        status:"pending",
        data:null,
        error:null,
        loading:true
    },
    extraReducers:(builder)=>{
        builder.addCase(getAllBook.fulfilled,(state,action)=>{
            state.status="fulfilled"
            state.data=action.payload;
            state.loading=false;
        })
        .addCase(getAllBook.pending,(state,action)=>{
          state.status="pending";
          state.loading=true;
        })
        .addCase(getAllBook.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.error.message;
            state.loading=false;
        });
    }


})
export default getAllBookSlice.reducer;