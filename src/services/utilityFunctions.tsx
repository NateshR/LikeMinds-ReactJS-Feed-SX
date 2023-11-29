/* eslint-disable no-useless-escape */
import React from 'react';
// import { PostSchema } from '../components/resource-creation';

export function setUserImage(user: any) {
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
          width: '100%',
          height: '100%',
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
export interface Limits {
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
export function setEndOfContenteditable(contentEditableElement: HTMLDivElement) {
  let range, selection;
  if (document.createRange) {
    //Firefox, Chrome, Opera, Safari, IE 9+
    range = document.createRange(); //Create a range (a range is a like the selection but invisible)
    range.selectNodeContents(contentEditableElement); //Select the entire contents of the element with the range
    range.collapse(false); //collapse the range to the end point. false means collapse to end rather than the start
    selection = window.getSelection(); //get the selection object (allows you to change selection)
    selection?.removeAllRanges(); //remove any selections already made
    selection?.addRange(range); //make the range you have just created the visible selection
  }
}

export function setTagUserImage(user: any, userContext: any) {
  const imageLink = user?.imageUrl;
  if (imageLink !== '') {
    return (
      <img
        src={imageLink}
        alt={userContext.user?.imageUrl}
        style={{
          width: '36px',
          height: '36px',
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

export function findTag(str: string, setTaggingPageCount?: any): TagInfo | undefined {
  if (str.length === 0) {
    return undefined;
  }
  const cursorPosition = getCaretPosition();

  // // ("the cursor position is: ", cursorPosition)
  const leftLimit = checkAtSymbol(str, cursorPosition - 1);

  if (leftLimit === -1) {
    return undefined;
  }
  const rightLimit = findSpaceAfterIndex(str, cursorPosition - 1);
  // // ("the right limit is :", rightLimit)
  const substr = str.substring(leftLimit, rightLimit + 1);
  setTaggingPageCount(1);

  return {
    tagString: substr,
    limitLeft: leftLimit,
    limitRight: rightLimit
  };
}

export function extractTextFromNode(node: any) {
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
export enum fields {
  title = 'title',
  linkResource = 'linkResource',
  description = 'description'
}
// export function takeInTakeOut(
//   mainObject: PostSchema,
//   field: fields,
//   formattedText: string
// ): PostSchema {
//   const newPostObject = { ...mainObject };
//   newPostObject[field] = formattedText;
//   return newPostObject;
// }
// export function getFileSize(size: number) {
//   return filesize(size);
// }

export function validateUrl(str: string) {
  var protocolAndDomainRE = /^(?:\w+:)?\/\/(\S+)$/;

  var localhostDomainRE = /^localhost[\:?\d]*(?:[^\:?\d]\S*)?$/;
  var nonLocalhostDomainRE = /^[^\s\.]+\.\S{2,}$/;

  if (typeof str !== 'string') {
    return false;
  }

  var match = str.match(protocolAndDomainRE);
  if (!match) {
    return false;
  }

  var everythingAfterProtocol = match[1];
  if (!everythingAfterProtocol) {
    return false;
  }

  if (
    localhostDomainRE.test(everythingAfterProtocol) ||
    nonLocalhostDomainRE.test(everythingAfterProtocol)
  ) {
    return true;
  }

  return false;
}

export function setTagUserImageInResourceView(user: any, userContext: any) {
  const dimension = '52px';
  const imageLink = user?.imageUrl;
  if (imageLink !== '') {
    return (
      <img
        src={imageLink}
        alt={'user profile pic'}
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
          minWidth: dimension,
          width: dimension,
          height: dimension,
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

export interface MatchPattern {
  type: number;
  displayName?: string;
  routeId?: string;
  link?: string;
}
export function convertTextToHTML(text: string) {
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
