import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Tag } from 'types';
import { tagsApi } from 'api/tags';

export const fetchTags = createAsyncThunk('tags/fetchAll', async () => {
  return tagsApi.getAllTags();
});

export const toggleTag = createAsyncThunk('tags/toggle', async (tag: Tag) => {
  if (tag.is_followed) await tagsApi.unfollowTag(tag.id);
  else await tagsApi.followTag(tag.id);
  return tag; // return original tag so reducer knows the pre-toggle state
});

interface TagsState {
  tags: Tag[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  toggling: string | null;
  filter: string;
}

const initialState: TagsState = {
  tags: [],
  status: 'idle',
  toggling: null,
  filter: '',
};

const tagsSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {
    setFilter(state, action: PayloadAction<string>) {
      state.filter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTags.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.tags = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchTags.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(toggleTag.pending, (state, action) => {
        state.toggling = action.meta.arg.id;
      })
      .addCase(toggleTag.fulfilled, (state, action) => {
        state.toggling = null;
        const { id, is_followed: wasFollowed } = action.payload;
        const tag = state.tags.find((t) => t.id === id);
        if (tag) {
          tag.is_followed = !wasFollowed;
          tag.follower_count += wasFollowed ? -1 : 1;
        }
      })
      .addCase(toggleTag.rejected, (state) => {
        state.toggling = null;
      });
  },
});

export const { setFilter } = tagsSlice.actions;
export default tagsSlice.reducer;
