import liked from '../assets/images/liked.svg';
import comment from '../assets/images/comment.svg';
import bookmark from '../assets/images/bookmark.svg';
import defaultUserImage from '../assets/images/defaultUserImage.png';
import share from '../assets/images/share.svg';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import React, { useContext, useEffect, useRef, useState } from 'react';
import PostComents from './PostComments';
import { lmFeedClient } from '..';
import { Dialog, IconButton } from '@mui/material';
import { LIKE_POST, SAVE_POST, SHOW_SNACKBAR } from '../services/feedModerationActions';
import { IComment, IMemberRight, IUser } from 'likeminds-sdk';
import SendIcon from '@mui/icons-material/Send';
import {
  TagInfo,
  checkAtSymbol,
  findSpaceAfterIndex,
  getCaretPosition
} from './dialog/createPost/CreatePostDialog';

import './../assets/css/post-footer.css';
import InfiniteScroll from 'react-infinite-scroll-component';
import UserContext from '../contexts/UserContext';
import SeePostLikes from './SeePostLikes';
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
  commentsCount
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
    } else {
      setPostLikesCount(postLikesCount + 1);
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
        <FavoriteIcon
          sx={{
            color: '#FB1609'
          }}
        />
      );
    } else {
      return <FavoriteBorderIcon />;
    }
  }
  function setSavePostButton() {
    if (isPostSaved) {
      return (
        <BookmarkIcon
          sx={{
            color: '#484F67'
          }}
        />
      );
    } else {
      return <BookmarkBorderIcon />;
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
            width: '32px',
            height: '32px',
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
        <span
          style={{
            width: '36px',
            height: '36px',
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

  function showCommentBox() {
    const isCommentingAllowed = userContext.memberStateRights?.memberRights.some(
      (item: IMemberRight) => item.id === 10 && item.isSelected
    );
    if (isCommentingAllowed) {
      return (
        <>
          <div className="lmProfile">{setUserImage()}</div>
          <div className="inputDiv">
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
              <div
                style={{
                  maxHeight: '150px',
                  width: '250px',
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  position: 'absolute',
                  top: '100%',
                  left: '0',
                  boxShadow: '0px 1px 16px 0 #0000003D',
                  borderRadius: '0px',
                  zIndex: 9
                }}>
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
                        let textNode2 = document.createTextNode(textNode2Text);
                        div!.replaceChild(textNode2, focusNode);
                        div!.insertBefore(anchorNode, textNode2);
                        div!.insertBefore(textNode1, anchorNode);
                        setTaggingMemberList([]);
                      }}>
                      {setTagUserImage(item)}
                      <span
                        style={{
                          padding: '0px 0.5rem'
                        }}>
                        {item?.name}
                      </span>
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
            <IconButton
              style={{
                margin: '0',
                padding: '0'
              }}
              onClick={likePost}>
              {setLikeButton()}
            </IconButton>{' '}
            <span onClick={() => setOpenSeeLikesDialog(true)}>
              {postLikesCount} {postLikesCount === 0 || postLikesCount > 1 ? 'Likes' : 'Like'}
            </span>
          </div>
          <div className="lm-d-flex lm-align-center lm-cursor-pointer">
            <IconButton
              style={{
                margin: '0',
                padding: '0'
              }}
              onClick={() => {
                getPostComments();
                setOpenCommentsSection(true);
              }}>
              <img src={comment} alt="comment" />
            </IconButton>{' '}
            <span
              style={{
                cursor: 'pointer',
                color:
                  openCommentsSection && commentList && commentList.length
                    ? '#5046E5'
                    : 'rgba(72, 79, 103, 0.7)'
              }}
              onClick={() => {
                setOpenCommentsSection(true);
                getPostComments();
              }}>
              {postCommentsCount}{' '}
              {postCommentsCount === 0 || postCommentsCount > 1 ? 'Comments' : 'Comment'}
            </span>
          </div>
        </div>
        <div className="lmWrapper__feed__post__footer__actions__right">
          <div className="lm-cursor-pointer">
            <IconButton
              title="Save"
              style={{
                margin: '0',
                padding: '0'
              }}
              onClick={savePost}>
              {setSavePostButton()}
            </IconButton>
          </div>
        </div>
      </div>
      {/* Comments */}
      <div className="commentInputBox">{showCommentBox()}</div>
      <div
        className="commentCountDiv"
        style={{
          display: openCommentsSection && commentList && commentList.length ? 'block' : 'none'
        }}>
        <span>
          {postCommentsCount}{' '}
          {postCommentsCount === 0 || postCommentsCount > 1 ? 'Comments' : 'Comment'}
        </span>
      </div>
      <div className="commentsWrapper" id="wrapperComment">
        {commentList.length && openCommentsSection ? (
          <InfiniteScroll
            dataLength={commentList.length}
            loader={null}
            next={getPostComments}
            hasMore={hasMoreComments}
            scrollableTarget={'wrapperComment'}>
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
      {/* Comments */}
    </div>
  );
};

export default PostFooter;
