import post from '../assets/images/post.jpg';

import React from 'react';

const PostBody: React.FC = () => {
  return (
    <div className="lmWrapper__feed__post__body">
      <div className="lmWrapper__feed__post__body--content">
        Congrats to @munni76 for being Community Hood CM Of the Week !
        <br />
        She has lived in Korea for twelve years and mastered the language from there. She has also
        worked as a cultural ambassador with UNESCO for ten years in Korea. Now, she is a full time
        tutor for Korean language and prepare her students for TOPIK certification exam.
      </div>
      <div className="lmWrapper__feed__post__body--media">
        <img src={post} alt="post" />
      </div>
    </div>
  );
};

export default PostBody;
