import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { FeedPost } from '../../models/feedPost';

interface SnackbarSlice {
  message: string;
  showSnackbar: boolean;
  openEditDialogBox: boolean;
  temporaryPost: FeedPost | null;
}
const snackbarState: SnackbarSlice = {
  message: '',
  showSnackbar: false,
  openEditDialogBox: false,
  temporaryPost: null
};

export const snackbarSlice = createSlice({
  name: 'snackbar',
  initialState: snackbarState,
  reducers: {
    showSnackbar: (state, action: PayloadAction<string>) => {
      state.showSnackbar = true;
      state.message = action.payload;
    },
    hideSnackbar: (state) => {
      state.message = '';
      state.showSnackbar = false;
    },
    handleEditDialogState: (state, action: PayloadAction<boolean>) => {
      state.openEditDialogBox = action.payload;
      return state;
    },
    setTemporaryPost: (state, action: PayloadAction<FeedPost>) => {
      state.temporaryPost = { ...action.payload };
      return state;
    },
    clearTemporaryPost: (state) => {
      state.temporaryPost = null;
      return state;
    }
  }
});

export default snackbarSlice.reducer;
export const {
  showSnackbar,
  hideSnackbar,
  handleEditDialogState,
  setTemporaryPost,
  clearTemporaryPost
} = snackbarSlice.actions;
