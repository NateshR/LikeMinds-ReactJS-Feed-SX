// src/Header/Header.tsx

import React, { useEffect, useState } from 'react';
import './../assets/css/header.css';
import { Badge, IconButton, Menu } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { lmFeedClient } from '..';
import { IActivity, IUser } from 'likeminds-sdk';
import InfiniteScroll from 'react-infinite-scroll-component';
interface HeaderProps {
  user: any;
}
const Header: React.FC<HeaderProps> = ({ user }) => {
  const [notificationsCount, setNotificationsCount] = useState<string | number>(0);
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);
  const [activityArray, setActivityArray] = useState<IActivity[]>([]);
  const [hasMoreUnreadActivities, setHasMoreUnreadActivities] = useState<boolean>(true);
  const [userMap, setUserMap] = useState<IUser[]>([]);
  const [pageCount, setPageCount] = useState(1);
  useEffect(() => {
    async function getNotificationsCount() {
      try {
        const response: any = await lmFeedClient.getUnreadNotificationCount();
        const count = response?.data?.count;
        if (count > 99) setNotificationsCount(response?.data?.count + '+');
        else setNotificationsCount(count);
      } catch (error) {
        console.log(error);
      }
    }
    getNotificationsCount();
  }, [user]);

  async function getNotifications() {
    try {
      const response: any = await lmFeedClient.getNotificationFeed(pageCount);
      setActivityArray([...activityArray].concat(response?.data?.activities));
      setUserMap({ ...userMap, ...response?.data?.users });
      setPageCount(pageCount + 1);
      const newUnreadCount = parseInt(notificationsCount.toString()) - activityArray.length;
      if (newUnreadCount > 0) {
        setNotificationsCount(newUnreadCount);
      } else {
        setNotificationsCount(0);
      }
    } catch (error) {
      console.log(error);
    }
  }
  function renderNotification() {
    return (
      <Menu
        open={Boolean(notificationAnchor)}
        anchorEl={notificationAnchor}
        onClose={() => setNotificationAnchor(null)}
        id="activityHolder">
        {activityArray.length > 0 ? (
          <InfiniteScroll
            dataLength={activityArray.length}
            hasMore={hasMoreUnreadActivities}
            next={getNotifications}
            loader={null}
            scrollableTarget="activityHolder">
            {activityArray.map((activity: IActivity) => {
              return <>{'hello'}</>;
            })}
          </InfiniteScroll>
        ) : (
          <>Sanjay pls add css and required designs to this</>
        )}
      </Menu>
    );
  }
  return (
    <div className="headerWrapper">
      <div className="headerWrapper--notification">
        {notificationsCount ? (
          <IconButton
            className="headerWrapper__notification--notification"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              setNotificationAnchor(e.currentTarget);
              getNotifications();
              setNotificationsCount(0);
            }}>
            <Badge badgeContent={notificationsCount} color="primary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        ) : (
          // </Badge>
          <IconButton
            className="headerWrapper__notification--notification"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              setNotificationAnchor(e.currentTarget);
              getNotifications();
              setNotificationsCount(0);
            }}>
            <NotificationsIcon />
          </IconButton>
        )}
        {renderNotification()}
      </div>
    </div>
  );
};

export default Header;
