import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { FeedPost } from '../../models/feedPost';
import { Topic } from '../../models/topics';
import { feedsSlice } from '../feedPosts/feedsSlice';

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
