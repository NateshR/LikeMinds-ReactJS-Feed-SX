import React, { useContext, useEffect, useRef, useState } from 'react';
import PostComents from './PostComments';
import { lmFeedClient } from '..';
import { Dialog, IconButton } from '@mui/material';
import {
  LIKE_POST,
  SAVE_POST,
  SHOW_POST_LIKES_BAR,
  SHOW_SNACKBAR,
  UPDATE_LIKES_COUNT_DECREMENT_POST,
  UPDATE_LIKES_COUNT_INCREMENT_POST
} from '../services/feedModerationActions';
import { IComment, IMemberRight, IPost, IUser } from '@likeminds.community/feed-js';
import SendIcon from '@mui/icons-material/Send';
import nonSavedPost from '../assets/images/nonSavedPost.png';
import savedPost from '../assets/images/savedPost.png';
import {
  TagInfo,
  checkAtSymbol,
  findSpaceAfterIndex,
  getCaretPosition,
  setCursorAtEnd
} from './dialog/createPost/CreatePostDialog';

import './../assets/css/post-footer.css';
import InfiniteScroll from 'react-infinite-scroll-component';
import UserContext from '../contexts/UserContext';
import SeePostLikes from './SeePostLikes';
import { useLocation, useNavigate, useNavigation } from 'react-router-dom';
interface PostFooterProps {
  postId: string;
  isEdited: boolean;
  isLiked: boolean;
  isPinned: boolean;
  isSaved: boolean;
  likesCount: number;
  feedModerationHandler: (action: string, index: number, value: any) => void;
  index: number;
  commentsCount: number;
  rightSidebarHandler: (action: string, value: any) => void;
}
const PostFooter: React.FC<PostFooterProps> = ({
  postId,
  isEdited,
  isLiked,
  isPinned,
  isSaved,
  likesCount,
  index,
  feedModerationHandler,
  commentsCount,
  rightSidebarHandler
}) => {
  const [commentList, setCommentList] = useState<IComment[]>([]);
  const [isPostLiked, setIsPostLiked] = useState<boolean>(isLiked);
  const [isPostSaved, setIsPostSaved] = useState<boolean>(isSaved);
  const [postLikesCount, setPostLikesCount] = useState<number>(likesCount);
  const [postCommentsCount, setPostCommentsCount] = useState<number>(likesCount);
  const [postUsersMap, setPostUsersMap] = useState<{ [key: string]: IUser }>({});
  const [pageCount, setPageCount] = useState<number>(1);
  const [hasMoreComments, setHasMoreComments] = useState<boolean>(true);
  const [openCommentsSection, setOpenCommentsSection] = useState<boolean>(false);
  const [openSeeLikesDialog, setOpenSeeLikesDialog] = useState(false);

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
    setIsPostLiked(!isPostLiked);
    if (isPostLiked) {
      setPostLikesCount(postLikesCount - 1);
      if (location.pathname.includes('/post')) {
        rightSidebarHandler(UPDATE_LIKES_COUNT_DECREMENT_POST, {
          postId: postId,
          totalLikes: postLikesCount - 1
        });
      }
    } else {
      setPostLikesCount(postLikesCount + 1);
      if (location.pathname.includes('/post')) {
        rightSidebarHandler(UPDATE_LIKES_COUNT_INCREMENT_POST, {
          postId: postId,
          totalLikes: postLikesCount + 1
        });
      }
    }

    return lmFeedClient.likePost(postId);
  }
  function getPostLikes() {}
  function sharePOst() {}
  function savePost() {
    setIsPostSaved(!isPostSaved);
    feedModerationHandler(
      SHOW_SNACKBAR,
      index,
      isPostSaved ? 'Post removed from Saved Posts' : 'Post added to Saved Posts'
    );
    return lmFeedClient.savePost(postId);
  }
  async function getPostComments() {
    let response: any = await lmFeedClient.getPostDetails(postId, pageCount);
    setPageCount(pageCount + 1);
    let commentArray = response?.data?.post?.replies;

    setPostUsersMap({ ...postUsersMap, ...response?.data?.users });
    if (pageCount === 1) {
      const tempArr: { [key: string]: number } = {};
      commentList.forEach((item: IComment) => (tempArr[item.Id] = 1));
      let newResponseReplies = commentArray.filter((item: IComment) => {
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

  const userContext = useContext(UserContext);

  function setUserImage() {
    const imageLink = userContext?.user?.imageUrl;
    if (imageLink !== '') {
      return (
        <img
          src={imageLink}
          alt={userContext.user?.imageUrl}
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
          {userContext.user?.name?.split(' ').map((part: string) => {
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
          alt={userContext.user?.imageUrl}
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

  function showCommentBox() {
    const memberState = userContext.memberStateRights?.state;
    let isCommentingAllowed: any = false;
    if (memberState == 4) {
      isCommentingAllowed = userContext.memberStateRights?.memberRights.some(
        (item: IMemberRight) => item.id === 10 && item.isSelected
      );
    } else {
      const rights: any = userContext?.memberStateRights;
      isCommentingAllowed = rights.managerRights.some(
        (item: any) => item.id === 7 && item.isSelected
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
              placeholder="hello world"
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
              onKeyDown={(e: React.KeyboardEvent) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  postComment();
                }
              }}
              onInput={(event: React.KeyboardEvent<HTMLDivElement>) => {
                setText(event.currentTarget.textContent!);
                const selection = window.getSelection();
                if (selection === null) return;
                let focusNode = selection.focusNode;
                if (focusNode === null) {
                  return;
                }
                let div = focusNode.parentElement;
                if (div === null) {
                  return;
                }
                let text = div.childNodes;
                if (focusNode === null || text.length === 0) {
                  return;
                }
                let textContentFocusNode = focusNode.textContent;

                let tagOp = findTag(textContentFocusNode!);
                if (tagOp?.tagString !== null && tagOp?.tagString !== undefined) {
                  setTagString(tagOp?.tagString!);
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
                        let focusNode = window.getSelection()!.focusNode;
                        if (focusNode === null) {
                          return;
                        }
                        let div = focusNode.parentElement;
                        let text = div!.childNodes;
                        if (focusNode === null || text.length === 0) {
                          return;
                        }
                        let textContentFocusNode = focusNode.textContent;
                        if (textContentFocusNode === null) {
                          return;
                        }
                        let tagOp = findTag(textContentFocusNode);
                        if (tagOp === undefined) return;
                        let substr = tagOp?.tagString;
                        const { limitLeft, limitRight } = tagOp;
                        // if (!substr || substr.length === 0) {
                        //   return;
                        // }
                        let textNode1Text = textContentFocusNode.substring(0, limitLeft - 1);
                        let textNode2Text = textContentFocusNode.substring(limitRight + 1);

                        let textNode1 = document.createTextNode(textNode1Text);
                        let anchorNode = document.createElement('a');
                        anchorNode.id = item?.id;
                        anchorNode.href = '#';
                        anchorNode.textContent = `@${item?.name.trim()}`;
                        anchorNode.contentEditable = 'false';
                        const dummyNode = document.createElement('span');
                        let textNode2 = document.createTextNode(textNode2Text);
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
          {/* Post comment send icon */}
          {/* <div className="postCommentButton">
            <IconButton onClick={postComment}>
              <SendIcon />
            </IconButton>
          </div> */}
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
                  {commentList.map((comment: IComment, index: number, commentArray: IComment[]) => {
                    return (
                      <PostComents
                        comment={comment}
                        key={comment.Id!.toString()}
                        postId={postId}
                        commentArray={commentArray}
                        setCommentArray={setCommentList}
                        index={index}
                        user={postUsersMap[comment?.uuid]}
                        setParentCommentsCount={setPostCommentsCount}
                        parentCommentsCount={postCommentsCount}
                        rightSidebarHandler={rightSidebarHandler}
                      />
                    );
                  })}
                </InfiniteScroll>
              ) : null}
              <Dialog open={openSeeLikesDialog} onClose={() => setOpenSeeLikesDialog(false)}>
                <SeePostLikes
                  entityId={postId}
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
  async function postComment() {
    try {
      let textContent: string = extractTextFromNode(contentEditableDiv.current);
      if (textContent.length === 0) {
        return;
      }

      while (contentEditableDiv.current?.firstChild) {
        contentEditableDiv.current.removeChild(contentEditableDiv.current.firstChild);
      }
      const response: any = await lmFeedClient.addComment(postId, textContent);
      const comment = response?.data?.comment;
      const user = response?.data?.users;
      setCommentList([{ ...comment }].concat(commentList));
      setPostUsersMap({ ...postUsersMap, ...user });
      setPostCommentsCount(postCommentsCount + 1);
      setOpenCommentsSection(true);
    } catch (error) {
      lmFeedClient.logError(error);
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
                    navigation(`/post/${postId}`, {
                      state: {
                        index: index
                      }
                    });
                  } else {
                    rightSidebarHandler(SHOW_POST_LIKES_BAR, {
                      postId: postId,
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
                  navigation(`/post/${postId}`, {
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
                  navigation(`/post/${postId}`, {
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
          <div className="lm-cursor-pointer">
            {/* <IconButton
              title="Save"
              style={{
                margin: '0',
                padding: '0'
              }} */}

            {/* > */}
            {setSavePostButton()}
            {/* </IconButton> */}
          </div>
        </div>
      </div>
      {/* Comments */}
      {showPostScreenSection(location.pathname.includes('/post') ? true : false)}
      {/* Comments */}
    </div>
  );
};

export default PostFooter;
