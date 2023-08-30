import userImg from '../assets/images/user.png';
import liked from '../assets/images/liked.svg';
import comment from '../assets/images/comment.svg';
import bookmark from '../assets/images/bookmark.svg';
import share from '../assets/images/share.svg';

import React from 'react';
import PostHeader from './PostHeader';
import PostBody from './PostBody';
import PostFooter from './PostFooter';
import { IPost, IUser } from '@likeminds.community/feed-js';

interface PostProps {
  post: IPost;
  user: IUser;
  feedModerationHandler: (action: string, index: number, value: any) => void;
  index: number;
  rightSidebarHandler: (action: string, value: any) => void;
}
const pattern = /<<.*?>>/g;

const Post: React.FC<PostProps> = ({
  post,
  user,
  feedModerationHandler,
  index,
  rightSidebarHandler
}) => {
  if (!user) {
    return null;
  }
  return (
    <div>
      {/* Post */}
      {/* declare custom title in user model */}
      <div className="lmWrapper__feed__post">
        {/* header */}
        <PostHeader
          imgUrl={user.imageUrl}
          username={user.name}
          customTitle={user.customTitle}
          createdAt={post.createdAt}
          menuOptions={post.menuItems}
          postId={post.Id}
          feedModerationHandler={feedModerationHandler}
          index={index}
          uuid={post.uuid}
          isPinned={post.isPinned}
          isEdited={post.isEdited}
        />
        {/* post */}
        <PostBody
          answer={post.text}
          attachments={post.attachments!}
          feedModerationHandler={feedModerationHandler}
        />
        {/* footer */}
        <PostFooter
          rightSidebarHandler={rightSidebarHandler}
          postId={post.Id}
          isLiked={post.isLiked}
          isPinned={post.isPinned}
          isEdited={post.isEdited}
          isSaved={post.isSaved}
          likesCount={post.likesCount}
          feedModerationHandler={feedModerationHandler}
          index={index}
          commentsCount={post.commentsCount}
        />
      </div>
      {/* Post */}
    </div>
  );
};

export default Post;

let a = (
  <>
    <div className="lmWrapper__feed__post">
      {/* header */}
      <div className="lmWrapper__feed__post__header">
        <div className="lmWrapper__feed__post__header--profile">
          <img src={userImg} alt="user" />
        </div>
        <div className="lmWrapper__feed__post__header--info">
          <div className="title">
            Theresa Web <span>Admin</span>
          </div>
          <div className="subTitle">
            Post <span>20 mins ago</span>
          </div>
        </div>
        <div className="lmWrapper__feed__post__header--menu">menu</div>
      </div>

      {/* post */}
      <div className="lmWrapper__feed__post__body">
        <div className="lmWrapper__feed__post__body--content">
          Congrats to @munni76 for being Community Hood CM Of the Week !
          <br />
          She has lived in Korea for twelve years and mastered the language from there. She has also
          worked as a cultural ambassador with UNESCO for ten years in Korea. Now, she is a full
          time tutor for Korean language and prepare her students for TOPIK certification exam.
        </div>
      </div>
      {/* footer */}
      <div className="lmWrapper__feed__post__footer">
        <div className="lmWrapper__feed__post__footer__actions">
          <div className="lmWrapper__feed__post__footer__actions__left">
            <div className="lm-d-flex lm-align-center lm-cursor-pointer">
              <img src={liked} alt="liked" /> <span>240</span>
            </div>
            <div className="lm-d-flex lm-align-center lm-cursor-pointer">
              <img src={comment} alt="comment" /> <span>33</span>
            </div>
          </div>
          <div className="lmWrapper__feed__post__footer__actions__right">
            <div className="lm-cursor-pointer">
              <img src={bookmark} alt="bookmark" />
            </div>
            <div className="lm-cursor-pointer">
              <img src={share} alt="share" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
);
