import userImg from "../assets/images/user.png";

import React from "react";
import PostOptions from "./PostOptions";

const CreatePost: React.FC = () => {
  return (
    <div className="lmWrapper__feed__creatPost">
      <div className="lmWrapper__feed__creatPost__write">
        <div className="lmWrapper__feed__creatPost__write--userImg">
          <img src={userImg} alt="user image" />
        </div>
        <div className="lmWrapper__feed__creatPost__write--inputBox">
          <input type="text" placeholder="Wtire something here..." />
        </div>
      </div>
      <PostOptions />
    </div>
  );
};

export default CreatePost;
