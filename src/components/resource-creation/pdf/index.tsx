import React, { useState } from 'react';
import InputField from '../side-components/InputField';
import InputArea from '../side-components/InputArea';
import UploadDocBlock from '../side-components/UploadDocBlock';
import DocPreview from '../side-components/DocPreview';
import { PostSchema } from '..';
import { ResourceCreator } from '../article';
import { fields, takeInTakeOut } from '../../../services/utilityFunctions';

function PDFResourceCreator({ setPostDetails, postDetails }: ResourceCreator) {
  const [str, setStr] = useState('');
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
    switch (postDetails.mediaFile) {
      case null:
        return <UploadDocBlock resourceType={2} setMediaFile={setMedia} />;
      default:
        return (
          <DocPreview
            file={postDetails.mediaFile ? postDetails.mediaFile : null}
            setMediaFile={setMedia}
          />
        );
    }
  }
  return (
    <div>
      <InputField isRequired={true} update={setTitle} title="Add Title" />
      <InputArea
        update={setDescription}
        placeholder="Write something (optional)"
        minHeight="102px"
      />
      {setPreviewComponents()}
    </div>
  );
}

export default PDFResourceCreator;
