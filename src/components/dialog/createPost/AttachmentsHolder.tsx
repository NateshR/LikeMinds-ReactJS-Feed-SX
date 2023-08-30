import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import './attachmentsHolder.css';
import phoneImageSample from '../../../assets/images/phoneImgaeSample.png';
import { ChangeEvent } from 'react';
import { DecodeUrlModelSX } from '../../../services/models';
import previewImage from './../../../assets/images/ogTagPreview.png';
import { Carousel } from 'react-responsive-carousel';
import { Attachment } from '@likeminds.community/feed-js';
import { DeleteOutlined } from '@mui/icons-material';
import { IconButton } from '@mui/material';
interface AttachmentsHolderProps {
  showMediaUploadBar: boolean | null;
  setShowMediaUploadBar: React.Dispatch<React.SetStateAction<boolean | null>>;
  imageOrVideoUploadArray: File[] | null;
  setImageOrVideoUploadArray: React.Dispatch<React.SetStateAction<File[] | null>>;
  documentUploadArray: File[] | null;
  setDocumentUploadArray: React.Dispatch<React.SetStateAction<File[] | null>>;
  attachmentType: number | null;
  setAttachmentType: React.Dispatch<React.SetStateAction<number | null>>;
  showInitiateUploadComponent: boolean;
  setShowInitiateUploadComponent: React.Dispatch<React.SetStateAction<boolean>>;
  showOGTagPreview: boolean;
  setShowOGTagPreview: React.Dispatch<React.SetStateAction<boolean>>;
  previewOGTagData: DecodeUrlModelSX | null; // Add the DecodeUrlModelSX type here (assuming it's imported)
  setPreviewOGTagData: React.Dispatch<React.SetStateAction<DecodeUrlModelSX | null>>; // Add the DecodeUrlModelSX type here (assuming it's imported)
  hasPreviewClosedOnce: boolean;
  setHasPreviewClosedOnce: React.Dispatch<React.SetStateAction<boolean>>;
  showMediaAttachmentOnInitiation: boolean;
  showDocumentAttachmentOnInitiation: boolean;
  // setShowMediaAttachmentOnInitiation: React.Dispatch<React.SetStateAction<boolean>>;
}
const AttachmentsHolder = ({
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
}: AttachmentsHolderProps) => {
  function setAttachmentTypeImage() {
    setShowMediaUploadBar(false);
    setShowInitiateUploadComponent(true);
    setAttachmentType(1);
  }
  function setAttachmentTypeDocument() {
    setShowMediaUploadBar(false);
    setShowInitiateUploadComponent(true);
    setAttachmentType(2);
  }

  useEffect(() => {
    if (showMediaAttachmentOnInitiation) {
      setAttachmentTypeImage();
    } else if (showDocumentAttachmentOnInitiation) {
      setAttachmentTypeDocument();
    }
  }, []);

  function setMediaUploadBar() {
    if (showMediaUploadBar) {
      return (
        <div className="create-post-feed-dialog-wrapper_container_post-wrapper--post-attachment-wrapper">
          <div className="create-post-feed-dialog-wrapper_container_post-wrapper_post-attachment-dialog--add-post-text">
            Add to your post
          </div>
          <div>
            {/* Image upload icon */}
            <span
              className="create-post-feed-dialog-wrapper_container_post-wrapper_post-attachment-dialog--icon"
              onClick={setAttachmentTypeImage}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M15.75 9.375C15.75 9.67337 15.6315 9.95952 15.4205 10.1705C15.2095 10.3815 14.9234 10.5 14.625 10.5C14.3266 10.5 14.0405 10.3815 13.8295 10.1705C13.6185 9.95952 13.5 9.67337 13.5 9.375C13.5 9.07663 13.6185 8.79048 13.8295 8.5795C14.0405 8.36853 14.3266 8.25 14.625 8.25C14.9234 8.25 15.2095 8.36853 15.4205 8.5795C15.6315 8.79048 15.75 9.07663 15.75 9.375ZM21.75 5.25V17.25V18.75C21.75 19.1478 21.592 19.5294 21.3107 19.8107C21.0294 20.092 20.6478 20.25 20.25 20.25H3.75C3.35218 20.25 2.97064 20.092 2.68934 19.8107C2.40804 19.5294 2.25 19.1478 2.25 18.75V15.75V5.25C2.25 4.85218 2.40804 4.47064 2.68934 4.18934C2.97064 3.90804 3.35218 3.75 3.75 3.75H20.25C20.6478 3.75 21.0294 3.90804 21.3107 4.18934C21.592 4.47064 21.75 4.85218 21.75 5.25ZM20.25 15.4406V5.25H3.75V13.9406L7.19062 10.5C7.47302 10.2217 7.85355 10.0658 8.25 10.0658C8.64645 10.0658 9.02698 10.2217 9.30938 10.5L13.5 14.6906L15.4406 12.75C15.723 12.4717 16.1036 12.3158 16.5 12.3158C16.8964 12.3158 17.277 12.4717 17.5594 12.75L20.25 15.4406Z"
                  fill="#ED8031"
                />
              </svg>
            </span>
            {/* Video upload icons */}
            <span
              className="create-post-feed-dialog-wrapper_container_post-wrapper_post-attachment-dialog--icon"
              onClick={setAttachmentTypeImage}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M16.5 8.625V17.625C16.5 18.0228 16.342 18.4044 16.0607 18.6857C15.7794 18.967 15.3978 19.125 15 19.125H4.5C4.00754 19.125 3.51991 19.028 3.06494 18.8395C2.60997 18.6511 2.19657 18.3749 1.84835 18.0267C1.14509 17.3234 0.75 16.3696 0.75 15.375V6.375C0.75 5.97718 0.908035 5.59564 1.18934 5.31434C1.47064 5.03304 1.85218 4.875 2.25 4.875H12.75C13.7446 4.875 14.6984 5.27009 15.4017 5.97335C16.1049 6.67661 16.5 7.63044 16.5 8.625ZM22.875 6.85312C22.762 6.78442 22.6323 6.74808 22.5 6.74808C22.3677 6.74808 22.238 6.78442 22.125 6.85312L18.375 8.99063C18.26 9.05702 18.1647 9.15276 18.0988 9.26806C18.0329 9.38336 17.9988 9.51408 18 9.64688V14.3531C17.9988 14.4859 18.0329 14.6166 18.0988 14.7319C18.1647 14.8472 18.26 14.943 18.375 15.0094L22.125 17.1469C22.2393 17.2124 22.3683 17.2479 22.5 17.25C22.6319 17.2492 22.7612 17.2136 22.875 17.1469C22.9899 17.0828 23.0854 16.9888 23.1514 16.875C23.2174 16.7611 23.2515 16.6316 23.25 16.5V7.5C23.2515 7.36841 23.2174 7.23886 23.1514 7.12501C23.0854 7.01116 22.9899 6.91723 22.875 6.85312Z"
                  fill="#7B61FF"
                />
              </svg>
            </span>

            <span
              className="create-post-feed-dialog-wrapper_container_post-wrapper_post-attachment-dialog--icon"
              onClick={setAttachmentTypeDocument}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M18 17.25C18 16.8358 17.6642 16.5 17.25 16.5H6.5C4.29 16.5 2.5 14.71 2.5 12.5C2.5 10.29 4.29 8.5 6.5 8.5H19C20.38 8.5 21.5 9.62 21.5 11C21.5 12.38 20.38 13.5 19 13.5H10.5C9.95 13.5 9.5 13.05 9.5 12.5C9.5 11.95 9.95 11.5 10.5 11.5H17.25C17.6642 11.5 18 11.1642 18 10.75C18 10.3358 17.6642 10 17.25 10H10.5C9.12 10 8 11.12 8 12.5C8 13.88 9.12 15 10.5 15H19C21.21 15 23 13.21 23 11C23 8.79 21.21 7 19 7H6.5C3.46 7 1 9.46 1 12.5C1 15.54 3.46 18 6.5 18H17.25C17.6642 18 18 17.6642 18 17.25Z"
                  fill="#484F67"
                />
              </svg>
            </span>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
  function setInitiateUploadBlock() {
    if (showInitiateUploadComponent) {
      return (
        <InitiateUploadView
          setShowMediaUploadBar={setShowMediaUploadBar}
          setImageOrVideoUploadArray={setImageOrVideoUploadArray}
          setDocumentUploadArray={setDocumentUploadArray}
          attachmentType={attachmentType}
          setAttachmentType={setAttachmentType}
          setShowInitiateUploadComponent={setShowInitiateUploadComponent}
        />
      );
    } else {
      return null;
    }
  }
  function setUploadedView() {
    if (attachmentType === 1 && !showInitiateUploadComponent) {
      return (
        <ImageVideoAttachmentView
          imageOrVideoUploadArray={imageOrVideoUploadArray}
          setImageOrVideoUploadArray={setImageOrVideoUploadArray}
          showInitiateUploadComponent={showInitiateUploadComponent}
          setShowInitiateUploadComponent={setShowInitiateUploadComponent}
        />
      );
    } else if (attachmentType === 2 && !showInitiateUploadComponent) {
      return (
        <DocumentUploadAttachmentContainer
          documentUploadArray={documentUploadArray}
          setDocumentUploadArray={setDocumentUploadArray}
        />
      );
    } else {
      return null;
    }
  }
  function setOGTagPreviewBlock() {
    if (showOGTagPreview && attachmentType === 0) {
      return (
        <PreviewForOGTag
          ogTagPreviewData={previewOGTagData!}
          setOgTagPreview={setShowOGTagPreview}
          setHasPreviewClosedOnce={setHasPreviewClosedOnce}
        />
      );
    }
    return null;
  }

  return (
    <>
      <div
        className="attachmentHolder"
        style={{
          display: showOGTagPreview ? 'block' : 'flex'
        }}>
        {/* <MaxTwoImage /> */}
        {setOGTagPreviewBlock()}
        {setInitiateUploadBlock()}
        {setUploadedView()}
        {setMediaUploadBar()}
      </div>
    </>
  );
};

type DocumentUploadAttachmentContainerProps = {
  documentUploadArray: File[] | null;
  setDocumentUploadArray: React.Dispatch<React.SetStateAction<File[] | null>>;
};

function DocumentUploadAttachmentContainer({
  documentUploadArray,
  setDocumentUploadArray
}: DocumentUploadAttachmentContainerProps) {
  function removeADocument(index: number) {
    const newDocumentUploadArray: File[] = [...documentUploadArray!];
    newDocumentUploadArray.splice(index, 1);
    setDocumentUploadArray(newDocumentUploadArray);
  }
  function renderUploadedDocuments() {
    if (documentUploadArray === null) {
      return null;
    }
    const docArray: File[] = Array.from(documentUploadArray);
    return docArray?.map((docItem: File, docIndex: number) => {
      function ad() {
        removeADocument(docIndex);
      }
      return (
        <HolderWithCross key={docItem.name + docIndex} onCloseFunction={ad}>
          <div className="attachedDocumentWrapper">
            {/* pdf icon */}
            <span>
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
            </span>
            <div className="attachedDocumentWrapper--attachmentBody">
              <p className="attachedDocumentWrapper__attachmentBody--headingMain">{docItem.name}</p>
              <p className="attachedDocumentWrapper__attachmentBody--headingSub">
                2 Pages {Math.floor(docItem.size / 1024)} Kb PDF
              </p>
            </div>
          </div>
        </HolderWithCross>
      );
    });
  }
  // eslint-disable-next-line no-undef
  function addMoreDocuments(event: ChangeEvent<HTMLInputElement>) {
    const newDocumentUploadArray: File[] = [...documentUploadArray!].concat(
      Array.from(event.target.files!)
    );
    setDocumentUploadArray(newDocumentUploadArray);
  }
  return (
    <div className="documentAttachmentWrapperContainer">
      <div className="documentAttachmentContainer">
        <>{renderUploadedDocuments()}</>
      </div>
      <label>
        <div className="documentAttachmentContainer--addMoreContainer">
          <span>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M4 12C4 12.2205 4.07919 12.41 4.23757 12.5685C4.39595 12.7201 4.58188 12.7959 4.79535 12.7959H11.2098V19.2145C11.2098 19.4281 11.2856 19.6107 11.4371 19.7623C11.5954 19.9208 11.7848 20 12.0052 20C12.2186 20 12.4011 19.9208 12.5526 19.7623C12.7041 19.6107 12.7799 19.4281 12.7799 19.2145V12.7959H19.215C19.4284 12.7959 19.6109 12.7201 19.7624 12.5685C19.9208 12.41 20 12.2205 20 12C20 11.7864 19.9208 11.6038 19.7624 11.4522C19.6109 11.2937 19.4284 11.2145 19.215 11.2145H12.7799V4.78553C12.7799 4.57881 12.7041 4.39621 12.5526 4.23773C12.4011 4.07924 12.2186 4 12.0052 4C11.7848 4 11.5954 4.07924 11.4371 4.23773C11.2856 4.39621 11.2098 4.57881 11.2098 4.78553V11.2145H4.79535C4.58188 11.2145 4.39595 11.2937 4.23757 11.4522C4.07919 11.6038 4 11.7864 4 12Z"
                fill="#484F67"
              />
            </svg>
          </span>
          <span>Add More</span>
          <input
            type="file"
            accept=".doc, .docx, .pdf, .txt"
            multiple
            onChange={addMoreDocuments}
          />
        </div>
      </label>
    </div>
  );
}

type SingleImageProps = {
  imageOrVideoUploadArray: File[] | null;
};

type InitiateUploadViewProps = {
  setShowMediaUploadBar: React.Dispatch<React.SetStateAction<boolean | null>>;
  setShowInitiateUploadComponent: React.Dispatch<React.SetStateAction<boolean>>;
  setImageOrVideoUploadArray: React.Dispatch<React.SetStateAction<File[] | null>>;
  setDocumentUploadArray: React.Dispatch<React.SetStateAction<File[] | null>>;
  attachmentType: number | null;
  setAttachmentType: React.Dispatch<React.SetStateAction<number | null>>;
};

const InitiateUploadView = ({
  // showMediaUploadBar,
  setShowMediaUploadBar,
  // showInitiateUploadComponent,
  setShowInitiateUploadComponent,
  // imageOrVideoUploadArray,
  setImageOrVideoUploadArray,
  // documentUploadArray,
  setDocumentUploadArray,
  attachmentType,
  setAttachmentType
}: InitiateUploadViewProps) => {
  function handleImageMediaUpload(e: ChangeEvent<HTMLInputElement>) {
    setImageOrVideoUploadArray(Array.from(e.target.files!));
    setShowInitiateUploadComponent(false);
  }
  function handleDocumentMediaUpload(e: ChangeEvent<HTMLInputElement>) {
    setDocumentUploadArray(Array.from(e.target.files!));
    setShowInitiateUploadComponent(false);
  }
  function renderInputBox() {
    if (attachmentType === 1) {
      return (
        <>
          {/* attachment image icon svg */}
          <div>
            <svg
              width="20"
              height="18"
              viewBox="0 0 20 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M13.75 6.375C13.75 6.67337 13.6315 6.95952 13.4205 7.1705C13.2095 7.38147 12.9234 7.5 12.625 7.5C12.3266 7.5 12.0405 7.38147 11.8295 7.1705C11.6185 6.95952 11.5 6.67337 11.5 6.375C11.5 6.07663 11.6185 5.79048 11.8295 5.5795C12.0405 5.36853 12.3266 5.25 12.625 5.25C12.9234 5.25 13.2095 5.36853 13.4205 5.5795C13.6315 5.79048 13.75 6.07663 13.75 6.375ZM19.75 2.25V14.25V15.75C19.75 16.1478 19.592 16.5294 19.3107 16.8107C19.0294 17.092 18.6478 17.25 18.25 17.25H1.75C1.35218 17.25 0.970644 17.092 0.68934 16.8107C0.408035 16.5294 0.25 16.1478 0.25 15.75V12.75V2.25C0.25 1.85218 0.408035 1.47064 0.68934 1.18934C0.970644 0.908035 1.35218 0.75 1.75 0.75H18.25C18.6478 0.75 19.0294 0.908035 19.3107 1.18934C19.592 1.47064 19.75 1.85218 19.75 2.25ZM18.25 12.4406V2.25H1.75V10.9406L5.19062 7.5C5.47302 7.22175 5.85355 7.06577 6.25 7.06577C6.64645 7.06577 7.02698 7.22175 7.30938 7.5L11.5 11.6906L13.4406 9.75C13.723 9.47175 14.1036 9.31577 14.5 9.31577C14.8964 9.31577 15.277 9.47175 15.5594 9.75L18.25 12.4406Z"
                fill="#ED8031"
              />
            </svg>
          </div>
          {/* heading */}
          <p className="initiateMediaUploadBox--headingOne">Add Photos/Videos</p>
          <p className="initiateMediaUploadBox--headingTwo">or drag and drop</p>

          <input
            type="file"
            accept="image/*, video/*"
            multiple
            // value={imageOrVideoUploadArray}
            onChange={handleImageMediaUpload}
          />
        </>
      );
    } else if (attachmentType === 2) {
      return (
        <>
          {/* attachment pin icon svg */}
          <span>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M18 17.25C18 16.8358 17.6642 16.5 17.25 16.5H6.5C4.29 16.5 2.5 14.71 2.5 12.5C2.5 10.29 4.29 8.5 6.5 8.5H19C20.38 8.5 21.5 9.62 21.5 11C21.5 12.38 20.38 13.5 19 13.5H10.5C9.95 13.5 9.5 13.05 9.5 12.5C9.5 11.95 9.95 11.5 10.5 11.5H17.25C17.6642 11.5 18 11.1642 18 10.75C18 10.3358 17.6642 10 17.25 10H10.5C9.12 10 8 11.12 8 12.5C8 13.88 9.12 15 10.5 15H19C21.21 15 23 13.21 23 11C23 8.79 21.21 7 19 7H6.5C3.46 7 1 9.46 1 12.5C1 15.54 3.46 18 6.5 18H17.25C17.6642 18 18 17.6642 18 17.25Z"
                fill="#484F67"
              />
            </svg>
          </span>
          {/* heading */}
          <p className="initiateMediaUploadBox--headingOne">Add Files/Documents</p>
          <p className="initiateMediaUploadBox--headingTwo">or drag and drop</p>
          <input
            type="file"
            accept=".doc, .docx, .pdf, .txt"
            multiple
            onChange={handleDocumentMediaUpload}
          />
        </>
      );
    }
  }
  function handleCloseIconInitiateMediaUploadBox(e: React.MouseEvent<HTMLElement>) {
    e.stopPropagation();
    e.preventDefault();
    setAttachmentType(0);
    setShowMediaUploadBar(true);
    setShowInitiateUploadComponent(false);
    setImageOrVideoUploadArray(null);
    setDocumentUploadArray(null);
  }
  return (
    <label className="initiateMediaUploadBox">
      {/* close icon for the upload box */}
      <span
        className="initiateMediaUploadBox--closeIcon"
        onClick={handleCloseIconInitiateMediaUploadBox}>
        <svg
          width="26"
          height="26"
          viewBox="0 0 26 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <circle cx="13" cy="13" r="12" stroke="#484F67" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M13.6857 13L17.1141 9.5716L16.4284 8.88592L13 12.3143L9.5716 8.88592L8.88592 9.5716L12.3143 13L8.88592 16.4284L9.5716 17.1141L13 13.6857L16.4284 17.1141L17.1141 16.4284L13.6857 13Z"
            fill="#484F67"
          />
          <path
            d="M17.1141 9.5716L17.4676 9.92515L17.8212 9.5716L17.4676 9.21804L17.1141 9.5716ZM13.6857 13L13.3321 12.6464L12.9786 13L13.3321 13.3535L13.6857 13ZM16.4284 8.88592L16.782 8.53236L16.4284 8.17881L16.0748 8.53236L16.4284 8.88592ZM13 12.3143L12.6464 12.6679L13 13.0214L13.3536 12.6679L13 12.3143ZM9.5716 8.88592L9.92516 8.53236L9.5716 8.17881L9.21805 8.53236L9.5716 8.88592ZM8.88592 9.5716L8.53237 9.21804L8.17882 9.5716L8.53237 9.92515L8.88592 9.5716ZM12.3143 13L12.6679 13.3535L13.0214 13L12.6679 12.6464L12.3143 13ZM8.88592 16.4284L8.53237 16.0748L8.17882 16.4284L8.53237 16.7819L8.88592 16.4284ZM9.5716 17.1141L9.21805 17.4676L9.5716 17.8212L9.92516 17.4676L9.5716 17.1141ZM13 13.6857L13.3536 13.3321L13 12.9786L12.6464 13.3321L13 13.6857ZM16.4284 17.1141L16.0748 17.4676L16.4284 17.8212L16.7819 17.4676L16.4284 17.1141ZM17.1141 16.4284L17.4676 16.7819L17.8212 16.4284L17.4676 16.0748L17.1141 16.4284ZM16.7605 9.21804L13.3321 12.6464L14.0392 13.3535L17.4676 9.92515L16.7605 9.21804ZM16.0748 9.23947L16.7605 9.92515L17.4676 9.21804L16.782 8.53236L16.0748 9.23947ZM13.3536 12.6679L16.782 9.23947L16.0748 8.53236L12.6464 11.9608L13.3536 12.6679ZM9.21805 9.23947L12.6464 12.6679L13.3536 11.9608L9.92516 8.53236L9.21805 9.23947ZM9.23948 9.92515L9.92516 9.23947L9.21805 8.53236L8.53237 9.21804L9.23948 9.92515ZM12.6679 12.6464L9.23948 9.21804L8.53237 9.92515L11.9608 13.3535L12.6679 12.6464ZM9.23948 16.7819L12.6679 13.3535L11.9608 12.6464L8.53237 16.0748L9.23948 16.7819ZM9.92516 16.7605L9.23948 16.0748L8.53237 16.7819L9.21805 17.4676L9.92516 16.7605ZM12.6464 13.3321L9.21805 16.7605L9.92516 17.4676L13.3536 14.0392L12.6464 13.3321ZM16.7819 16.7605L13.3536 13.3321L12.6464 14.0392L16.0748 17.4676L16.7819 16.7605ZM16.7605 16.0748L16.0748 16.7605L16.7819 17.4676L17.4676 16.7819L16.7605 16.0748ZM13.3321 13.3535L16.7605 16.7819L17.4676 16.0748L14.0392 12.6464L13.3321 13.3535Z"
            fill="#484F67"
          />
        </svg>
      </span>

      {renderInputBox()}
    </label>
  );
};
type ImageVideoAttachmentViewProps = {
  imageOrVideoUploadArray: File[] | null;
  setImageOrVideoUploadArray: React.Dispatch<React.SetStateAction<File[] | null>>;
  showInitiateUploadComponent: any;
  setShowInitiateUploadComponent: any;
};
function renderAttachments(attachmentsArray: File[]) {
  return attachmentsArray.map((attachment: File) => {
    return renderMediaItem(attachment);
  });
}
function renderMediaItem(attachment: File) {
  switch (attachment.type.split('/')[0]) {
    case 'image':
      return (
        <div
          style={{
            background: 'black',
            height: '100%'
          }}>
          <img
            // className="postMediaAttachment--image"
            src={URL.createObjectURL(attachment)}
            alt="post"
            key={attachment.name + Math.random().toString()}
            loading="lazy"
            style={{
              maxHeight: '468px',
              maxWidth: '100%',
              height: 'auto',
              width: 'auto'
            }}
          />
        </div>
      );
    case 'video':
      return (
        <div
          style={{
            background: 'black'
          }}>
          <video
            className="postMediaAttachment--video"
            src={URL.createObjectURL(attachment)}
            key={attachment.name + Math.random().toString()}
            controls
            style={{
              maxHeight: '468px',
              maxWidth: '100%',
              height: 'auto',
              width: 'auto'
            }}
          />
        </div>
      );
    default:
      return (
        <object
          data={URL.createObjectURL(attachment)}
          type="application/pdf"
          width="100%"
          height="100%">
          <p>
            Alternative text - include a link{' '}
            <a href="http://africau.edu/images/default/sample.pdf">to the PDF!</a>
          </p>
        </object>
      );
  }
}
function ImageVideoAttachmentView({
  imageOrVideoUploadArray,
  setImageOrVideoUploadArray,
  setShowInitiateUploadComponent
}: ImageVideoAttachmentViewProps) {
  const [selectedSlide, setSelectedSlide] = useState<number>(0);
  const [rI, setRI] = useState<any>(null);
  function removeAMedia(index: number) {
    let newMediaArray = [...imageOrVideoUploadArray!];
    newMediaArray.splice(index, 1);
    if (newMediaArray.length === 0) {
      setShowInitiateUploadComponent(true);
    }
    setImageOrVideoUploadArray(newMediaArray);
  }
  useMemo(() => renderImages(), [imageOrVideoUploadArray]);
  function renderImages() {
    setRI(
      <div
        style={{
          position: 'relative',
          height: '100%',
          width: '100%'
        }}>
        <span
          className="initiateMediaUploadBox--closeIcon"
          onClick={() => removeAMedia(selectedSlide)}
          style={{
            zIndex: 1
          }}>
          <svg
            width="26"
            height="26"
            viewBox="0 0 26 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <circle cx="13" cy="13" r="12" stroke="white" />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M13.6857 13L17.1141 9.5716L16.4284 8.88592L13 12.3143L9.5716 8.88592L8.88592 9.5716L12.3143 13L8.88592 16.4284L9.5716 17.1141L13 13.6857L16.4284 17.1141L17.1141 16.4284L13.6857 13Z"
              fill="white"
            />
            <path
              d="M17.1141 9.5716L17.4676 9.92515L17.8212 9.5716L17.4676 9.21804L17.1141 9.5716ZM13.6857 13L13.3321 12.6464L12.9786 13L13.3321 13.3535L13.6857 13ZM16.4284 8.88592L16.782 8.53236L16.4284 8.17881L16.0748 8.53236L16.4284 8.88592ZM13 12.3143L12.6464 12.6679L13 13.0214L13.3536 12.6679L13 12.3143ZM9.5716 8.88592L9.92516 8.53236L9.5716 8.17881L9.21805 8.53236L9.5716 8.88592ZM8.88592 9.5716L8.53237 9.21804L8.17882 9.5716L8.53237 9.92515L8.88592 9.5716ZM12.3143 13L12.6679 13.3535L13.0214 13L12.6679 12.6464L12.3143 13ZM8.88592 16.4284L8.53237 16.0748L8.17882 16.4284L8.53237 16.7819L8.88592 16.4284ZM9.5716 17.1141L9.21805 17.4676L9.5716 17.8212L9.92516 17.4676L9.5716 17.1141ZM13 13.6857L13.3536 13.3321L13 12.9786L12.6464 13.3321L13 13.6857ZM16.4284 17.1141L16.0748 17.4676L16.4284 17.8212L16.7819 17.4676L16.4284 17.1141ZM17.1141 16.4284L17.4676 16.7819L17.8212 16.4284L17.4676 16.0748L17.1141 16.4284ZM16.7605 9.21804L13.3321 12.6464L14.0392 13.3535L17.4676 9.92515L16.7605 9.21804ZM16.0748 9.23947L16.7605 9.92515L17.4676 9.21804L16.782 8.53236L16.0748 9.23947ZM13.3536 12.6679L16.782 9.23947L16.0748 8.53236L12.6464 11.9608L13.3536 12.6679ZM9.21805 9.23947L12.6464 12.6679L13.3536 11.9608L9.92516 8.53236L9.21805 9.23947ZM9.23948 9.92515L9.92516 9.23947L9.21805 8.53236L8.53237 9.21804L9.23948 9.92515ZM12.6679 12.6464L9.23948 9.21804L8.53237 9.92515L11.9608 13.3535L12.6679 12.6464ZM9.23948 16.7819L12.6679 13.3535L11.9608 12.6464L8.53237 16.0748L9.23948 16.7819ZM9.92516 16.7605L9.23948 16.0748L8.53237 16.7819L9.21805 17.4676L9.92516 16.7605ZM12.6464 13.3321L9.21805 16.7605L9.92516 17.4676L13.3536 14.0392L12.6464 13.3321ZM16.7819 16.7605L13.3536 13.3321L12.6464 14.0392L16.0748 17.4676L16.7819 16.7605ZM16.7605 16.0748L16.0748 16.7605L16.7819 17.4676L17.4676 16.7819L16.7605 16.0748ZM13.3321 13.3535L16.7605 16.7819L17.4676 16.0748L14.0392 12.6464L13.3321 13.3535Z"
              fill="white"
            />
          </svg>
        </span>

        <Carousel
          className="postMediaAttachment"
          showThumbs={false}
          showStatus={false}
          dynamicHeight={false}
          onChange={(index: number) => {
            setSelectedSlide(index);
          }}>
          {renderAttachments(imageOrVideoUploadArray!)}
        </Carousel>
      </div>
    );
  }
  // eslint-disable-next-line no-undef
  function addMoreImages(e: ChangeEvent<HTMLInputElement>) {
    const newImageArray: File[] = [...imageOrVideoUploadArray!].concat(Array.from(e.target.files!));
    setImageOrVideoUploadArray(newImageArray);
  }
  return (
    <div
      className="attachmentHolder__singleBlock"
      style={{
        height: '100%'
      }}>
      <label>
        <span
          className="attachmentHolder__addMoreButton"
          style={{
            zIndex: 1
          }}>
          <input type="file" onChange={addMoreImages} accept="image/*, video/*" />
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 8C0 8.2205 0.0791909 8.40999 0.237573 8.56847C0.395954 8.72007 0.581881 8.79587 0.795352 8.79587H7.20981V15.2145C7.20981 15.4281 7.28556 15.6107 7.43706 15.7623C7.59544 15.9208 7.78481 16 8.00517 16C8.21864 16 8.40112 15.9208 8.55262 15.7623C8.70411 15.6107 8.77986 15.4281 8.77986 15.2145V8.79587H15.215C15.4284 8.79587 15.6109 8.72007 15.7624 8.56847C15.9208 8.40999 16 8.2205 16 8C16 7.78639 15.9208 7.60379 15.7624 7.4522C15.6109 7.29371 15.4284 7.21447 15.215 7.21447H8.77986V0.78553C8.77986 0.578811 8.70411 0.39621 8.55262 0.237726C8.40112 0.079242 8.21864 0 8.00517 0C7.78481 0 7.59544 0.079242 7.43706 0.237726C7.28556 0.39621 7.20981 0.578811 7.20981 0.78553V7.21447H0.795352C0.581881 7.21447 0.395954 7.29371 0.237573 7.4522C0.0791909 7.60379 0 7.78639 0 8Z"
              fill="#5046E5"
            />
          </svg>
          Add More
        </span>
      </label>
      {rI}
    </div>
  );
}

export type HolderWithCrossProps = {
  children: ReactNode;
  onCloseFunction: () => void;
  closeIconHide?: boolean;
};

export function HolderWithCross({
  children,
  onCloseFunction,
  closeIconHide
}: HolderWithCrossProps) {
  return (
    <div className="holderWithCrossContainer">
      {!closeIconHide ? (
        <span className="holderWithCrossContainer--closeIcon" onClick={onCloseFunction}>
          <svg
            width="26"
            height="26"
            viewBox="0 0 26 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <circle cx="13" cy="13" r="12" fill="white" stroke="#484F67" />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M13.6857 13L17.1141 9.5716L16.4284 8.88592L13 12.3143L9.5716 8.88592L8.88592 9.5716L12.3143 13L8.88592 16.4284L9.5716 17.1141L13 13.6857L16.4284 17.1141L17.1141 16.4284L13.6857 13Z"
              fill="#484F67"
            />
            <path
              d="M17.1141 9.5716L17.4676 9.92515L17.8212 9.5716L17.4676 9.21804L17.1141 9.5716ZM13.6857 13L13.3321 12.6464L12.9786 13L13.3321 13.3535L13.6857 13ZM16.4284 8.88592L16.782 8.53236L16.4284 8.17881L16.0748 8.53236L16.4284 8.88592ZM13 12.3143L12.6464 12.6679L13 13.0214L13.3536 12.6679L13 12.3143ZM9.5716 8.88592L9.92516 8.53236L9.5716 8.17881L9.21805 8.53236L9.5716 8.88592ZM8.88592 9.5716L8.53237 9.21804L8.17882 9.5716L8.53237 9.92515L8.88592 9.5716ZM12.3143 13L12.6679 13.3535L13.0214 13L12.6679 12.6464L12.3143 13ZM8.88592 16.4284L8.53237 16.0748L8.17882 16.4284L8.53237 16.7819L8.88592 16.4284ZM9.5716 17.1141L9.21805 17.4676L9.5716 17.8212L9.92516 17.4676L9.5716 17.1141ZM13 13.6857L13.3536 13.3321L13 12.9786L12.6464 13.3321L13 13.6857ZM16.4284 17.1141L16.0748 17.4676L16.4284 17.8212L16.7819 17.4676L16.4284 17.1141ZM17.1141 16.4284L17.4676 16.7819L17.8212 16.4284L17.4676 16.0748L17.1141 16.4284ZM16.7605 9.21804L13.3321 12.6464L14.0392 13.3535L17.4676 9.92515L16.7605 9.21804ZM16.0748 9.23947L16.7605 9.92515L17.4676 9.21804L16.782 8.53236L16.0748 9.23947ZM13.3536 12.6679L16.782 9.23947L16.0748 8.53236L12.6464 11.9608L13.3536 12.6679ZM9.21805 9.23947L12.6464 12.6679L13.3536 11.9608L9.92516 8.53236L9.21805 9.23947ZM9.23948 9.92515L9.92516 9.23947L9.21805 8.53236L8.53237 9.21804L9.23948 9.92515ZM12.6679 12.6464L9.23948 9.21804L8.53237 9.92515L11.9608 13.3535L12.6679 12.6464ZM9.23948 16.7819L12.6679 13.3535L11.9608 12.6464L8.53237 16.0748L9.23948 16.7819ZM9.92516 16.7605L9.23948 16.0748L8.53237 16.7819L9.21805 17.4676L9.92516 16.7605ZM12.6464 13.3321L9.21805 16.7605L9.92516 17.4676L13.3536 14.0392L12.6464 13.3321ZM16.7819 16.7605L13.3536 13.3321L12.6464 14.0392L16.0748 17.4676L16.7819 16.7605ZM16.7605 16.0748L16.0748 16.7605L16.7819 17.4676L17.4676 16.7819L16.7605 16.0748ZM13.3321 13.3535L16.7605 16.7819L17.4676 16.0748L14.0392 12.6464L13.3321 13.3535Z"
              fill="#484F67"
            />
          </svg>
        </span>
      ) : null}
      {children}
    </div>
  );
}

interface OgTags {
  title?: string; // Link Title | nullable
  image?: string; // Link Image URL | nullable
  description?: string; // Link description | nullable
  url?: string; // Link URL | nullable
}
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
  if (!ogTagPreviewData) {
    return null;
  }
  return (
    <div className="ogTagPreviewContainer">
      <HolderWithCross onCloseFunction={closePreviewBox}>
        <div className="ogTagPreviewContainer--wrapper">
          <div className="ogTagPreviewContainer__wrapper--imageWrapper">
            {
              <img
                src={ogTagPreviewData.image?.length === 0 ? previewImage : ogTagPreviewData?.image}
                alt="preview"
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
export default AttachmentsHolder;
