import React, { useEffect, useRef, useState } from 'react';
import '../../../assets/css/cropperComponent.css';
import Cropper, { ReactCropperElement } from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { Button } from '@mui/material';
interface CropperProps {
  imageFile: File;
  returnCallback: any;
}
export const CropperWindow: React.FC<CropperProps> = ({ imageFile, returnCallback }) => {
  const cropperRef = useRef<ReactCropperElement>(null);
  const [croppedFile, setCroppedFile] = useState<any>(null);
  const onCrop = () => {
    const cropper = cropperRef.current?.cropper;
    cropper?.getCroppedCanvas().toBlob((blob) => {
      const newFile = new File([blob!], imageFile.name, {
        type: 'image/png'
      });
      console.log(newFile);
      returnCallback(newFile);
    }, 'image/png');
  };

  return (
    <div className="cropperWrapper">
      <Cropper
        ref={cropperRef}
        style={{ height: 400, width: '100%' }}
        zoomTo={0.5}
        initialAspectRatio={1}
        preview=".img-preview"
        src={URL.createObjectURL(imageFile)}
        viewMode={1}
        minCropBoxHeight={270}
        minCropBoxWidth={480}
        background={false}
        responsive={true}
        autoCropArea={1}
        checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
        guides={true}
        autoCrop={false}
      />
      <div className="cropButtonContainer">
        <Button
          // fullWidth={true}
          onClick={() => {
            onCrop();
          }}
          sx={{
            background: '#00897B',
            color: 'white',
            width: '220px',
            ':hover': {
              background: '#00897B',
              color: 'white'
            }
          }}>
          Crop
        </Button>
      </div>
    </div>
  );
};
