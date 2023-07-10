import userImg from "../assets/images/user.png";

import React from "react";

const PostHeader: React.FC = () => {
  return (
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
  );
};

export default PostHeader;
