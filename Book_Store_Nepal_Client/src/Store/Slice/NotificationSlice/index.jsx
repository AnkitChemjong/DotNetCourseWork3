
import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: []
  },
  reducers: {
    setNotification(state, action) {
      state.items = action.payload;     
    },
    addNotification(state, action) {
      state.items.unshift(action.payload); 
    }
  }
});

export const { setNotification, addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
