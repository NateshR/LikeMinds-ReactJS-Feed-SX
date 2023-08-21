import userImg from '../assets/images/user.png';
import { IMenuItem } from 'likeminds-sdk';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
import React, { useContext, useEffect, useState } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { lmFeedClient } from '..';
import { DELETE_POST } from '../services/feedModerationActions';
import UserContext from '../contexts/UserContext';
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
  // useEffect(() => {
  //   reportPost();
  // });
  function editPost() {}
  function onClickHandler(event: React.MouseEvent) {
    switch (event.currentTarget.id) {
      case '2':
        return pinPost();
      case '3':
        return unpinPost();
      case '1':
        return deletePost();
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
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'gray',
            display: 'inline-flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          {userContext.user?.name?.split(' ').map((part: string) => {
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
