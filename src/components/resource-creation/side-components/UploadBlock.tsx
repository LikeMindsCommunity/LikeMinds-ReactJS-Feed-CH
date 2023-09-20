import React, { useState } from 'react';
import '../../../assets/css/upload-block.css';
import { PostSchema } from '..';
interface UploadBlockProps {
  postDetails: PostSchema;
  setPostDetails: React.Dispatch<PostSchema>;
}
function UploadBlock({ postDetails, setPostDetails }: UploadBlockProps) {
  // const [file, setFile] = useState<FileList | null>(null);
  const [imageFile, setImageFile] = useState<any>(null);
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
  }
  function removeImage() {
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
    switch (postDetails.mediaFile) {
      case null:
        return uploadBlock;
      default:
        return (
          <div className="imageWrapperContainer">
            <span className="closeIcon" onClick={removeImage}>
              <svg
                width="18"
                height="19"
                viewBox="0 0 18 19"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M0.53273 18.0254C0.954605 18.4356 1.64601 18.4356 2.04445 18.0254L9.05226 11.0176L16.0601 18.0254C16.4702 18.4356 17.1616 18.4473 17.5718 18.0254C17.9819 17.6035 17.9937 16.9121 17.5835 16.502L10.5757 9.49416L17.5835 2.49806C17.9937 2.08791 17.9937 1.38478 17.5718 0.974625C17.1499 0.564469 16.4702 0.564469 16.0601 0.974625L9.05226 7.98244L2.04445 0.974625C1.64601 0.564469 0.942887 0.55275 0.53273 0.974625C0.122574 1.3965 0.122574 2.08791 0.53273 2.49806L7.52882 9.49416L0.53273 16.502C0.122574 16.9121 0.110855 17.6152 0.53273 18.0254Z"
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
  return <div className="container">{renderComponent()}</div>;
}

export default UploadBlock;
