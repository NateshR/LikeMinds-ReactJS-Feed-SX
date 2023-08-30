import React, { useEffect, useState } from 'react';
import '../../assets/css/post-details-header.css';
import backIcon from '../../assets/images/postDetailsBackIcon.png';
import Post from '../Post';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { IPost, IUser } from '@likeminds.community/feed-js';
import { lmFeedClient } from '../..';
import AllMembers from '../AllMembers';
import { SHOW_SNACKBAR } from '../../services/feedModerationActions';
import { CircularProgress } from '@mui/material';
interface PostDetailsProps {
  callBack: ((action: string, index: number, value: any) => void) | null;
  feedArray: IPost[];
  users: { [key: string]: IUser };
  rightSidebarHandler: (action: string, value: any) => void;
  rightSideBar: any;
}
interface UseParamsProps {
  index: number;
  user: IUser;
  post: IPost;
}
function PostDetails({ callBack, feedArray, rightSidebarHandler, rightSideBar }: PostDetailsProps) {
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState<IPost | null>(null);
  const [user, setUser] = useState<null | IUser>(null);
  const [index, setIndex] = useState<number | null>(null);
  useEffect(() => {
    async function setPostDetails() {
      try {
        let newPostIndex: any = feedArray.findIndex((post: IPost) => post.Id === params.postId);
        let newPost: any;
        setIndex(newPostIndex);
        const resp: any = await lmFeedClient.getPostDetails(params.postId!, 1);
        if (resp?.data === null) {
          navigate('/');
          callBack!(SHOW_SNACKBAR, 0, 'The Post does not exists anymore');
        }
        newPost = resp?.data?.post;
        setPost(newPost!);
        setUser(resp?.data?.users[newPost?.uuid]);
      } catch (error) {
        alert('Post Doesnt Exist');
        navigate('/');
        callBack!(SHOW_SNACKBAR, 0, 'The Post does not exists anymore');
      }
    }
    if (params?.postId) {
      setPostDetails();
    }
    return () => {
      setPost(null);
      setUser(null);
    };
  }, [params.postId]);

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
                <Post
                  index={index!}
                  feedModerationHandler={callBack!}
                  post={post!}
                  user={user!}
                  rightSidebarHandler={rightSidebarHandler}
                />
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
