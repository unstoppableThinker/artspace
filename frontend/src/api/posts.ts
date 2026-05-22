import { client } from './client';
import { Post } from 'types';

export const postsApi = {
  getUserPosts: async (username: string, page = 1, limit = 20): Promise<Post[]> => {
    const { data } = await client.get<Post[]>(`/posts/user/${username}`, {
      params: { skip: (page - 1) * limit, limit },
    });
    return data;
  },

  getPost: async (postId: string): Promise<Post> => {
    const { data } = await client.get<Post>(`/posts/${postId}`);
    return data;
  },

  createPost: async (
    caption: string,
    tagNames: string[],
    files: File[]
  ): Promise<Post> => {
    const form = new FormData();
    form.append('caption', caption);
    form.append('tag_names', JSON.stringify(tagNames));
    files.forEach((f) => form.append('files', f));
    const { data } = await client.post<Post>('/posts', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  deletePost: async (postId: string): Promise<void> => {
    await client.delete(`/posts/${postId}`);
  },
};
