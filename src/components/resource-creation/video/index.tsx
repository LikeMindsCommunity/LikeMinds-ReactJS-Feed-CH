import React, { useState } from 'react';
import InputField from '../side-components/InputField';
import InputArea from '../side-components/InputArea';
import DocPreview from '../side-components/DocPreview';
import UploadDocBlock from '../side-components/UploadDocBlock';
import { ResourceCreator } from '../article';
import { fields, takeInTakeOut } from '../../../services/utilityFunctions';

function VideoResourceCreator({
  setPostDetails,
  postDetails,
  isEditMode,
  attachmentBlock
}: ResourceCreator) {
  const [file, setFile] = useState<any>(null);
  function setTitle(formattedString: string) {
    setPostDetails(takeInTakeOut(postDetails, fields.title, formattedString));
  }
  function setDescription(formattedString: string) {
    setPostDetails(takeInTakeOut(postDetails, fields.description, formattedString));
  }
  function setMedia(file: File) {
    const newPost = { ...postDetails };
    newPost.mediaFile = file;
    setPostDetails(newPost);
  }
  function setPreviewComponents() {
    switch (isEditMode) {
      case true: {
        return (
          <DocPreview
            file={postDetails.mediaFile ? postDetails.mediaFile : null}
            setMediaFile={setMedia}
            isEditMode={isEditMode}
            attachmentBlock={attachmentBlock as any}
          />
        );
      }
      default: {
        switch (postDetails.mediaFile) {
          case null:
            return <UploadDocBlock resourceType={1} setMediaFile={setMedia} />;
          default:
            return (
              <DocPreview
                file={postDetails.mediaFile ? postDetails.mediaFile : null}
                setMediaFile={setMedia}
                isEditMode={isEditMode}
                attachmentBlock={attachmentBlock as any}
              />
            );
        }
      }
    }
  }
  return (
    <div>
      <InputField
        isRequired={true}
        update={setTitle}
        title="Add Title"
        editValuePreset={isEditMode}
        editFieldValue={postDetails.title}
      />
      <InputArea
        editValuePreset={isEditMode}
        minHeight="102px"
        update={setDescription}
        placeholder="Write something (optional)"
        editFieldValue={postDetails.description}
      />
      {/* <DocPreview /> */}
      {setPreviewComponents()}
    </div>
  );
}

export default VideoResourceCreator;
