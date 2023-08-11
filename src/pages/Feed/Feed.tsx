import React, { useEffect, useState } from 'react';
import CreatePost from '../../components/CreatePost';
import FeedFilter from '../../components/FeedFilter';
import Post from '../../components/Post';
import UserContext from '../../contexts/UserContext';
import { lmFeedClient } from '../..';
import DialogBox from '../../components/dialog/DialogBox';
import CreatePostDialog from '../../components/dialog/createPost/CreatePostDialog';
import { IPost, IUser } from 'likeminds-sdk';
const FeedComponent: React.FC = () => {
  const [user, setUser] = useState(null);
  const [feedPostsArray, setFeedPostsArray] = useState<IPost[]>([]);
  const [usersMap, setUsersMap] = useState<{ [key: string]: IUser }>({});
  function setAppUserState(user: any) {
    switch (user) {
      case null:
        return null;
      default:
        return (
          <div className="lmWrapper">
            <div className="lmWrapper__feed">
              {/* Create Post */}
              <CreatePost />
              {/* Create Post */}

              {/* Filter */}
              <FeedFilter />
              {/* Filter */}

              {/* Post */}
              {feedPostsArray.map((post: IPost, index: number) => {
                return <Post key={post.Id} post={post} user={usersMap[post.uuid]} />;
              })}
              {/* <Post /> */}
              {/* Post */}
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
      setUser(userResponse?.data?.user);
    }

    setUserState();
  }, []);
  useEffect(() => {
    if (!user) {
      return;
    }
    const getFeeds = async () => {
      let feeds = await lmFeedClient.fetchFeed();
      console.log(feeds);
      if (!feeds) {
        return;
      }
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
        setUser
      }}>
      {setAppUserState(user)}
    </UserContext.Provider>
  );
};

export default FeedComponent;
