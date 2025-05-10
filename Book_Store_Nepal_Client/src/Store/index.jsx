import { configureStore } from "@reduxjs/toolkit";
import userSlice from './Slice/UserSlice';
import getAllBookSlice from './Slice/AllBookSlice';
import getAllCartSlice from './Slice/AllCartSlice';
import getAllMarkSlice from './Slice/GetAllBookMark';
import getAllOrdersSlice from './Slice/AllOrderSlice';
import getAllReviewSlice from './Slice/AllReviewSlice';
import notificationReducer from './Slice/NotificationSlice';

const store=configureStore({
    reducer:{
     user:userSlice,
     books:getAllBookSlice,
     carts:getAllCartSlice,
     bookmarks:getAllMarkSlice,
     orders:getAllOrdersSlice,
     reviews:getAllReviewSlice,
     notifications: notificationReducer 
    }
});
export default store;