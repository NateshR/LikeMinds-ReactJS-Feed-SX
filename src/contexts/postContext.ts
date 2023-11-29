import { createContext } from 'react';
import { FeedPost } from '../models/feedPost';
import { User } from '../models/User';
import { Topic } from '../models/topics';

interface PostContextInterface {
  post: FeedPost | null;
  user: Record<string, User> | null;
  topics: Record<string, Topic> | null;
  index: number | null;
}

export const PostContext = createContext<PostContextInterface>({
  post: null,
  user: null,
  topics: null,
  index: null
});
