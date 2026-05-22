// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

// ─── User ─────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  username: string;
  bio: string | null;
  profile_picture_url: string | null;
  created_at: string;
}

export interface UserPrivate extends User {
  email: string;
}

// ─── Tag ──────────────────────────────────────────────────────────────────────

export interface Tag {
  id: string;
  name: string;
  created_at: string;
  follower_count: number;
  is_followed: boolean;
}

// ─── Post ─────────────────────────────────────────────────────────────────────

export type MediaType = 'image' | 'video';

export interface PostMedia {
  id: string;
  media_url: string;
  media_type: MediaType;
  order_index: number;
}

export interface Post {
  id: string;
  caption: string | null;
  created_at: string;
  author: User;
  media: PostMedia[];
  tags: Tag[];
  comment_count: number;
}

// ─── Comment ──────────────────────────────────────────────────────────────────

export interface Comment {
  id: string;
  content: string;
  created_at: string;
  author: User;
}

// ─── Friendship ──────────────────────────────────────────────────────────────

export type FriendRequestStatus = 'pending' | 'accepted' | 'rejected';

export interface FriendRequest {
  id: string;
  sender: User;
  receiver: User;
  status: FriendRequestStatus;
  created_at: string;
}

// ─── API error ────────────────────────────────────────────────────────────────

export interface ApiError {
  detail: string | { field: string; message: string }[];
}
