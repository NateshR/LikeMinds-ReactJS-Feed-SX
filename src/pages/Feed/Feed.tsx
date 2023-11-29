import React, { useCallback, useEffect, useMemo, useState } from 'react';
import CreatePost from '../../components/CreatePost';
import FeedFilter from '../../components/FeedFilter';
import Post from '../../components/Post';
import { lmFeedClient } from '../..';
import DialogBox from '../../components/dialog/DialogBox';
import CreatePostDialog from '../../components/dialog/createPost/CreatePostDialog';
import { IPost, IUser, IMemberState, LMFeedTopics } from '@likeminds.community/feed-js';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CircularProgress, Dialog, Skeleton, Snackbar } from '@mui/material';
import {
  ADD_NEW_POST,
  ADD_POST_LOCALLY,
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
import { Route, Routes, useNavigate } from 'react-router-dom';
import PostDetails from '../../components/post-details';
import PostLikesList from '../../components/PostLikesList';
import '../../assets/css/skeleton-post.css';
import TopicFeedDropdownSelector from '../../components/topic-feed/select-feed-dropdown';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { setMemberState, setUser } from '../../store/currentUser/currentUserSlice';
import { addNewPosts, clearPosts, setNewFeedPosts } from '../../store/feedPosts/feedsSlice';
import { addNewTopics } from '../../store/topics/topicsSlice';
import { addNewUsers } from '../../store/users/usersSlice';
import { FeedPost } from '../../models/feedPost';
import { PostContext } from '../../contexts/postContext';
import { Topic } from '../../models/topics';
import { handleEditDialogState, hideSnackbar } from '../../store/snackbar/snackbarSlice';
import { setSelectedTopicsArray } from '../../store/extrasSlice/extraSlice';
interface FeedProps {
  setCallBack: React.Dispatch<((action: string, index: number, value: any) => void) | null>;
}
const FeedComponent: React.FC<FeedProps> = ({ setCallBack }) => {
  const user = useSelector((state: RootState) => state.currentUser.user);
  const memberStateRights = useSelector((state: RootState) => state.currentUser.memberState);
  const feedPosts = useSelector((state: RootState) => state.posts);
  const users = useSelector((state: RootState) => state.users);
  const topics = useSelector((state: RootState) => state.topics);
  const snackbarState = useSelector((state: RootState) => state.snackbar);
  const dispatch = useDispatch();
  // const [user, setUser] = useState(null);
  // const [memberStateRights, setMemberStateRights] = useState<IMemberState | null>(null);
  // const [feedPostsArray, setFeedPostsArray] = useState<IPost[]>([]);
  // const [usersMap, setUsersMap] = useState<{ [key: string]: IUser }>({});
  const [hasMoreFeed, setHasMoreFeed] = useState<boolean>(true);
  const [openSnackBar, setOpenSnackBar] = useState<boolean>(false);
  const [snackBarMessage, setSnackBarMessage] = useState<string>('');
  const [openDialogBox, setOpenDialogBox] = useState(false);
  const [tempPost, setTempPost] = useState<FeedPost | null>(null);
  const [pageCount, setPageCount] = useState<number>(1);
  const [sideBar, setSideBar] = useState<any>(null);
  const [selectedTopics, setSelectedTopics] = useState<null | string[]>(null);
  function setTopicsForTopicFeed(topics: null | LMFeedTopics[]) {
    const newSelectedTopics = topics?.map((topic) => {
      return topic.Id;
    });
    if (newSelectedTopics && newSelectedTopics.length) {
      setSelectedTopics(newSelectedTopics);
      dispatch(setSelectedTopicsArray(topics!));
    } else {
      setSelectedTopics(null);
      dispatch(setSelectedTopicsArray([]));
    }
    dispatch(clearPosts());
    setPageCount(1);
  }
  useEffect(() => {
    rightSidebarhandler('', null);
  }, []);
  const navigate = useNavigate();
  const getFeeds = async () => {
    let feeds;
    if (selectedTopics) {
      feeds = await lmFeedClient.fetchFeed(pageCount, selectedTopics);
    } else {
      feeds = await lmFeedClient.fetchFeed(pageCount);
    }
    if (!feeds) {
      setHasMoreFeed(false);
      return;
    }
    if (feeds.posts.length < 10) {
      setHasMoreFeed(false);
    }
    setPageCount(pageCount + 1);
    // setFeedPostsArray([...feedPostsArray].concat(feeds?.posts!));
    // setTopics({ ...topics, ...feeds.topics });
    // setUsersMap({ ...usersMap, ...feeds.users });
    console.log('The feeds are');
    console.log(feeds);
    dispatch(addNewPosts(feeds?.posts!));
    dispatch(addNewTopics(feeds.topics));
    dispatch(addNewUsers(feeds.users));
  };
  const feedModerationLocalHandler = (action: string, index: number, value: any) => {
    function reNewFeedArray(index: number, newFeedObject: FeedPost) {
      newFeedArray[index] = newFeedObject;
      dispatch(setNewFeedPosts(newFeedArray));
    }
    const newFeedArray = [...feedPosts];
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
        dispatch(setNewFeedPosts(newFeedArray));
        setOpenSnackBar(true);
        setSnackBarMessage('Post Deleted');
        break;
      }
      case EDIT_POST: {
        setOpenDialogBox(true);
        console.log(index);
        setTempPost(feedPosts[index]);
        break;
      }
      case SHOW_SNACKBAR: {
        setOpenSnackBar(true);
        setSnackBarMessage(value);
        break;
      }
      // add in CH
      case ADD_NEW_POST: {
        // const { post } = value;
        // const newFeedArray = [...feedPostsArray];
        // console.log(feedPostsArray);
        // const tempPost = newFeedArray.findIndex(
        //   (postObject) => postObject?.Id?.toString() === post?.tempId?.toString(0)
        // );
        // const newFeedsArray = [{ ...value.post }].concat([...feedPostsArray]);
        // const newTopics = { ...value.topics, ...topics };
        // setFeedPostsArray(newFeedsArray);
        // setTopics(newTopics);
        break;
      }
      case ADD_POST_LOCALLY: {
        // console.log('locallyb adding: ', value.post);
        // const newFeedsArray = [{ ...value.post }].concat([...feedPostsArray]);
        // const newTopics = { ...value.topics, ...topics };
        // setFeedPostsArray(newFeedsArray);
        // setTopics(newTopics);
        break;
      }
      default:
        return null;
    }
  };
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
    switch (feedPosts.length) {
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
        return feedPosts.map((post: FeedPost, index: number) => {
          const postTopics: Record<string, Topic> = {};
          post?.topics?.forEach((topicId: string) => {
            postTopics[topicId] = topics[topicId];
          });
          return (
            <PostContext.Provider
              key={post.Id}
              value={{
                post,
                topics: postTopics,
                user: users,
                index: index
              }}>
              <Post rightSidebarHandler={rightSidebarhandler} />
            </PostContext.Provider>
          );
        });
    }
  }

  useEffect(() => setCallBack(feedModerationLocalHandler), [feedModerationLocalHandler]);
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
                dataLength={feedPosts.length + 2}
                scrollThreshold={0.8}
                hasMore={hasMoreFeed}
                loader={(() => {
                  return <CircularProgress />;
                })()}
                next={() => {
                  getFeeds();
                }}>
                <CreatePost feedModerationHandler={feedModerationLocalHandler} />
                {/* Create Post */}

                {/* Filter */}
                {/* <FeedFilter /> */}
                <div className="lmWrapper__feed__filter">
                  <TopicFeedDropdownSelector setTopicsForTopicFeed={setTopicsForTopicFeed} />
                </div>
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
      dispatch(setMemberState(memberStateResponse.data));
      dispatch(setUser(userResponse?.data?.user));
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

    // setFeedPostsArray([]);
    getFeeds();
  }, [user, selectedTopics]);
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
    <>
      {/* {setHeader()} */}
      <Routes>
        <Route path="/" element={<>{setAppUserState(user)}</>} />
        <Route
          path="/post/:postId"
          element={
            <div className="main">
              <PostDetails rightSidebarHandler={rightSidebarhandler} rightSideBar={sideBar} />
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
      <Snackbar
        open={snackbarState.showSnackbar}
        onClose={() => {
          dispatch(hideSnackbar());
        }}
        autoHideDuration={3000}
        message={snackbarState.message}
      />
      <Dialog
        open={snackbarState.openEditDialogBox}
        onClose={() => dispatch(handleEditDialogState(false))}
        PaperProps={{
          sx: {
            borderRadius: '16px'
          }
        }}>
        <EditPost closeCreatePostDialog={() => dispatch(handleEditDialogState(false))} />
      </Dialog>
    </>
  );
};

export default FeedComponent;
