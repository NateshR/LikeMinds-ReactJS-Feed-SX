import liked from '../assets/images/liked.svg';
import comment from '../assets/images/comment.svg';
import bookmark from '../assets/images/bookmark.svg';
import share from '../assets/images/share.svg';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import React, { useState } from 'react';
import PostComents from './PostComments';
import { lmFeedClient } from '..';
import { IconButton } from '@mui/material';
import { LIKE_POST, SAVE_POST } from '../services/feedModerationActions';
import { IComment } from 'likeminds-sdk/dist/shared/models/comment.model';
interface PostFooterProps {
  postId: string;
  isEdited: boolean;
  isLiked: boolean;
  isPinned: boolean;
  isSaved: boolean;
  likesCount: number;
  feedModerationHandler: (action: string, index: number, value: any) => void;
  index: number;
  commentsCount: number;
}
const PostFooter: React.FC<PostFooterProps> = ({
  postId,
  isEdited,
  isLiked,
  isPinned,
  isSaved,
  likesCount,
  index,
  feedModerationHandler,
  commentsCount
}) => {
  const [commentList, setCommentList] = useState<IComment[]>([]);

  async function likePost() {
    if (isLiked) {
      feedModerationHandler(LIKE_POST, index, false);
    } else {
      feedModerationHandler(LIKE_POST, index, true);
    }
    return lmFeedClient.likePost(postId);
  }
  function getPostLikes() {}
  function sharePOst() {}
  function savePost() {
    if (isSaved) {
      feedModerationHandler(SAVE_POST, index, false);
    } else {
      feedModerationHandler(SAVE_POST, index, true);
    }
    return lmFeedClient.savePost(postId);
  }

  async function getPostComments() {
    let response: any = await lmFeedClient.getPostDetails(postId);
    let commentArray = response?.data?.post?.replies;
    setCommentList(commentArray);
    console.log(response);
  }

  function setLikeButton() {
    if (isLiked) {
      return (
        <FavoriteIcon
          sx={{
            color: '#FB1609'
          }}
        />
      );
    } else {
      return <FavoriteBorderIcon />;
    }
  }
  function setSavePostButton() {
    console.log('is saved is ', isSaved);
    if (isSaved) {
      return (
        <BookmarkIcon
          sx={{
            color: '#484F67'
          }}
        />
      );
    } else {
      return <BookmarkBorderIcon />;
    }
  }
  return (
    <div className="lmWrapper__feed__post__footer">
      <div className="lmWrapper__feed__post__footer__actions">
        <div className="lmWrapper__feed__post__footer__actions__left">
          <div className="lm-d-flex lm-align-center lm-cursor-pointer">
            {' '}
            <IconButton onClick={likePost}>{setLikeButton()}</IconButton> <span>{likesCount}</span>
          </div>
          <div className="lm-d-flex lm-align-center lm-cursor-pointer">
            <IconButton onClick={getPostComments}>
              <img src={comment} alt="comment" />
            </IconButton>{' '}
            <span>{commentsCount}</span>
          </div>
        </div>
        <div className="lmWrapper__feed__post__footer__actions__right">
          <div className="lm-cursor-pointer">
            <IconButton onClick={savePost}>{setSavePostButton()}</IconButton>
          </div>
          <div className="lm-cursor-pointer">
            <img src={share} alt="share" />
          </div>
        </div>
      </div>
      {/* Comments */}
      <div>{/* <input */}</div>
      {commentList.length
        ? commentList.map((comment: IComment, index: number) => {
            return <PostComents comment={comment} key={comment.Id!.toString()} />;
          })
        : null}
      {/* Comments */}
    </div>
  );
};

export default PostFooter;
