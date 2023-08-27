import { Attachment } from 'likeminds-sdk';
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
    <img
      src={attachment.attachmentMeta.url}
      alt="Your Image"
      style={{
        width: '100%',
        height: 'auto',
        aspectRatio: ratio
      }}
      onLoad={(e) => {
        console.log(e.currentTarget.height);
        console.log(e.currentTarget.width);
        setDimensions({
          height: e.currentTarget.height.toString(),
          width: e.currentTarget.width.toString()
        });
      }}
    />
  );
}

export default ImageMedia;
