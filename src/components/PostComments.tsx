// src/Header/Header.tsx

import React, { useContext, useEffect, useRef, useState } from 'react';
import defaultUserImage from '../assets/images/defaultUserImage.png';
import { Dialog, IconButton, Menu, MenuItem, Skeleton } from '@mui/material';
import { IMenuItem, IUser } from '@likeminds.community/feed-js';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { lmFeedClient } from '..';
import SendIcon from '@mui/icons-material/Send';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Parser } from 'html-to-react';
import './../assets/css/post-footer.css';
import './../assets/css/comments.css';
import overflowIcon from '../assets/images/commentOverflowMenuIconShape.png';
import commentLikes from '../assets/images/commentLikes.png';
import commentLikesFilled from '../assets/images/commentLikesFilled.png';
// import './../assets/css/post-footer.css';
import {
  TagInfo,
  checkAtSymbol,
  findSpaceAfterIndex,
  getCaretPosition,
  setCursorAtEnd
} from './dialog/createPost/CreatePostDialog';
import InfiniteScroll from 'react-infinite-scroll-component';
import ReportPostDialogBox from './ReportPost';
import { truncateSync } from 'fs';
import SeePostLikes from './SeePostLikes';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import DeleteDialog from './DeleteDialog';
import {
  SHOW_COMMENTS_LIKES_BAR,
  UPDATE_LIKES_COUNT_DECREMENT,
  UPDATE_LIKES_COUNT_INCREMENT
} from '../services/feedModerationActions';
import { RootState } from '../store/store';
import { useSelector } from 'react-redux';
import { Comment } from '../models/comment';
import EditCommentBox from './EditComment';
dayjs.extend(relativeTime);
interface CommentProps {
  updateReplies: any;
  comment: Comment;
  postId: string;
  commentArray: Comment[];
  setCommentArray: React.Dispatch<Comment[]>;
  index: number;
  user?: IUser;
  setParentCommentsCount: React.Dispatch<number>;
  parentCommentsCount: number;
  rightSidebarHandler: (action: string, value: any) => void;
}
const PostComents: React.FC<CommentProps> = ({
  comment,
  postId,
  commentArray,
  index,
  setCommentArray,
  user,
  setParentCommentsCount,
  parentCommentsCount,
  rightSidebarHandler,
  updateReplies
}) => {
  // Redux Managed State
  const currentUser = useSelector((state: RootState) => state.currentUser.user);

  // Local states
  const [editCommentMode, setEditCommentMode] = useState<boolean>(false);
  const [repliesArray, setRepliesArray] = useState<Comment[]>([]);
  const [openDialogBox, setOpenDialogBox] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(comment.isLiked);
  const [likesCount, setLikesCount] = useState<number>(comment.likesCount);
  const [commentsCount, setCommentsCount] = useState<number>(comment.commentsCount);
  const [pageCount, setPageCount] = useState<number>(1);
  const [usersMap, setUsersMap] = useState<{ [key: string]: IUser }>({});
  const [loadMoreReplies, setLoadMoreReplies] = useState<boolean>(true);
  const [openCommentsLikesDialog, setOpenCommentsDialog] = useState<boolean>(false);
  const [openDeleteConfirmationDialog, setOpenDeleteConfirmationDialog] = useState<boolean>(false);
  const [showShimmer, setShowShimmer] = useState<boolean>(true);
  useEffect(() => {
    setShowShimmer(false);
  }, [comment]);
  function updateCommentsArray(index: number, comment: Comment) {
    const newArr = [...repliesArray];
    newArr[index] = comment;
    setRepliesArray(newArr);
  }
  function closeDeleteDialog() {
    setOpenDeleteConfirmationDialog(false);
  }
  const repliesDiv = useRef(null);
  useEffect(() => {
    setIsLiked(comment.isLiked);
    setLikesCount(comment.likesCount);
    setCommentsCount(comment.commentsCount);
  }, [comment.isLiked, comment.likesCount, comment.commentsCount]);
  function likeComment() {
    setIsLiked(!isLiked);
    likeAComment();
    if (isLiked) {
      // rightSidebarHandler
      setLikesCount(likesCount - 1);
      rightSidebarHandler(UPDATE_LIKES_COUNT_DECREMENT, {
        postId: postId,
        commentId: comment.Id,
        totalLikes: likesCount - 1
      });
    } else {
      setLikesCount(likesCount + 1);
      rightSidebarHandler(UPDATE_LIKES_COUNT_INCREMENT, {
        postId: postId,
        commentId: comment.Id,
        totalLikes: likesCount + 1
      });
    }
  }
  function renderLikeButton() {
    if (isLiked) {
      return (
        <img
          src={commentLikesFilled}
          alt="like button"
          style={{
            verticalAlign: 'bottom'
          }}
        />
      );
    } else {
      return (
        <img
          src={commentLikes}
          alt="like button"
          style={{
            verticalAlign: 'bottom'
          }}
        />
      );
    }
  }
  async function getComments() {
    try {
      const req: any = await lmFeedClient.getComments(postId, comment.Id, pageCount);
      const replyArray = req?.data?.comment?.replies;
      const userMap = req?.data?.users;
      setUsersMap({ ...usersMap, ...userMap });
      if (pageCount === 1) {
        const tempArr: { [key: string]: number } = {};
        repliesArray.forEach((item: Comment) => (tempArr[item.Id] = 1));
        let newResponseReplies = [];
        newResponseReplies = replyArray?.filter((item: Comment) => {
          if (tempArr[item.Id] != 1) {
            return item;
          }
        });

        setRepliesArray([...repliesArray, ...newResponseReplies]);
      } else {
        setRepliesArray([...repliesArray].concat(replyArray));
      }

      if (replyArray?.length === 0) {
        setLoadMoreReplies(false);
      }
      setPageCount(pageCount + 1);
    } catch (error) {
      console.log(error);
    }
  }
  async function likeAComment() {
    try {
      const req: any = await lmFeedClient.likeComment(postId, comment.Id);
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteComment() {
    try {
      const req: any = await lmFeedClient.deleteComment(postId, comment.Id);
      const newArray = [...commentArray];
      newArray.splice(index, 1);
      setCommentArray(newArray);
      setParentCommentsCount(parentCommentsCount - 1);
    } catch (error) {
      console.log(error);
    }
  }

  function setUserImage() {
    const imageLink = currentUser?.imageUrl;
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
          {currentUser?.name?.split(' ').map((part: string) => {
            return part.charAt(0)?.toUpperCase();
          })}
        </span>
      );
    }
  }

  function handleMenuClick(e: React.MouseEvent) {
    const clickedElementid = e.currentTarget.id;
    switch (clickedElementid) {
      case '6':
        setOpenDeleteConfirmationDialog(true);
        break;
      case '7':
        openReportDialogBox();
        break;
      case 'editCommentMenuTile':
        setEditCommentMode(true);
        break;
    }
    setMenuAnchor(null);
  }
  function openReportDialogBox() {
    setOpenDialogBox(true);
  }
  // functions for input box
  const [text, setText] = useState<string>('');
  const [tagString, setTagString] = useState<string | null>(null);
  const [taggingMemberList, setTaggingMemberList] = useState<any[] | null>(null);
  const [openReplyBox, setOpenReplyBox] = useState<boolean>(false);
  const contentEditableDiv = useRef<HTMLDivElement>(null);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [openCommentsSection, setOpenCommentsSection] = useState<boolean>(false);
  const [newCommentContent, setNewCommentContent] = useState<string>('');
  const editCommentRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (contentEditableDiv && contentEditableDiv.current) {
      if (text === '' && !contentEditableDiv.current.isSameNode(document.activeElement)) {
        contentEditableDiv.current.textContent = 'Write something here...';
      }
    }
  }, [text]);
  function openMenu(e: React.MouseEvent<HTMLButtonElement>) {
    setMenuAnchor(e.currentTarget);
  }
  function closeMenu() {
    setMenuAnchor(null);
  }
  function renderMenu() {
    return (
      <Menu
        // className="lmOverflowMenu"
        open={Boolean(menuAnchor)}
        anchorEl={menuAnchor}
        onClose={closeMenu}
        anchorOrigin={{
          horizontal: 'right',
          vertical: 'top'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        sx={{
          paddingY: '0px'
        }}>
        {comment.menuItems.map((item: IMenuItem) => {
          if (item.id === 8)
            return (
              <div
                className="lmOverflowMenuTitle"
                id={'editCommentMenuTile'}
                key={item.id.toString()}
                onClick={handleMenuClick}
                style={{
                  width: '196px',
                  padding: '1rem',
                  cursor: 'pointer'
                  // boxShadow: '0px 1px 16px 0px rgba(0, 0, 0, 0.24)'
                }}>
                {item.title}
              </div>
            );
          return (
            <div
              className="lmOverflowMenuTitle"
              id={item.id.toString()}
              key={item.id.toString()}
              onClick={handleMenuClick}
              style={{
                width: '196px',
                padding: '1rem',
                cursor: 'pointer'
                // boxShadow: '0px 1px 16px 0px rgba(0, 0, 0, 0.24)'
              }}>
              {item.title}
            </div>
          );
        })}
      </Menu>
    );
  }
  function findTag(str: string): TagInfo | undefined {
    str;
    if (str.length === 0) {
      return undefined;
    }
    const cursorPosition = getCaretPosition();

    const leftLimit = checkAtSymbol(str, cursorPosition - 1);
    leftLimit;
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
  interface MatchPattern {
    type: number;
    displayName?: string;
    routeId?: string;
    link?: string;
  }
  function convertTextToHTML(text: string) {
    const regex = /<<.*?>>|(?:https?|ftp):\/\/\S+|(?<!www\.)\S+\.\S+/g;
    const matches = text.match(regex) || [];
    const splits = text.split(regex);

    const container = document.createElement('div');

    for (let i = 0; i < splits.length; i++) {
      const splitNode = document.createTextNode(splits[i]);
      container.appendChild(splitNode);

      if (matches[i]) {
        const text = matches[i];
        const getInfoPattern = /<<([^|]+)\|([^>>]+)>>/;
        const match = text.match(getInfoPattern);
        const userObject: MatchPattern = {
          type: 1
        };
        if (match) {
          const userName = match[1];
          const userId = match[2];
          userObject.displayName = userName;
          userObject.routeId = userId;
        } else {
          userObject.type = 2;
          userObject.link = text;
        }
        if (userObject.type === 1) {
          const matchText = matches[i].slice(2, -2); // Remove '<<' and '>>'
          const linkNode = document.createElement('a');
          linkNode.href = '#'; // You can set the appropriate URL here
          linkNode.textContent = userObject.displayName!;
          linkNode.id = userObject.routeId!;
          container.appendChild(linkNode);
        } else {
          const linkNode = document.createElement('a');
          linkNode.href = userObject.link!; // You can set the appropriate URL here
          linkNode.textContent = userObject.link!;
          container.appendChild(linkNode);
        }
      }
    }

    return container;
  }
  function setTagUserImage(user: any, dimension: string) {
    const imageLink = user?.imageUrl;
    if (imageLink !== '') {
      return (
        <img
          src={imageLink}
          alt={''}
          style={{
            width: dimension,
            height: dimension,
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

  function showReplyBox() {
    if (openReplyBox) {
      return (
        <div className="commentInputBox">
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
                  if (text?.trim().length === 0) {
                    contentEditableDiv.current.textContent = `Write your comment`;
                  }
                }
              }}
              onFocus={() => {
                if (contentEditableDiv && contentEditableDiv.current) {
                  if (text?.trim() === '') {
                    contentEditableDiv.current.textContent = ``;
                  }
                }
              }}
              onKeyDown={(e: React.KeyboardEvent) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  postReply();
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
                // if (focusNode === null || text.length === 0) {
                //   return;
                // }
                let textContentFocusNode = focusNode.textContent;

                let tagOp = findTag(textContentFocusNode!);
                if (tagOp?.tagString !== null && tagOp?.tagString !== undefined) {
                  setTagString(tagOp?.tagString!);
                }
              }}>
              {/*  */}
            </div>
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
                        ('A');
                        let div = focusNode.parentElement;
                        let text = div!.childNodes;
                        if (focusNode === null || text.length === 0) {
                          return;
                        }
                        ('B');
                        let textContentFocusNode = focusNode.textContent;
                        if (textContentFocusNode === null) {
                          return;
                        }
                        ('C');
                        let tagOp = findTag(textContentFocusNode);
                        ('D');
                        if (tagOp === undefined) return;
                        ('E');
                        let substr = tagOp?.tagString;
                        const { limitLeft, limitRight } = tagOp;

                        let textNode1Text = textContentFocusNode.substring(0, limitLeft - 1);
                        let textNode2Text = textContentFocusNode.substring(limitRight + 1);

                        let textNode1 = document.createTextNode(textNode1Text);
                        let anchorNode = document.createElement('a');
                        anchorNode.id = item?.id;
                        anchorNode.href = '#';
                        anchorNode.textContent = `@${item?.name.trim()}`;
                        anchorNode.contentEditable = 'false';
                        let textNode2 = document.createTextNode(textNode2Text);
                        const dummyNode = document.createElement('span');
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
                        {setTagUserImage(item, '40px')}
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
          {/* <div className="postCommentButton">
            <IconButton onClick={postReply}>
              <SendIcon />
            </IconButton>
          </div> */}
        </div>
      );
    } else {
      return null;
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
  // function renamed to post comments
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
      uuid: currentUser?.uuid!
    };
    return tempComment;
  }
  async function postReply() {
    try {
      let textContent: string = extractTextFromNode(contentEditableDiv.current);
      if (textContent.length === 0) {
        return;
      }
      while (contentEditableDiv.current?.firstChild) {
        contentEditableDiv.current.removeChild(contentEditableDiv.current.firstChild);
      }
      const timeStamp = Date.now().toString();
      // setOpenReplyBox(false);
      // setOpenCommentsSection(true);
      const tempComment = makeTempComment(timeStamp, textContent);
      let newRepliesArray = [];
      newRepliesArray.push(tempComment);
      newRepliesArray = newRepliesArray.concat([...repliesArray]);
      setRepliesArray(newRepliesArray);
      const response: any = await lmFeedClient.replyComment(
        postId,
        comment.Id,
        textContent,
        timeStamp
      );
      if (response.status && response.comment) {
        setRepliesArray([{ ...response.comment }, ...repliesArray]);
      } else {
        setRepliesArray([...repliesArray]);
      }

      setCommentsCount(commentsCount + 1);
    } catch (error) {
      lmFeedClient.logError(error);
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
  const [isReadMore, setIsReadMore] = useState(true);
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
  useEffect(() => {
    if (!tagString) {
      setTaggingMemberList([]);
    }
  }, [tagString]);
  useEffect(() => {
    getComments();
  }, []);
  function returnCommentBox() {
    return (
      <div>
        <div className="commentWrapper--upperLayer" id={comment.Id}>
          <div className="commentWrapper__upperLayer--contentBox">
            <div className="commentWrapper--contentContainer">
              <div className="commentWrapper--commentContent">
                <div className="commentWrapper__commentContent--username">{user?.name}</div>
                <div
                  className="commentWrapper__commentContent--content"
                  style={{
                    overflowWrap: 'anywhere'
                  }}>
                  {showContentOfComment()}
                </div>
              </div>
            </div>
          </div>
          <div className="commentWrapper__upperLayer--menuActionArea">
            <span
              onClick={openMenu}
              style={{
                height: '24px',
                width: '24px',
                marginRight: '8px',
                cursor: 'pointer'
              }}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8 12C8 10.9 7.1 10 6 10C4.9 10 4 10.9 4 12C4 13.1 4.9 14 6 14C7.1 14 8 13.1 8 12ZM10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10C10.9 10 10 10.9 10 12ZM16 12C16 13.1 16.9 14 18 14C19.1 14 20 13.1 20 12C20 10.9 19.1 10 18 10C16.9 10 16 10.9 16 12Z"
                  fill="#666666"
                />
              </svg>
            </span>

            {renderMenu()}
          </div>
        </div>
        <div className="commentWrapper--commentActions">
          <span
            className="like"
            style={{
              height: '24px',
              width: '24px',
              textAlign: 'center'
            }}
            onClick={likeComment}>
            {renderLikeButton()}
          </span>
          <span
            className="likes-count"
            onClick={() => {
              if (likesCount) {
                rightSidebarHandler(SHOW_COMMENTS_LIKES_BAR, {
                  postId: postId,
                  entityType: 2,
                  totalLikes: likesCount,
                  commentId: comment.Id
                });
              } else {
                likeComment();
              }
            }}
            style={{ cursor: 'pointer' }}>
            {likesCount ? likesCount : null} {likesCount > 1 ? 'Likes' : 'Like'}
          </span>
          {comment.level === 0 ? (
            <>
              {' '}
              <span className="replies"> | </span>
              <span className="replies">
                <span
                  style={{
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    setOpenReplyBox(!openReplyBox);
                  }}>
                  {commentsCount > 0 ? <span className="dotAfter">Reply</span> : 'Reply'}
                </span>{' '}
                <span
                  style={{
                    cursor: 'pointer',
                    // color: openCommentsSection && commentsCount > 0 ? '#5046E5' : 'rgba(72, 79, 103, 0.7)',
                    color: 'rgba(72, 79, 103, 0.7)'
                  }}
                  className="replyCount"
                  onClick={() => {
                    if (commentsCount !== repliesArray.length) {
                      getComments();
                    }
                    setOpenCommentsSection(!openCommentsSection);
                  }}>
                  <span>
                    {commentsCount > 0 ? commentsCount + ' ' : null}
                    {commentsCount === 0 ? '' : commentsCount > 1 ? 'Replies' : 'Reply'}
                  </span>
                </span>
              </span>
            </>
          ) : null}

          <span
            className="replies"
            style={{
              flexGrow: 1,
              textAlign: 'right'
            }}>
            {comment.isEdited ? (
              <span
                className="elevated-dot"
                style={{
                  color: 'rgba(15, 30, 61, 0.4)'
                }}>
                Edited <span className="dotAfter"></span>
              </span>
            ) : null}
            <> {dayjs(comment.createdAt).fromNow()}</>
          </span>
        </div>
      </div>
    );
  }
  function showContentOfComment() {
    switch (showShimmer) {
      case true:
        return (
          <Skeleton
            height={14}
            sx={{
              marginLeft: '24px',
              borderRadius: '4px'
            }}
            width={'80%'}
            variant="rectangular"
          />
        );
      default: {
        return (
          <>
            {isReadMore && comment.text.length > 300
              ? Parser().parse(convertTextToHTML(comment.text.substring(0, 300)).innerHTML)
              : Parser().parse(convertTextToHTML(comment.text).innerHTML)}
            {isReadMore && comment.text.length > 300 ? (
              <span
                style={{
                  color: 'gray',
                  fontWeight: '400',
                  cursor: 'pointer',

                  fontSize: '14px'
                }}
                onClick={() => setIsReadMore(false)}>
                ...ReadMore
              </span>
            ) : null}
          </>
        );
      }
    }
  }
  function renderCommentContainer() {
    switch (editCommentMode) {
      case true: {
        return (
          <div>
            <div className="commentWrapper--upperLayer" id={comment.Id} ref={editCommentRef}>
              <div className="commentWrapper__upperLayer--contentBox">
                <div className="commentWrapper--contentContainer">
                  <div className="commentWrapper--commentContent">
                    <div className="commentWrapper__commentContent--username">{user?.name}</div>
                    <div
                      className="commentWrapper__commentContent--content"
                      style={{
                        overflowWrap: 'anywhere'
                      }}>
                      <EditCommentBox
                        update={setNewCommentContent}
                        minHeight={'24px'}
                        placeholder="Write your comment"
                        editValuePreset={true}
                        editFieldValue={comment.text}
                        setEditCommentMode={setEditCommentMode}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginRight: '10px'
                }}>
                <span
                  style={{
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    setShowShimmer(true);
                    lmFeedClient
                      .editComment(postId, comment.Id, newCommentContent)
                      .then((res: any) => {
                        comment = res?.data?.comment;
                        updateReplies(index, res?.data?.comment);
                      });
                    setEditCommentMode(false);
                  }}>
                  <svg
                    width="20"
                    height="22"
                    viewBox="0 0 20 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M18.6535 9.68369L2.85657 0.843068C2.59336 0.689576 2.29028 0.618275 1.98624 0.638321C1.68221 0.658368 1.3911 0.768846 1.15032 0.955568C0.904423 1.14958 0.725886 1.41613 0.640059 1.71736C0.554233 2.01859 0.565478 2.33921 0.672199 2.63369L3.30657 9.99307C3.33322 10.0664 3.38159 10.13 3.44523 10.1752C3.50886 10.2204 3.58476 10.2452 3.66282 10.2462H10.4316C10.6262 10.2431 10.8147 10.314 10.9592 10.4445C11.1036 10.575 11.1931 10.7554 11.2097 10.9493C11.2161 11.0517 11.2015 11.1543 11.1666 11.2507C11.1318 11.3472 11.0776 11.4355 11.0073 11.5102C10.937 11.5849 10.8522 11.6444 10.758 11.685C10.6638 11.7256 10.5623 11.7464 10.4597 11.7462H3.66282C3.58476 11.7472 3.50886 11.772 3.44523 11.8172C3.38159 11.8624 3.33322 11.9259 3.30657 11.9993L0.672199 19.3587C0.593155 19.5854 0.569337 19.8277 0.602724 20.0655C0.63611 20.3033 0.725738 20.5296 0.864165 20.7258C1.00259 20.922 1.18582 21.0823 1.39864 21.1935C1.61146 21.3046 1.84773 21.3634 2.08782 21.3649C2.34332 21.3638 2.59455 21.2994 2.81907 21.1774L18.6535 12.3087C18.8854 12.177 19.0783 11.9861 19.2126 11.7555C19.3468 11.525 19.4175 11.263 19.4175 10.9962C19.4175 10.7294 19.3468 10.4674 19.2126 10.2369C19.0783 10.0063 18.8854 9.81543 18.6535 9.68369Z"
                      fill="#00897b"
                    />
                  </svg>
                </span>
              </div>
            </div>
            <div className="commentWrapper--commentActions">
              <span
                className="like"
                style={{
                  height: '24px',
                  width: '24px',
                  textAlign: 'center'
                }}
                onClick={likeComment}>
                {renderLikeButton()}
              </span>
              <span
                className="likes-count"
                onClick={() => {
                  if (likesCount) {
                    rightSidebarHandler(SHOW_COMMENTS_LIKES_BAR, {
                      postId: postId,
                      entityType: 2,
                      totalLikes: likesCount,
                      commentId: comment.Id
                    });
                  } else {
                    likeComment();
                  }
                }}
                style={{ cursor: 'pointer' }}>
                {likesCount ? likesCount : null} {likesCount > 1 ? 'Likes' : 'Like'}
              </span>
              {comment.level === 0 ? (
                <>
                  {' '}
                  <span className="replies"> | </span>
                  <span className="replies">
                    <span
                      style={{
                        cursor: 'pointer'
                      }}
                      onClick={() => {
                        setOpenReplyBox(!openReplyBox);
                        setOpenCommentsSection(true);
                      }}>
                      {commentsCount > 0 ? <span className="dotAfter">Reply</span> : 'Reply'}
                    </span>{' '}
                    <span
                      style={{
                        cursor: 'pointer',
                        color:
                          openCommentsSection && commentsCount > 0
                            ? '#5046E5'
                            : 'rgba(72, 79, 103, 0.7)'
                      }}
                      className="replyCount"
                      onClick={() => {
                        if (commentsCount !== repliesArray.length) {
                          getComments();
                        }
                        setOpenCommentsSection(!openCommentsSection);
                        // if (commentsCount > 0) {

                        // }
                      }}>
                      <span>
                        {commentsCount > 0 ? commentsCount + ' ' : null}
                        {commentsCount === 0 ? '' : commentsCount > 1 ? 'Replies' : 'Reply'}
                      </span>
                    </span>
                  </span>
                </>
              ) : null}

              <span
                className="replies"
                style={{
                  flexGrow: 1,
                  textAlign: 'right'
                }}>
                {dayjs(comment.createdAt).fromNow()}
              </span>
            </div>
          </div>
        );
      }
      default: {
        return returnCommentBox();
      }
    }
  }
  return (
    <div
      className="commentWrapper"
      style={{
        borderBottom: comment.level > 0 ? 'none' : '1px solid #dde3ed'
      }}>
      <Dialog open={openDeleteConfirmationDialog} onClose={closeDeleteDialog}>
        <DeleteDialog onClose={closeDeleteDialog} deleteComment={deleteComment} type={2} />
      </Dialog>
      {/* <div className="commentWrapper--upperLayer">
        <div className="commentWrapper__upperLayer--contentBox">
          <div className="commentWrapper--username">
            <span className="displayName">{user?.name}</span>
            <span className="displayTitle"></span>
          </div>
          <div className="commentWrapper--commentContent">
            <div
              className="commentWrapper__commentContent--content"
              style={{
                overflowWrap: 'anywhere'
              }}>
              {isReadMore && comment.text.length > 300
                ? Parser().parse(convertTextToHTML(comment.text.substring(0, 300)).innerHTML)
                : Parser().parse(convertTextToHTML(comment.text).innerHTML)}
              {isReadMore && comment.text.length > 300 ? (
                <span
                  style={{
                    color: 'gray',
                    fontWeight: '400',
                    cursor: 'pointer',

                    fontSize: '14px'
                  }}
                  onClick={() => setIsReadMore(false)}>
                  ...ReadMore
                </span>
              ) : null}
            </div>
          </div>
        </div>
        <div className="commentWrapper__upperLayer--menuActionArea">
          <IconButton
            onClick={openMenu}
            style={{
              height: '24px',
              width: '24px',
              marginLeft: '8px',
              marginRight: '16px',
              cursor: 'pointer'
            }}
            sx={{
              $hover: {
                background: 'none'
              }
            }}>
            <img
              src={overflowIcon}
              alt="overflow icon"
              style={{
                cursor: 'pointer'
              }}
            />
          </IconButton>
          {renderMenu()}
        </div>
      </div> */}
      {/* <div className="commentWrapper--commentActions">
        <span
          className="like"
          style={{
            height: '24px',
            width: '24px',
            textAlign: 'center'
          }}
          onClick={likeComment}>
          {renderLikeButton()}
        </span>
        <span
          className="likes-count"
          onClick={() => {
            if (likesCount) {
              rightSidebarHandler(SHOW_COMMENTS_LIKES_BAR, {
                postId: postId,
                entityType: 2,
                totalLikes: likesCount,
                commentId: comment.Id
              });
            } else {
              likeComment();
            }
          }}
          style={{ cursor: 'pointer' }}>
          {likesCount ? likesCount : null} {likesCount > 1 ? 'Likes' : 'Like'}
        </span>
        {comment.level === 0 ? (
          <>
            {' '}
            <span className="replies"> | </span>
            <span className="replies">
              <span
                style={{
                  cursor: 'pointer'
                }}
                onClick={() => {
                  setOpenReplyBox(!openReplyBox);
                  setOpenCommentsSection(true);
                }}>
                {commentsCount > 0 ? <span className="dotAfter">Reply</span> : 'Reply'}
              </span>{' '}
              <span
                style={{
                  cursor: 'pointer',
                  color:
                    openCommentsSection && commentsCount > 0 ? '#5046E5' : 'rgba(72, 79, 103, 0.7)'
                }}
                className="replyCount"
                onClick={() => {
                  if (commentsCount !== repliesArray.length) {
                    getComments();
                  }
                  setOpenCommentsSection(!openCommentsSection);
                  // if (commentsCount > 0) {

                  // }
                }}>
                <span>
                  {commentsCount > 0 ? commentsCount + ' ' : null}
                  {commentsCount === 0 ? '' : commentsCount > 1 ? 'Replies' : 'Reply'}
                </span>
              </span>
            </span>
          </>
        ) : null}

        <span
          className="replies"
          style={{
            flexGrow: 1,
            textAlign: 'right'
          }}>
          {dayjs(comment.createdAt).fromNow()}
        </span>
      </div> */}
      {renderCommentContainer()}
      {showReplyBox()}
      <div
        style={{
          paddingLeft: '52px',
          maxHeight: '328.5px',
          overflowY: 'auto'
        }}
        id={comment.Id}>
        <InfiniteScroll
          loader={null}
          hasMore={loadMoreReplies}
          next={getComments}
          dataLength={repliesArray?.length}
          scrollableTarget={comment.Id}>
          {repliesArray.length && openCommentsSection
            ? repliesArray.map((comment: Comment, index: number, commentArray: Comment[]) => {
                return (
                  <PostComents
                    parentCommentsCount={commentsCount}
                    setParentCommentsCount={setCommentsCount}
                    comment={comment}
                    postId={postId}
                    key={comment.Id}
                    index={index}
                    commentArray={commentArray}
                    setCommentArray={setRepliesArray}
                    user={usersMap[comment?.uuid]}
                    rightSidebarHandler={rightSidebarHandler}
                    updateReplies={updateCommentsArray}
                  />
                );
              })
            : null}
        </InfiniteScroll>
        <Dialog
          open={openDialogBox}
          onClose={() => {
            setOpenDialogBox(false);
          }}>
          <ReportPostDialogBox
            entity={comment.level === 0 ? 6 : 7}
            uuid={comment.uuid}
            closeBox={() => {
              setOpenDialogBox(false);
            }}
            reportedPostId={postId}
          />
        </Dialog>
        <Dialog open={openCommentsLikesDialog} onClose={() => setOpenCommentsDialog(false)}>
          <SeePostLikes
            entityType={2}
            entityId={postId}
            onClose={() => setOpenCommentsDialog(false)}
            likesCount={likesCount}
            commentId={comment.Id}
          />
        </Dialog>
      </div>
    </div>
  );
};

export default PostComents;
