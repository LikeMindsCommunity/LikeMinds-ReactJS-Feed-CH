import React, { useEffect, useState } from 'react';
import '../../../assets/css/upload-block.css';
import { PostSchema } from '..';
import { Post, Widget } from '../../../services/models/resourceResponses/articleResponse';
import { Dialog } from '@mui/material';
import { CropperWindow } from './Cropper';
interface UploadBlockProps {
  postDetails: PostSchema;
  setPostDetails: React.Dispatch<PostSchema>;
  isEditMode?: boolean;
  post?: Post;
  widget?: Widget;
}
function UploadBlock({ postDetails, setPostDetails, isEditMode, post, widget }: UploadBlockProps) {
  // const [file, setFile] = useState<FileList | null>(null);
  const [openCropper, setOpenCropper] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState<string>('');
  useEffect(() => {
    if (isEditMode) {
      setImgUrl(widget?.metadata.coverImageUrl!);
    }
  }, []);
  function returnCallback(arg: any) {
    setImageFile(arg);
    setOpenCropper(false);
    const newPost = { ...postDetails };
    newPost.mediaFile = arg;
    setPostDetails(newPost);
  }
  function handleImageUpload(imageFile: File | null) {
    const fileReader = new FileReader();
    fileReader.onload = function (e) {
      const image = new Image();
      image.src = e.target?.result as any;
      image.onload = function () {
        if (image.width < 480 || image.height < 270) {
          alert('invalid');
        } else {
          const newPost = { ...postDetails };
          newPost.mediaFile = imageFile;
          setPostDetails(newPost);
        }
      };
    };
    fileReader.readAsDataURL(imageFile!);
    setImageFile(imageFile);
  }
  function removeImage() {
    if (isEditMode) {
      setImgUrl('');
    }
    const newPost = { ...postDetails };
    newPost.mediaFile = null;
    setPostDetails(newPost);
  }
  const uploadBlock = (
    <div className="block">
      <label>
        <input
          accept=".png, .jpg, .jpeg"
          type="file"
          onChange={(e) => {
            handleImageUpload(e.target?.files ? e.target?.files[0] : null);
            setOpenCropper(true);
          }}
        />
        <div className="uploadBlockWrapper">
          <div className="content">
            <div className="svgBlock">
              <svg
                width="21"
                height="21"
                viewBox="0 0 21 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M14.3462 7.31818C14.3462 7.67984 14.2246 8.02669 14.0082 8.28242C13.7918 8.53815 13.4983 8.68182 13.1923 8.68182C12.8863 8.68182 12.5928 8.53815 12.3764 8.28242C12.16 8.02669 12.0385 7.67984 12.0385 7.31818C12.0385 6.95652 12.16 6.60968 12.3764 6.35395C12.5928 6.09821 12.8863 5.95455 13.1923 5.95455C13.4983 5.95455 13.7918 6.09821 14.0082 6.35395C14.2246 6.60968 14.3462 6.95652 14.3462 7.31818ZM20.5 2.31818V16.8636V18.6818C20.5 19.164 20.3379 19.6265 20.0494 19.9675C19.7609 20.3084 19.3696 20.5 18.9615 20.5H2.03846C1.63044 20.5 1.23912 20.3084 0.950605 19.9675C0.662087 19.6265 0.5 19.164 0.5 18.6818V15.0455V2.31818C0.5 1.83597 0.662087 1.37351 0.950605 1.03253C1.23912 0.691558 1.63044 0.5 2.03846 0.5H18.9615C19.3696 0.5 19.7609 0.691558 20.0494 1.03253C20.3379 1.37351 20.5 1.83597 20.5 2.31818ZM18.9615 14.6705V2.31818H2.03846V12.8523L5.56731 8.68182C5.85694 8.34454 6.24723 8.15548 6.65385 8.15548C7.06046 8.15548 7.45075 8.34454 7.74039 8.68182L12.0385 13.7614L14.0288 11.4091C14.3185 11.0718 14.7088 10.8828 15.1154 10.8828C15.522 10.8828 15.9123 11.0718 16.2019 11.4091L18.9615 14.6705Z"
                  fill="#ED8031"
                />
              </svg>
            </div>
            <p className="blockText">
              Add Cover Photo{' '}
              <span
                style={{
                  color: 'red'
                }}>
                *
              </span>
            </p>
          </div>
        </div>
      </label>
    </div>
  );

  function renderComponent() {
    switch (imgUrl.length) {
      case 0: {
        switch (postDetails.mediaFile) {
          case null:
            return uploadBlock;
          default:
            return (
              <div className="imageWrapperContainer">
                <span className="closeIcon" onClick={removeImage}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <rect width="24" height="24" rx="4" fill="black" fillOpacity="0.5" />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M14 6.66667H16.3333V8H7V6.66667H9.33333L10 6H13.3333L14 6.66667ZM9.00006 18C8.26673 18 7.66673 17.4 7.66673 16.6667V8.66667H15.6667V16.6667C15.6667 17.4 15.0667 18 14.3334 18H9.00006Z"
                      fill="white"
                    />
                  </svg>
                </span>

                <div className="imageBlockWrapper">
                  <img
                    src={URL.createObjectURL(postDetails.mediaFile!)}
                    alt="none"
                    className="imageBlock"
                  />
                </div>
              </div>
            );
        }
      }
      default: {
        return (
          <div className="imageWrapperContainer">
            <span className="closeIcon" onClick={removeImage}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" rx="4" fill="black" fillOpacity="0.5" />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M14 6.66667H16.3333V8H7V6.66667H9.33333L10 6H13.3333L14 6.66667ZM9.00006 18C8.26673 18 7.66673 17.4 7.66673 16.6667V8.66667H15.6667V16.6667C15.6667 17.4 15.0667 18 14.3334 18H9.00006Z"
                  fill="white"
                />
              </svg>
            </span>

            <div className="imageBlockWrapper">
              <img src={imgUrl} alt="none" className="imageBlock" />
            </div>
          </div>
        );
      }
    }
  }
  return (
    <div className="container">
      {imageFile ? (
        <Dialog open={openCropper} onClose={() => setOpenCropper(false)}>
          <CropperWindow imageFile={imageFile!} returnCallback={returnCallback} />
        </Dialog>
      ) : null}
      {renderComponent()}
    </div>
  );
}

export default UploadBlock;
