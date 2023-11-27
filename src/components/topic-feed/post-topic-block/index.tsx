import React from 'react';
import './index.css';
import { LMFeedTopics } from '@likeminds.community/feed-js-beta';
import TopicBlock from '../topic';
interface PostTopicBlockProps {
  topics: LMFeedTopics[];
}
const PostTopicBlock = ({ topics }: PostTopicBlockProps) => {
  return (
    <div className="postTopicBlockContainer">
      {topics?.map((topic: LMFeedTopics) => {
        return (
          <TopicBlock isCreateMode={true} onDeleteClick={null} key={topic?.Id} topic={topic} />
        );
      })}
    </div>
  );
};

export default PostTopicBlock;
