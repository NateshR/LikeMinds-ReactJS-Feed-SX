import React, { useEffect } from "react";
import CreatePost from "../../components/CreatePost";
import FeedFilter from "../../components/FeedFilter";
import Post from "../../components/Post";
import { lmFeedClient } from "../..";

const FeedComponent: React.FC = () => {
  useEffect(() => {
    lmFeedClient.fetchFeed();
  });
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
