// src/Header/Header.tsx

import React from 'react';
import './../assets/css/comments.css';
import { IconButton } from '@mui/material';
import { IComment } from 'likeminds-sdk/dist/shared/models/comment.model';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
interface CommentProps {
  comment: IComment;
}
const PostComents: React.FC<CommentProps> = ({ comment }) => {
  function renderLikeButton() {
    if (comment.isLiked) {
      return (
        <Favorite
          sx={{
            color: '#FB1609',
            fontSize: '14px'
          }}
        />
      );
    } else {
      return <FavoriteBorder sx={{ fontSize: '14px' }} />;
    }
  }
  return (
    <div className="commentWrapper">
      <div className="commentWrapper--username">
        <span className="displayName">Ronald Richard</span>
        <span className="displayTitle"></span>
      </div>
      <div className="commentWrapper--commentContent">
        Reliance Retail Ltd has signed a long-term franchise agreement with American fashion brand
        Gap Inc to bring its products to India, a statement issued on July 6 read. The pact makes
        Reliance Retail the official retailer for Gap across all channels in India... See more
      </div>
      <div className="commentWrapper--commentActions">
        <span className="like">
          <IconButton>{renderLikeButton()}</IconButton>
        </span>
        |<span className="replies"></span>
      </div>
    </div>
  );
};

export default PostComents;
