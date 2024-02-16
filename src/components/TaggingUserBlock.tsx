/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { setTagUserImage } from '../services/utilityFunctions';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
interface TaggingUserBlockProps {
  clickHandler: (e: React.MouseEvent, f: any) => void;
  item: any;
}
function TaggingUserBlock({ clickHandler, item }: TaggingUserBlockProps) {
  const currentUser = useSelector((state: RootState) => state.currentUser.user);
  return (
    <button
      className="taggingTile"
      onClick={(e) => {
        clickHandler(e, item);
      }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center'
        }}>
        {setTagUserImage(item, currentUser)}
        <div
          style={{
            padding: '0px 0.5rem',
            textTransform: 'capitalize',
            overflowY: 'hidden',
            textOverflow: 'ellipsis'
          }}>
          {item?.name}
        </div>
      </div>
    </button>
  );
}

export default TaggingUserBlock;
