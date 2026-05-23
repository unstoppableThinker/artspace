import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { UserPrivate } from 'types';
import { authApi } from 'api/auth';

export const fetchCurrentUser = createAsyncThunk('auth/fetchCurrentUser', async () => {
  return authApi.me();
});

export const loginWithToken = createAsyncThunk(
  'auth/loginWithToken',
  async (token: string, { dispatch }) => {
    localStorage.setItem('access_token', token);
    await dispatch(fetchCurrentUser());
  }
);

interface AuthState {
  user: UserPrivate | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: AuthState = {
  user: null,
  // If a token exists on load, start in 'loading' to prevent route-guard flash
  status: localStorage.getItem('access_token') ? 'loading' : 'idle',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      localStorage.removeItem('access_token');
      state.user = null;
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.user = null;
        state.status = 'failed';
        localStorage.removeItem('access_token');
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
