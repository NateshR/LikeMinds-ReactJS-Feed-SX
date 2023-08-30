import React, { useEffect, useState } from 'react';
import { lmFeedClient } from '..';
import '../assets/css/get-likes.css';
import InfiniteScroll from 'react-infinite-scroll-component';
interface SeePostLikesProps {
  entityId: string;
  onClose: () => void;
  likesCount: number;
  entityType: number;
  commentId?: string;
}
function SeePostLikes({ entityId, onClose, likesCount, entityType, commentId }: SeePostLikesProps) {
  const [likesArr, setLikesArray] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [loadMore, setLoadMore] = useState(true);
  const [userMap, setUserMap] = useState<any>({});
  async function getLikes() {
    try {
      let callResp: any;
      if (entityType === 1) {
        callResp = await lmFeedClient.getPostLikes(entityId, pageCount);
      } else {
        callResp = await lmFeedClient.getCommentLikes(entityId, pageCount, commentId!);
      }

      setLikesArray([...likesArr].concat(callResp?.data?.likes));
      setUserMap({ ...userMap, ...callResp?.data?.users });
      setPageCount(pageCount + 1);
      if (callResp?.data?.likes?.length === 0) {
        setLoadMore(false);
      }
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
  useEffect(() => {
    getLikes();
  }, []);
  useEffect(() => {
    likesArr;
    return () => {
      setLikesArray([]);
    };
  }, [entityId, commentId, entityType]);
  useEffect(() => {
    likesArr;
  }, [likesArr]);
  return (
    <div className="lmPostLikesWrapper">
      <span
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          cursor: 'pointer'
        }}
        onClick={onClose}>
        <svg
          width="26"
          height="26"
          viewBox="0 0 26 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <circle cx="13" cy="13" r="12" fill="white" stroke="#484F67" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M13.6857 13L17.1141 9.5716L16.4284 8.88592L13 12.3143L9.5716 8.88592L8.88592 9.5716L12.3143 13L8.88592 16.4284L9.5716 17.1141L13 13.6857L16.4284 17.1141L17.1141 16.4284L13.6857 13Z"
            fill="#484F67"
          />
          <path
            d="M17.1141 9.5716L17.4676 9.92515L17.8212 9.5716L17.4676 9.21804L17.1141 9.5716ZM13.6857 13L13.3321 12.6464L12.9786 13L13.3321 13.3535L13.6857 13ZM16.4284 8.88592L16.782 8.53236L16.4284 8.17881L16.0748 8.53236L16.4284 8.88592ZM13 12.3143L12.6464 12.6679L13 13.0214L13.3536 12.6679L13 12.3143ZM9.5716 8.88592L9.92516 8.53236L9.5716 8.17881L9.21805 8.53236L9.5716 8.88592ZM8.88592 9.5716L8.53237 9.21804L8.17882 9.5716L8.53237 9.92515L8.88592 9.5716ZM12.3143 13L12.6679 13.3535L13.0214 13L12.6679 12.6464L12.3143 13ZM8.88592 16.4284L8.53237 16.0748L8.17882 16.4284L8.53237 16.7819L8.88592 16.4284ZM9.5716 17.1141L9.21805 17.4676L9.5716 17.8212L9.92516 17.4676L9.5716 17.1141ZM13 13.6857L13.3536 13.3321L13 12.9786L12.6464 13.3321L13 13.6857ZM16.4284 17.1141L16.0748 17.4676L16.4284 17.8212L16.7819 17.4676L16.4284 17.1141ZM17.1141 16.4284L17.4676 16.7819L17.8212 16.4284L17.4676 16.0748L17.1141 16.4284ZM16.7605 9.21804L13.3321 12.6464L14.0392 13.3535L17.4676 9.92515L16.7605 9.21804ZM16.0748 9.23947L16.7605 9.92515L17.4676 9.21804L16.782 8.53236L16.0748 9.23947ZM13.3536 12.6679L16.782 9.23947L16.0748 8.53236L12.6464 11.9608L13.3536 12.6679ZM9.21805 9.23947L12.6464 12.6679L13.3536 11.9608L9.92516 8.53236L9.21805 9.23947ZM9.23948 9.92515L9.92516 9.23947L9.21805 8.53236L8.53237 9.21804L9.23948 9.92515ZM12.6679 12.6464L9.23948 9.21804L8.53237 9.92515L11.9608 13.3535L12.6679 12.6464ZM9.23948 16.7819L12.6679 13.3535L11.9608 12.6464L8.53237 16.0748L9.23948 16.7819ZM9.92516 16.7605L9.23948 16.0748L8.53237 16.7819L9.21805 17.4676L9.92516 16.7605ZM12.6464 13.3321L9.21805 16.7605L9.92516 17.4676L13.3536 14.0392L12.6464 13.3321ZM16.7819 16.7605L13.3536 13.3321L12.6464 14.0392L16.0748 17.4676L16.7819 16.7605ZM16.7605 16.0748L16.0748 16.7605L16.7819 17.4676L17.4676 16.7819L16.7605 16.0748ZM13.3321 13.3535L16.7605 16.7819L17.4676 16.0748L14.0392 12.6464L13.3321 13.3535Z"
            fill="#484F67"
          />
        </svg>
      </span>
      <div className="lmPostLikesWrapper--likesCount">
        {likesCount} {likesCount === 0 || likesCount > 1 ? ' Likes ' : ' Like '}
      </div>
      <div className="lmPostLikesWrapper__scroller" id="likesWrapper">
        <InfiniteScroll
          dataLength={likesArr.length}
          loader={null}
          hasMore={loadMore}
          next={getLikes}>
          {likesArr.map((like: any) => {
            return (
              <div className="likesUserTile" key={like.Id}>
                <div className="likesUserTile--userImage">{setUserImage(userMap[like?.uuid])}</div>
                <div className="likesUserTile--userName">
                  {userMap[like?.uuid]?.name?.toUpperCase()}
                </div>
              </div>
            );
          })}
        </InfiniteScroll>
      </div>
    </div>
  );
}

export default SeePostLikes;
