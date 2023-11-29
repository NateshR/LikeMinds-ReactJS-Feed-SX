import React, {
  KeyboardEventHandler,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';

import './createPostDialog.css';
import defaultUserImage from '../../../assets/images/defaultUserImage.png';

import { lmFeedClient } from '../../..';
import AttachmentsHolder from './AttachmentsHolder';
import { DecodeUrlModelSX, OgTags } from '../../../services/models';
import { IPost, IUser, LMFeedTopics } from '@likeminds.community/feed-js-beta';
import InfiniteScroll from 'react-infinite-scroll-component';
import TopicFeedDropdownSelector from '../../topic-feed/select-feed-dropdown';
import { ADD_NEW_POST, ADD_POST_LOCALLY } from '../../../services/feedModerationActions';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { addNewLocalPost, replaceLocalPost } from '../../../store/feedPosts/feedsSlice';
import { addNewTopics } from '../../../store/topics/topicsSlice';
import { Topic } from '../../../models/topics';

interface CreatePostDialogProps {
  dialogBoxRef?: React.RefObject<HTMLDivElement>; // Replace "HTMLElement" with the actual type of the ref
  closeCreatePostDialog: () => void;
  showMediaAttachmentOnInitiation: boolean;
  setShowMediaAttachmentOnInitiation: React.Dispatch<React.SetStateAction<boolean>>;
  showDocumentAttachmentOnInitiation: boolean;
  setShowDocumentAttachmentOnInitiation: React.Dispatch<React.SetStateAction<boolean>>;
  feedModerationHandler?: any;
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
export function getCharacterWidth(character: string): number {
  let font: string = 'Roboto',
    fontSize: number = 16;
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (context) {
    context.font = `${fontSize}px ${font}`;
    const metrics = context.measureText(character);
    return metrics.width;
  } else {
    return 0;
  }
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

export function returnCSSForTagging(refObject: React.MutableRefObject<HTMLDivElement | null>) {
  const selection = window.getSelection();
  const resObject: any = {};
  if (selection === null) {
    return {};
  }
  const boundingsForDiv = refObject.current?.getBoundingClientRect();
  const focusNodeParentBoundings = selection.focusNode?.parentElement?.getBoundingClientRect();
  resObject.top = (
    focusNodeParentBoundings?.top! -
    refObject.current?.getBoundingClientRect()!.top! +
    30
  )
    .toString()
    .concat('px');
  const leftSubstring = selection.focusNode?.parentElement?.textContent?.substring(
    0,
    selection.focusOffset - 1
  );
  const width = getCharacterWidth(leftSubstring!);
  if (width > 264) {
    resObject.left = '264px';
  } else {
    resObject.left = width;
  }
  resObject.position = 'absolute';
  return resObject;
}

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

export function setCursorAtEnd(
  contentEditableDiv: React.MutableRefObject<HTMLDivElement | null>
): void {
  if (!contentEditableDiv.current) return;

  const range = document.createRange();
  const selection = window.getSelection();

  range.selectNodeContents(contentEditableDiv.current);
  range.collapse(false);

  if (selection) {
    selection.removeAllRanges();
    selection.addRange(range);
  }

  contentEditableDiv.current.focus();
}

const CreatePostDialog = ({
  closeCreatePostDialog,
  showMediaAttachmentOnInitiation,
  setShowMediaAttachmentOnInitiation,
  showDocumentAttachmentOnInitiation,
  setShowDocumentAttachmentOnInitiation,
  feedModerationHandler
}: CreatePostDialogProps) => {
  // redux managed state
  const currentUser = useSelector((state: RootState) => state.currentUser.user);
  const dispatch = useDispatch();
  const PLACE_HOLDER_TEXT = 'Write something here...';
  const [text, setText] = useState<string>('');
  const [showMediaUploadBar, setShowMediaUploadBar] = useState<null | boolean>(true);
  const [showInitiateUploadComponent, setShowInitiateUploadComponent] = useState<boolean>(false);
  const [imageOrVideoUploadArray, setImageOrVideoUploadArray] = useState<null | File[]>(null);
  const [documentUploadArray, setDocumentUploadArray] = useState<null | File[]>(null);
  const [attachmentType, setAttachmentType] = useState<null | number>(0);
  const [showOGTagPreview, setShowOGTagPreview] = useState<boolean>(false);
  const [previewOGTagData, setPreviewOGTagData] = useState<DecodeUrlModelSX | null>(null);
  const [hasPreviewClosedOnce, setHasPreviewClosedOnce] = useState<boolean>(false);
  const [limits, setLimits] = useState<Limits>({
    left: 0,
    right: 0
  });
  const [tagString, setTagString] = useState<string | null>(null);
  const [taggingMemberList, setTaggingMemberList] = useState<any[]>([]);
  const contentEditableDiv = useRef<HTMLDivElement | null>(null);
  const [loadMoreTaggingUsers, setLoadMoreTaggingUsers] = useState<boolean>(true);
  const [taggingPageCount, setTaggingPageCount] = useState<number>(1);
  const [previewTagsUrl, setPreviewTagsUrl] = useState<boolean>(false);
  const [selectedTopics, setSelectedTopics] = useState<null | string[]>(null);
  const [topics, setTopics] = useState<any[]>([]);
  function setTopicsForTopicFeed(topics: LMFeedTopics[]) {
    const newSelectedTopics = topics?.map((topic) => {
      return topic.Id;
    });
    setTopics(topics);
    console.log(newSelectedTopics);
    if (newSelectedTopics && newSelectedTopics.length) {
      setSelectedTopics(newSelectedTopics);
    } else {
      setSelectedTopics(null);
    }
  }
  const containerRef = useRef<HTMLDivElement | null>(null);
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
    setHasPreviewClosedOnce,
    showMediaAttachmentOnInitiation,
    showDocumentAttachmentOnInitiation
  };
  const setCloseDialog = () => {};
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
            width: '48px',
            height: '48px',
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
          {currentUser!.name!.split(' ').map((part: string) => {
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
    setShowMediaAttachmentOnInitiation(false);
    setShowDocumentAttachmentOnInitiation(false);
  }
  function makeTempPost(
    text: string,
    imageAttachmentArray: File[] | null,
    pdfAttachmentArray: File[] | null,
    ogTagAttachmentArray: any,
    topics: any,
    timeStamp: string
  ) {
    console.log(timeStamp);
    const post = {
      Id: timeStamp,
      attachments: [],
      commentsCount: 0,
      communityId: 50489,
      createdAt: parseInt(timeStamp),
      heading: '',
      isEdited: false,
      isLiked: false,
      isPinned: false,
      isSaved: false,
      likesCount: 0,
      menuItems: [
        {
          id: 5,
          title: 'Edit Post'
        },
        {
          id: 1,
          title: 'Delete Post'
        }
      ],
      replies: [],
      text: '',
      topics: [],
      updatedAt: timeStamp,
      userId: currentUser?.uuid,
      uuid: currentUser?.uuid
    };
    post.topics = topics;
    post.text = text;
    const attachments: any = [];
    if (imageAttachmentArray?.length) {
      imageAttachmentArray.map((attachment: File) => {
        const attachmentType = attachment.type.split('/')[0] === 'image' ? 1 : 2;
        attachments.push({
          attachmentType: attachmentType,
          attachmentMeta: {
            url: URL.createObjectURL(attachment),
            name: attachment.name,
            size: attachment.size,
            format: attachmentType === 2 ? 'video/mp4' : undefined
          }
        });
      });
    } else if (pdfAttachmentArray?.length) {
      pdfAttachmentArray.map((attachment: File) => {
        attachments.push({
          attachmentType: 3,
          attachmentMeta: {
            url: URL.createObjectURL(attachment),
            name: attachment.name,
            size: attachment.size,
            format: 'pdf'
          }
        });
      });
    } else if (previewOGTagData !== null) {
      attachments.push({
        attachmentType: 4,
        attachmentMeta: {
          ogTags: ogTagAttachmentArray
        }
      });
    }
    // post.
    post.attachments = attachments;
    return post as any;
  }
  const postFeed = async function (timeStamp: string) {
    try {
      let textContent: string = extractTextFromNode(contentEditableDiv.current);
      textContent = textContent.trim();
      if (textContent === PLACE_HOLDER_TEXT) {
        textContent = '';
      }

      closeDialogBox();
      let response: any;
      if (imageOrVideoUploadArray?.length) {
        response = await lmFeedClient.addPostWithImageAttachments(
          textContent,
          selectedTopics,
          imageOrVideoUploadArray,
          currentUser?.sdkClientInfo.uuid,
          timeStamp
        );
      } else if (documentUploadArray?.length) {
        response = await lmFeedClient.addPostWithDocumentAttachments(
          textContent,
          selectedTopics,
          documentUploadArray,
          currentUser?.sdkClientInfo.uuid,
          timeStamp
        );
      } else if (previewOGTagData !== null) {
        response = await lmFeedClient.addPostWithOGTags(
          text,
          selectedTopics,
          previewOGTagData,
          timeStamp
        );
      } else {
        if (textContent === '') {
          return;
        }
        response = await lmFeedClient.addPost(textContent, selectedTopics, null, timeStamp);
      }
      // feedModerationHandler(ADD_NEW_POST, null, {
      //   topics: topics,
      //   post: response?.data?.post
      // });
      document.dispatchEvent(
        new CustomEvent(ADD_NEW_POST, {
          detail: {
            topics: topics,
            post: response?.data?.post
          }
        })
      );
      return response?.data?.post;
    } catch (error) {
      lmFeedClient.logError(error);
    }
  };
  async function checkForOGTags(ogTagLinkArray: string[]) {
    try {
      // (ogTagLinkArray);
      if (ogTagLinkArray.length) {
        const getOgTag: DecodeUrlModelSX = await lmFeedClient.decodeUrl(ogTagLinkArray[0]);
        // ('the og tag call is :', getOgTag);
        setPreviewOGTagData(getOgTag);
        if (!hasPreviewClosedOnce) {
          setShowOGTagPreview(true);
        }
      } else {
        setPreviewOGTagData(null);
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
    if (contentEditableDiv && contentEditableDiv.current) {
      contentEditableDiv.current.focus();
    }
  }, [contentEditableDiv.current]);
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
          !e.currentTarget?.classList?.contains('taggingTile')
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
    console.log('component rerendered');
  });
  return (
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
          </InfiniteScroll>
        </div>
      ) : null}
      <div className="create-post-feed-dialog-wrapper--container" ref={containerRef}>
        <span
          className="create-post-feed-dialog-wrapper_container--closeicon"
          onClick={closeDialogBox}>
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
        <div className="create-post-feed-dialog-wrapper_container--post-wrapper">
          <div className="create-post-feed-dialog-wrapper_container_post-wrapper--heading">
            <p>Create Post</p>
          </div>

          <div style={{}}>
            <div className="create-post-feed-dialog-wrapper_container_post-wrapper--user-info margin-bottom-16">
              <div className="create-post-feed-dialog-wrapper_container_post-wrapper_user-info--user-image">
                {setUserImage()}
              </div>
              <div className="create-post-feed-dialog-wrapper_container_post-wrapper_user-info--user-name">
                {currentUser?.name.toUpperCase()}
              </div>
            </div>
            <TopicFeedDropdownSelector
              setTopicsForTopicFeed={setTopicsForTopicFeed}
              isCreateMode={true}
            />
            <div className="separator"></div>
            <div
              style={{
                maxHeight: '324px',
                overflowY: 'auto',
                height: 'auto'
              }}>
              <div className="create-post-feed-dialog-wrapper_container_post-wrapper--post-container">
                <div
                  ref={contentEditableDiv}
                  contentEditable={true}
                  suppressContentEditableWarning
                  tabIndex={0}
                  autoFocus={true}
                  id="editableDiv"
                  style={{
                    width: '100%',
                    height: 'auto',
                    resize: 'none',
                    border: 'none',
                    fontWeight: '400',
                    fontSize: '1rem',
                    fontFamily: 'Roboto',
                    overflowY: 'auto',
                    minHeight: '76px',
                    paddingLeft: '3px',
                    paddingRight: '3px'
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
                        while (contentEditableDiv.current?.firstChild) {
                          contentEditableDiv.current.removeChild(
                            contentEditableDiv.current.firstChild
                          );
                        }
                      }
                    }
                  }}
                  onInput={(event: React.KeyboardEvent<HTMLDivElement>) => {
                    const selection = window.getSelection();
                    setText(event.currentTarget.textContent!);
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
              <AttachmentsHolder {...attachmentProps} />
            </div>
            <div
              className="create-post-feed-dialog-wrapper_container_post-wrapper--send-post"
              onClick={() => {
                let textContent: string = extractTextFromNode(contentEditableDiv.current);
                textContent = textContent.trim();
                if (textContent === PLACE_HOLDER_TEXT) {
                  textContent = '';
                }
                if (!textContent.length) {
                  return;
                }
                const timeStamp = Date.now().toString();
                const tempPost = makeTempPost(
                  textContent,
                  imageOrVideoUploadArray,
                  documentUploadArray,
                  previewOGTagData,
                  selectedTopics,
                  timeStamp
                );
                console.log('The Temp post is');
                console.log(tempPost);
                console.log('The topics are: ');
                console.log(topics);
                feedModerationHandler(ADD_POST_LOCALLY, null, {
                  post: tempPost,
                  topics: topics
                });
                dispatch(addNewLocalPost(tempPost));
                const topicMap: Record<string, Topic> = {};
                for (let topic of topics) {
                  topicMap[topic.Id] = { ...topic };
                }
                dispatch(addNewTopics(topicMap));
                postFeed(timeStamp).then((res: any) => {
                  dispatch(replaceLocalPost(res));
                });
              }}>
              Post
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostDialog;
