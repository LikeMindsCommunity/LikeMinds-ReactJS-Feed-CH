import React from 'react';
import '../../../assets/css/doc-preview.css';
import { getFileSize } from '../../../services/utilityFunctions';
interface DocPreviewInterface {
  setMediaFile: React.Dispatch<any>;
  file: File | null;
}
function DocPreview({ setMediaFile, file }: DocPreviewInterface) {
  return (
    <div className="previewWrapper">
      <div className="docContent">
        <span>
          <svg
            width="25"
            height="30"
            viewBox="0 0 25 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M21.3454 29.5C22.9045 29.5 24.1667 28.3318 24.1667 26.8886V7.13152H18.4869C18.0786 7.13152 17.7816 6.82228 17.7816 6.47867V0.5H2.78418C1.26216 0.5 0 1.63389 0 3.07701V26.923C0 28.3318 1.22504 29.5 2.78418 29.5H21.3454ZM19.1923 1.53081V5.82583H23.3129L19.1923 1.53081Z"
              fill="#F2994A"
            />
          </svg>
        </span>
        <div className="docContent__metaDetails">
          <p className="docContent--metaDetails__name">{file?.name}</p>
          <p className="docContent--metaDetails__size">{getFileSize(file?.size!)}</p>
        </div>
      </div>
      <div className="deleteIcon" onClick={() => setMediaFile(null)}>
        <svg
          width="14"
          height="18"
          viewBox="0 0 14 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.5 1H14V3H0V1H3.5L4.5 0H9.5L10.5 1ZM3 18C1.9 18 1 17.1 1 16V4H13V16C13 17.1 12.1 18 11 18H3Z"
            fill="#333333"
          />
        </svg>
      </div>
    </div>
  );
}

export default DocPreview;
