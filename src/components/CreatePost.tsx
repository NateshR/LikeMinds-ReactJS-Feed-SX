import userImg from "../assets/images/user.png";

import React, { useState } from "react";
import PostOptions from "./PostOptions";
import DialogBox from "./dialog/DialogBox";
import CreatePostDialog from "./dialog/createPost/CreatePostDialog";

const CreatePost: React.FC = () => {
  const [openCreatePostDialog, setOpenCreatePostDialog] = useState(false);
  function closeCreatePostDialog() {
    setOpenCreatePostDialog(false);
  }
  function openCreatePostDialogBox() {
    setOpenCreatePostDialog(true);
  }
  return (
    <>
      <DialogBox
        openCreatePostDialog={openCreatePostDialog}
        closeCreatePostDialog={closeCreatePostDialog}
        // children={<CreatePostDialog/>}
      >
        <CreatePostDialog />
      </DialogBox>
      <div className="lmWrapper__feed__creatPost">
        <div className="lmWrapper__feed__creatPost__write">
          <div className="lmWrapper__feed__creatPost__write--userImg">
            <img src={userImg} alt="user_image" />
          </div>
          <div className="lmWrapper__feed__creatPost__write--inputBox">
            <input
              type="text"
              placeholder="Wtire something here..."
              onSelect={openCreatePostDialogBox}
            />
          </div>
        </div>
        <PostOptions />
      </div>
    </>
  );
};

export default CreatePost;
