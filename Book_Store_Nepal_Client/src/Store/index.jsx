import { configureStore } from "@reduxjs/toolkit";
import userSlice from './Slice/UserSlice';
import getAllBookSlice from './Slice/AllBookSlice';
import getAllCartSlice from './Slice/AllCartSlice';

const store=configureStore({
    reducer:{
     user:userSlice,
     books:getAllBookSlice,
     carts:getAllCartSlice
    }
});
export default store;