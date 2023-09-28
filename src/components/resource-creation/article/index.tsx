import { Upload } from '@mui/icons-material';
import React, { useState } from 'react';
import UploadBlock from '../side-components/UploadBlock';
import InputField from '../side-components/InputField';
import InputArea from '../side-components/InputArea';
import { PostSchema } from '..';
import { fields, takeInTakeOut } from '../../../services/utilityFunctions';
import { OgTag } from '../../../services/models/resourceResponses/articleResponse';
export interface ResourceCreator {
  setPostDetails: React.Dispatch<PostSchema>;
  postDetails: PostSchema;
  setOgTagHolder?: React.Dispatch<OgTag | null>;
}
function ArticleResourceCreator({ setPostDetails, postDetails }: ResourceCreator) {
  function setTitle(formattedString: string) {
    setPostDetails(takeInTakeOut(postDetails, fields.title, formattedString));
  }
  function setDescription(formattedString: string) {
    setPostDetails(takeInTakeOut(postDetails, fields.description, formattedString));
  }
  return (
    <div>
      <UploadBlock postDetails={postDetails} setPostDetails={setPostDetails} />
      <InputField width="40%" isRequired={true} update={setTitle} title="Add Title" />
      <InputArea
        update={setDescription}
        minHeight={'166px'}
        placeholder="Write something here (min. 200char)"
      />
    </div>
  );
}

export default ArticleResourceCreator;
