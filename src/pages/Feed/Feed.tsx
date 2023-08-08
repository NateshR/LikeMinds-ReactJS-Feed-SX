import React, { useEffect, useState } from 'react';
import CreatePost from '../../components/CreatePost';
import FeedFilter from '../../components/FeedFilter';
import Post from '../../components/Post';
import UserContext from '../../contexts/UserContext';
import { lmFeedClient } from '../..';
import DialogBox from '../../components/dialog/DialogBox';
import CreatePostDialog from '../../components/dialog/createPost/CreatePostDialog';

const FeedComponent: React.FC = () => {
  const [user, setUser] = useState(null);
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
              <Post />
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
