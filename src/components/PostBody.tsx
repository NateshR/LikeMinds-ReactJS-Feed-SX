import post from '../assets/images/post.jpg';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import React, { useMemo, useState } from 'react';
import { Dialog, IconButton } from '@mui/material';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import { Attachment } from '@likeminds.community/feed-js';
import ReactDOMServer from 'react-dom/server';
import { Parser } from 'html-to-react';
import './../assets/css/post-body.css';
import previewImage from '../assets/images/ogTagPreview.png';
import { Document, Page, pdfjs } from 'react-pdf';
import { HolderWithCross } from './dialog/createPost/AttachmentsHolder';
import { OgTags } from '../services/models';
import pdfIcon from '../assets/images/poll.svg';
import ImageMedia from './media-components/ImageMedia';

const url = `//cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
pdfjs.GlobalWorkerOptions.workerSrc = url;
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
  const [pdfPageNo, setPdfPageNo] = useState<number>(1);
  const [ogTagPreview, setOgTagPreview] = useState<boolean>(true);
  const [hasPreviewClosedOnce, setHasPreviewClosedOnce] = useState<boolean>(false);
  useMemo(() => setRenderedData(renderAttachments(attachments)), [attachments]);
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
      const textParts = container.innerHTML.split('\n');
      container.innerHTML = '';

      for (let i = 0; i < textParts.length; i++) {
        container.innerHTML += textParts[i];

        if (i !== textParts.length - 1) {
          const br = document.createElement('br');
          container.appendChild(br);
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
          attachment.attachmentType === 3 ||
          attachment.attachmentType === 4
      )
      .map((attachment: Attachment) => {
        return renderMediaItem(attachment);
      });
  }

  function renderMediaItem(attachment: Attachment) {
    switch (attachment.attachmentType) {
      case 1: {
        const img = new Image();
        img.src = attachment?.attachmentMeta?.url!;
        return (
          <ImageMedia
            attachment={attachment}
            key={attachment.attachmentMeta.url + Math.random().toString()}
          />
        );
      }
      case 2:
        return (
          <div
            style={{
              background: 'black'
            }}
            key={attachment.attachmentMeta.url + Math.random().toString()}>
            <video
              className="postMediaAttachment--video"
              src={attachment.attachmentMeta.url}
              controls
              style={{
                maxHeight: '576px',
                maxWidth: '100%',
                height: 'auto',
                width: 'auto'
              }}
            />
          </div>
        );
      case 3:
        return (
          <div
            key={attachment?.attachmentMeta?.url}
            style={{
              background: 'white',
              height: '100%',
              paddingBottom: '20px',
              paddingTop: '20px'
            }}>
            <div
              className="lmPdfViewer"
              onClick={() => {
                window.open(attachment?.attachmentMeta?.url, '_blank');
              }}
              style={{
                cursor: 'pointer'
              }}>
              <Document file={attachment?.attachmentMeta?.url}>
                <Page
                  pageNumber={pdfPageNo}
                  height={200}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                />
              </Document>

              <div className="pdfInfo">
                <div className="iconBox">
                  <svg
                    width="28"
                    height="36"
                    viewBox="0 0 28 36"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M24.7312 36C26.5376 36 28 34.5498 28 32.7583V8.23223H21.4194C20.9462 8.23223 20.6022 7.84834 20.6022 7.4218V0H3.22581C1.46237 0 0 1.40758 0 3.19905V32.8009C0 34.5498 1.41935 36 3.22581 36H24.7312ZM22.2365 1.27935V6.6111H27.0107L22.2365 1.27935Z"
                      fill="#EF6060"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M5.23765 25.3398V22.1662H6.87829C7.95541 22.1662 8.7986 21.9115 9.40786 21.4022C10.0171 20.8928 10.3217 20.1968 10.3217 19.3142C10.3217 18.7327 10.1824 18.2141 9.90379 17.7584C9.62515 17.3026 9.22695 16.951 8.70918 16.7036C8.19142 16.4561 7.59152 16.3324 6.90948 16.3324H3.36621V25.3398H5.23765ZM6.90949 20.6629H5.23767V17.8357H6.95316C7.41478 17.8439 7.77659 17.9842 8.03859 18.2564C8.30059 18.5286 8.4316 18.8853 8.4316 19.3266C8.4316 19.7555 8.30163 20.0855 8.04171 20.3164C7.78179 20.5474 7.40438 20.6629 6.90949 20.6629ZM16.5599 24.7954C15.9278 25.1542 15.2145 25.3357 14.4202 25.3398H11.6068V16.3324H14.4015C15.2 16.3324 15.9143 16.5108 16.5443 16.8675C17.1744 17.2243 17.6661 17.7316 18.0196 18.3894C18.3731 19.0472 18.5499 19.7947 18.5499 20.632V21.0464C18.5499 21.8837 18.3762 22.6281 18.029 23.2797C17.6817 23.9314 17.192 24.4366 16.5599 24.7954ZM14.3828 23.8489H13.4783V17.8357H14.4015C15.1376 17.8357 15.697 18.0718 16.0796 18.544C16.4622 19.0163 16.6535 19.7102 16.6535 20.6258V21.1021C16.6452 21.9847 16.4476 22.6632 16.0608 23.1374C15.6741 23.6117 15.1147 23.8489 14.3828 23.8489ZM21.7812 21.6589V25.3398H19.9098V16.3324H25.8235V17.8357H21.7812V20.1618H25.3744V21.6589H21.7812Z"
                      fill="white"
                    />
                  </svg>
                </div>
                <div className="desc">
                  <h3>{attachment?.attachmentMeta?.name?.split('.pdf')[0]}</h3>
                  <div>
                    <span>
                      {Math.floor(parseInt(attachment?.attachmentMeta?.size!.toString()) / 1024)} KB
                    </span>
                    <span>PDF</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 4: {
        if (ogTagPreview) {
          return (
            <div
              style={{
                float: 'left',
                background: 'white'
              }}
              key={attachment.attachmentMeta?.ogTags?.url?.toString()}>
              <PreviewForOGTag
                setOgTagPreview={setOgTagPreview}
                ogTagPreviewData={attachment.attachmentMeta.ogTags as any}
                setHasPreviewClosedOnce={setHasPreviewClosedOnce}
              />
            </div>
          );
        } else {
          return null;
        }
      }
      default:
        return null;
    }
  }
  const [isReadMore, setIsReadMore] = useState(true);

  return (
    <div className="lmWrapper__feed__post__body">
      {answer && (
        <div className="lmWrapper__feed__post__body--content">
          {isReadMore && answer.length > 300
            ? Parser().parse(convertTextToHTML(answer.substring(0, 300)).innerHTML)
            : Parser().parse(convertTextToHTML(answer).innerHTML)}
          {isReadMore && answer.length > 300 ? (
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

type PreviewForOGTagProps = {
  ogTagPreviewData: OgTags;
  setOgTagPreview: React.Dispatch<React.SetStateAction<boolean>>;
  setHasPreviewClosedOnce: any;
};

const PreviewForOGTag = ({
  setOgTagPreview,
  ogTagPreviewData,
  setHasPreviewClosedOnce
}: PreviewForOGTagProps) => {
  function closePreviewBox() {
    setOgTagPreview(false);
    setHasPreviewClosedOnce(true);
  }
  console.log(ogTagPreviewData);
  if (!ogTagPreviewData) {
    return null;
  }
  return (
    <div className="ogTagPreviewContainer">
      <HolderWithCross onCloseFunction={closePreviewBox} closeIconHide={true}>
        <div
          className="ogTagPreviewContainer--wrapper"
          style={{
            cursor: 'pointer'
          }}
          onClick={() =>
            window.open(
              ogTagPreviewData.url?.startsWith('https://') ||
                ogTagPreviewData.url?.startsWith('http://')
                ? ogTagPreviewData?.url
                : 'https://' + ogTagPreviewData?.url,
              '_blank'
            )
          }>
          <div className="ogTagPreviewContainer__wrapper--imageWrapper">
            {
              <img
                src={
                  !ogTagPreviewData.image || ogTagPreviewData.image?.length === 0
                    ? previewImage
                    : ogTagPreviewData?.image
                }
                alt="preview"
                style={{
                  height: '100%',
                  width: 'auto'
                }}
              />
            }
          </div>
          <div className="ogTagPreviewContainer__wrapper--bodyWrapper">
            <p className="ogTagPreviewContainer__wrapper__bodyWrapper--title">
              {ogTagPreviewData.title}
            </p>
            <p className="ogTagPreviewContainer__wrapper__bodyWrapper--description">
              {ogTagPreviewData.description}
            </p>
          </div>
        </div>
      </HolderWithCross>
    </div>
  );
};

export default PostBody;
