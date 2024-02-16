import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { Topic } from '../../models/topics';

const extras: {
  selectedTopics: Topic[];
} = {
  selectedTopics: []
};

export const extrasSlice = createSlice({
  name: 'extras',
  initialState: extras,
  reducers: {
    setSelectedTopicsArray: (state, action: PayloadAction<Topic[]>) => {
      state = { ...state, selectedTopics: action.payload };
      return state;
    },
    clearSelectedTopics: (state) => {
      state.selectedTopics = [];
    }
  }
});

export default extrasSlice.reducer;
export const { setSelectedTopicsArray, clearSelectedTopics } = extrasSlice.actions;
