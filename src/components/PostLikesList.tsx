import { IMember } from '@likeminds.community/feed-js';
import React, { useContext, useEffect, useState } from 'react';
import { lmFeedClient } from '..';
import '../assets/css/all-members.css';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
  SHOW_POST_LIKES_BAR,
  UPDATE_LIKES_COUNT_DECREMENT,
  UPDATE_LIKES_COUNT_DECREMENT_POST,
  UPDATE_LIKES_COUNT_INCREMENT,
  UPDATE_LIKES_COUNT_INCREMENT_POST
} from '../services/feedModerationActions';
import { Drawer, Skeleton } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
interface PostLikesProps {
  postId: string;
  rightSidebarhandler: (action: string, value: any) => void;
  entityType: number;
  entityId: string | null;
  totalLikes: number;
  initiateAction?: any;
  feedModerationHandler?: any;
}
function PostLikesList({
  postId,
  rightSidebarhandler,
  entityType,
  entityId,
  totalLikes,
  initiateAction
}: PostLikesProps) {
  const [postLikesArray, setPostLikesArray] = useState<IMember[]>([]);
  const [commentLikesArray, setCommentLikesArray] = useState<IMember[]>([]);
  const [pageCount, setPageCount] = useState<number>(4);
  const [loadMore, setLoadMore] = useState<boolean>(true);
  const [totalMembers, setTotalMembers] = useState<number>(0);
  const [userMap, setUserMap] = useState<any>({});
  const userContext = useSelector((state: RootState) => state.currentUser);
  const [showLoadingBars, setShowLoadingBars] = useState<boolean>(true);

  // useEffect(() => {
  //     // console.log()
  //     handleActions();
  // }, [initiateAction?.action]);
  useEffect(() => {
    async function initiateLikesScreen() {
      await getAllMembersThrice();
      // handleActions();
    }
    initiateLikesScreen();
    return () => {
      setShowLoadingBars(true);
      setPostLikesArray([]);
      setCommentLikesArray([]);
      setPageCount(1);
    };
  }, [postId, entityId]);
  useEffect(() => {
    // console.log()
    handleActions();
  }, [initiateAction?.action]);
  function handleActions() {
    let newArr: any;
    if (entityType === 1) {
      newArr = [...postLikesArray];
    } else {
      newArr = [...commentLikesArray];
    }
    switch (initiateAction?.action) {
      case SHOW_POST_LIKES_BAR: {
        return;
      }
      case UPDATE_LIKES_COUNT_DECREMENT: {
        const index = commentLikesArray.findIndex(
          (member: any) => member.uuid === userContext.user?.uuid
        );
        newArr.splice(index, 1);
        setCommentLikesArray(newArr);
        break;
      }
      case UPDATE_LIKES_COUNT_INCREMENT: {
        newArr.push({
          uuid: userContext.user?.uuid,
          name: userContext.user?.name
        });
        setCommentLikesArray(newArr);
        break;
      }
      case UPDATE_LIKES_COUNT_DECREMENT_POST: {
        const index = postLikesArray.findIndex(
          (member: any) => member.uuid === userContext.user?.uuid
        );
        newArr.splice(index, 1);
        setPostLikesArray(newArr);
        break;
      }
      case UPDATE_LIKES_COUNT_INCREMENT_POST: {
        newArr.push({
          uuid: userContext.user?.uuid,
          name: userContext.user?.name
        });
        setPostLikesArray(newArr);
        break;
      }
    }

    setUserMap({ ...userMap, [userContext.user?.uuid.toString()!]: userContext.user });
  }
  async function getAllMembersThrice() {
    try {
      if (entityType === 1) {
        let r1: any = await lmFeedClient.getPostLikes(postId, 1);
        let r2: any = await lmFeedClient.getPostLikes(postId, 2);
        let r3: any = await lmFeedClient.getPostLikes(postId, 3);
        const membersArrayOne: IMember[] = r1?.data?.likes;
        const membersArrayTwo: IMember[] = r2?.data?.likes;
        const membersArrayThree: IMember[] = r3?.data?.likes;
        const membersObjectOne: IMember[] = r1?.data?.users;
        const membersObjectTwo: IMember[] = r2?.data?.users;
        const membersObjectThree: IMember[] = r3?.data?.users;
        setPostLikesArray([...membersArrayOne, ...membersArrayTwo, ...membersArrayThree]);
        setUserMap({ ...membersObjectOne, ...membersObjectTwo, ...membersObjectThree });
      } else {
        let r1: any = await lmFeedClient.getCommentLikes(postId, 1, entityId!);
        let r2: any = await lmFeedClient.getCommentLikes(postId, 2, entityId!);
        let r3: any = await lmFeedClient.getCommentLikes(postId, 3, entityId!);
        const membersArrayOne: IMember[] = r1?.data?.likes;
        const membersArrayTwo: IMember[] = r2?.data?.likes;
        const membersArrayThree: IMember[] = r3?.data?.likes;
        const membersObjectOne: IMember[] = r1?.data?.users;
        const membersObjectTwo: IMember[] = r2?.data?.users;
        const membersObjectThree: IMember[] = r3?.data?.users;
        setCommentLikesArray([...membersArrayOne, ...membersArrayTwo, ...membersArrayThree]);
        setUserMap({ ...membersObjectOne, ...membersObjectTwo, ...membersObjectThree });
      }
      setShowLoadingBars(false);
    } catch (error) {
      console.log(error);
    }
  }
  async function getAllMembers() {
    try {
      const response: any = await lmFeedClient.getPostLikes(postId, pageCount);
      const membersArray: IMember[] = response?.data?.members;
      if (!membersArray.length) {
        setLoadMore(false);
        return;
      }
      if (pageCount === 1) {
        setTotalMembers(response?.data?.totalMembers);
      }
      setPageCount(pageCount + 1);
      setPostLikesArray([...postLikesArray].concat([...membersArray]));
    } catch (error) {
      console.log(error);
    }
  }
  async function getAllMembersComment() {
    try {
      const response: any = await lmFeedClient.getCommentLikes(postId, pageCount, entityId!);
      const membersArray: IMember[] = response?.data?.members;
      if (!membersArray.length) {
        setLoadMore(false);
        return;
      }
      if (pageCount === 1) {
        setTotalMembers(response?.data?.totalMembers);
      }
      setPageCount(pageCount + 1);
      setCommentLikesArray([...postLikesArray].concat([...membersArray]));
    } catch (error) {
      console.log(error);
    }
  }

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
  function renderComponent() {
    switch (showLoadingBars) {
      case true:
        return Array(30)
          .fill(0)
          .map((value: number, index: number) => {
            return (
              <div className="noMemberSkeletonContainer" key={(Math.random() + index).toString()}>
                <Skeleton variant="circular" width={40} height={40} />
                <div className="textContentSkeleton">
                  <Skeleton variant="text" width={'80%'} />
                </div>
              </div>
            );
          });
      default:
        return renderMembersList();
    }
  }
  function renderMembersList() {
    switch (entityType) {
      case 1: {
        return postLikesArray.map((member: any) => {
          return (
            <div className="memberTile" key={member?.uuid}>
              <div className="memberTile__image">{setUserImage(userMap[member?.uuid])}</div>
              <div className="memberTile__profile">{userMap[member?.uuid].name}</div>
            </div>
          );
        });
      }
      case 2: {
        return commentLikesArray.map((member: any) => {
          return (
            <div className="memberTile" key={member?.uuid}>
              <div className="memberTile__image">{setUserImage(userMap[member?.uuid])}</div>
              <div className="memberTile__profile">{userMap[member?.uuid].name}</div>
            </div>
          );
        });
      }
    }
  }

  return (
    <Drawer
      anchor="right"
      open={true}
      onClose={() => {
        rightSidebarhandler(' ', null);
      }}>
      <div className="allMembers">
        {showLoadingBars ? (
          <div className="noMemberSkeletonContainer">
            <Skeleton variant="circular" width={40} height={40} />
            <div className="textContentSkeleton">
              <Skeleton variant="text" width={'80%'} />
            </div>
          </div>
        ) : (
          <div
            className="allMembers__header"
            style={{
              display: 'flex',
              justifyContent: 'space-between'
            }}>
            <div>
              Likes {'('}
              {totalLikes}
              {')'}
            </div>
            <div>
              <span
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  rightSidebarhandler(' ', null);
                }}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M0.477066 17.5254C0.898941 17.9356 1.59035 17.9356 1.98879 17.5254L8.9966 10.5176L16.0044 17.5254C16.4146 17.9356 17.106 17.9473 17.5161 17.5254C17.9263 17.1035 17.938 16.4121 17.5278 16.002L10.52 8.99416L17.5278 1.99806C17.938 1.58791 17.938 0.884781 17.5161 0.474625C17.0943 0.0644686 16.4146 0.0644686 16.0044 0.474625L8.9966 7.48244L1.98879 0.474625C1.59035 0.0644686 0.887223 0.0527498 0.477066 0.474625C0.06691 0.8965 0.06691 1.58791 0.477066 1.99806L7.47316 8.99416L0.477066 16.002C0.06691 16.4121 0.0551912 17.1152 0.477066 17.5254Z"
                    fill="#484F67"
                  />
                </svg>
              </span>
            </div>
          </div>
        )}
        <div className="allMembers__list" id="allMembersScrollWrapper">
          <InfiniteScroll
            loader={null}
            hasMore={loadMore}
            dataLength={entityType === 1 ? postLikesArray.length : commentLikesArray.length}
            next={entityType === 1 ? getAllMembers : getAllMembersComment}
            scrollableTarget="allMembersScrollWrapper">
            {renderComponent()}
          </InfiniteScroll>
        </div>
      </div>
    </Drawer>
  );
}

export default PostLikesList;
