import { client } from './client';
import { Post } from 'types';

export const timelineApi = {
  getTimeline: async (page = 1, limit = 20): Promise<Post[]> => {
    const { data } = await client.get<Post[]>('/timeline', { params: { page, limit } });
    return data;
  },
};
