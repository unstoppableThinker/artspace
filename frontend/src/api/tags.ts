import { client } from './client';
import { Tag } from 'types';

export const tagsApi = {
  getAllTags: async (): Promise<Tag[]> => {
    const { data } = await client.get<Tag[]>('/tags');
    return data;
  },

  getFollowedTags: async (): Promise<Tag[]> => {
    const { data } = await client.get<Tag[]>('/tags/followed');
    return data;
  },

  followTag: async (tagId: string): Promise<void> => {
    await client.post(`/tags/${tagId}/follow`);
  },

  unfollowTag: async (tagId: string): Promise<void> => {
    await client.delete(`/tags/${tagId}/follow`);
  },
};
