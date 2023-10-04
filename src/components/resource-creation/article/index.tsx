import { Upload } from '@mui/icons-material';
import React, { useState } from 'react';
import UploadBlock from '../side-components/UploadBlock';
import InputField from '../side-components/InputField';
import InputArea from '../side-components/InputArea';
import { PostSchema } from '..';
import { fields, takeInTakeOut } from '../../../services/utilityFunctions';
import {
  Attachment,
  OgTag,
  Widget
} from '../../../services/models/resourceResponses/articleResponse';
export interface ResourceCreator {
  setPostDetails: React.Dispatch<PostSchema>;
  postDetails: PostSchema;
  setOgTagHolder?: React.Dispatch<OgTag | null>;
  isEditMode: boolean;
  attachmentBlock?: Attachment | Widget;
}
function ArticleResourceCreator({
  setPostDetails,
  postDetails,
  isEditMode,
  attachmentBlock
}: ResourceCreator) {
  function setTitle(formattedString: string) {
    setPostDetails(takeInTakeOut(postDetails, fields.title, formattedString));
  }
  function setDescription(formattedString: string) {
    setPostDetails(takeInTakeOut(postDetails, fields.description, formattedString));
  }
  return (
    <div>
      <UploadBlock
        postDetails={postDetails}
        setPostDetails={setPostDetails}
        isEditMode={isEditMode}
        widget={attachmentBlock as any}
      />
      <InputField
        width="40%"
        isRequired={true}
        update={setTitle}
        title="Add Title"
        editValuePreset={isEditMode}
        editFieldValue={postDetails.title}
      />
      <InputArea
        editValuePreset={isEditMode}
        update={setDescription}
        minHeight={'72px'}
        placeholder="Write something here (min. 200char)"
        editFieldValue={postDetails.description}
      />
    </div>
  );
}

export default ArticleResourceCreator;
