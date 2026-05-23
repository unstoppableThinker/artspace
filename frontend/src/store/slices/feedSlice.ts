import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Post } from 'types';
import { timelineApi } from 'api/timeline';
import { postsApi } from 'api/posts';

export const fetchFeedPage = createAsyncThunk(
  'feed/fetchPage',
  async (page: number) => ({ posts: await timelineApi.getTimeline(page), page })
);

export const deleteFeedPost = createAsyncThunk('feed/deletePost', async (postId: string) => {
  await postsApi.deletePost(postId);
  return postId;
});

interface FeedState {
  posts: Post[];
  page: number;
  hasMore: boolean;
  status: 'idle' | 'loading' | 'loadingMore' | 'succeeded' | 'failed';
  showCreate: boolean;
}

const initialState: FeedState = {
  posts: [],
  page: 1,
  hasMore: true,
  status: 'idle',
  showCreate: false,
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    setShowCreate(state, action: PayloadAction<boolean>) {
      state.showCreate = action.payload;
    },
    prependPost(state, action: PayloadAction<Post>) {
      state.posts.unshift(action.payload);
    },
    resetFeed: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedPage.pending, (state, action) => {
        state.status = action.meta.arg === 1 ? 'loading' : 'loadingMore';
      })
      .addCase(fetchFeedPage.fulfilled, (state, action) => {
        const { posts, page } = action.payload;
        if (page === 1) state.posts = posts;
        else state.posts.push(...posts);
        state.page = page;
        state.hasMore = posts.length === 20;
        state.status = 'succeeded';
      })
      .addCase(fetchFeedPage.rejected, (state) => {
        state.hasMore = false;
        state.status = 'failed';
      })
      .addCase(deleteFeedPost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((p) => p.id !== action.payload);
      });
  },
});

export const { setShowCreate, prependPost, resetFeed } = feedSlice.actions;
export default feedSlice.reducer;
