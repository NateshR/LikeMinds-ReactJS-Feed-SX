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
import { IPost, IMenuItem } from 'likeminds-sdk';
interface PostHeaderProps {
  imgUrl: string;
  username: string;
  customTitle: string;
  createdAt: number;
  menuOptions: IMenuItem[];
  postId: string;
  index: number;
  feedModerationHandler: (action: string, index: number, value: any) => void;
}
const PostHeader: React.FC<PostHeaderProps> = ({
  username,
  customTitle,
  imgUrl,
  createdAt,
  menuOptions,
  postId,
  feedModerationHandler,
  index
}) => {
  const [moreAnchorsMenu, setMoreOptionsMenu] = useState<HTMLElement | null>(null);
  const [reportTags, setReportTags] = useState([]);
  const [openDialogBox, setOpenDialog] = useState(false);
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
    return await lmFeedClient.pinPost(postId);
  }
  async function unpinPost() {
    return await lmFeedClient.pinPost(postId);
  }
  async function deletePost() {
    feedModerationHandler(DELETE_POST, index, null);
    return await lmFeedClient.deletePost(postId);
  }
  async function reportPost() {
    const tags = await lmFeedClient.getReportTags();
  }

  function closeEditPostDialog() {
    setOpenDialog(false);
  }
  function editPost() {
    feedModerationHandler(EDIT_POST, index, null);
  }
  function onClickHandler(event: React.MouseEvent) {
    switch (event.currentTarget.id) {
      case '2':
        return pinPost();
      case '3':
        return unpinPost();
      case '1':
        return deletePost();
      case '5':
        return editPost();
    }
    handleCloseMoreOptionsMenu();
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
  return (
    <div className="lmWrapper__feed__post__header">
      <div className="lmWrapper__feed__post__header--profile">{setUserImage()}</div>
      <div className="lmWrapper__feed__post__header--info">
        <div className="title">
          {transformUsername(username)}
          {customTitle.length ? <span>Admin</span> : null}
        </div>
        <div className="subTitle">
          Post <span>{dayjs(createdAt).fromNow()}</span>
        </div>
      </div>
      <div className="lmWrapper__feed__post__header--menu">
        <IconButton onClick={handleOpenMoreOptionsMenu}>
          <MoreHorizIcon />
        </IconButton>
        <Menu
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
          onClose={handleCloseMoreOptionsMenu}>
          {menuOptions?.map((menuItem: IMenuItem) => {
            return (
              <MenuItem onClick={onClickHandler} id={menuItem.id.toString()} key={menuItem.id}>
                {menuItem.title}
              </MenuItem>
            );
          })}
        </Menu>
      </div>
    </div>
  );
};

export default PostHeader;
