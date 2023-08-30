import { IMember } from '@likeminds.community/feed-js';
import React, { useContext, useEffect, useState } from 'react';
import { lmFeedClient } from '..';
import '../assets/css/all-members.css';
import InfiniteScroll from 'react-infinite-scroll-component';
import UserContext from '../contexts/UserContext';
import {
  UPDATE_LIKES_COUNT_DECREMENT,
  UPDATE_LIKES_COUNT_INCREMENT,
  UPDATE_LIKES_COUNT_INCREMENT_POST
} from '../services/feedModerationActions';
interface PostLikesProps {
  postId: string;
  rightSidebarhandler: (action: string, value: any) => void;
  entityType: number;
  entityId: string | null;
  totalLikes: number;
  initiateAction?: any;
}
function PostLikesList({
  postId,
  rightSidebarhandler,
  entityType,
  entityId,
  totalLikes,
  initiateAction
}: PostLikesProps) {
  const [allMembersArray, setAllMembersArray] = useState<IMember[]>([]);
  const [pageCount, setPageCount] = useState<number>(4);
  const [loadMore, setLoadMore] = useState<boolean>(true);
  const [totalMembers, setTotalMembers] = useState<number>(0);
  const [userMap, setUserMap] = useState<any>({});
  const userContext = useContext(UserContext);
  useEffect(() => {
    getAllMembersThrice();
  }, [postId, entityId]);
  useEffect(() => {
    if (
      initiateAction?.action === UPDATE_LIKES_COUNT_INCREMENT ||
      initiateAction?.action === UPDATE_LIKES_COUNT_DECREMENT
    ) {
      const index = allMembersArray.findIndex(
        (member: any) => member.uuid === userContext.user?.uuid
      );
      const newArr: any = [...allMembersArray];
      if (initiateAction?.action === UPDATE_LIKES_COUNT_INCREMENT) {
        newArr.push({
          uuid: userContext.user?.uuid,
          name: userContext.user?.name
        });
      } else {
        newArr.splice(index, 1);
      }
      setAllMembersArray(newArr);

      setUserMap({ ...userMap, [userContext.user?.uuid]: userContext.user });
    } else {
      const index = allMembersArray.findIndex(
        (member: any) => member.uuid === userContext.user?.uuid
      );
      const newArr: any = [...allMembersArray];
      if (initiateAction?.action === UPDATE_LIKES_COUNT_INCREMENT_POST) {
        newArr.push({
          uuid: userContext.user?.uuid,
          name: userContext.user?.name
        });
      } else {
        newArr.splice(index, 1);
      }
      setAllMembersArray(newArr);

      setUserMap({ ...userMap, [userContext.user?.uuid]: userContext.user });
    }
  }, [initiateAction?.action, postId, entityId, entityType]);
  async function getAllMembersThrice() {
    try {
      let callResp: any;
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
        setAllMembersArray([...membersArrayOne, ...membersArrayTwo, ...membersArrayThree]);
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
        setAllMembersArray([...membersArrayOne, ...membersArrayTwo, ...membersArrayThree]);
        setUserMap({ ...membersObjectOne, ...membersObjectTwo, ...membersObjectThree });
      }
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
      setAllMembersArray([...allMembersArray].concat([...membersArray]));
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
  function renderMembersList() {
    return allMembersArray.map((member: any) => {
      return (
        <div className="memberTile" key={member?.uuid}>
          <div className="memberTile__image">{setUserImage(userMap[member?.uuid])}</div>
          <div className="memberTile__profile">{userMap[member?.uuid].name}</div>
        </div>
      );
    });
  }
  return (
    <div className="allMembers">
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
      <div className="allMembers__list" id="allMembersScrollWrapper">
        <InfiniteScroll
          loader={null}
          hasMore={loadMore}
          dataLength={allMembersArray.length}
          next={getAllMembers}
          scrollableTarget="allMembersScrollWrapper">
          {renderMembersList()}
        </InfiniteScroll>
      </div>
    </div>
  );
}

export default PostLikesList;
