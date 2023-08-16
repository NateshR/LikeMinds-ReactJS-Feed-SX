import userImg from '../assets/images/user.png';

import React, { useEffect, useRef, useState } from 'react';
import PostOptions from './PostOptions';
import DialogBox from './dialog/DialogBox';
import CreatePostDialog from './dialog/createPost/CreatePostDialog';
import { lmFeedClient } from '..';
import { Dialog } from '@mui/material';

const CreatePost: React.FC = () => {
  const ref = useRef<HTMLInputElement | null>(null);
  const [openCreatePostDialog, setOpenCreatePostDialog] = useState(false);
  function closeCreatePostDialog() {
    console.log('handles');
    setOpenCreatePostDialog(false);
  }
  function openCreatePostDialogBox() {
    setOpenCreatePostDialog(true);
  }
  useEffect(() => {
    // lmFeedClient.fetchFeed();
    if (ref && ref.current) {
      ref.current.blur();
    }
  }, [openCreatePostDialog]);
  const [open, setOpen] = useState(false);
  return (
    <>
      <Dialog
        open={openCreatePostDialog}
        onClose={(e: any) => {
          closeCreatePostDialog();
          e.preventDefault();
        }}>
        <CreatePostDialog closeCreatePostDialog={closeCreatePostDialog} />
      </Dialog>
      <div className="lmWrapper__feed__creatPost">
        <div className="lmWrapper__feed__creatPost__write">
          <div className="lmWrapper__feed__creatPost__write--userImg">
            <img src={userImg} alt="user_image" />
          </div>
          <div className="lmWrapper__feed__creatPost__write--inputBox">
            <input
              ref={ref}
              type="text"
              placeholder="Wtire something here..."
              onSelect={() => {
                openCreatePostDialogBox();
                // e.currentTarget.
              }}
              autoFocus={false}
            />
          </div>
        </div>
        <PostOptions />
      </div>
    </>
  );
};

export default CreatePost;
