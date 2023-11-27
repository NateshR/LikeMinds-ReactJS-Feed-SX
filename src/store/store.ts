import { configureStore } from '@reduxjs/toolkit';
import currentUserSlice from './currentUser/currentUserSlice';
import feedsSlice from './feedPosts/feedsSlice';
import topicsSlice from './topics/topicsSlice';
import usersSlice from './users/usersSlice';

export const store = configureStore({
  reducer: {
    currentUser: currentUserSlice,
    posts: feedsSlice,
    topics: topicsSlice,
    users: usersSlice
  }
});
export type RootState = ReturnType<typeof store.getState>;
