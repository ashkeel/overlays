export interface User {
  avatar: string;
  avatarUrl: string;
  confirmedAt: string;
  displayname: string;
  id: string;
  username: string;
}

export interface FollowEvent {
  hasLiveNotifications: boolean;
  id: string;
  insertedAt: string;
  streamer: Partial<User>;
  updatedAt: string;
  user: Partial<User>;
}

export interface SubEvent {
  endedAt?: string;
  id: string;
  insertedAt: string;
  isActive: boolean;
  price?: number;
  productName: string;
  startedAt: string;
  streamer: Partial<User>;
  updatedAt: string;
  user: Partial<User>;
}
