import liked from "../assets/images/liked.svg";
import comment from "../assets/images/comment.svg";
import bookmark from "../assets/images/bookmark.svg";
import share from "../assets/images/share.svg";

import React from "react";
import PostComents from "./PostComments";

const PostFooter: React.FC = () => {
  return (
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
      {/* Comments */}
      <PostComents />
      {/* Comments */}
    </div>
  );
};

export default PostFooter;
