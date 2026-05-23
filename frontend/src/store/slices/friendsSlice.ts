import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { FriendRequest, User } from 'types';
import { friendsApi } from 'api/friends';

export const loadFriends = createAsyncThunk('friends/load', async () => {
  const [friends, incoming, outgoing] = await Promise.all([
    friendsApi.getFriends(),
    friendsApi.getIncomingRequests(),
    friendsApi.getOutgoingRequests(),
  ]);
  return { friends, incoming, outgoing };
});

export const acceptFriendRequest = createAsyncThunk('friends/accept', async (id: string) => {
  await friendsApi.acceptRequest(id);
  return id;
});

export const rejectFriendRequest = createAsyncThunk('friends/reject', async (id: string) => {
  await friendsApi.rejectRequest(id);
  return id;
});

export const removeFriend = createAsyncThunk('friends/remove', async (id: string) => {
  await friendsApi.removeFriend(id);
  return id;
});

interface FriendsState {
  friends: User[];
  incoming: FriendRequest[];
  outgoing: FriendRequest[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: FriendsState = {
  friends: [],
  incoming: [],
  outgoing: [],
  status: 'idle',
};

const friendsSlice = createSlice({
  name: 'friends',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadFriends.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadFriends.fulfilled, (state, action) => {
        state.friends = action.payload.friends;
        state.incoming = action.payload.incoming;
        state.outgoing = action.payload.outgoing;
        state.status = 'succeeded';
      })
      .addCase(loadFriends.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(acceptFriendRequest.fulfilled, (state, action) => {
        state.incoming = state.incoming.filter((r) => r.id !== action.payload);
      })
      .addCase(rejectFriendRequest.fulfilled, (state, action) => {
        state.incoming = state.incoming.filter((r) => r.id !== action.payload);
      })
      .addCase(removeFriend.fulfilled, (state, action) => {
        state.friends = state.friends.filter((f) => f.id !== action.payload);
      });
  },
});

export default friendsSlice.reducer;
