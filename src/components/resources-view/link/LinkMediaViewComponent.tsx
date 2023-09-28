import React from 'react';
import '../../../assets/css/link-media-view.css';
import { OgTag } from '../../../services/models/resourceResponses/articleResponse';
interface LinkMediaViewComponentProps {
  ogTag: OgTag;
}
function LinkMediaViewComponent({ ogTag }: LinkMediaViewComponentProps) {
  return (
    <div className="linkMediaWrapper">
      <div className="ogTagContent">
        {ogTag?.image?.length ? (
          <img className="ogPreview" src={ogTag.image} />
        ) : (
          <svg
            width="544"
            height="216"
            viewBox="0 0 544 216"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <rect width="544" height="216" fill="black" fillOpacity="0.0413571" />
            <rect width="544" height="216" fill="url(#pattern0)" />
            <defs>
              <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
                <use transform="matrix(0.00193424 0 0 0.00487141 0 -1.39011)" />
              </pattern>
              <image id="image0_1444_280318" width="517" height="776" />
            </defs>
          </svg>
        )}
        <div className="ogDetails">
          <div className="ogDetails--title">{ogTag.title}</div>
          <div className="ogDetails--subtitle">{ogTag.url}</div>
        </div>
      </div>
    </div>
  );
}

export default LinkMediaViewComponent;
