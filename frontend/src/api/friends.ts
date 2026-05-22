import { client } from './client';
import { FriendRequest, User } from 'types';

export const friendsApi = {
  getFriends: async (): Promise<User[]> => {
    const { data } = await client.get<User[]>('/friends');
    return data;
  },

  getIncomingRequests: async (): Promise<FriendRequest[]> => {
    const { data } = await client.get<FriendRequest[]>('/friends/requests/incoming');
    return data;
  },

  getOutgoingRequests: async (): Promise<FriendRequest[]> => {
    const { data } = await client.get<FriendRequest[]>('/friends/requests/outgoing');
    return data;
  },

  sendRequest: async (userId: string): Promise<FriendRequest> => {
    const { data } = await client.post<FriendRequest>(`/friends/requests/${userId}`);
    return data;
  },

  acceptRequest: async (requestId: string): Promise<FriendRequest> => {
    const { data } = await client.put<FriendRequest>(`/friends/requests/${requestId}/accept`);
    return data;
  },

  rejectRequest: async (requestId: string): Promise<FriendRequest> => {
    const { data } = await client.put<FriendRequest>(`/friends/requests/${requestId}/reject`);
    return data;
  },

  removeFriend: async (friendId: string): Promise<void> => {
    await client.delete(`/friends/${friendId}`);
  },
};
