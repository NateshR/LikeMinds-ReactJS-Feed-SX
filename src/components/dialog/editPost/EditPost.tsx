import React, { useContext, useEffect, useRef, useState } from 'react';

import '../createPost/createPostDialog.css';
import { lmFeedClient } from '../../..';
import { DecodeUrlModelSX } from '../../../services/models';
import { Attachment, AttachmentMeta, IPost, LMFeedTopics } from '@likeminds.community/feed-js-beta';
import { returnCSSForTagging, setCursorAtEnd } from '../createPost/CreatePostDialog';
import InfiniteScroll from 'react-infinite-scroll-component';
import TopicFeedDropdownSelector from '../../topic-feed/select-feed-dropdown';
import { Snackbar } from '@mui/material';
import { FeedPost } from '../../../models/feedPost';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { replaceEditedMessage } from '../../../store/feedPosts/feedsSlice';
import { addNewTopics } from '../../../store/topics/topicsSlice';
import { addNewUsers } from '../../../store/users/usersSlice';
import { showSnackbar } from '../../../store/snackbar/snackbarSlice';

interface CreatePostDialogProps {
  dialogBoxRef?: React.RefObject<HTMLDivElement>; // Replace "HTMLElement" with the actual type of the ref
  closeCreatePostDialog: () => void;
  //   showMediaAttachmentOnInitiation: boolean;
  //   setShowMediaAttachmentOnInitiation: React.Dispatch<React.SetStateAction<boolean>>;
  // setFeedArray: React.Dispatch<React.SetStateAction<IPost[]>>;
  // feedArray: FeedPost[];
  // post: IPost | null;
  // topics: Record<string, LMFeedTopics>;
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

const EditPost = ({ closeCreatePostDialog }: CreatePostDialogProps) => {
  // redux managed state
  const currentUser = useSelector((state: RootState) => state.currentUser.user);
  const post = useSelector((state: RootState) => state.snackbar).temporaryPost;
  const feedArray = useSelector((state: RootState) => state.posts);
  const topics = useSelector((state: RootState) => state.topics);
  const dispatch = useDispatch();
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
          {currentUser?.name?.split(' ').map((part: string) => {
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
  const [selectedTopics, setSelectedTopics] = useState<null | string[]>(null);
  const [existingSelectedTopics, setExistingSelectedTopics] = useState<LMFeedTopics[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  function setTopicsForTopicFeed(topics: LMFeedTopics[]) {
    console.log('Called');
    const newSelectedTopics = topics?.map((topic) => {
      return topic.Id;
    });
    console.log(newSelectedTopics);
    if (newSelectedTopics && newSelectedTopics.length) {
      setSelectedTopics(newSelectedTopics);
    } else {
      setSelectedTopics([]);
    }
  }
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
    const matches = text?.match(regex) || [];
    const splits = text?.split(regex);

    const container = document.createElement('div');

    for (let i = 0; i < splits?.length; i++) {
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
      const disabledTopicList: string[] = [];
      console.log('the selected topicIds are');
      console.log(selectedTopics);
      selectedTopics?.forEach((topicId: string) => {
        const tempTopic = topics[topicId];
        console.log(tempTopic?.isEnabled);
        if (tempTopic && !tempTopic?.isEnabled) {
          disabledTopicList.push(tempTopic?.name);
        }
      });
      console.log('The Disabled Topic List is');
      console.log(disabledTopicList);
      if (disabledTopicList.length) {
        // dispatch(
        //   showSnackbar(`
        //   The following topics have been disabled. Please remove them to save the post.
        //   ${disabledTopicList.join(',')}
        //   `)
        // );
        setOpenSnackbar(true);
        setSnackbarMessage(`
        The following topics have been disabled. Please remove them to save the post.
        ${disabledTopicList.join(',')}
        `);
        return;
      }
      closeDialogBox();
      response = await lmFeedClient.editPost(
        post?.Id!,
        textContent,
        [...imageOrVideoUploadArray, ...documentUploadArray, ...previewOGTagData],
        selectedTopics
      );
      const newpost: FeedPost = response?.data?.post;

      dispatch(replaceEditedMessage(newpost));
      dispatch(addNewTopics(response.data.topics));
      dispatch(addNewUsers(response.data.users));
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
      if (!text.trim().length) {
        return;
      }
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
  useEffect(() => {
    const postTopics: any = post?.topics;
    const selectedTopicsList = postTopics?.map((topicId: string) => {
      return topics[topicId];
    });
    console.log('The selected topics list is');
    console.log(selectedTopicsList);
    setExistingSelectedTopics(selectedTopicsList);
  }, [topics, post]);
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
            <p>Edit Post</p>
          </div>
          <div className="create-post-feed-dialog-wrapper_container_post-wrapper--user-info margin-bottom-16">
            <div className="create-post-feed-dialog-wrapper_container_post-wrapper_user-info--user-image ">
              {setUserImage()}
            </div>
            <div className="create-post-feed-dialog-wrapper_container_post-wrapper_user-info--user-name">
              {currentUser?.name.toUpperCase()}
            </div>
          </div>
          <TopicFeedDropdownSelector
            setTopicsForTopicFeed={setTopicsForTopicFeed}
            isCreateMode={true}
            existingSelectedTopics={existingSelectedTopics}
          />
          <div className="separator"></div>
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
                  if (text?.trim() === '') {
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
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        message={snackbarMessage}
        onClose={() => {
          setOpenSnackbar(false);
        }}
      />
    </div>
  );
};

export default EditPost;
