import { configureStore } from "@reduxjs/toolkit";
import userSlice from './Slice/UserSlice';
import getAllBookSlice from './Slice/AllBookSlice';
import getAllCartSlice from './Slice/AllCartSlice';
import getAllMarkSlice from './Slice/GetAllBookMark'

const store=configureStore({
    reducer:{
     user:userSlice,
     books:getAllBookSlice,
     carts:getAllCartSlice,
     bookmarks:getAllMarkSlice
    }
});
export default store;