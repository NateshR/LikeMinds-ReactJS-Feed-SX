import { Attachment } from './Attachment';
import { Comment } from './comment';
import { MenuItem } from './menuItem';

export interface FeedPost {
  Id: string;
  text: string;
  attachments?: Attachment[];
  communityId: number;
  isLiked: boolean;
  isEdited: boolean;
  isPinned: boolean;
  userId: string;
  likesCount: number;
  commentsCount: number;
  isSaved: boolean;
  menuItems: MenuItem[];
  replies?: Comment[];
  createdAt: number;
  updatedAt: number;
  uuid: string;
  topics: string[];
  tempId: string;
}
