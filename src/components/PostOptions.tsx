import photoIcon from '../assets/images/photo.svg';
import videoIcon from '../assets/images/video.svg';
import pollIcon from '../assets/images/poll.svg';
import React from 'react';

const PostOptions: React.FC<{
  setMediaAttachmentOnInitiation: React.Dispatch<boolean>;
  openCreatePostDialogBox: () => void;
}> = ({ setMediaAttachmentOnInitiation, openCreatePostDialogBox }) => {
  return (
    <div className="lmWrapper__feed__creatPost__options">
      <div className="lmWrapper__feed__creatPost__options__types">
        <ul>
          <li
            onClick={() => {
              setMediaAttachmentOnInitiation(true);
              openCreatePostDialogBox();
            }}
            style={{
              cursor: 'pointer'
            }}>
            <img src={photoIcon} alt="photo" /> <span>Photo</span>
          </li>
          <li
            onClick={() => {
              setMediaAttachmentOnInitiation(true);
              openCreatePostDialogBox();
            }}
            style={{
              cursor: 'pointer'
            }}>
            <img src={videoIcon} alt="Video" /> <span>Video</span>
          </li>
          {/* <li>
            <img src={pollIcon} alt="Poll" /> <span>Poll</span>
          </li> */}
        </ul>
      </div>
      <div className="lmWrapper__feed__creatPost__actionBtn">
        <button
          style={{
            cursor: 'pointer'
          }}
          type="button"
          onClick={openCreatePostDialogBox}>
          Post
        </button>
      </div>
    </div>
  );
};

export default PostOptions;
