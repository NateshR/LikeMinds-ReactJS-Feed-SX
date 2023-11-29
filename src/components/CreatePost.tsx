import userImg from '../assets/images/user.png';

import React, { useContext, useEffect, useRef, useState } from 'react';
import PostOptions from './PostOptions';
import DialogBox from './dialog/DialogBox';
import CreatePostDialog from './dialog/createPost/CreatePostDialog';
import { lmFeedClient } from '..';
import { Dialog } from '@mui/material';
import { IPost } from '@likeminds.community/feed-js';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
interface CreateFeedProps {
  feedModerationHandler: any;
}
const CreatePost: React.FC<CreateFeedProps> = ({ feedModerationHandler }) => {
  const currentUser = useSelector((state: RootState) => state.currentUser.user);

  const ref = useRef<HTMLInputElement | null>(null);
  const [openCreatePostDialog, setOpenCreatePostDialog] = useState(false);
  const [showMediaAttachmentOnInitiation, setShowMediaAttachmentOnInitiation] =
    useState<boolean>(false);
  const [showDocumentAttachmentOnInitiation, setShowDocumentAttachmentOnInitiation] =
    useState<boolean>(false);
  function closeCreatePostDialog() {
    setOpenCreatePostDialog(false);
    setShowMediaAttachmentOnInitiation(false);
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

  function setUserImage() {
    const imageLink = currentUser?.imageUrl;
    if (imageLink !== '') {
      return (
        <img
          src={imageLink}
          alt={''}
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
          {currentUser?.name?.split(' ').map((part: string) => {
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
        }}
        PaperProps={{
          sx: {
            borderRadius: '16px'
          }
        }}>
        <CreatePostDialog
          closeCreatePostDialog={closeCreatePostDialog}
          showMediaAttachmentOnInitiation={showMediaAttachmentOnInitiation}
          setShowMediaAttachmentOnInitiation={setShowMediaAttachmentOnInitiation}
          showDocumentAttachmentOnInitiation={showDocumentAttachmentOnInitiation}
          setShowDocumentAttachmentOnInitiation={setShowDocumentAttachmentOnInitiation}
          feedModerationHandler={feedModerationHandler}
        />
      </Dialog>
      <div className="lmWrapper__feed__creatPost">
        <div className="lmWrapper__feed__creatPost__write">
          <div className="lmWrapper__feed__creatPost__write--userImg">{setUserImage()}</div>
          <div className="lmWrapper__feed__creatPost__write--inputBox">
            <input
              ref={ref}
              type="text"
              placeholder="Write something here..."
              onClick={(e) => {
                e.preventDefault();
              }}
              onSelect={(e) => {
                e.currentTarget.blur();
                e.preventDefault();
                openCreatePostDialogBox();
                // e.currentTarget.
              }}
              readOnly
              autoFocus={false}
            />
          </div>
        </div>
        <PostOptions
          setMediaAttachmentOnInitiation={setShowMediaAttachmentOnInitiation}
          openCreatePostDialogBox={openCreatePostDialogBox}
          setDocumentAttachmentOnInitiation={setShowDocumentAttachmentOnInitiation}
        />
      </div>
    </>
  );
};

export default CreatePost;
