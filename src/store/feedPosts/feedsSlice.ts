import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { FeedPost } from '../../models/feedPost';

let feedPostArray: FeedPost[] = [];

export const feedsSlice = createSlice({
  name: 'feeds',
  initialState: feedPostArray,
  reducers: {
    addNewPosts: (state, action: PayloadAction<FeedPost[]>) => {
      state = state.concat(action.payload);
      return state;
    },
    clearPosts: (state) => {
      return [];
    },
    setNewFeedPosts: (state, action: PayloadAction<FeedPost[]>) => {
      state = action.payload;
      return state;
    },
    addNewLocalPost: (state, action: PayloadAction<FeedPost>) => {
      state = [action.payload, ...state];
      return state;
    },
    replaceLocalPost: (state, action: PayloadAction<FeedPost>) => {
      const newPostTempId = action.payload.tempId;
      const targetPostIndex = state.findIndex((post: FeedPost) => post.Id === newPostTempId);
      if (targetPostIndex !== -1) {
        state[targetPostIndex] = action.payload;
      }
      return state;
    },
    deleteAPost: (state, action: PayloadAction<string>) => {
      const targetPostIndex = state.findIndex((post) => post.Id === action.payload);
      if (targetPostIndex !== -1) {
        state.splice(targetPostIndex, 1);
      }
      return state;
    },
    replaceEditedMessage: (state, action: PayloadAction<FeedPost>) => {
      const replacedPostId = action.payload.Id;
      const targetPostIndex = state.findIndex((post) => post.Id === replacedPostId);
      if (targetPostIndex !== -1) {
        state[targetPostIndex] = action.payload;
      }
      return state;
    },
    handlePostLike: (state, action: PayloadAction<string>) => {
      const targetPost = state.find((post: FeedPost) => post.Id === action.payload);
      if (targetPost) {
        targetPost.isLiked = !targetPost.isLiked;
      }
      return state;
    }
  }
});

export default feedsSlice.reducer;
export const {
  addNewPosts,
  clearPosts,
  setNewFeedPosts,
  addNewLocalPost,
  replaceLocalPost,
  deleteAPost,
  replaceEditedMessage
} = feedsSlice.actions;
