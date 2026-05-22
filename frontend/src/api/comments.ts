import { client } from './client';
import { Comment } from 'types';

export const commentsApi = {
  getComments: async (postId: string): Promise<Comment[]> => {
    const { data } = await client.get<Comment[]>(`/posts/${postId}/comments`);
    return data;
  },

  addComment: async (postId: string, content: string): Promise<Comment> => {
    const { data } = await client.post<Comment>(`/posts/${postId}/comments`, { content });
    return data;
  },

  deleteComment: async (commentId: string): Promise<void> => {
    await client.delete(`/posts/comments/${commentId}`);
  },
};
