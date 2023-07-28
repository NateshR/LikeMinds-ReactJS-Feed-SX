import React, { useContext, useEffect, useState } from 'react';

import './createPostDialog.css';
import defaultUserImage from '../../../assets/images/defaultUserImage.png';
import UserContext from '../../../contexts/UserContext';
import { lmFeedClient } from '../../..';
import AttachmentsHolder from './AttachmentsHolder';
import { DecodeUrlModelSX } from '../../../services/models';
const CreatePostDialog = ({ dialogBoxRef, closeCreatePostDialog }: any) => {
  console.log(dialogBoxRef);
  const userContext = useContext(UserContext);
  function setUserImage() {
    const imageLink = userContext?.user?.image_url;
    if (imageLink !== '') {
      return <img src={imageLink} alt={userContext.user?.image_url} />;
    } else {
      return <img src={defaultUserImage} alt={userContext.user?.image_url} />;
    }
  }
  const [text, setText] = useState('');
  const [showMediaUploadBar, setShowMediaUploadBar] = useState<null | boolean>(true);
  const [showInitiateUploadComponent, setShowInitiateUploadComponent] = useState<boolean>(false);
  const [imageOrVideoUploadArray, setImageOrVideoUploadArray] = useState<null | any[]>(null);
  const [documentUploadArray, setDocumentUploadArray] = useState<null | any[]>(null);
  const [attachmentType, setAttachmentType] = useState<null | number>(0);
  const [showOGTagPreview, setShowOGTagPreview] = useState<boolean>(false);
  const [previewOGTagData, setPreviewOGTagData] = useState<DecodeUrlModelSX | null>(null);
  const [hasPreviewClosedOnce, setHasPreviewClosedOnce] = useState<boolean>(false);
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
  };

  function resetContext() {
    setShowMediaUploadBar(true);
    setImageOrVideoUploadArray(null);
    setDocumentUploadArray(null);
    setText('');
    setAttachmentType(null);
    setShowInitiateUploadComponent(false);
  }

  async function postFeed() {
    try {
      closeDialogBox();
      if (imageOrVideoUploadArray?.length) {
        await lmFeedClient.addPostWithImageAttachments(
          text,
          imageOrVideoUploadArray,
          userContext?.user?.sdk_client_info.user_unique_id
        );
      } else if (documentUploadArray?.length) {
        await lmFeedClient.addPostWithDocumentAttachments(
          text,
          documentUploadArray,
          userContext?.user?.sdk_client_info.user_unique_id
        );
      } else if (previewOGTagData !== null) {
        await lmFeedClient.addPostWithOGTags(text, previewOGTagData);
      } else {
        lmFeedClient.addPost(text);
      }
    } catch (error) {
      lmFeedClient.logError(error);
    }
  }
  async function checkForOGTags() {
    try {
      const ogTagLinkArray: string[] = lmFeedClient.detectLinks(text);
      console.log(ogTagLinkArray);
      if (ogTagLinkArray.length) {
        const getOgTag: DecodeUrlModelSX = await lmFeedClient.decodeUrl(ogTagLinkArray[0]);
        console.log('the og tag call is :', getOgTag);
        setPreviewOGTagData(getOgTag);
        if (!hasPreviewClosedOnce) {
          setShowOGTagPreview(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  function closeDialogBox() {
    resetContext();
    closeCreatePostDialog();
  }

  useEffect(() => {
    console.log(imageOrVideoUploadArray);
  }, [imageOrVideoUploadArray]);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      checkForOGTags();
    }, 500);
    return () => {
      clearTimeout(timeOut);
    };
  }, [text]);
  return (
    <div className="create-post-feed-dialog-wrapper">
      <div className="create-post-feed-dialog-wrapper--container">
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
            <span>Create Post</span>
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
            <textarea
              rows={4}
              placeholder="Write something here...."
              value={text}
              onChange={(e) => {
                setText(e.target.value);
              }}
            />
          </div>
          <AttachmentsHolder {...attachmentProps} />
          <div
            className="create-post-feed-dialog-wrapper_container_post-wrapper--send-post"
            onClick={postFeed}>
            Post
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostDialog;
