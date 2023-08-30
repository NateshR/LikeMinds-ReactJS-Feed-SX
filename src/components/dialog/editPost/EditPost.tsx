import React, { useContext, useEffect, useRef, useState } from 'react';

import '../createPost/createPostDialog.css';
import UserContext from '../../../contexts/UserContext';
import { lmFeedClient } from '../../..';
import { DecodeUrlModelSX } from '../../../services/models';
import { Attachment, AttachmentMeta, IPost } from '@likeminds.community/feed-js';
import { returnCSSForTagging, setCursorAtEnd } from '../createPost/CreatePostDialog';
import InfiniteScroll from 'react-infinite-scroll-component';

interface CreatePostDialogProps {
  dialogBoxRef?: React.RefObject<HTMLDivElement>; // Replace "HTMLElement" with the actual type of the ref
  closeCreatePostDialog: () => void;
  //   showMediaAttachmentOnInitiation: boolean;
  //   setShowMediaAttachmentOnInitiation: React.Dispatch<React.SetStateAction<boolean>>;
  setFeedArray: React.Dispatch<React.SetStateAction<IPost[]>>;
  feedArray: IPost[];
  post: IPost | null;
}
interface Limits {
  left: number;
  right: number;
}
export interface TagInfo {
  tagString: string;
  limitLeft: number;
  limitRight: number;
}

export const getCaretPosition = (): number => {
  const selection = window.getSelection();
  const editableDiv = selection?.focusNode as Node;
  let caretPos = 0;
  if (window.getSelection()) {
    if (selection?.rangeCount && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(editableDiv);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      caretPos = preCaretRange.toString().length;
    }
  }
  return caretPos;
};

export function findSpaceAfterIndex(str: string, index: number): number {
  if (index < 0 || index >= str.length) {
    throw new Error('Invalid index');
  }
  let pos = -1;
  for (let i = index + 1; i < str.length; i++) {
    if (str[i] === ' ') {
      pos = i - 1;
      break;
    } else if (str[i] === '@') {
      pos = i - 1;
      break;
    }
  }
  if (pos === -1) {
    return str.length - 1;
  } else {
    return pos;
  }
}

export function checkAtSymbol(str: string, index: number): number {
  if (index < 0 || index >= str.length) {
    return -1;
  }
  let pos = -1;
  for (let i = index; i >= 0; i--) {
    if (str[i] === '@') {
      pos = i;
      break;
    }
  }
  if (pos === -1) {
    return -1;
  } else if (pos === 0) {
    return 1;
  } else if (pos > 0 && /\s/.test(str[pos - 1])) {
    return pos + 1;
  } else {
    return -1;
  }
}

