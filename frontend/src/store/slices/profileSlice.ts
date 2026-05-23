import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, Post } from 'types';
import { usersApi } from 'api/users';
import { postsApi } from 'api/posts';
import { friendsApi } from 'api/friends';
import { extractError } from 'api/client';

export const fetchProfile = createAsyncThunk('profile/fetchProfile', async (username: string) => {
  return usersApi.getProfile(username);
});

export const fetchProfilePosts = createAsyncThunk(
  'profile/fetchPosts',
  async (username: string) => {
    return postsApi.getUserPosts(username);
  }
);

export const checkFriendStatus = createAsyncThunk(
  'profile/checkFriendStatus',
  async (profileId: string) => {
    const [friends, outgoing] = await Promise.all([
      friendsApi.getFriends(),
      friendsApi.getOutgoingRequests(),
    ]);
    return {
      isFriend: friends.some((f) => f.id === profileId),
      requestSent: outgoing.some((r) => r.receiver.id === profileId),
    };
  }
);

export const sendFriendRequest = createAsyncThunk(
  'profile/sendFriendRequest',
  async (profileId: string) => {
    await friendsApi.sendRequest(profileId);
  }
);

export const updateProfile = createAsyncThunk(
  'profile/update',
  async (form: { username: string; bio: string }, { rejectWithValue }) => {
    try {
      return await usersApi.updateProfile(form);
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  }
);

export const uploadAvatar = createAsyncThunk('profile/uploadAvatar', async (file: File) => {
  return usersApi.uploadAvatar(file);
});

export const deleteProfilePost = createAsyncThunk(
  'profile/deletePost',
  async (postId: string) => {
    await postsApi.deletePost(postId);
    return postId;
  }
);

interface ProfileState {
  profile: User | null;
  posts: Post[];
  loadingProfile: boolean;
  loadingPosts: boolean;
  isFriend: boolean;
  requestSent: boolean;
  editOpen: boolean;
  editForm: { username: string; bio: string };
  saving: boolean;
  editError: string;
  uploadingAvatar: boolean;
}

const initialState: ProfileState = {
  profile: null,
  posts: [],
  loadingProfile: false,
  loadingPosts: false,
  isFriend: false,
  requestSent: false,
  editOpen: false,
  editForm: { username: '', bio: '' },
  saving: false,
  editError: '',
  uploadingAvatar: false,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfile: () => initialState,
    setEditOpen(state, action: PayloadAction<boolean>) {
      state.editOpen = action.payload;
    },
    setEditForm(state, action: PayloadAction<Partial<{ username: string; bio: string }>>) {
      state.editForm = { ...state.editForm, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loadingProfile = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loadingProfile = false;
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.loadingProfile = false;
      })
      .addCase(fetchProfilePosts.pending, (state) => {
        state.loadingPosts = true;
      })
      .addCase(fetchProfilePosts.fulfilled, (state, action) => {
        state.posts = action.payload;
        state.loadingPosts = false;
      })
      .addCase(fetchProfilePosts.rejected, (state) => {
        state.loadingPosts = false;
      })
      .addCase(checkFriendStatus.fulfilled, (state, action) => {
        state.isFriend = action.payload.isFriend;
        state.requestSent = action.payload.requestSent;
      })
      .addCase(sendFriendRequest.fulfilled, (state) => {
        state.requestSent = true;
      })
      .addCase(updateProfile.pending, (state) => {
        state.saving = true;
        state.editError = '';
      })
      .addCase(updateProfile.fulfilled, (state) => {
        state.saving = false;
        state.editOpen = false;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.saving = false;
        state.editError = (action.payload as string) || 'Something went wrong.';
      })
      .addCase(uploadAvatar.pending, (state) => {
        state.uploadingAvatar = true;
      })
      .addCase(uploadAvatar.fulfilled, (state) => {
        state.uploadingAvatar = false;
      })
      .addCase(uploadAvatar.rejected, (state) => {
        state.uploadingAvatar = false;
      })
      .addCase(deleteProfilePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((p) => p.id !== action.payload);
      });
  },
});

export const { clearProfile, setEditOpen, setEditForm } = profileSlice.actions;
export default profileSlice.reducer;
