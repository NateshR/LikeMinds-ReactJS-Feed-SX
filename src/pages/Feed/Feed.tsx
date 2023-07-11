import React from "react";
import CreatePost from "../../components/CreatePost";
import FeedFilter from "../../components/FeedFilter";
import Post from "../../components/Post";

const FeedComponent: React.FC = () => {
  return (
    <div className="lmWrapper">
      <div className="lmWrapper__feed">
        {/* Create Post */}
        <CreatePost />
        {/* Create Post */}

        {/* Filter */}
        <FeedFilter />
        {/* Filter */}

        {/* Post */}
        <Post />
        {/* Post */}
      </div>
    </div>
  );
};

export default FeedComponent;
