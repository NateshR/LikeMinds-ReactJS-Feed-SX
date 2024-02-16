/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useRef, useState } from 'react';
import PostComents from './PostComments';
import { lmFeedClient } from '../client';
import { Dialog } from '@mui/material';
import {
  SHOW_POST_LIKES_BAR,
  UPDATE_LIKES_COUNT_DECREMENT_POST,
  UPDATE_LIKES_COUNT_INCREMENT_POST
} from '../services/feedModerationActions';
import { IComment, IMemberRight, IUser } from '@likeminds.community/feed-js';

import {
  TagInfo,
  checkAtSymbol,
  findSpaceAfterIndex,
  getCaretPosition,
  setCursorAtEnd
} from './dialog/createPost/CreatePostDialog';

import './../assets/css/post-footer.css';
import InfiniteScroll from 'react-infinite-scroll-component';

import SeePostLikes from './SeePostLikes';
import { useLocation, useNavigate, useNavigation } from 'react-router-dom';
import { PostContext } from '../contexts/postContext';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { MEMBER_STATE } from '../enums/memberState';
import { Comment } from '../models/comment';
interface PostFooterProps {
  rightSidebarHandler: (action: string, value: any) => void;
}
const PostFooter: React.FC<PostFooterProps> = ({ rightSidebarHandler }) => {
  const { post, topics, index, user } = useContext(PostContext);
  const { Id, isEdited, isLiked, isSaved, likesCount, commentsCount } = post!;

  const currentUser = useSelector((state: RootState) => state.currentUser.user);
  const memberStateRights = useSelector((state: RootState) => state.currentUser.memberState);
  const [commentList, setCommentList] = useState<Comment[]>([]);
  const [isPostLiked, setIsPostLiked] = useState<boolean>(isLiked);
  const [isPostSaved, setIsPostSaved] = useState<boolean>(isSaved);
  const [postLikesCount, setPostLikesCount] = useState<number>(likesCount);
  const [postCommentsCount, setPostCommentsCount] = useState<number>(likesCount);
  const [postUsersMap, setPostUsersMap] = useState<{ [key: string]: IUser }>({});
  const [pageCount, setPageCount] = useState<number>(1);
  const [hasMoreComments, setHasMoreComments] = useState<boolean>(true);
  const [openCommentsSection, setOpenCommentsSection] = useState<boolean>(false);
  const [openSeeLikesDialog, setOpenSeeLikesDialog] = useState(false);
  function updateCommentsArray(index: number, comment: Comment) {
    const newArr = [...commentList];
    newArr[index] = comment;
    setCommentList(newArr);
  }
  const navigation = useNavigate();
  const location = useLocation();
  // (location);
  useEffect(() => {
    setIsPostLiked(isLiked);
    setIsPostSaved(isSaved);
    setPostCommentsCount(commentsCount);
    setPostLikesCount(likesCount);
  }, [isLiked, isSaved, likesCount, commentsCount]);
  // Utility function
  async function likePost() {
    switch (isPostLiked) {
      case true: {
        setIsPostLiked(false);
        setPostLikesCount((currentCount) => currentCount - 1);
        break;
      }
      case false: {
        setIsPostLiked(true);
        setPostLikesCount((currentCount) => currentCount + 1);
        break;
      }
    }
    lmFeedClient.likePost(Id);
  }
  function getPostLikes() {}
  function sharePOst() {}
  function savePost() {
    setIsPostSaved(!isPostSaved);
    // feedModerationHandler(
    //   SHOW_SNACKBAR,
    //   index,
    //   isPostSaved ? 'Post removed from Saved Posts' : 'Post added to Saved Posts'
    // );
    return lmFeedClient.savePost(Id);
  }
  async function getPostComments() {
    const response: any = await lmFeedClient.getPostDetails(Id, pageCount);
    setPageCount(pageCount + 1);
    const commentArray = response?.data?.post?.replies;

    setPostUsersMap({ ...postUsersMap, ...response?.data?.users });
    if (pageCount === 1) {
      const tempArr: { [key: string]: number } = {};
      commentList.forEach((item: Comment) => (tempArr[item.Id] = 1));
      const newResponseReplies = commentArray?.filter((item: Comment) => {
        if (tempArr[item.Id] != 1) {
          return item;
        }
      });
      setCommentList([...commentList, ...newResponseReplies]);
    } else {
      setCommentList([...commentList, ...commentArray]);
    }

    if (commentArray?.length === 0) {
      setHasMoreComments(false);
    }
  }
  function setLikeButton() {
    if (isPostLiked) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none">
          <path
            d="M12.534 19.8662L20.1278 12.2725C21.9934 10.3975 22.2653 7.33187 20.5028 5.37249C20.0607 4.87872 19.5227 4.48026 18.9215 4.20145C18.3203 3.92264 17.6685 3.76933 17.0061 3.75091C16.3436 3.73248 15.6844 3.84932 15.0686 4.09428C14.4528 4.33924 13.8934 4.70718 13.4246 5.17562L11.9996 6.60999L10.7715 5.37249C8.89652 3.50687 5.83089 3.23499 3.87152 4.99749C3.37774 5.43951 2.97928 5.97756 2.70047 6.57877C2.42166 7.17999 2.26836 7.83173 2.24993 8.49419C2.23151 9.15665 2.34834 9.81591 2.5933 10.4317C2.83826 11.0475 3.2062 11.6068 3.67464 12.0756L11.4653 19.8662C11.6075 20.0071 11.7995 20.0861 11.9996 20.0861C12.1998 20.0861 12.3918 20.0071 12.534 19.8662Z"
            fill="#FB1609"
            stroke="#FB1609"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    } else {
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12.534 19.8662L20.1278 12.2725C21.9934 10.3975 22.2653 7.33187 20.5028 5.37249C20.0607 4.87872 19.5227 4.48026 18.9215 4.20145C18.3203 3.92264 17.6685 3.76933 17.0061 3.75091C16.3436 3.73248 15.6844 3.84932 15.0686 4.09428C14.4528 4.33924 13.8934 4.70718 13.4246 5.17562L11.9996 6.60999L10.7715 5.37249C8.89652 3.50687 5.83089 3.23499 3.87152 4.99749C3.37774 5.43951 2.97928 5.97756 2.70047 6.57877C2.42166 7.17999 2.26836 7.83173 2.24993 8.49419C2.23151 9.15665 2.34834 9.81591 2.5933 10.4317C2.83826 11.0475 3.2062 11.6068 3.67464 12.0756L11.4653 19.8662C11.6075 20.0071 11.7995 20.0861 11.9996 20.0861C12.1998 20.0861 12.3918 20.0071 12.534 19.8662Z"
            stroke="#484F67"
            strokeOpacity="0.7"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    }
  }
  function setSavePostButton() {
    if (isPostSaved) {
      return (
        <svg
          onClick={savePost}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none">
          <path
            d="M8.25 4H15.75C16.4404 4 17 4.55103 17 5.23077V20L12 15.0769L7 20V5.23077C7 4.55103 7.55964 4 8.25 4Z"
            fill="#484F67"
            stroke="#484F67"
            strokeOpacity="0.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    } else {
      return (
        <svg
          onClick={savePost}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none">
          <path
            d="M8.25 4H15.75C16.4404 4 17 4.55103 17 5.23077V20L12 15.0769L7 20V5.23077C7 4.55103 7.55964 4 8.25 4Z"
            stroke="#484F67"
            strokeOpacity="0.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    }
  }

  function setUserImage() {
    const imageLink = currentUser?.imageUrl;
    if (imageLink !== '') {
      return (
        <img
          src={imageLink}
          alt={currentUser?.name}
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
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#fff',
            letterSpacing: '1px'
          }}>
          {currentUser?.name?.split(' ').map((part: string) => {
            return part.charAt(0)?.toUpperCase();
          })}
        </span>
      );
    }
  }
  function setTagUserImage(user: any) {
    const imageLink = user?.imageUrl;
    if (imageLink !== '') {
      return (
        <img
          src={imageLink}
          alt={''}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%'
          }}
        />
      );
    } else {
      return (
        <div
          style={{
            minWidth: '36px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'flex',
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
        </div>
      );
    }
  }

  function makeTempComment(timeStamp: string, text: string) {
    const tempComment: Comment = {
      Id: timeStamp,
      commentsCount: 0,
      communityId: 0,
      createdAt: parseInt(timeStamp),
      isEdited: false,
      isLiked: false,
      level: 0,
      likesCount: 0,
      menuItems: [
        {
          id: 8,
          title: 'Edit'
        },
        {
          id: 6,
          title: 'Delete'
        }
      ],
      postId: '',
      replies: [],
      tempId: null,
      text: text,
      updatedAt: 1701118115396,
      userId: '',
      uuid: currentUser?.uuid || ''
    };
    return tempComment;
  }

  function showCommentBox() {
    const memberState = memberStateRights?.state;
    let isCommentingAllowed: any = memberState === MEMBER_STATE.STATE_ADMIN ? true : false;
    if (memberState == 4) {
      isCommentingAllowed = memberStateRights?.memberRights.some(
        (item: IMemberRight) => item.id === 10 && item.isSelected
      );
    }
    if (isCommentingAllowed) {
      return (
        <>
          <div className="lmProfile">{setUserImage()}</div>
          <div
            className="inputDiv"
            style={{
              overflow: 'visible'
            }}>
            <div
              ref={contentEditableDiv}
              contentEditable={true}
              suppressContentEditableWarning
              tabIndex={0}
              id="editableDiv"
              onBlur={() => {
                if (contentEditableDiv && contentEditableDiv.current) {
                  if (text.trim().length === 0) {
                    contentEditableDiv.current.textContent = `Write your comment`;
                  }
                }
              }}
              onFocus={() => {
                if (contentEditableDiv && contentEditableDiv.current) {
                  if (text.trim() === '') {
                    contentEditableDiv.current.textContent = ``;
                  }
                }
              }}
              onKeyDown={async (e: React.KeyboardEvent) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const textContent: string = extractTextFromNode(contentEditableDiv.current);
                  if (textContent.length === 0) {
                    return;
                  }

                  const timeStamp = Date.now().toString();
                  const tempComment = makeTempComment(timeStamp, textContent);
                  setCommentList([{ ...tempComment }].concat(commentList));

                  setPostCommentsCount(postCommentsCount + 1);
                  setOpenCommentsSection(true);
                  const commentCall = await postComment(timeStamp);
                  console.log('The comment call is');
                  console.log(commentCall);
                  if (commentCall?.status && commentCall?.post) {
                    const newCommentList = [{ ...commentCall.post }, ...commentList];
                    console.log('the new comment list is');
                    console.log(newCommentList);
                    setCommentList([{ ...commentCall.post }].concat(commentList));
                  } else {
                    setCommentList([...commentList]);
                    setPostCommentsCount(postCommentsCount);
                  }
                }
              }}
              onInput={(event: React.KeyboardEvent<HTMLDivElement>) => {
                setText(event.currentTarget.textContent!);
                const selection = window.getSelection();
                if (selection === null) return;
                const focusNode = selection.focusNode;
                if (focusNode === null) {
                  return;
                }
                const div = focusNode.parentElement;
                if (div === null) {
                  return;
                }
                const text = div.childNodes;
                if (focusNode === null || text.length === 0) {
                  return;
                }
                const textContentFocusNode = focusNode.textContent;

                const tagOp = findTag(textContentFocusNode!);
                if (tagOp?.tagString !== null && tagOp?.tagString !== undefined) {
                  setTagString(tagOp?.tagString);
                }
              }}></div>
            {taggingMemberList && taggingMemberList?.length > 0 ? (
              <div className="taggingBox">
                {taggingMemberList?.map!((item: any) => {
                  return (
                    <button
                      key={item?.id}
                      className="postTaggingTile"
                      onClick={(e) => {
                        e.preventDefault();
                        const focusNode = window.getSelection()!.focusNode;
                        if (focusNode === null) {
                          return;
                        }
                        const div = focusNode.parentElement;
                        const text = div!.childNodes;
                        if (focusNode === null || text.length === 0) {
                          return;
                        }
                        const textContentFocusNode = focusNode.textContent;
                        if (textContentFocusNode === null) {
                          return;
                        }
                        const tagOp = findTag(textContentFocusNode);
                        if (tagOp === undefined) return;
                        const substr = tagOp?.tagString;
                        const { limitLeft, limitRight } = tagOp;

                        const textNode1Text = textContentFocusNode.substring(0, limitLeft - 1);
                        const textNode2Text = textContentFocusNode.substring(limitRight + 1);

                        const textNode1 = document.createTextNode(textNode1Text);
                        const anchorNode = document.createElement('a');
                        anchorNode.id = item?.id;
                        anchorNode.href = '#';
                        anchorNode.textContent = `@${item?.name.trim()}`;
                        anchorNode.contentEditable = 'false';
                        const dummyNode = document.createElement('span');
                        const textNode2 = document.createTextNode(textNode2Text);
                        div!.replaceChild(textNode2, focusNode);
                        div!.insertBefore(anchorNode, textNode2);
                        div!.insertBefore(dummyNode, anchorNode);
                        div!.insertBefore(textNode1, anchorNode);
                        setTaggingMemberList([]);
                        setCursorAtEnd(contentEditableDiv);
                      }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                        {setTagUserImage(item)}
                        <div
                          style={{
                            padding: '0px 0.5rem',
                            textTransform: 'capitalize',
                            overflowY: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                          {item?.name}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
        </>
      );
    } else {
      return null;
    }
  }

  function showPostScreenSection(showPostScreenSection: boolean) {
    switch (showPostScreenSection) {
      case true: {
        return (
          <>
            <div className="commentInputBox">{showCommentBox()}</div>
            <div
              className="commentCountDiv"
              style={{
                display: commentList && commentList.length ? 'block' : 'none'
              }}>
              <span>
                {postCommentsCount}{' '}
                {postCommentsCount === 0 || postCommentsCount > 1 ? 'Comments' : 'Comment'}
              </span>
            </div>
            <div className="commentsWrapper" id="wrapperComment">
              {commentList.length ? (
                <InfiniteScroll
                  dataLength={commentList.length}
                  loader={null}
                  next={getPostComments}
                  hasMore={hasMoreComments}
                  scrollableTarget={'postDetailsContainer'}>
                  {commentList.map((comment: Comment, index: number, commentArray: Comment[]) => {
                    return (
                      <PostComents
                        comment={comment}
                        key={comment.Id!.toString()}
                        postId={Id}
                        commentArray={commentArray}
                        setCommentArray={setCommentList}
                        index={index}
                        user={postUsersMap[comment?.uuid]}
                        setParentCommentsCount={setPostCommentsCount}
                        parentCommentsCount={postCommentsCount}
                        rightSidebarHandler={rightSidebarHandler}
                        updateReplies={updateCommentsArray}
                      />
                    );
                  })}
                </InfiniteScroll>
              ) : null}
              <Dialog open={openSeeLikesDialog} onClose={() => setOpenSeeLikesDialog(false)}>
                <SeePostLikes
                  entityId={Id}
                  onClose={() => setOpenSeeLikesDialog(false)}
                  likesCount={postLikesCount}
                  entityType={1}
                />
              </Dialog>
            </div>
          </>
        );
      }
      case false: {
        return null;
      }
    }
  }
  useEffect(() => {
    if (location.pathname.includes('/post')) {
      getPostComments();
    }
  }, []);
  // end of utility functions

  // functions for comment input box
  const [text, setText] = useState<string>('');
  const [tagString, setTagString] = useState<string | null>(null);
  const [taggingMemberList, setTaggingMemberList] = useState<any[] | null>(null);
  const contentEditableDiv = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (contentEditableDiv && contentEditableDiv.current) {
      if (text === '' && !contentEditableDiv.current.isSameNode(document.activeElement)) {
        contentEditableDiv.current.textContent = 'Write your comment';
      }
    }
  }, [text]);
  function findTag(str: string): TagInfo | undefined {
    if (str.length === 0) {
      return undefined;
    }
    const cursorPosition = getCaretPosition();
    const leftLimit = checkAtSymbol(str, cursorPosition - 1);
    if (leftLimit === -1) {
      // setCloseDialog(); // Assuming this function is defined somewhere else and handled separately.
      return undefined;
    }
    const rightLimit = findSpaceAfterIndex(str, cursorPosition - 1);

    const substr = str.substring(leftLimit, rightLimit + 1);

    return {
      tagString: substr,
      limitLeft: leftLimit,
      limitRight: rightLimit
    };
  }
  function extractTextFromNode(node: any) {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.nodeName === 'A') {
        let textContent: string = node.textContent;
        textContent = textContent.substring(1);
        const id = node.getAttribute('id');
        return `<<${textContent}|route://user_profile/${id}>>`;
      } else {
        let text = '';
        const childNodes = node.childNodes;

        for (const childNode of childNodes) {
          text += extractTextFromNode(childNode);
        }

        return text.trim();
      }
    } else {
      return '';
    }
  }
  // function renamed to post comments
  async function postComment(timeStamp: string) {
    try {
      const textContent: string = extractTextFromNode(contentEditableDiv.current);
      if (textContent.length === 0) {
        return;
      }

      while (contentEditableDiv.current?.firstChild) {
        contentEditableDiv.current.removeChild(contentEditableDiv.current.firstChild);
      }
      const response: any = await lmFeedClient.addComment(Id, textContent, timeStamp);
      const comment = response?.data?.comment;
      const user = response?.data?.users;
      setPostUsersMap({ ...postUsersMap, ...user });

      return {
        status: true,
        post: comment
      };
    } catch (error) {
      return {
        status: false,
        post: null
      };
    }
  }
  async function getTags() {
    if (tagString === undefined || tagString === null) {
      return;
    }
    const tagListResponse = await lmFeedClient.getTaggingList(tagString);

    const memberList = tagListResponse?.data?.members;
    if (memberList && memberList.length > 0) {
      setTaggingMemberList(memberList);
    } else {
      setTaggingMemberList(null);
    }
  }
  useEffect(() => {
    if (tagString === null || tagString === undefined) {
      return;
    }

    const timeout = setTimeout(() => {
      getTags();
    }, 500);
    return () => {
      clearTimeout(timeout);
    };
  }, [tagString]);
  useEffect(() => {
    if (!tagString) {
      setTaggingMemberList([]);
    }
  }, [tagString]);
  useEffect(() => {
    function handleClickOutside(e: any) {
      if (contentEditableDiv && contentEditableDiv?.current) {
        if (
          !contentEditableDiv?.current?.contains(e.target as unknown as any) &&
          !e.currentTarget?.classList?.contains('postTaggingTile')
        ) {
          setTaggingMemberList([]);
        }
      }
    }

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [contentEditableDiv]);

  return (
    <div className="lmWrapper__feed__post__footer">
      <div className="lmWrapper__feed__post__footer__actions">
        <div className="lmWrapper__feed__post__footer__actions__left">
          <div className="lm-d-flex lm-align-center lm-cursor-pointer">
            {' '}
            <span
              style={{
                margin: '0',
                padding: '0',
                cursor: 'pointer'
              }}
              onClick={likePost}>
              {setLikeButton()}
            </span>{' '}
            <span
              onClick={() => {
                if (postLikesCount) {
                  if (!location.pathname.includes('/post')) {
                    location.pathname;
                    navigation(`/post/${Id}`, {
                      state: {
                        index: index
                      }
                    });
                  } else {
                    rightSidebarHandler(SHOW_POST_LIKES_BAR, {
                      postId: Id,
                      entityType: 1,
                      totalLikes: postLikesCount
                    });
                  }
                } else {
                  likePost();
                }
              }}>
              {postLikesCount ? postLikesCount : null} {postLikesCount > 1 ? 'Likes' : 'Like'}
            </span>
          </div>
          <div className="lm-d-flex lm-align-center lm-cursor-pointer">
            <span
              style={{
                margin: '0',
                padding: '0'
              }}
              onClick={() => {
                if (location.pathname !== '/post') {
                  navigation(`/post/${Id}`, {
                    state: {
                      index: index
                    }
                  });
                }
              }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none">
                <path
                  d="M4.25602 16.5937C3.13935 14.7097 2.74875 12.4829 3.15755 10.3314C3.56636 8.1798 4.74645 6.25143 6.47628 4.90829C8.20611 3.56514 10.3667 2.89958 12.5525 3.03657C14.7383 3.17355 16.7989 4.10365 18.3475 5.65226C19.8961 7.20086 20.8262 9.26148 20.9632 11.4472C21.1002 13.633 20.4346 15.7936 19.0915 17.5235C17.7483 19.2533 15.8199 20.4334 13.6684 20.8422C11.5168 21.251 9.29001 20.8604 7.40602 19.7437V19.7437L4.29352 20.625C4.16599 20.6623 4.03079 20.6646 3.90207 20.6317C3.77335 20.5987 3.65586 20.5318 3.56191 20.4378C3.46796 20.3439 3.40101 20.2264 3.36809 20.0977C3.33516 19.969 3.33747 19.8338 3.37477 19.7062L4.25602 16.5937Z"
                  stroke="#484F67"
                  strokeOpacity="0.7"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>{' '}
            <span
              style={{
                cursor: 'pointer',
                color:
                  openCommentsSection && commentList && commentList.length
                    ? '#5046E5'
                    : 'rgba(72, 79, 103, 0.7)'
              }}
              onClick={() => {
                if (location.pathname !== '/post') {
                  navigation(`/post/${Id}`, {
                    state: {
                      index: index
                    }
                  });
                }
                if (postCommentsCount > 0) {
                  setOpenCommentsSection(!openCommentsSection);
                }
                getPostComments();
              }}>
              {postCommentsCount > 0 ? postCommentsCount + ' ' : null}
              {postCommentsCount === 0
                ? 'Add Comment'
                : postCommentsCount > 1
                ? 'Comments'
                : 'Comment'}
            </span>
          </div>
        </div>
        <div className="lmWrapper__feed__post__footer__actions__right">
          <div className="lm-cursor-pointer">{setSavePostButton()}</div>
        </div>
      </div>
      {/* Comments */}
      {showPostScreenSection(location.pathname.includes('/post') ? true : false)}
      {/* Comments */}
    </div>
  );
};

export default PostFooter;
