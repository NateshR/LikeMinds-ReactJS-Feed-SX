import userImg from '../assets/images/user.png';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
import React, { useContext, useEffect, useState } from 'react';
import { Dialog, IconButton, Menu, MenuItem } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { lmFeedClient } from '..';
import { DELETE_POST, EDIT_POST } from '../services/feedModerationActions';
import UserContext from '../contexts/UserContext';
import EditPost from './dialog/editPost/EditPost';
import { IPost, IMenuItem } from '@likeminds.community/feed-js';
import ReportPostDialogBox from './ReportPost';
import { useLocation, useNavigate } from 'react-router-dom';
import DeleteDialog from './DeleteDialog';
interface PostHeaderProps {
  imgUrl: string;
  username: string;
  customTitle: string;
  createdAt: number;
  menuOptions: IMenuItem[];
  postId: string;
  index: number;
  feedModerationHandler: (action: string, index: number, value: any) => void;
  uuid: any;
  isPinned: boolean;
  isEdited: boolean;
}
const PostHeader: React.FC<PostHeaderProps> = ({
  username,
  customTitle,
  imgUrl,
  createdAt,
  menuOptions,
  postId,
  feedModerationHandler,
  index,
  uuid,
  isPinned,
  isEdited
}) => {
  const [moreAnchorsMenu, setMoreOptionsMenu] = useState<HTMLElement | null>(null);
  const [openDialogBox, setOpenDialog] = useState(false);
  const [postMenuOptions, setPostMenuOptions] = useState([...menuOptions]);
  const [isPostPinned, setIsPostPinned] = useState<boolean>(isPinned);
  const [openDeleteConfirmationDialog, setOpenDeleteConfirmationDialog] = useState<boolean>(false);
  function closeDeleteDialog() {
    setOpenDeleteConfirmationDialog(false);
  }
  const location = useLocation();
  const navigate = useNavigate();
  function handleOpenMoreOptionsMenu(event: React.MouseEvent<HTMLElement>) {
    setMoreOptionsMenu(event.currentTarget);
  }
  function handleCloseMoreOptionsMenu() {
    setMoreOptionsMenu(null);
  }
  function transformUsername(username: string) {
    return username
      .split(' ')
      .map((part: string) => {
        return part.substring(0, 1).toUpperCase().concat(part.substring(1));
      })
      .join(' ');
  }
  async function pinPost() {
    setIsPostPinned(!isPostPinned);
    return await lmFeedClient.pinPost(postId);
  }
  async function unpinPost() {
    setIsPostPinned(!isPostPinned);
    return await lmFeedClient.pinPost(postId);
  }
  async function deletePost() {
    feedModerationHandler(DELETE_POST, index, null);
    await lmFeedClient.deletePost(postId);
    if (location.pathname.includes('/post')) {
      navigate('/');
    } else {
      return;
    }
    // location.
  }

  function closeEditPostDialog() {
    setOpenDialog(false);
  }
  async function editPost() {
    feedModerationHandler(EDIT_POST, index, null);
  }
  async function openReport() {
    setOpenDialog(true);
  }
  async function onClickHandler(event: React.MouseEvent) {
    handleCloseMoreOptionsMenu();
    switch (event.currentTarget.id) {
      case '2':
        await pinPost();
        break;
      case '3':
        await unpinPost();
        break;
      case '1':
        setOpenDeleteConfirmationDialog(true);
        break;
      case '5':
        await editPost();
        break;
      case '4':
        await openReport();
        break;
    }
    const postDetailsCall: any = await lmFeedClient.getPostDetails(postId, 1);
    setPostMenuOptions(postDetailsCall?.data?.post?.menuItems);
  }
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
            width: '48px',
            height: '48px',
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
          {username?.split(' ').map((part: string) => {
            return part.charAt(0)?.toUpperCase();
          })}
        </span>
      );
    }
  }
  function setPinnedIcon() {
    if (isPostPinned) {
      return (
        <div
          style={{
            marginRight: '1rem'
          }}>
          {' '}
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M10.0053 20.001C15.4832 20.001 20 15.4842 20 10.0063C20 4.51779 15.4832 0.000976562 9.99466 0.000976562C4.50614 0.000976562 0 4.51779 0 10.0063C0 15.4842 4.51682 20.001 10.0053 20.001ZM10.0053 18.9438C5.05072 18.9438 1.05713 14.9503 1.05713 10.0063C1.05713 5.06238 5.05072 1.0581 9.99466 1.0581C14.9386 1.0581 18.9429 5.06238 18.9429 10.0063C18.9536 14.9503 14.9493 18.9438 10.0053 18.9438ZM6.05446 12.1206C6.05446 12.4836 6.31073 12.7079 6.68446 12.7079H9.55686V14.9289C9.55686 15.7404 9.85585 16.4345 9.99466 16.4345C10.1335 16.4345 10.4431 15.7404 10.4431 14.9289V12.7079H13.2942C13.6893 12.7079 13.9349 12.4836 13.9349 12.1206C13.9349 10.9567 13.0272 9.80343 11.575 9.31224L11.4042 6.74951C12.0021 6.39713 12.6215 5.91662 12.9204 5.53221C13.0593 5.36136 13.1233 5.17983 13.1233 5.04102C13.1233 4.77407 12.9311 4.58186 12.6108 4.58186H7.38922C7.07955 4.58186 6.86599 4.77407 6.86599 5.04102C6.86599 5.19051 6.95142 5.37204 7.10091 5.56424C7.39989 5.94865 8.00854 6.40781 8.59584 6.74951L8.41431 9.31224C6.97277 9.80343 6.05446 10.9567 6.05446 12.1206Z"
              fill="#484F67"
            />
          </svg>
        </div>
      );
    } else {
      return null;
    }
  }
  return (
    <div className="lmWrapper__feed__post__header">
      <Dialog open={openDeleteConfirmationDialog} onClose={closeDeleteDialog}>
        <DeleteDialog onClose={closeDeleteDialog} deletePost={deletePost} type={1} />
      </Dialog>
      <div className="lmWrapper__feed__post__header--profile">{setUserImage()}</div>
      <div className="lmWrapper__feed__post__header--info">
        <div className="title">
          {transformUsername(username)}
          {customTitle.length ? <span>Admin</span> : null}
        </div>
        {isEdited ? (
          <div className="subTitle edited">
            <span>{dayjs(createdAt).fromNow()}</span> Edited
          </div>
        ) : (
          <div className="subTitle nonEdited">
            Post <span>{dayjs(createdAt).fromNow()}</span>
          </div>
        )}
      </div>
      <div
        className="lmWrapper__feed__post__header--menu"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
        {setPinnedIcon()}
        <IconButton onClick={handleOpenMoreOptionsMenu}>
          <MoreHorizIcon />
        </IconButton>
        <Menu
          // className="lmOverflowMenu"
          anchorEl={moreAnchorsMenu}
          open={Boolean(moreAnchorsMenu)}
          anchorOrigin={{
            horizontal: 'right',
            vertical: 'top'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          sx={{
            paddingY: '0px',
            boxShadow: '0px 1px 16px 0px rgba(0, 0, 0, 0.24)'
          }}
          onClose={handleCloseMoreOptionsMenu}>
          {postMenuOptions?.map((menuItem: IMenuItem) => {
            return (
              <div
                className="lmOverflowMenuTitle"
                onClick={onClickHandler}
                id={menuItem?.id?.toString()}
                key={menuItem?.id}>
                {menuItem?.title}
              </div>
            );
          })}
        </Menu>
        <Dialog
          open={openDialogBox}
          onClose={() => {
            setOpenDialog(false);
          }}>
          <ReportPostDialogBox
            uuid={uuid}
            closeBox={() => {
              setOpenDialog(false);
            }}
            reportedPostId={postId}
          />
        </Dialog>
      </div>
    </div>
  );
};

export default PostHeader;
