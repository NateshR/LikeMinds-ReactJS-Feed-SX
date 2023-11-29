import { Attachment } from '@likeminds.community/feed-js';
import React, { useEffect, useState } from 'react';
import './image-media.css';

interface ImageMediaProps {
  attachment: Attachment;
}

function ImageMedia({ attachment }: ImageMediaProps) {
  const [dimensions, setDimensions] = useState<{
    height: string;
    width: string;
  }>({
    height: '0px',
    width: '0px'
  });
  const [ratio, setRatio] = useState<string>('');
  useEffect(() => {
    if (parseInt(dimensions.height) > parseInt(dimensions.width)) {
      setRatio('4 / 5');
    } else if (parseInt(dimensions.height) < parseInt(dimensions.width)) {
      setRatio('16 / 9');
    } else {
      setRatio('1 / 1');
    }
  }, [dimensions]);
  return (
    <div
      style={{
        backgroundColor: 'black'
      }}>
      <img
        src={attachment.attachmentMeta.url}
        alt="Your Image"
        style={{
          width: 'auto',
          height: 'auto',
          maxWidth: '100%',
          maxHeight: '576px'
        }}
      />
    </div>
  );
}

export default ImageMedia;
