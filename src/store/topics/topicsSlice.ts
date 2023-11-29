import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { FeedPost } from '../../models/feedPost';
import { Topic } from '../../models/topics';
import { feedsSlice } from '../feedPosts/feedsSlice';

const topics: Record<string, Topic> = {};

export const topicsSlice = createSlice({
  name: 'topics',
  initialState: topics,
  reducers: {
    addNewTopics: (state, action: PayloadAction<Record<string, Topic>>) => {
      state = { ...state, ...action.payload };
      return state;
    }
  }
});

export default topicsSlice.reducer;
export const { addNewTopics } = topicsSlice.actions;
