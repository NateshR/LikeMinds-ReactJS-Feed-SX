import post from '../assets/images/post.jpg';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import React, { ReactChild, useMemo, useState } from 'react';
import { Dialog, IconButton } from '@mui/material';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import { Attachment } from 'likeminds-sdk';
import ReactDOMServer from 'react-dom/server';
import { Parser } from 'html-to-react';
import './../assets/css/post-body.css';
interface PostBodyProps {
  answer: string;
  attachments: Attachment[];
  feedModerationHandler: (action: string, index: number, value: any) => void;
}
interface MatchPattern {
  type: number;
  displayName?: string;
  routeId?: string;
  link?: string;
}

const PostBody: React.FC<PostBodyProps> = ({ answer, attachments }) => {
  const [renderedData, setRenderedData] = useState<any>(null);
  useMemo(() => setRenderedData(renderAttachments(attachments)), [attachments]);
  function convertTextToHTML(text: string) {
    const regex = /<<.*?>>|(?:https?|ftp):\/\/\S+|(?<!www\.)\S+\.\S+/g;
    // const regex =
    //   /(?:<<.*?>>)|(?:https?|ftp):\/\/[^\s/$.?#]+\.[^\s]*|www\.[^\s/$.?#]+\.[^\s]*|\b(?<!:\/\/)(?<!\w)(?:www\.)?([^\s.]+\.[^\s]{2,}|localhost)(?:\/[^\s]*)?(?:\?[^\s]*)?\b/g;

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
          linkNode.target = '_blank';
          let url = userObject.link;
          if (!url?.startsWith('http://') && !url?.startsWith('https://')) {
            url = 'http://' + url;
          }
          linkNode.href = url!; // You can set the appropriate URL here
          linkNode.textContent = userObject.link!;
          container.appendChild(linkNode);
        }
      }
    }
    return container;
  }
  function renderAttachments(attachmentsArray: Attachment[]) {
    return attachmentsArray
      .filter(
        (attachment: Attachment) =>
          attachment.attachmentType === 1 ||
          attachment.attachmentType === 2 ||
          attachment.attachmentType === 3
      )
      .map((attachment: Attachment) => {
        return renderMediaItem(attachment);
      });
  }

  function renderMediaItem(attachment: Attachment) {
    switch (attachment.attachmentType) {
      case 1:
        return (
          <img
            className="postMediaAttachment--image"
            src={attachment.attachmentMeta.url}
            alt="post"
            key={attachment.attachmentMeta.url + Math.random().toString()}
            loading="lazy"
          />
        );
      case 2:
        return (
          <>
            <video
              className="postMediaAttachment--video"
              src={attachment.attachmentMeta.url}
              key={attachment.attachmentMeta.url + Math.random().toString()}
              controls
            />
          </>
        );
      case 3:
        return (
          <object
            key={attachment?.attachmentMeta?.url}
            data={attachment?.attachmentMeta?.url}
            type="application/pdf"
            width="100%"
            height="100%">
            <p>
              Alternative text - include a link{' '}
              <a href="http://africau.edu/images/default/sample.pdf">to the PDF!</a>
            </p>
          </object>
        );
      default:
        return (
          <img
            src={attachment.attachmentMeta.url}
            alt="post"
            key={attachment.attachmentMeta.url + Math.random().toString()}
          />
        );
    }
  }
  const [isReadMore, setIsReadMore] = useState(true);

  return (
    <div className="lmWrapper__feed__post__body">
      {answer && (
        <div
          className="lmWrapper__feed__post__body--content"
          // dangerouslySetInnerHTML={{
          //   __html: convertTextToHTML(answer).innerHTML
          // }}
        >
          {isReadMore && answer.length > 300
            ? Parser().parse(convertTextToHTML(answer.substring(0, 300)).innerHTML)
            : Parser().parse(convertTextToHTML(answer).innerHTML)}
          {isReadMore && answer.length > 300 ? (
            <span
              style={{
                color: 'gray',
                fontWeight: '400',
                cursor: 'pointer',
                // textDecoration: 'underline',
                fontSize: '14px'
              }}
              onClick={() => setIsReadMore(false)}>
              ...ReadMore
            </span>
          ) : null}
        </div>
      )}

      <div className="lmWrapper__feed__post__body--media">
        <Carousel
          className="postMediaAttachment"
          showThumbs={false}
          showStatus={false}
          showIndicators={false}>
          {renderedData}
        </Carousel>
      </div>
    </div>
  );
};

export default PostBody;
