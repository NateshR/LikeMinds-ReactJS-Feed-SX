import { IMember } from 'likeminds-sdk';
import React, { useEffect, useState } from 'react';
import { lmFeedClient } from '..';
import '../assets/css/all-members.css';
import InfiniteScroll from 'react-infinite-scroll-component';

function AllMembers() {
  const [allMembersArray, setAllMembersArray] = useState<IMember[]>([]);
  const [pageCount, setPageCount] = useState<number>(1);
  const [loadMore, setLoadMore] = useState<boolean>(true);
  const [totalMembers, setTotalMembers] = useState<number>(0);
  useEffect(() => {
    getAllMembers();
  }, []);
  async function getAllMembers() {
    try {
      const response: any = await lmFeedClient.getAllMembers(pageCount);
      const membersArray: IMember[] = response.data.members;
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
  return (
    <div className="allMembers">
      <div className="allMembers__header">
        Members {'('}
        {totalMembers}
        {')'}
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

export default AllMembers;
