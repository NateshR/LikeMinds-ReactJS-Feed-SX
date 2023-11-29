import React, { memo } from 'react';
import './index.css';
import { LMFeedTopics } from '@likeminds.community/feed-js';
import { Checkbox, MenuItem } from '@mui/material';
interface TopicListProps {
  topic: LMFeedTopics;
  checkedList: LMFeedTopics[];
  clickHandler: any;
}
const TopicListItem = ({ topic, checkedList, clickHandler }: TopicListProps) => {
  return (
    <div
      className="topicTile"
      onClick={() => {
        clickHandler(topic);
      }}>
      <Checkbox
        disableRipple={true}
        sx={{
          '&.Mui-checked': {
            color: '#5046e5'
          },
          ':hover': {
            background: 'white'
          },
          paddingX: '0px'
        }}
        checked={
          topic.name === 'All Topics'
            ? checkedList.length === 0
            : checkedList.some((el) => el.Id === topic.Id)
        }
      />
      <span className="topicNameContainer">{topic.name}</span>
    </div>
  );
};

export default memo(TopicListItem);
