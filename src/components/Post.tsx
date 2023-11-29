import userImg from '../assets/images/user.png';
import liked from '../assets/images/liked.svg';
import comment from '../assets/images/comment.svg';
import bookmark from '../assets/images/bookmark.svg';
import share from '../assets/images/share.svg';

import React, { useContext, useEffect, useState } from 'react';
import PostHeader from './PostHeader';
import PostBody from './PostBody';
import PostFooter from './PostFooter';
import { IPost, IUser, LMFeedTopics } from '@likeminds.community/feed-js';
import PostTopicBlock from './topic-feed/post-topic-block';
import { FeedPost } from '../models/feedPost';
import { User } from '../models/User';
import { PostContext } from '../contexts/postContext';
import { Topic } from '../models/topics';

interface PostProps {
  rightSidebarHandler: (action: string, value: any) => void;
}
const pattern = /<<.*?>>/g;

const Post: React.FC<PostProps> = ({ rightSidebarHandler }) => {
  const { post, topics, index, user } = useContext(PostContext);
  const [topicsForPost, setTopicsForPost] = useState<Topic[]>([]);
  useEffect(() => {
    if (topics && post) {
      const selectedPostTopics = post?.topics?.map((topicId: string) => {
        return topics[topicId];
      });
      setTopicsForPost(selectedPostTopics);
    }
  }, [topics, post]);
  if (!user) {
    return null;
  }
  if (!post) {
    return null;
  }
  // useEffect(() => {
  //   console.log('The topics are', topics);
  //   if (topics) {
  //     for (let [key, val] of Object.entries(topics)) {
  //       console.log(val);
  //     }
  //   }
  // }, [topics]);
  return (
    <div>
      {/* Post */}
      {/* declare custom title in user model */}
      <div className="lmWrapper__feed__post">
        {/* header */}
        <PostHeader />
        <PostTopicBlock topics={topicsForPost} />
        {/* post */}
        <PostBody />
        {/* footer */}
        <PostFooter rightSidebarHandler={rightSidebarHandler} />
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
