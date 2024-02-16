import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { Topic } from '../../models/topics';

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
