import { IMember } from '@likeminds.community/feed-js';
import React, { useEffect, useState } from 'react';
import { lmFeedClient } from '..';
import '../assets/css/all-members.css';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Skeleton } from '@mui/material';

function AllMembers() {
  const [allMembersArray, setAllMembersArray] = useState<IMember[]>([]);
  const [pageCount, setPageCount] = useState<number>(4);
  const [loadMore, setLoadMore] = useState<boolean>(true);
  const [totalMembers, setTotalMembers] = useState<number>(0);

  useEffect(() => {
    getAllMembersThrice();
  }, []);
  async function getAllMembersThrice() {
    try {
      const responseOne: any = await lmFeedClient.getAllMembers(1);
      const responseTwo: any = await lmFeedClient.getAllMembers(2);
      const responseThree: any = await lmFeedClient.getAllMembers(3);
      const membersArrayOne: IMember[] = responseOne?.data?.members;
      const membersArrayTwo: IMember[] = responseTwo?.data?.members;
      const membersArrayThree: IMember[] = responseThree?.data?.members;
      setTotalMembers(responseOne?.data?.totalMembers);
      setAllMembersArray([...membersArrayOne, ...membersArrayTwo, ...membersArrayThree]);
    } catch (error) {
      console.log(error);
    }
  }
  async function getAllMembers() {
    try {
      const response: any = await lmFeedClient.getAllMembers(pageCount);
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
    return allMembersArray.map((member: IMember) => {
      return (
        <div className="memberTile" key={member.id}>
          <div className="memberTile__image">{setUserImage(member)}</div>
          <div className="memberTile__profile">{member.name}</div>
        </div>
      );
    });
  }
  function renderComponent() {
    switch (allMembersArray.length) {
      case 0:
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
  return (
    <div className="allMembers">
      {allMembersArray.length ? (
        <div className="allMembers__header">
          Members {'('}
          {totalMembers}
          {')'}
        </div>
      ) : (
        <div className="noMemberSkeletonContainer">
          <Skeleton variant="circular" width={40} height={40} />
          <div className="textContentSkeleton">
            <Skeleton variant="text" width={'80%'} />
          </div>
        </div>
      )}
      <div className="allMembers__list" id="allMembersScrollWrapper">
        <InfiniteScroll
          loader={null}
          hasMore={loadMore}
          dataLength={allMembersArray.length}
          next={getAllMembers}
          scrollableTarget="allMembersScrollWrapper">
          {renderComponent()}
        </InfiniteScroll>
      </div>
    </div>
  );
}

export default AllMembers;
