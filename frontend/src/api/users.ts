import { client } from './client';
import { User, UserPrivate } from 'types';

export const usersApi = {
  getProfile: async (username: string): Promise<User> => {
    const { data } = await client.get<User>(`/users/${username}`);
    return data;
  },

  updateProfile: async (payload: { username?: string; bio?: string }): Promise<UserPrivate> => {
    const { data } = await client.put<UserPrivate>('/users/me/profile', payload);
    return data;
  },

  uploadAvatar: async (file: File): Promise<UserPrivate> => {
    const form = new FormData();
    form.append('file', file);
    const { data } = await client.post<UserPrivate>('/users/me/avatar', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
};
