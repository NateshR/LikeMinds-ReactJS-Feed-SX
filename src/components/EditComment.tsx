import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import '../assets/css/input-area.css';
import '../assets/css/createPostDialog.css';
import {
  convertTextToHTML,
  extractTextFromNode,
  findTag,
  returnCSSForTagging,
  setCursorAtEnd,
  setEndOfContenteditable
} from '../services/utilityFunctions';

import InfiniteScroll from 'react-infinite-scroll-component';
import { lmFeedClient } from '../client';
import TaggingUserBlock from './TaggingUserBlock';
interface InputFieldProps {
  width?: string;
  placeholder?: string;
  isRequired?: boolean;
  update: React.Dispatch<string>;
  minHeight?: string;
  editValuePreset?: boolean;
  editFieldValue?: string;
  setEditCommentMode: React.Dispatch<boolean>;
}
function EditCommentBox({
  width,
  placeholder,
  isRequired,
  update,
  minHeight,
  editValuePreset,
  editFieldValue,
  setEditCommentMode
}: InputFieldProps) {
  const PLACE_HOLDER_TEXT = placeholder;
  const [text, setText] = useState<string>('');
  const [tagString, setTagString] = useState<string | null>(null);
  const [taggingMemberList, setTaggingMemberList] = useState<any[]>([]);
  const contentEditableDiv = useRef<HTMLDivElement | null>(null);
  const [loadMoreTaggingUsers, setLoadMoreTaggingUsers] = useState<boolean>(true);
  const [taggingPageCount, setTaggingPageCount] = useState<number>(1);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (editValuePreset) {
      if (contentEditableDiv.current) {
        const innnerHTML = convertTextToHTML(editFieldValue!).innerHTML;
        contentEditableDiv.current!.innerHTML = innnerHTML;
        setTimeout(() => setEndOfContenteditable(contentEditableDiv.current!), 500);
      }
    }
  }, [contentEditableDiv, editValuePreset]);
  function formatText(text: string) {
    return text.trim();
  }
  function hanldeBlur(text: string) {
    const formattedText = formatText(text);
    update(formattedText);
  }
  function handleTagButtonClick(e: React.MouseEvent, item: any) {
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

    const tagOp = findTag(textContentFocusNode, setTaggingPageCount);

    // ('the tag string is ', tagOp!.tagString);
    if (tagOp === undefined) return;

    const { limitLeft, limitRight } = tagOp;

    const textNode1Text = textContentFocusNode.substring(0, limitLeft - 1);

    const textNode2Text = textContentFocusNode.substring(limitRight + 1);

    const textNode1 = document.createTextNode(textNode1Text);
    const anchorNode = document.createElement('a');
    anchorNode.id = item?.id;
    anchorNode.href = '#';
    anchorNode.textContent = `@${item?.name.trim()}`;
    anchorNode.contentEditable = 'false';
    const textNode2 = document.createTextNode(textNode2Text);
    const dummyNode = document.createElement('span');
    div!.replaceChild(textNode2, focusNode);

    div!.insertBefore(anchorNode, textNode2);
    div!.insertBefore(dummyNode, anchorNode);
    div!.insertBefore(textNode1, dummyNode);
    setTaggingMemberList([]);
    setCursorAtEnd(contentEditableDiv);
  }
  function handleInput(event: React.MouseEvent<HTMLDivElement>) {
    const selection = window.getSelection();
    setText(event.currentTarget.textContent!);
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

    const tagOp = findTag(textContentFocusNode!, setTaggingPageCount);

    if (tagOp?.tagString !== null && tagOp?.tagString !== undefined) {
      setTagString(tagOp?.tagString);
    } else {
      setTagString(null);
    }
  }
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
  function returnPlaceholder() {
    const placeHolderElement = document.createElement('div');
    placeHolderElement.className = 'placeholderElement';
    placeHolderElement.innerText = PLACE_HOLDER_TEXT!;
    return placeHolderElement;
  }

  useEffect(() => {
    const timeOut = setTimeout(() => {
      const ogTagLinkArray: string[] = lmFeedClient.detectLinks(text);
      if (!text.includes(ogTagLinkArray[0])) {
        ogTagLinkArray.splice(0, 1);
      }
    }, 500);
    if (contentEditableDiv && contentEditableDiv.current) {
      if (text === '' && !contentEditableDiv.current.isSameNode(document.activeElement)) {
        contentEditableDiv.current.appendChild(returnPlaceholder());
      }
    }
    return () => {
      clearTimeout(timeOut);
    };
  }, [text]);

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
    // contentEditableDiv.current?.focus();
    setCursorAtEnd(contentEditableDiv);
    if (editValuePreset) {
      if (contentEditableDiv.current) {
        const innnerHTML = convertTextToHTML(editFieldValue!).innerHTML;
        contentEditableDiv.current!.innerHTML = innnerHTML;
      }
    }
  }, [contentEditableDiv, editValuePreset]);

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
                <TaggingUserBlock
                  key={item?.id.toString() + Math.random().toString()}
                  clickHandler={handleTagButtonClick}
                  item={item}
                />
              );
            })}
          </InfiniteScroll>
        </div>
      ) : null}
      <div ref={containerRef}>
        <div
          ref={contentEditableDiv}
          contentEditable={true}
          suppressContentEditableWarning
          tabIndex={0}
          className="inputCommentWrapper"
          id="editableDivContainer"
          onBlur={() => {
            hanldeBlur(extractTextFromNode(contentEditableDiv.current));
          }}
          // onFocus={() => {
          //     if (contentEditableDiv && contentEditableDiv.current) {
          //         if (text.trim() === '') {
          //             while (contentEditableDiv.current?.firstChild) {
          //                 contentEditableDiv.current.removeChild(contentEditableDiv.current.firstChild);
          //             }
          //         }
          //     }
          // }}
          onInput={handleInput}></div>
      </div>
      {/* <div className="separator"></div> */}
    </div>
  );
}

export default EditCommentBox;
