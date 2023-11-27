import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface SnackbarSlice {
  message: string;
  showSnackbar: boolean;
}
const snackbarState: SnackbarSlice = {
  message: '',
  showSnackbar: false
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
    }
  }
});

export default snackbarSlice.reducer;
export const { showSnackbar, hideSnackbar } = snackbarSlice.actions;
