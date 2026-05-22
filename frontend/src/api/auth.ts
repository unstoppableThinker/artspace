import { client } from './client';
import { TokenResponse, UserPrivate } from 'types';

export const authApi = {
  register: async (username: string, email: string, password: string): Promise<TokenResponse> => {
    const { data } = await client.post<TokenResponse>('/auth/register', { username, email, password });
    return data;
  },

  login: async (email: string, password: string): Promise<TokenResponse> => {
    const { data } = await client.post<TokenResponse>('/auth/login', { email, password });
    return data;
  },

  me: async (): Promise<UserPrivate> => {
    const { data } = await client.get<UserPrivate>('/auth/me');
    return data;
  },
};
