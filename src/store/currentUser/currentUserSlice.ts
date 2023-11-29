import { createSlice } from '@reduxjs/toolkit';
import { User } from '../../models/User';
import { MemberState } from '../../models/MemberState';
import { PayloadAction } from '@reduxjs/toolkit';
interface CurrentUser {
  user: User | null;
  memberState: MemberState | null;
}

const initialState: CurrentUser = {
  user: null,
  memberState: null
};

export const currentUserSlice = createSlice({
  name: 'currentUser',
  initialState: initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      return state;
    },
    setMemberState: (state, action: PayloadAction<MemberState>) => {
      state.memberState = action.payload;
      return state;
    }
  }
});

export default currentUserSlice.reducer;
export const { setUser, setMemberState } = currentUserSlice.actions;
