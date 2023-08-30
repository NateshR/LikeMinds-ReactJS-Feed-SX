import React, { useEffect, useMemo, useState } from 'react';
import CreatePost from '../../components/CreatePost';
import FeedFilter from '../../components/FeedFilter';
import Post from '../../components/Post';
import UserContext from '../../contexts/UserContext';
import { lmFeedClient } from '../..';
import DialogBox from '../../components/dialog/DialogBox';
import CreatePostDialog from '../../components/dialog/createPost/CreatePostDialog';
import { IPost, IUser, IMemberState } from '@likeminds.community/feed-js';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CircularProgress, Dialog, Skeleton, Snackbar } from '@mui/material';
import {
  DELETE_POST,
  EDIT_POST,
  LIKE_POST,
  REFRESH_LIKES_LIST,
  SAVE_POST,
  SHOW_COMMENTS_LIKES_BAR,
  SHOW_POST_LIKES_BAR,
  SHOW_SNACKBAR,
  UPDATE_LIKES_COUNT_DECREMENT,
  UPDATE_LIKES_COUNT_DECREMENT_POST,
  UPDATE_LIKES_COUNT_INCREMENT,
  UPDATE_LIKES_COUNT_INCREMENT_POST
} from '../../services/feedModerationActions';
import Header from '../../components/Header';
import EditPost from '../../components/dialog/editPost/EditPost';
import AllMembers from '../../components/AllMembers';
import LMFeedClient from '@likeminds.community/feed-js';
import { Route, Routes, useNavigate } from 'react-router-dom';
import PostDetails from '../../components/post-details';
import PostLikesList from '../../components/PostLikesList';
import '../../assets/css/skeleton-post.css';
interface FeedProps {
  setCallBack: React.Dispatch<((action: string, index: number, value: any) => void) | null>;
}
const FeedComponent: React.FC<FeedProps> = ({ setCallBack }) => {
  const [user, setUser] = useState(null);
  const [memberStateRights, setMemberStateRights] = useState<IMemberState | null>(null);
  const [feedPostsArray, setFeedPostsArray] = useState<IPost[]>([]);
  const [usersMap, setUsersMap] = useState<{ [key: string]: IUser }>({});
  const [hasMoreFeed, setHasMoreFeed] = useState<boolean>(true);
  const [openSnackBar, setOpenSnackBar] = useState<boolean>(false);
  const [snackBarMessage, setSnackBarMessage] = useState<string>('');
  const [openDialogBox, setOpenDialogBox] = useState(false);
  const [tempPost, setTempPost] = useState<IPost | null>(null);
  const [pageCount, setPageCount] = useState<number>(1);
  const [sideBar, setSideBar] = useState<any>(null);
  useEffect(() => {
    rightSidebarhandler('', null);
  }, []);
  const navigate = useNavigate();
  const getFeeds = async (pgNo: number) => {
    let feeds = await lmFeedClient.fetchFeed(pageCount);
    if (!feeds) {
      setHasMoreFeed(false);
      return;
    }
    if (feeds.posts.length < 10) {
      setHasMoreFeed(false);
    }
    setPageCount(pageCount + 1);
    setFeedPostsArray([...feedPostsArray].concat(feeds?.posts!));
    setUsersMap({ ...usersMap, ...feeds.users });
  };
  function feedModerationLocalHandler(action: string, index: number, value: any) {
    function reNewFeedArray(index: number, newFeedObject: IPost) {
      newFeedArray[index] = newFeedObject;
      setFeedPostsArray(newFeedArray);
    }
    const newFeedArray = [...feedPostsArray];
    const newFeedObject = { ...newFeedArray[index] };
    switch (action) {
      case LIKE_POST: {
        newFeedObject.isLiked = value;
        if (value) {
          newFeedObject.likesCount++;
        } else {
          newFeedObject.likesCount--;
        }
        reNewFeedArray(index, newFeedObject);
        setOpenSnackBar(true);
        setSnackBarMessage('Post Liked');
        break;
      }
      case SAVE_POST: {
        newFeedObject.isSaved = value;
        reNewFeedArray(index, newFeedObject);
        setOpenSnackBar(true);
        setSnackBarMessage('Post Saved');
        break;
      }
      case DELETE_POST: {
        newFeedArray.splice(index, 1);
        setFeedPostsArray(newFeedArray);
        setOpenSnackBar(true);
        setSnackBarMessage('Post Deleted');
        break;
      }
      case EDIT_POST: {
        setOpenDialogBox(true);
        setTempPost(feedPostsArray[index]);
        break;
      }
      case SHOW_SNACKBAR: {
        setOpenSnackBar(true);
        setSnackBarMessage(value);
        break;
      }
      default:
        return null;
    }
  }
  function rightSidebarhandler(action: string, value: any) {
    action;
    switch (action) {
      case SHOW_POST_LIKES_BAR: {
        setSideBar(
          <PostLikesList
            postId={value.postId}
            rightSidebarhandler={rightSidebarhandler}
            entityType={1}
            entityId={null}
            totalLikes={value.totalLikes}
          />
        );
        break;
      }
      case SHOW_COMMENTS_LIKES_BAR: {
        setSideBar(
          <PostLikesList
            postId={value.postId}
            rightSidebarhandler={rightSidebarhandler}
            entityType={2}
            entityId={value.commentId}
            totalLikes={value.totalLikes}
          />
        );
        break;
      }
      case UPDATE_LIKES_COUNT_INCREMENT: {
        setSideBar(
          <PostLikesList
            postId={value.postId}
            rightSidebarhandler={rightSidebarhandler}
            entityType={2}
            entityId={value.commentId}
            totalLikes={value.totalLikes}
            initiateAction={{
              action: UPDATE_LIKES_COUNT_INCREMENT
            }}
          />
        );
        break;
      }
      case UPDATE_LIKES_COUNT_DECREMENT: {
        setSideBar(
          <PostLikesList
            postId={value.postId}
            rightSidebarhandler={rightSidebarhandler}
            entityType={2}
            entityId={value.commentId}
            totalLikes={value.totalLikes}
            initiateAction={{
              action: UPDATE_LIKES_COUNT_DECREMENT
            }}
          />
        );
        break;
      }
      case UPDATE_LIKES_COUNT_INCREMENT_POST: {
        setSideBar(
          <PostLikesList
            postId={value.postId}
            rightSidebarhandler={rightSidebarhandler}
            entityType={1}
            entityId={null}
            totalLikes={value.totalLikes}
            initiateAction={{
              action: UPDATE_LIKES_COUNT_INCREMENT
            }}
          />
        );
        break;
      }
      case UPDATE_LIKES_COUNT_DECREMENT_POST: {
        setSideBar(
          <PostLikesList
            postId={value.postId}
            rightSidebarhandler={rightSidebarhandler}
            entityType={1}
            entityId={null}
            totalLikes={value.totalLikes}
            initiateAction={{
              action: UPDATE_LIKES_COUNT_DECREMENT
            }}
          />
        );
        break;
      }
      default:
        setSideBar(<AllMembers />);
    }
  }

  function setFeedPosts() {
    switch (feedPostsArray.length) {
      case 0:
        return Array(10)
          .fill(0)
          .map((val: number) => {
            return (
              <div className="skeletonPostContainer" key={(Math.random() + val).toString()}>
                <div className="skeletonHeader">
                  <Skeleton variant="circular" width={40} height={40} />
                  <Skeleton
                    sx={{
                      marginX: '16px'
                    }}
                    variant="text"
                    width={'40%'}
                  />
                </div>
                <div className="skeletonContent">
                  <Skeleton variant="rounded" width={'100%'} height={150} />
                </div>
              </div>
            );
          });
      default:
        return feedPostsArray.map((post: IPost, index: number) => {
          return (
            <Post
              key={post.Id}
              post={post}
              user={usersMap[post.uuid]}
              feedModerationHandler={feedModerationLocalHandler}
              index={index}
              rightSidebarHandler={rightSidebarhandler}
            />
          );
        });
    }
  }

  useMemo(() => setCallBack(feedModerationLocalHandler), [feedModerationLocalHandler]);
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
                <CreatePost setFeedArray={setFeedPostsArray} feedArray={feedPostsArray} />
                {/* Create Post */}

                {/* Filter */}
                {/* <FeedFilter /> */}
                {/* Filter */}

                {/* Post */}
                {setFeedPosts()}
                {/* <Post /> */}
                {/* Post */}
              </InfiniteScroll>
            </div>
            <div className="lmWrapper__allMembers">{sideBar}</div>
          </div>
        );
    }
  }

  useEffect(() => {
    async function setUserState() {
      const userResponse = await lmFeedClient.initiateUser('', false);
      const memberStateResponse: any = await lmFeedClient.getMemberState();
      setMemberStateRights(memberStateResponse.data);
      setUser(userResponse?.data?.user);
      const event = new CustomEvent('USER_INITIATED', {
        detail: userResponse?.data?.user
      });
      document.dispatchEvent(event);
    }

    setUserState();
  }, []);
  useEffect(() => {
    if (!user) {
      return;
    }
    const getFeeds = async () => {
      let feeds = await lmFeedClient.fetchFeed(pageCount);
      if (!feeds) {
        setHasMoreFeed(false);
        return;
      }
      if (feeds.posts.length < 10) {
        setHasMoreFeed(false);
      }
      setPageCount(pageCount + 1);
      setFeedPostsArray(feeds?.posts!);
      setUsersMap(feeds.users);
      // feeds?.posts.
    };

    getFeeds();
  }, [user]);
  useEffect(() => {
    document.addEventListener('NOTIFICATION', handleNotificationAction);

    return () => document.removeEventListener('NOTIFICATION', handleNotificationAction);
  });
  async function handleNotificationAction(e: any) {
    navigate(`/post/${e.detail}`);
  }
  if (!user) {
    return null;
  }
  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        memberStateRights
      }}>
      {/* {setHeader()} */}
      <Routes>
        <Route path="/" element={<>{setAppUserState(user)}</>} />
        <Route
          path="/post/:postId"
          element={
            <div className="main">
              <PostDetails
                rightSidebarHandler={rightSidebarhandler}
                callBack={feedModerationLocalHandler}
                feedArray={feedPostsArray}
                users={usersMap}
                rightSideBar={sideBar}
              />
            </div>
          }
        />
      </Routes>

      <Snackbar
        open={openSnackBar}
        onClose={() => {
          setOpenSnackBar(false);
        }}
        autoHideDuration={3000}
        message={snackBarMessage}
      />
      <Dialog open={openDialogBox} onClose={() => setOpenDialogBox(false)}>
        <EditPost
          feedArray={feedPostsArray}
          setFeedArray={setFeedPostsArray}
          closeCreatePostDialog={() => setOpenDialogBox(false)}
          post={tempPost}
        />
      </Dialog>
    </UserContext.Provider>
  );
};

export default FeedComponent;
