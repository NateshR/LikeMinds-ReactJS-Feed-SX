import React, { useEffect, useState } from 'react';
import '../../assets/css/post-details-header.css';
import backIcon from '../../assets/images/postDetailsBackIcon.png';
import Post from '../Post';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { IPost, IUser } from 'likeminds-sdk';
import { lmFeedClient } from '../..';
import AllMembers from '../AllMembers';
interface PostDetailsProps {
  callBack: ((action: string, index: number, value: any) => void) | null;
  feedArray: IPost[];
  users: { [key: string]: IUser };
}
interface UseParamsProps {
  index: number;
  user: IUser;
  post: IPost;
}
function PostDetails({ callBack, feedArray, users }: PostDetailsProps) {
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  if (!location.state) {
    return null;
  }
  const { index = 0 } = location.state;
  const [post, setPost] = useState<IPost | null>(null);
  const [user, setUser] = useState<null | IUser>(null);
  useEffect(() => {
    async function setPostDetails() {
      try {
        console.log(params);
        let newPost: any = feedArray.find((post: IPost) => post.Id === params.postId);

        const resp: any = await lmFeedClient.getPostDetails(params.postId!, 1);
        newPost = resp.data.post;

        setPost(newPost!);
        setUser(resp.data.users[newPost.uuid]);
      } catch (error) {
        console.log(error);
      }
    }
    setPostDetails();
  }, [params]);
  if (!post && !user) {
    return null;
  }
  return (
    <div>
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
          <div className="lmWrapper__feed">
            <div className="postDetailsContentWrapper">
              <Post index={index} feedModerationHandler={callBack!} post={post!} user={user!} />
            </div>
          </div>
        </div>
        <div className="lmWrapper__allMembers">
          <AllMembers />
        </div>
      </div>
      {/* </div> */}
    </div>
  );
}

export default PostDetails;
