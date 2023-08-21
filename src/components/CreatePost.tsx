import userImg from '../assets/images/user.png';

import React, { useContext, useEffect, useRef, useState } from 'react';
import PostOptions from './PostOptions';
import DialogBox from './dialog/DialogBox';
import CreatePostDialog from './dialog/createPost/CreatePostDialog';
import { lmFeedClient } from '..';
import { Dialog } from '@mui/material';
import UserContext from '../contexts/UserContext';

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
  const userContext = useContext(UserContext);

  function setUserImage() {
    const imageLink = userContext?.user?.imageUrl;
    if (imageLink !== '') {
      return (
        <img
          src={imageLink}
          alt={userContext.user?.imageUrl}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%'
          }}
        />
      );
    } else {
      return (
        <span
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'inline-flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#5046e5',
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#fff',
            letterSpacing: '1px'
          }}>
          {userContext.user?.name?.split(' ').map((part: string) => {
            return part.charAt(0)?.toUpperCase();
          })}
        </span>
      );
    }
  }
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
          <div className="lmWrapper__feed__creatPost__write--userImg">{setUserImage()}</div>
          <div className="lmWrapper__feed__creatPost__write--inputBox">
            <input
              ref={ref}
              type="text"
              placeholder="Write something here..."
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
