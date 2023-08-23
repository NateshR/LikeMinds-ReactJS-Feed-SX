// src/Header/Header.tsx

import React, { useEffect, useState } from 'react';
import './../assets/css/header.css';
import { Badge, IconButton, Menu, MenuItem } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { lmFeedClient } from '..';
import { IActivity, IUser } from 'likeminds-sdk';
import InfiniteScroll from 'react-infinite-scroll-component';
import noNotification from '../assets/images/default.svg';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import MoreVertIcon from '@mui/icons-material/MoreVert';
dayjs.extend(relativeTime);
interface HeaderProps {
  // user: any;
}
interface MatchPattern {
  type: number;
  displayName?: string;
  routeId?: string;
  link?: string;
}
const Header: React.FC<HeaderProps> = () => {
  const [notificationsCount, setNotificationsCount] = useState<string | number>(0);
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);
  const [activityArray, setActivityArray] = useState<IActivity[]>([]);
  const [hasMoreUnreadActivities, setHasMoreUnreadActivities] = useState<boolean>(true);
  const [userMap, setUserMap] = useState<{ [key: string]: IUser }>({});
  const [pageCount, setPageCount] = useState(1);
  const [user, setUser] = useState<null | IUser>();
  const [menuAnchor, setMenuAnchor] = useState<HTMLButtonElement | null>(null);
  function convertTextToHTML(text: string) {
    const regex = /<<.*?>>|(?:https?|ftp):\/\/[^\s/$.?#].[^\s]*|www\.[^\s/$.?#].[^\s]*/g;
    const matches = text.match(regex) || [];
    const splits = text.split(regex);

    const container = document.createElement('div');

    for (let i = 0; i < splits.length; i++) {
      const splitNode = document.createTextNode(splits[i]);
      container.appendChild(splitNode);

      if (matches[i]) {
        const text = matches[i];
        const getInfoPattern = /<<([^|]+)\|([^>>]+)>>/;
        const match = text.match(getInfoPattern);
        const userObject: MatchPattern = {
          type: 1
        };
        if (match) {
          const userName = match[1];
          const userId = match[2];
          userObject.displayName = userName;
          userObject.routeId = userId;
        } else {
          userObject.type = 2;
          userObject.link = text;
        }
        if (userObject.type === 1) {
          const matchText = matches[i].slice(2, -2); // Remove '<<' and '>>'
          const linkNode = document.createElement('a');
          linkNode.href = '#'; // You can set the appropriate URL here
          linkNode.textContent = userObject.displayName!;
          linkNode.id = userObject.routeId!;
          container.appendChild(linkNode);
        } else {
          const linkNode = document.createElement('a');
          linkNode.target = '_blank';
          let url = userObject.link;
          if (!url?.startsWith('http://') && !url?.startsWith('https://')) {
            url = 'http://' + url;
          }

          linkNode.href = url!; // You can set the appropriate URL here
          linkNode.textContent = userObject.link!;
          container.appendChild(linkNode);
        }
      }
    }

    return container;
  }
  useEffect(() => {
    document.addEventListener('USER_INITIATED', (e: any) => {
      setUser(e.detail);
    });
    return () =>
      document.removeEventListener('USER_INITIATED', (e: any) => {
        setUser(e.detail);
      });
  });
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
  function setUserImage(user: any) {
    if (!user) {
      return null;
    }
    const imageLink = user?.imageUrl;
    if (imageLink !== '') {
      return (
        <img
          src={imageLink}
          alt={user?.imageUrl}
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
          {user?.name?.split(' ').map((part: string) => {
            return part.charAt(0)?.toUpperCase();
          })}
        </span>
      );
    }
  }
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
  function handleNotification(activity: IActivity) {
    lmFeedClient.markReadNotification(activity.Id);
    switch (activity.action) {
      case 10: {
        window.open(`/${activity.Id}`, '_blank');
      }
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
            <div className="lmNotification">
              <div className="title">Notification</div>
              {activityArray.map((activity: IActivity) => {
                return (
                  <div
                    key={activity.Id}
                    className="customMenuItem"
                    onClick={() => handleNotification(activity)}
                    style={{
                      background: activity.isRead ? 'none' : 'gray'
                    }}>
                    <div className="notificationIist">
                      <div className="notiImg">
                        {setUserImage(userMap[activity.actionBy[activity.actionBy.length - 1]])}
                      </div>
                      <div
                        className="lmNoti"
                        dangerouslySetInnerHTML={{
                          __html: convertTextToHTML(activity.activityText).innerHTML
                        }}></div>
                      <div className="notiTime">{dayjs(activity.updatedAt).fromNow()}</div>
                    </div>
                    <IconButton
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                        setMenuAnchor(e.currentTarget)
                      }>
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      open={Boolean(menuAnchor)}
                      onClose={() => setMenuAnchor(null)}
                      anchorEl={menuAnchor}>
                      <div>REMOVE THIS NOTIFICATION</div>
                      <div>MUTE THIS NOTIFICATION</div>
                    </Menu>
                  </div>
                );
              })}
            </div>
          </InfiniteScroll>
        ) : (
          <div className="lmNoNotification">
            <img src={noNotification} alt="default image" />
            Oops! You do not have any no notifications yet.
          </div>
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
