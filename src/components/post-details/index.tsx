import React, { useEffect, useState } from 'react';
import '../../assets/css/post-details-header.css';
import backIcon from '../../assets/images/postDetailsBackIcon.png';
import Post from '../Post';
import { useNavigate, useParams } from 'react-router-dom';
import { lmFeedClient } from '../../client';
import AllMembers from '../AllMembers';
import { POST_DOESNT_EXISTS, SHOW_SNACKBAR } from '../../services/feedModerationActions';
import { CircularProgress } from '@mui/material';
import { User } from '../../models/User';
import { FeedPost } from '../../models/feedPost';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { showSnackbar } from '../../store/snackbar/snackbarSlice';
import { Topic } from '../../models/topics';
import { PostContext } from '../../contexts/postContext';
import SeePostLikes from '../SeePostLikes';
interface PostDetailsProps {
  rightSidebarHandler: (action: string, value: any) => void;
  rightSideBar: any;
}

function PostDetails({ rightSidebarHandler, rightSideBar }: PostDetailsProps) {
  const params = useParams();
  const navigate = useNavigate();
  const feedPosts = useSelector((state: RootState) => state.posts);
  // const users = useSelector((state: RootState) => state.users);
  // const topics = useSelector((state: RootState) => state.topics);
  const dispatch = useDispatch();
  const [post, setPost] = useState<FeedPost | null>(null);
  const [user, setUser] = useState<null | Record<string, User>>(null);
  const [topics, setTopics] = useState<Record<string, Topic> | null>(null);
  const [index, setIndex] = useState<number | null>(null);
  useEffect(() => {
    async function setPostDetails() {
      try {
        const postIndex = feedPosts.findIndex((feed: FeedPost) => {
          feed.Id.toString() === params?.postId?.toString();
        });
        // setting the index of the current post if it exists in the locally saved posts array.
        setIndex(postIndex === -1 ? null : postIndex);
        const resp: any = await lmFeedClient.getPostDetails(params.postId!, 1);
        if (resp?.data === null) {
          dispatch(showSnackbar(POST_DOESNT_EXISTS));
          navigate('/');
        }
        const newPost = resp?.data?.post;
        setPost(newPost!);
        setUser(resp?.data?.users);
        setTopics(resp?.data?.topics);
      } catch (error) {
        dispatch(showSnackbar(POST_DOESNT_EXISTS));
        navigate('/');
      }
    }

    if (params?.postId && feedPosts.length) {
      setPostDetails();
    }
    return () => {
      setPost(null);
      setUser(null);
    };
  }, [params.postId, feedPosts]);

  return (
    <div
      id="postDetailsContainer"
      style={{
        maxHeight: '100vh',
        overflowY: 'auto'
      }}>
      <div className="lmWrapper">
        <div
          style={{
            flexGrow: 1
          }}>
          <div className="postDetailsHeaderWrapper">
            <div
              className="postDetailsHeaderWrapper--backIconHolder"
              onClick={() => {
                //   navigate('/');
                window.history.back();
              }}>
              <img src={backIcon} alt="back icon" />
            </div>
            <div className="postDetailsHeaderWrapper--toolBarArea">
              <span>Back to Feed</span>
            </div>
          </div>
          {post && user ? (
            <div className="lmWrapper__feed">
              <div className="postDetailsContentWrapper">
                <PostContext.Provider
                  value={{
                    post,
                    user,
                    topics,
                    index
                  }}>
                  <Post rightSidebarHandler={rightSidebarHandler} />
                </PostContext.Provider>
              </div>
            </div>
          ) : (
            <div className="progressContainer">
              <CircularProgress />
            </div>
          )}
        </div>

        <div className="lmWrapper__allMembers">{rightSideBar}</div>
      </div>
      {/* </div> */}
    </div>
  );
}

export default PostDetails;
