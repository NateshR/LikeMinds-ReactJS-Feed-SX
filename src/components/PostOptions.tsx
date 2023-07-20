import photoIcon from '../assets/images/photo.svg';
import videoIcon from '../assets/images/video.svg';
import pollIcon from '../assets/images/poll.svg';
import React from 'react';

const PostOptions: React.FC = () => {
  return (
    <div className="lmWrapper__feed__creatPost__options">
      <div className="lmWrapper__feed__creatPost__options__types">
        <ul>
          <li>
            <img src={photoIcon} alt="photo" /> <span>Photo</span>
          </li>
          <li>
            <img src={videoIcon} alt="Video" /> <span>Video</span>
          </li>
          <li>
            <img src={pollIcon} alt="Poll" /> <span>Poll</span>
          </li>
        </ul>
      </div>
      <div className="lmWrapper__feed__creatPost__actionBtn">
        <button type="button">Post</button>
      </div>
    </div>
  );
};

export default PostOptions;