const EditPost = ({
  closeCreatePostDialog,

  setFeedArray,
  feedArray,
  post
}: CreatePostDialogProps) => {
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
            display: 'inline-flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#5046e5',
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#fff',
            letterSpacing: '1px',
            borderRadius: '50%'
          }}>
          {userContext.user?.name?.split(' ').map((part: string) => {
            return part.charAt(0)?.toUpperCase();
          })}
        </span>
      );
    }
  }
  const [text, setText] = useState<string>(post?.text!);
  const [showMediaUploadBar, setShowMediaUploadBar] = useState<null | boolean>(true);
  const [showInitiateUploadComponent, setShowInitiateUploadComponent] = useState<boolean>(false);
  const [imageOrVideoUploadArray, setImageOrVideoUploadArray] = useState<any>([]);
  const [documentUploadArray, setDocumentUploadArray] = useState<any>([]);
  const [attachmentType, setAttachmentType] = useState<null | number>(0);
  const [showOGTagPreview, setShowOGTagPreview] = useState<boolean>(false);
  const [previewOGTagData, setPreviewOGTagData] = useState<any>([]);
  const [hasPreviewClosedOnce, setHasPreviewClosedOnce] = useState<boolean>(false);
  const [loadMoreTaggingUsers, setLoadMoreTaggingUsers] = useState<boolean>(true);
  const [limits, setLimits] = useState<Limits>({
    left: 0,
    right: 0
  });
  function setToEndOfContent(element: HTMLDivElement): void {
    if (element.contentEditable === 'true') {
      const range = document.createRange();
      const selection = window.getSelection();

      if (selection) {
        const lastChild = element.lastChild;
        const lastNode =
          lastChild instanceof Text ? lastChild : element.appendChild(document.createTextNode(''));

        range.setStart(lastNode, lastNode.length);
        range.collapse(true);

        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }

  useEffect(() => {
    const attachments = post?.attachments;
    if (!attachments?.length) {
      return;
    }
    const newMediaArray: any = [];
    const newDocArray: any = [];
    const newOGTagArray: any = [];
    attachments.forEach((item: Attachment) => {
      if (item.attachmentType === 1 || item.attachmentType === 2) {
        newMediaArray.push(
          Attachment.builder()
            .setAttachmentType(item.attachmentType)
            .setAttachmentMeta(
              AttachmentMeta.builder()
                .seturl(item.attachmentMeta.url!)
                .setsize(item.attachmentMeta.size!)
                .setname(item.attachmentMeta.name!)
                .setformat(item.attachmentMeta.format!)
                .setduration(item.attachmentType === 2 ? item.attachmentMeta.duration! : 0)
                .build()
            )
            .build()
        );
      } else if (item.attachmentType === 3) {
        newDocArray.push(
          Attachment.builder()
            .setAttachmentType(item.attachmentType)
            .setAttachmentMeta(
              AttachmentMeta.builder()
                .seturl(item.attachmentMeta.url!)
                .setsize(item.attachmentMeta.size!)
                .setname(item.attachmentMeta.name!)
                .setformat('document/pdf')
                .build()
            )
            .build()
        );
      } else {
        newOGTagArray.push(
          Attachment.builder()
            .setAttachmentType(item.attachmentType)
            .setAttachmentMeta(
              AttachmentMeta.builder().setogTags(item.attachmentMeta.ogTags).build()
            )
            .build()
        );
      }
    });
    setImageOrVideoUploadArray(newMediaArray);
    setDocumentUploadArray(newDocArray);
    setPreviewOGTagData(newOGTagArray);
  }, [post, feedArray]);
  const [tagString, setTagString] = useState<string | null>(null);
  const [taggingMemberList, setTaggingMemberList] = useState<any[]>([]);
  const contentEditableDiv = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (contentEditableDiv.current) {
      contentEditableDiv.current.innerHTML = convertTextToHTML(post?.text!).innerHTML;
    }
  }, []);
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
  const attachmentProps = {
    showMediaUploadBar,
    setShowMediaUploadBar,
    imageOrVideoUploadArray,
    setImageOrVideoUploadArray,
    documentUploadArray,
    setDocumentUploadArray,
    attachmentType,
    setAttachmentType,
    showInitiateUploadComponent,
    setShowInitiateUploadComponent,
    showOGTagPreview,
    setShowOGTagPreview,
    previewOGTagData,
    setPreviewOGTagData,
    hasPreviewClosedOnce,
    setHasPreviewClosedOnce
    // showMediaAttachmentOnInitiation
  };

  const setCloseDialog = () => {};
  function findTag(str: string): TagInfo | undefined {
    if (str.length === 0) {
      return undefined;
    }
    const cursorPosition = getCaretPosition();
    // // ("the cursor position is: ", cursorPosition)
    const leftLimit = checkAtSymbol(str, cursorPosition - 1);
    if (leftLimit === -1) {
      setCloseDialog(); // Assuming this function is defined somewhere else and handled separately.
      return undefined;
    }
    const rightLimit = findSpaceAfterIndex(str, cursorPosition - 1);
    // // ("the right limit is :", rightLimit)
    const substr = str.substring(leftLimit, rightLimit + 1);
    setLimits({
      left: leftLimit,
      right: rightLimit
    });
    setTaggingPageCount(1);
    return {
      tagString: substr,
      limitLeft: leftLimit,
      limitRight: rightLimit
    };
  }

  function resetContext() {
    setShowMediaUploadBar(true);
    setImageOrVideoUploadArray(null);
    setDocumentUploadArray(null);
    if (contentEditableDiv.current) {
      const nodes = contentEditableDiv.current.childNodes;
      while (nodes.length) {
        const el = nodes[0];
        contentEditableDiv.current.removeChild(el);
      }
    }
    setText('');
    setAttachmentType(null);
    setShowInitiateUploadComponent(false);
    // setShowMediaAttachmentOnInitiation(false);
  }
  const PLACE_HOLDER_TEXT = 'Write something here...';
  async function postFeed() {
    try {
      let textContent = extractTextFromNode(contentEditableDiv.current);
      textContent.trim();
      if (textContent === PLACE_HOLDER_TEXT) {
        textContent = '';
      }

      closeDialogBox();
      let response: any;

      if (textContent === '') {
        return;
      }
      let newArr: any[] = [];
      if (imageOrVideoUploadArray.length > 0) {
        newArr = [...imageOrVideoUploadArray];
      }
      if (documentUploadArray.length > 0) {
        newArr = [...documentUploadArray];
      }
      newArr = newArr.map((item: any) => {
        if (item.attachmentType === 3) {
          item.attachmentMeta.format = 'document/pdf';
        }
        return item;
      });
      response = await lmFeedClient.editPost(post?.Id!, textContent, [
        ...imageOrVideoUploadArray,
        ...documentUploadArray,
        ...previewOGTagData
      ]);
      const newpost: IPost = response?.data?.post;
      const newFeedArray = [...feedArray];
      const thisFeedIndex = newFeedArray.findIndex((item: IPost) => item.Id === post?.Id!);
      newFeedArray[thisFeedIndex] = { ...newpost };
      setFeedArray(newFeedArray);
    } catch (error) {
      lmFeedClient.logError(error);
    }
  }
  async function checkForOGTags(ogTagLinkArray: string[]) {
    try {
      const ogTagLinkArray: string[] = lmFeedClient.detectLinks(text);
      // (ogTagLinkArray);
      if (ogTagLinkArray.length) {
        const getOgTag: DecodeUrlModelSX = await lmFeedClient.decodeUrl(ogTagLinkArray[0]);
        // ('the og tag call is :', getOgTag);
        setPreviewOGTagData(getOgTag);
        if (!hasPreviewClosedOnce) {
          setShowOGTagPreview(true);
        }
      }
    } catch (error) {
      // (error);
    }
  }
  function closeDialogBox() {
    resetContext();
    closeCreatePostDialog();
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
      } else if (node.nodeName === 'BR') {
        // Handle <br> tag
        return '\n'; // Add a new line
      } else {
        let text = '';
        const childNodes = node.childNodes;

        for (const childNode of childNodes) {
          text += extractTextFromNode(childNode);
        }

        return '\n' + text;
      }
    } else {
      return '';
    }
  }

  useEffect(() => {
    const timeOut = setTimeout(() => {
      const ogTagLinkArray: string[] = lmFeedClient.detectLinks(text);
      if (!text.includes(ogTagLinkArray[0])) {
        ogTagLinkArray.splice(0, 1);
      }
      checkForOGTags(ogTagLinkArray);
    }, 500);
    if (contentEditableDiv && contentEditableDiv.current) {
      if (text === '' && !contentEditableDiv.current.isSameNode(document.activeElement)) {
        contentEditableDiv.current.textContent = 'Write something here...';
      }
    }
    return () => {
      clearTimeout(timeOut);
    };
  }, [text]);
  const [taggingPageCount, setTaggingPageCount] = useState<number>(1);
  async function getTags() {
    if (tagString === undefined || tagString === null) {
      return;
    }

    const tagListResponse = await lmFeedClient.getTaggingList(tagString, taggingPageCount);
    const memberList = tagListResponse?.data?.members;
    if (memberList && memberList.length > 0) {
      if (taggingPageCount === 1) {
        setTaggingMemberList([...memberList]);
      } else {
        setTaggingMemberList([...taggingMemberList].concat([...memberList]));
      }

      setTaggingPageCount(taggingPageCount + 1);
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
      setTaggingMemberList([]);
      setTaggingPageCount(1);
      setLoadMoreTaggingUsers(true);
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
  useEffect(() => {
    if (contentEditableDiv && contentEditableDiv.current) {
      setToEndOfContent(contentEditableDiv.current);
    }
  }, [contentEditableDiv.current]);
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
  return (
    // <div className="create-post-feed-dialog-wrapper">
    <div
      style={{
        position: 'relative'
      }}>
      {taggingMemberList && taggingMemberList?.length > 0 ? (
        <div
          className="taggingBox"
          id="scrollableTaggingContainer"
          style={returnCSSForTagging(containerRef)}>
          <InfiniteScroll
            loader={null}
            hasMore={loadMoreTaggingUsers}
            next={getTags}
            dataLength={taggingMemberList.length}
            scrollableTarget="scrollableTaggingContainer">
            {taggingMemberList?.map!((item: any) => {
              return (
                <button
                  key={item?.id.toString() + Math.random().toString()}
                  className="taggingTile"
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

                    // ('the tag string is ', tagOp!.tagString);
                    if (tagOp === undefined) return;

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
                    div!.insertBefore(textNode1, dummyNode);
                    // setTaggingMemberList([]);
                    anchorNode.focus();
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
          </InfiniteScroll>
        </div>
      ) : null}
      <div className="create-post-feed-dialog-wrapper--container" ref={containerRef}>
        <span
          className="create-post-feed-dialog-wrapper_container--closeicon"
          onClick={closeDialogBox}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M3.47755 20.5254C3.89943 20.9356 4.59084 20.9356 4.98927 20.5254L11.9971 13.5176L19.0049 20.5254C19.4151 20.9356 20.1065 20.9473 20.5166 20.5254C20.9268 20.1035 20.9385 19.4121 20.5283 19.002L13.5205 11.9942L20.5283 4.99806C20.9385 4.58791 20.9385 3.88478 20.5166 3.47462C20.0947 3.06447 19.4151 3.06447 19.0049 3.47462L11.9971 10.4824L4.98927 3.47462C4.59084 3.06447 3.88771 3.05275 3.47755 3.47462C3.0674 3.8965 3.0674 4.58791 3.47755 4.99806L10.4736 11.9942L3.47755 19.002C3.0674 19.4121 3.05568 20.1152 3.47755 20.5254Z"
              fill="#000000"
            />
          </svg>
        </span>
        <div className="create-post-feed-dialog-wrapper_container--post-wrapper">
          <div className="create-post-feed-dialog-wrapper_container_post-wrapper--heading">
            <p>Edit Post</p>
          </div>
          <div className="create-post-feed-dialog-wrapper_container_post-wrapper--user-info">
            <div className="create-post-feed-dialog-wrapper_container_post-wrapper_user-info--user-image">
              {setUserImage()}
            </div>
            <div className="create-post-feed-dialog-wrapper_container_post-wrapper_user-info--user-name">
              {userContext?.user?.name}
            </div>
          </div>
          <div className="create-post-feed-dialog-wrapper_container_post-wrapper--post-container">
            <div
              ref={contentEditableDiv}
              contentEditable={true}
              suppressContentEditableWarning
              tabIndex={0}
              placeholder="hello world"
              id="editableDiv"
              style={{
                width: '100%',
                height: 'auto',
                resize: 'none',
                border: 'none',
                fontWeight: '400',
                fontSize: '1rem',
                fontFamily: 'Roboto',
                overflowY: 'auto'
              }}
              onBlur={() => {
                if (contentEditableDiv && contentEditableDiv.current) {
                  if (text.trim().length === 0) {
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
                if (tagOp?.tagString !== null && tagOp?.tagString !== undefined) {
                  setTagString(tagOp?.tagString!);
                } else {
                  setTagString(null);
                }
              }}></div>
          </div>
          <div
            className="create-post-feed-dialog-wrapper_container_post-wrapper--send-post"
            onClick={postFeed}>
            Edit Post
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPost;
