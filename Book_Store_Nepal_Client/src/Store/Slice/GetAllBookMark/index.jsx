import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axiosService from "@/Services/Axios";

export const getAllMark=createAsyncThunk("getAllMark",async ()=>{
  try{
      const marks=await axiosService.get("/api/whitelist/getAllBookMark",{withCredentials:true});
      if (marks?.data) {
        return marks.data?.$values;
      } 
  }
  catch(error){
    return rejectWithValue(error.message);;
  }
});

const getAllMarkSlice=createSlice({
    name:'bookmarks',
    initialState:{
        status:"pending",
        data:null,
        error:null,
        loading:true
    },
    extraReducers:(builder)=>{
        builder.addCase(getAllMark.fulfilled,(state,action)=>{
            state.status="fulfilled"
            state.data=action.payload;
            state.loading=false;
        })
        .addCase(getAllMark.pending,(state,action)=>{
          state.status="pending";
          state.loading=true;
        })
        .addCase(getAllMark.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.error.message;
            state.loading=false;
        });
    }


})
export default getAllMarkSlice.reducer;