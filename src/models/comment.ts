import { MenuItem } from './menuItem';

export interface Comment {
  Id: string;
  isLiked: boolean;
  isEdited: boolean;
  userId: string;
  text: string;
  level: number;
  likesCount: number;
  commentsCount: number;
  createdAt: number;
  updatedAt: number;
  replies?: Comment[];
  menuItems: MenuItem[];
  parentComment?: Comment;
  uuid: string;
  tempId: string | null;
  communityId?: number;
  postId: string;
}
