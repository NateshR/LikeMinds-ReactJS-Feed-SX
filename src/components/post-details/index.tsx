import React from 'react';
import '../../assets/css/post-details-header.css';
import backIcon from '../../assets/images/postDetailsBackIcon.png';
import Post from '../Post';
import { useLocation, useParams } from 'react-router-dom';
function PostDetails() {
  const location = useLocation();
  const params = useParams();
  return (
    <div>
      <div className="postDetailsHeaderWrapper">
        <div className="postDetailsHeaderWrapper--backIconHolder">
          <img src={backIcon} alt="back icon" />
        </div>
        <div className="postDetailsHeaderWrapper--toolBarArea">
          <span>Back to Feed</span>
        </div>
      </div>
      <div className="postDetailsContentWrapper"></div>
    </div>
  );
}

export default PostDetails;
