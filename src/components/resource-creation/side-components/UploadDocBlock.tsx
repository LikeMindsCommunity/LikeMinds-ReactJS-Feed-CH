import React from 'react';
import '../../../assets/css/upload-doc-block.css';
import { lmFeedClient } from '../../..';
import { getVideoDuration } from '../../../services/helper';
import { duration } from '@mui/material';
import {
  FILE_OUTSIDE_LIMITS_PDF,
  FILE_OUTSIDE_LIMITS_VIDEO
} from '../../../services/feedModerationActions';
interface UploadDocBlockInterface {
  resourceType: number;
  setMediaFile: React.Dispatch<any>;
}
function UploadDocBlock({ resourceType, setMediaFile }: UploadDocBlockInterface) {
  function setPreview() {
    switch (resourceType) {
      case 1:
        return (
          <div className="container">
            <div className="image">
              <svg
                width="24"
                height="16"
                viewBox="0 0 24 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M16.5 4.625V13.625C16.5 14.0228 16.342 14.4044 16.0607 14.6857C15.7794 14.967 15.3978 15.125 15 15.125H4.5C4.00754 15.125 3.51991 15.028 3.06494 14.8395C2.60997 14.6511 2.19657 14.3749 1.84835 14.0267C1.14509 13.3234 0.75 12.3696 0.75 11.375V2.375C0.75 1.97718 0.908035 1.59564 1.18934 1.31434C1.47064 1.03304 1.85218 0.875 2.25 0.875H12.75C13.7446 0.875 14.6984 1.27009 15.4017 1.97335C16.1049 2.67661 16.5 3.63044 16.5 4.625ZM22.875 2.85312C22.762 2.78442 22.6323 2.74808 22.5 2.74808C22.3677 2.74808 22.238 2.78442 22.125 2.85312L18.375 4.99063C18.26 5.05702 18.1647 5.15276 18.0988 5.26806C18.0329 5.38336 17.9988 5.51408 18 5.64688V10.3531C17.9988 10.4859 18.0329 10.6166 18.0988 10.7319C18.1647 10.8472 18.26 10.943 18.375 11.0094L22.125 13.1469C22.2393 13.2124 22.3683 13.2479 22.5 13.25C22.6319 13.2492 22.7612 13.2136 22.875 13.1469C22.9899 13.0828 23.0854 12.9888 23.1514 12.875C23.2174 12.7611 23.2515 12.6316 23.25 12.5V3.5C23.2515 3.36841 23.2174 3.23886 23.1514 3.12501C23.0854 3.01116 22.9899 2.91723 22.875 2.85312Z"
                  fill="#7B61FF"
                />
              </svg>
            </div>
            <p className="content">Add Video here</p>
          </div>
        );
      case 2:
        return (
          <div className="container">
            <div className="image">
              <svg
                width="22"
                height="11"
                viewBox="0 0 22 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M17 10.25C17 9.83579 16.6642 9.5 16.25 9.5H5.5C3.29 9.5 1.5 7.71 1.5 5.5C1.5 3.29 3.29 1.5 5.5 1.5H18C19.38 1.5 20.5 2.62 20.5 4C20.5 5.38 19.38 6.5 18 6.5H9.5C8.95 6.5 8.5 6.05 8.5 5.5C8.5 4.95 8.95 4.5 9.5 4.5H16.25C16.6642 4.5 17 4.16421 17 3.75C17 3.33579 16.6642 3 16.25 3H9.5C8.12 3 7 4.12 7 5.5C7 6.88 8.12 8 9.5 8H18C20.21 8 22 6.21 22 4C22 1.79 20.21 0 18 0H5.5C2.46 0 0 2.46 0 5.5C0 8.54 2.46 11 5.5 11H16.25C16.6642 11 17 10.6642 17 10.25Z"
                  fill="#484F67"
                />
              </svg>
            </div>
            <p className="content">Add Documents here</p>
          </div>
        );
    }
  }
  return (
    <div className="wrapper">
      <label>
        {setPreview()}
        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files![0];
            if (resourceType === 1) {
              if (e.target.files) {
                getVideoDuration(file).then((duration) => {
                  if (duration <= 600 && Math.round(file.size / 8192) <= 200) {
                    setMediaFile(file);
                  } else {
                    alert(FILE_OUTSIDE_LIMITS_VIDEO);
                  }
                });
              }
            } else if (resourceType === 2) {
              if (Math.round(file.size / 8192) <= 8) {
                setMediaFile(file);
              } else {
                alert(FILE_OUTSIDE_LIMITS_PDF);
              }
            }
          }}
        />
      </label>
    </div>
  );
}

export default UploadDocBlock;
