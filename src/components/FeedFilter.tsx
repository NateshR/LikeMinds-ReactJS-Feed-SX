import filterCaretIcon from '../assets/images/filter_caret.svg';
import downArrow from '../assets/images/Frame.svg';

import React from 'react';

const FeedFilter: React.FC = () => {
  return (
    <div className="lmWrapper__feed__filter">
      <div>
        <div className="lmWrapper__feed__filter--dropdown">
          <span>All Post</span>
          <img src={filterCaretIcon} alt="downArrowIcon" />
        </div>
      </div>
      <div>
        <div className="lmWrapper__feed__filter--dropdown">
          <span>Newest</span> <img src={downArrow} alt="downArrow" />
        </div>
      </div>
    </div>
  );
};

export default FeedFilter;
