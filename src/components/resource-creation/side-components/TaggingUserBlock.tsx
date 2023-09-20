import React from 'react';
import { setTagUserImage } from '../../../services/utilityFunctions';
interface TaggingUserBlockProps {
  clickHandler: (e: React.MouseEvent, f: any) => void;
  item: any;
  userContext: any;
}
function TaggingUserBlock({ clickHandler, item, userContext }: TaggingUserBlockProps) {
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
        {setTagUserImage(item, userContext)}
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
