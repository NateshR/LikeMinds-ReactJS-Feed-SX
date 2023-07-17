import React, { useContext, useEffect, useState } from "react";

import "./createPostDialog.css";
import defaultUserImage from "../../../assets/images/defaultUserImage.png";
import UserContext from "../../../contexts/UserContext";
import { lmFeedClient } from "../../..";
const CreatePostDialog = ({ dialogBoxRef, closeCreatePostDialog }: any) => {
  const userContext = useContext(UserContext);
  function setUserImage() {
    const imageLink = userContext?.user?.image_url;
    if (imageLink !== "") {
      return <img src={imageLink} alt={userContext.user?.image_url} />;
    } else {
      return <img src={defaultUserImage} alt={userContext.user?.image_url} />;
    }
  }
  const [text, setText] = useState("");
  async function postFeed() {
    try {
      lmFeedClient.addPost(text);
    } catch (error) {}
  }
  return (
    <div className="create-post-feed-dialog-wrapper">
      <div className="create-post-feed-dialog-wrapper--container">
        <span
          className="create-post-feed-dialog-wrapper_container--closeicon"
          onClick={closeCreatePostDialog}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
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
          <div className="create-post-feed-dialog-wrapper_container_post-wrapper--post-attachment-wrapper">
            <span className="create-post-feed-dialog-wrapper_container_post-wrapper_post-attachment-dialog--add-post-text">
              Add to your post
            </span>
            <span className="create-post-feed-dialog-wrapper_container_post-wrapper_post-attachment-dialog--icon">
              <span>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.75 9.375C15.75 9.67337 15.6315 9.95952 15.4205 10.1705C15.2095 10.3815 14.9234 10.5 14.625 10.5C14.3266 10.5 14.0405 10.3815 13.8295 10.1705C13.6185 9.95952 13.5 9.67337 13.5 9.375C13.5 9.07663 13.6185 8.79048 13.8295 8.5795C14.0405 8.36853 14.3266 8.25 14.625 8.25C14.9234 8.25 15.2095 8.36853 15.4205 8.5795C15.6315 8.79048 15.75 9.07663 15.75 9.375ZM21.75 5.25V17.25V18.75C21.75 19.1478 21.592 19.5294 21.3107 19.8107C21.0294 20.092 20.6478 20.25 20.25 20.25H3.75C3.35218 20.25 2.97064 20.092 2.68934 19.8107C2.40804 19.5294 2.25 19.1478 2.25 18.75V15.75V5.25C2.25 4.85218 2.40804 4.47064 2.68934 4.18934C2.97064 3.90804 3.35218 3.75 3.75 3.75H20.25C20.6478 3.75 21.0294 3.90804 21.3107 4.18934C21.592 4.47064 21.75 4.85218 21.75 5.25ZM20.25 15.4406V5.25H3.75V13.9406L7.19062 10.5C7.47302 10.2217 7.85355 10.0658 8.25 10.0658C8.64645 10.0658 9.02698 10.2217 9.30938 10.5L13.5 14.6906L15.4406 12.75C15.723 12.4717 16.1036 12.3158 16.5 12.3158C16.8964 12.3158 17.277 12.4717 17.5594 12.75L20.25 15.4406Z"
                    fill="#ED8031"
                  />
                </svg>
              </span>
            </span>
            <span className="create-post-feed-dialog-wrapper_container_post-wrapper_post-attachment-dialog--icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.5 8.625V17.625C16.5 18.0228 16.342 18.4044 16.0607 18.6857C15.7794 18.967 15.3978 19.125 15 19.125H4.5C4.00754 19.125 3.51991 19.028 3.06494 18.8395C2.60997 18.6511 2.19657 18.3749 1.84835 18.0267C1.14509 17.3234 0.75 16.3696 0.75 15.375V6.375C0.75 5.97718 0.908035 5.59564 1.18934 5.31434C1.47064 5.03304 1.85218 4.875 2.25 4.875H12.75C13.7446 4.875 14.6984 5.27009 15.4017 5.97335C16.1049 6.67661 16.5 7.63044 16.5 8.625ZM22.875 6.85312C22.762 6.78442 22.6323 6.74808 22.5 6.74808C22.3677 6.74808 22.238 6.78442 22.125 6.85312L18.375 8.99063C18.26 9.05702 18.1647 9.15276 18.0988 9.26806C18.0329 9.38336 17.9988 9.51408 18 9.64688V14.3531C17.9988 14.4859 18.0329 14.6166 18.0988 14.7319C18.1647 14.8472 18.26 14.943 18.375 15.0094L22.125 17.1469C22.2393 17.2124 22.3683 17.2479 22.5 17.25C22.6319 17.2492 22.7612 17.2136 22.875 17.1469C22.9899 17.0828 23.0854 16.9888 23.1514 16.875C23.2174 16.7611 23.2515 16.6316 23.25 16.5V7.5C23.2515 7.36841 23.2174 7.23886 23.1514 7.12501C23.0854 7.01116 22.9899 6.91723 22.875 6.85312Z"
                  fill="#7B61FF"
                />
              </svg>
            </span>
            <span className="create-post-feed-dialog-wrapper_container_post-wrapper_post-attachment-dialog--icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M14.2509 9.58201C14.2509 13.1067 11.2846 15.9641 7.62544 15.9641C6.45964 15.9641 5.36418 15.674 4.41255 15.1648L1.9439 16.2235L2.71942 13.8713C1.65107 12.7381 1 11.2333 1 9.58201C1 6.0573 3.96631 3.19995 7.62544 3.19995C11.2846 3.19995 14.2509 6.0573 14.2509 9.58201ZM7.81514 11.428C7.70258 11.4484 7.58503 11.4585 7.4625 11.4585C7.19883 11.4585 6.95664 11.4107 6.73594 11.315C6.51719 11.2193 6.32773 11.0816 6.16758 10.9019C6.00742 10.7222 5.8834 10.5044 5.79551 10.2486C5.70762 9.99077 5.66367 9.70073 5.66367 9.37847V9.15874C5.66367 8.83452 5.70664 8.54448 5.79258 8.28862C5.88047 8.03276 6.00352 7.81499 6.16172 7.6353C6.32188 7.45366 6.51133 7.31499 6.73008 7.21929C6.95078 7.12358 7.19297 7.07573 7.45664 7.07573C7.72227 7.07573 7.96445 7.12358 8.1832 7.21929C8.40391 7.31499 8.59336 7.45366 8.75156 7.6353C8.91172 7.81499 9.03477 8.03276 9.1207 8.28862C9.20859 8.54448 9.25254 8.83452 9.25254 9.15874V9.37847C9.25254 9.70073 9.20957 9.99077 9.12363 10.2486C9.03769 10.5044 8.91465 10.7222 8.75449 10.9019C8.67974 10.9868 8.59822 11.0623 8.50994 11.1285L9.23203 11.7017L8.71641 12.15L7.81514 11.428ZM8.43809 9.15288V9.37847C8.43809 9.60894 8.4166 9.81304 8.37363 9.99077C8.33066 10.1685 8.26719 10.3189 8.1832 10.4419C8.10117 10.563 7.99961 10.6548 7.87852 10.7173C7.75742 10.7798 7.61875 10.8111 7.4625 10.8111C7.3082 10.8111 7.16953 10.7798 7.04648 10.7173C6.92539 10.6548 6.82188 10.563 6.73594 10.4419C6.65195 10.3189 6.5875 10.1685 6.54258 9.99077C6.49961 9.81304 6.47813 9.60894 6.47813 9.37847V9.15288C6.47813 8.92046 6.49961 8.71636 6.54258 8.54058C6.5875 8.36284 6.65195 8.21343 6.73594 8.09233C6.81992 7.97124 6.92246 7.88042 7.04355 7.81987C7.16465 7.75737 7.30234 7.72612 7.45664 7.72612C7.61289 7.72612 7.75156 7.75737 7.87266 7.81987C7.99375 7.88042 8.09629 7.97124 8.18027 8.09233C8.26621 8.21343 8.33066 8.36284 8.37363 8.54058C8.4166 8.71636 8.43809 8.92046 8.43809 9.15288Z"
                  fill="#F2994A"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M22.9999 14.1584C22.9999 10.6337 20.0336 7.77637 16.3745 7.77637C15.7714 7.77637 15.1872 7.85398 14.6319 7.99941C15.1674 9.88522 15.005 14.1515 10.0713 16.1301C10.9336 18.6899 13.4297 20.5405 16.3745 20.5405C17.5403 20.5405 18.6358 20.2504 19.5874 19.7412L22.056 20.7999L21.2805 18.4477C22.3489 17.3146 22.9999 15.8097 22.9999 14.1584ZM16.3737 11.5343H16.5729L18.1755 15.7999H17.32L16.9995 14.8507H15.4065L15.0876 15.7999H14.235L15.8288 11.5343H16.0251H16.3737ZM15.6202 14.2149H16.7848L16.2011 12.4862L15.6202 14.2149Z"
                  fill="#F2994A"
                />
              </svg>
            </span>
            <span className="create-post-feed-dialog-wrapper_container_post-wrapper_post-attachment-dialog--icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.0002 3.19995C11.4167 3.19995 10.8571 3.43174 10.4446 3.84432C10.032 4.2569 9.80019 4.81647 9.80019 5.39995V18.5999C9.80019 19.1834 10.032 19.743 10.4446 20.1556C10.8571 20.5682 11.4167 20.7999 12.0002 20.7999C12.5837 20.7999 13.1432 20.5682 13.5558 20.1556C13.9684 19.743 14.2002 19.1834 14.2002 18.5999V5.39995C14.2002 4.81647 13.9684 4.2569 13.5558 3.84432C13.1432 3.43174 12.5837 3.19995 12.0002 3.19995ZM5.4002 12C4.81672 12 4.25714 12.2317 3.84456 12.6443C3.43198 13.0569 3.2002 13.6165 3.2002 14.2V18.5999C3.2002 19.1834 3.43198 19.743 3.84456 20.1556C4.25714 20.5682 4.81672 20.7999 5.4002 20.7999C5.98367 20.7999 6.54325 20.5682 6.95583 20.1556C7.36841 19.743 7.60019 19.1834 7.60019 18.5999V14.2C7.60019 13.6165 7.36841 13.0569 6.95583 12.6443C6.54325 12.2317 5.98367 12 5.4002 12ZM18.6002 7.59995C18.0167 7.59995 17.4571 7.83174 17.0446 8.24432C16.632 8.6569 16.4002 9.21647 16.4002 9.79995V18.5999C16.4002 19.1834 16.632 19.743 17.0446 20.1556C17.4571 20.5682 18.0167 20.7999 18.6002 20.7999C19.1837 20.7999 19.7432 20.5682 20.1558 20.1556C20.5684 19.743 20.8002 19.1834 20.8002 18.5999V9.79995C20.8002 9.21647 20.5684 8.6569 20.1558 8.24432C19.7432 7.83174 19.1837 7.59995 18.6002 7.59995Z"
                  fill="#F75266"
                />
              </svg>
            </span>
            <span className="create-post-feed-dialog-wrapper_container_post-wrapper_post-attachment-dialog--icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 17.25C18 16.8358 17.6642 16.5 17.25 16.5H6.5C4.29 16.5 2.5 14.71 2.5 12.5C2.5 10.29 4.29 8.5 6.5 8.5H19C20.38 8.5 21.5 9.62 21.5 11C21.5 12.38 20.38 13.5 19 13.5H10.5C9.95 13.5 9.5 13.05 9.5 12.5C9.5 11.95 9.95 11.5 10.5 11.5H17.25C17.6642 11.5 18 11.1642 18 10.75C18 10.3358 17.6642 10 17.25 10H10.5C9.12 10 8 11.12 8 12.5C8 13.88 9.12 15 10.5 15H19C21.21 15 23 13.21 23 11C23 8.79 21.21 7 19 7H6.5C3.46 7 1 9.46 1 12.5C1 15.54 3.46 18 6.5 18H17.25C17.6642 18 18 17.6642 18 17.25Z"
                  fill="#484F67"
                />
              </svg>
            </span>
          </div>
          <div
            className="create-post-feed-dialog-wrapper_container_post-wrapper--send-post"
            onClick={postFeed}
          >
            Post
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostDialog;