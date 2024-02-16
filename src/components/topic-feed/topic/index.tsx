/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import './index.css';
import { LMFeedTopics } from '@likeminds.community/feed-js';
interface TopicBlockProps {
  topic: LMFeedTopics;
  onDeleteClick: any;
  isCreateMode?: any;
}
const TopicBlock = ({ topic, onDeleteClick, isCreateMode }: TopicBlockProps) => {
  switch (isCreateMode) {
    case true: {
      return (
        <div className="topicBlockPostCreation">
          <span>{topic?.name}</span>
        </div>
      );
    }
    default: {
      return (
        <div className="topicBlock">
          <span>{topic?.name}</span>
          <span className="crossIcon" onClick={() => onDeleteClick(topic?.Id)}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <rect opacity="0.01" width="20" height="20" fill="white" />
              <path d="M5.92578 5.9259L14.6555 14.11L5.92578 5.9259Z" fill="#5046E5" />
              <path d="M5.92578 5.9259L14.6555 14.11" stroke="#5046E5" />
              <path d="M14.6555 5.9259L5.92578 14.11L14.6555 5.9259Z" fill="#5046E5" />
              <path d="M14.6555 5.9259L5.92578 14.11" stroke="#5046E5" />
            </svg>
          </span>
        </div>
      );
    }
  }
};

export default TopicBlock;
