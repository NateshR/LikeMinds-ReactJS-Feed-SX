import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { User } from '../../models/User';

const users: Record<string, User> = {};

export const usersSlice = createSlice({
  name: 'users',
  initialState: users,
  reducers: {
    addNewUsers: (state, action: PayloadAction<Record<string, User>>) => {
      state = { ...state, ...action.payload };
      return state;
    }
  }
});

export default usersSlice.reducer;
export const { addNewUsers } = usersSlice.actions;
