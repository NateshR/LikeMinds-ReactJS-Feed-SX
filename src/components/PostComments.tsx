// src/Header/Header.tsx

import React, { useContext, useEffect, useRef, useState } from 'react';
import defaultUserImage from '../assets/images/defaultUserImage.png';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { IComment, IMenuItem, IUser } from 'likeminds-sdk';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { lmFeedClient } from '..';
import SendIcon from '@mui/icons-material/Send';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import './../assets/css/post-footer.css';
import './../assets/css/comments.css';
// import './../assets/css/post-footer.css';
import {
  TagInfo,
  checkAtSymbol,
  findSpaceAfterIndex,
  getCaretPosition
} from './dialog/createPost/CreatePostDialog';
import InfiniteScroll from 'react-infinite-scroll-component';
import UserContext from '../contexts/UserContext';
interface CommentProps {
  comment: IComment;
  postId: string;
  commentArray: IComment[];
  setCommentArray: React.Dispatch<IComment[]>;
  index: number;
  user?: IUser;
}
const PostComents: React.FC<CommentProps> = ({
  comment,
  postId,
  commentArray,
  index,
  setCommentArray,
  user
}) => {
  const [repliesArray, setRepliesArray] = useState<IComment[]>([]);
  const [isLiked, setIsLiked] = useState<boolean>(comment.isLiked);
  const [likesCount, setLikesCount] = useState<number>(comment.likesCount);
  const [commentsCount, setCommentsCount] = useState<number>(comment.commentsCount);
  const [pageCount, setPageCount] = useState<number>(1);
  const [usersMap, setUsersMap] = useState<{ [key: string]: IUser }>({});
  const [loadMoreReplies, setLoadMoreReplies] = useState<boolean>(true);
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
      setLikesCount(likesCount - 1);
    } else {
      setLikesCount(likesCount + 1);
    }
  }
  function renderLikeButton() {
    if (isLiked) {
      return (
        <Favorite
          sx={{
            color: '#FB1609',
            fontSize: '16px'
          }}
        />
      );
    } else {
      return <FavoriteBorder sx={{ fontSize: '16px' }} />;
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
        repliesArray.forEach((item: IComment) => (tempArr[item.Id] = 1));
        let newResponseReplies = replyArray.filter((item: IComment) => {
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
      // setRepliesArray(req.data.comment.replies);
      // console.log(req);
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
    } catch (error) {
      console.log(error);
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
            backgroundColor: 'gray',
            display: 'inline-flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          {userContext.user?.name?.split(' ').map((part: string) => {
            return part.charAt(0)?.toUpperCase();
          })}
        </span>
      );
    }
  }

  function handleMenuClick(e: React.MouseEvent) {
    const clickedElementid = e.currentTarget.id;
    console.log(e.target);
    switch (clickedElementid) {
      case '6':
        return deleteComment();
    }
  }
  // functions for input box
  const [text, setText] = useState<string>('');
  const [tagString, setTagString] = useState('');
  const [taggingMemberList, setTaggingMemberList] = useState<any[] | null>(null);
  const [openReplyBox, setOpenReplyBox] = useState<boolean>(false);
  const contentEditableDiv = useRef<HTMLDivElement>(null);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [openCommentsSection, setOpenCommentsSection] = useState<boolean>(false);
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
      <Menu open={Boolean(menuAnchor)} anchorEl={menuAnchor} onClose={closeMenu}>
        {comment.menuItems.map((item: IMenuItem) => {
          if (item.id === 8) return null;
          return (
            <MenuItem id={item.id.toString()} key={item.id.toString()} onClick={handleMenuClick}>
              {item.title}
            </MenuItem>
          );
        })}
      </Menu>
    );
  }
  function findTag(str: string): TagInfo | undefined {
    if (str.length === 0) {
      return undefined;
    }
    const cursorPosition = getCaretPosition();
    // // console.log ("the cursor position is: ", cursorPosition)
    const leftLimit = checkAtSymbol(str, cursorPosition - 1);
    if (leftLimit === -1) {
      // setCloseDialog(); // Assuming this function is defined somewhere else and handled separately.
      return undefined;
    }
    const rightLimit = findSpaceAfterIndex(str, cursorPosition - 1);
    // // console.log ("the right limit is :", rightLimit)
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
    const regex = /<<.*?>>|(?:https?|ftp):\/\/[^\s/$.?#].[^\s]*|www\.[^\s/$.?#].[^\s]*/g;
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

  function showReplyBox() {
    if (openReplyBox) {
      return (
        <div className="commentInputBox">
          <div className="profile">{setUserImage()}</div>
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
                    // alert('hello');
                    contentEditableDiv.current.textContent = `Write something here...`;
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
                if (
                  tagOp?.tagString !== null &&
                  tagOp?.tagString !== undefined &&
                  tagOp?.tagString !== ''
                ) {
                  setTagString(tagOp?.tagString!);
                }
              }}></div>
            {taggingMemberList && taggingMemberList?.length > 0 ? (
              <div
                style={{
                  maxHeight: '100px',
                  overflowY: 'auto'
                }}>
                {taggingMemberList?.map!((item: any) => {
                  return (
                    <button
                      key={item?.id}
                      style={{
                        background: 'white',
                        padding: '12px',
                        display: 'block',
                        border: 'none',
                        width: '100%',
                        textAlign: 'left'
                      }}
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
                        // console.log ('the tag string is ', tagOp!.tagString);
                        if (tagOp === undefined) return;
                        let substr = tagOp?.tagString;
                        const { limitLeft, limitRight } = tagOp;
                        if (!substr || substr.length === 0) {
                          return;
                        }
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
                      {item?.name}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
          <div className="postCommentButton">
            <IconButton onClick={postReply}>
              <SendIcon />
            </IconButton>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  // function renamed to post comments
  async function postReply() {
    try {
      let textContent: string = extractTextFromNode(contentEditableDiv.current);
      if (textContent.length === 0) {
        return;
      }
      while (contentEditableDiv.current?.firstChild) {
        contentEditableDiv.current.removeChild(contentEditableDiv.current.firstChild);
      }
      setOpenReplyBox(false);
      const response: any = await lmFeedClient.replyComment(postId, comment.Id, textContent);
      let newAddedComment: IComment = response.data.comment;
      if (repliesArray.length) {
        let newRepliesArray = [];
        newRepliesArray.push(newAddedComment);
        newRepliesArray = newRepliesArray.concat([...repliesArray]);
        setRepliesArray(newRepliesArray);
      }
      setCommentsCount(commentsCount + 1);
      console.log(response);
    } catch (error) {
      lmFeedClient.logError(error);
    }
  }
  useEffect(() => {
    if (!tagString && !(tagString.length > 0)) {
      return;
    }
    async function getTags() {
      const tagListResponse = await lmFeedClient.getTaggingList(tagString);

      const memberList = tagListResponse?.data?.members;
      console.log(memberList);
      if (memberList && memberList.length > 0) {
        console.log('setting tag member list');
        setTaggingMemberList(memberList);
      } else {
        console.log('setting tag member list  to null');
        setTaggingMemberList(null);
      }
    }
    const timeout = setTimeout(() => {
      getTags();
    }, 500);
    return () => {
      clearTimeout(timeout);
    };
  }, [tagString]);
  return (
    <div className="commentWrapper">
      <div className="commentWrapper--username">
        <span className="displayName">{user?.name || 'Ronald Richard'}</span>
        <span className="displayTitle"></span>
      </div>
      <div className="commentWrapper--commentContent">
        <div
          className="commentWrapper__commentContent--content"
          dangerouslySetInnerHTML={{
            __html: convertTextToHTML(comment.text).innerHTML
          }}></div>
        <IconButton onClick={openMenu}>
          <MoreVertIcon
            sx={{
              fontSize: '14px'
            }}
          />
        </IconButton>
        {renderMenu()}
      </div>
      <div className="commentWrapper--commentActions">
        <span className="like">
          <IconButton onClick={likeComment}>{renderLikeButton()}</IconButton>
        </span>
        <span className="replies">{likesCount} Likes</span>
        {' | '}
        <span className="replies">
          <span
            style={{
              cursor: 'pointer'
            }}
            onClick={() => setOpenReplyBox(!openReplyBox)}>
            Reply.
          </span>{' '}
          <span
            style={{
              cursor: 'pointer'
            }}
            onClick={() => {
              getComments();
              setOpenCommentsSection(true);
            }}>
            <span>{commentsCount} replies</span>
          </span>
        </span>
        {showReplyBox()}
        <div
          style={{
            marginLeft: '4px',
            maxHeight: '300px',
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
              ? repliesArray.map((comment: IComment, index: number, commentArray: IComment[]) => {
                  return (
                    <PostComents
                      comment={comment}
                      postId={postId}
                      key={comment.Id}
                      index={index}
                      commentArray={commentArray}
                      setCommentArray={setRepliesArray}
                      user={usersMap[comment?.uuid]}
                    />
                  );
                })
              : null}
          </InfiniteScroll>
        </div>
      </div>
    </div>
  );
};

export default PostComents;
