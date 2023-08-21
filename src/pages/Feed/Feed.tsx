import React, { useEffect, useState } from 'react';
import CreatePost from '../../components/CreatePost';
import FeedFilter from '../../components/FeedFilter';
import Post from '../../components/Post';
import UserContext from '../../contexts/UserContext';
import { lmFeedClient } from '../..';
import DialogBox from '../../components/dialog/DialogBox';
import CreatePostDialog from '../../components/dialog/createPost/CreatePostDialog';
import { IPost, IUser, IMemberState } from 'likeminds-sdk';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CircularProgress } from '@mui/material';
import { DELETE_POST, LIKE_POST, SAVE_POST } from '../../services/feedModerationActions';
import Header from '../../components/Header';

const FeedComponent: React.FC = () => {
  const [user, setUser] = useState(null);
  const [memberStateRights, setMemberStateRights] = useState<IMemberState | null>(null);
  const [feedPostsArray, setFeedPostsArray] = useState<IPost[]>([]);
  const [usersMap, setUsersMap] = useState<{ [key: string]: IUser }>({});
  const [hasMoreFeed, setHasMoreFeed] = useState<boolean>(true);
  const getFeeds = async (pgNo: number) => {
    let feeds = await lmFeedClient.fetchFeed(pgNo);
    if (!feeds) {
      setHasMoreFeed(false);
      return;
    }
    if (feeds.posts.length < 10) {
      setHasMoreFeed(false);
    }

    setFeedPostsArray([...feedPostsArray].concat(feeds?.posts!));
    setUsersMap({ ...usersMap, ...feeds.users });
    // feeds?.posts.
  };
  function feedModerationLocalHandler(action: string, index: number, value: any) {
    function reNewFeedArray(index: number, newFeedObject: IPost) {
      newFeedArray[index] = newFeedObject;
      setFeedPostsArray(newFeedArray);
    }
    const newFeedArray = [...feedPostsArray];
    const newFeedObject = { ...newFeedArray[index] };
    switch (action) {
      // For hadling likes/dislikes by user
      case LIKE_POST: {
        newFeedObject.isLiked = value;
        if (value) {
          newFeedObject.likesCount++;
        } else {
          newFeedObject.likesCount--;
        }
        reNewFeedArray(index, newFeedObject);
        break;
      }
      case SAVE_POST: {
        newFeedObject.isSaved = value;
        reNewFeedArray(index, newFeedObject);
        break;
      }
      case DELETE_POST: {
        newFeedArray.splice(index, 1);
        setFeedPostsArray(newFeedArray);
        break;
      }
      default:
        return null;
    }
  }
  function setHeader() {
    switch (user) {
      case null:
        return null;
      default:
        return (
          <div className="header">
            <Header />
          </div>
        );
    }
  }
  function setAppUserState(user: any) {
    switch (user) {
      case null:
        return null;
      default:
        return (
          <div className="lmWrapper">
            <div className="lmWrapper__feed">
              {/* Create Post */}
              <InfiniteScroll
                dataLength={feedPostsArray.length + 2}
                scrollThreshold={0.8}
                hasMore={hasMoreFeed}
                loader={(() => {
                  return <CircularProgress />;
                })()}
                next={() => {
                  let pg = feedPostsArray.length / 10;
                  getFeeds(pg + 1);
                }}>
                <CreatePost />
                {/* Create Post */}

                {/* Filter */}
                {/* <FeedFilter /> */}
                {/* Filter */}

                {/* Post */}
                {feedPostsArray.map((post: IPost, index: number) => {
                  return (
                    <Post
                      key={post.Id}
                      post={post}
                      user={usersMap[post.uuid]}
                      feedModerationHandler={feedModerationLocalHandler}
                      index={index}
                    />
                  );
                })}
                {/* <Post /> */}
                {/* Post */}
              </InfiniteScroll>
            </div>
          </div>
        );
    }
  }

  useEffect(() => {
    async function setUserState() {
      const userResponse = await lmFeedClient.initiateUser(
        '28f7f107-5916-4cce-bbb7-4ee48b35e64d',
        false
      );
      const memberStateResponse: any = await lmFeedClient.getMemberState();
      setMemberStateRights(memberStateResponse.data);
      setUser(userResponse?.data?.user);
    }

    setUserState();
  }, []);
  useEffect(() => {
    if (!user) {
      return;
    }
    const getFeeds = async () => {
      let feeds = await lmFeedClient.fetchFeed(1);
      if (!feeds) {
        setHasMoreFeed(false);
        return;
      }
      if (feeds.posts.length < 10) {
        setHasMoreFeed(false);
      }
      console.log(feeds);
      setFeedPostsArray(feeds?.posts!);
      setUsersMap(feeds.users);
      // feeds?.posts.
    };

    getFeeds();
  }, [user]);
  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        memberStateRights
      }}>
      {setHeader()}
      {setAppUserState(user)}
    </UserContext.Provider>
  );
};

export default FeedComponent;
