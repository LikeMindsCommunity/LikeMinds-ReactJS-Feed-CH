import React, { useState } from 'react';
import InputField from '../side-components/InputField';
import InputArea from '../side-components/InputArea';
import { ResourceCreator } from '../article';
import { fields, takeInTakeOut } from '../../../services/utilityFunctions';
import { OgTag } from '../../../services/models/resourceResponses/articleResponse';

function LinkResourceCreator({
  setPostDetails,
  postDetails,
  isEditMode,
  setOgTagHolder
}: ResourceCreator) {
  function setTitle(formattedString: string) {
    setPostDetails(takeInTakeOut(postDetails, fields.title, formattedString));
  }
  function setDescription(formattedString: string) {
    setPostDetails(takeInTakeOut(postDetails, fields.description, formattedString));
  }
  function setLinkResource(ogTag: OgTag) {
    console.log(ogTag);
    setOgTagHolder!(ogTag);
    setPostDetails(takeInTakeOut(postDetails, fields.linkResource, ogTag.url));
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
      <InputField
        isRequired={true}
        update={setLinkResource}
        title="Share the link resource"
        isSubtitle={true}
        shouldCheckForLink={true}
        editValuePreset={isEditMode}
        editFieldValue={postDetails.linkResource}
      />
      <InputArea
        editValuePreset={isEditMode}
        update={setDescription}
        placeholder="Write something (optional)"
        minHeight="100px"
        editFieldValue={postDetails.description}
      />
    </div>
  );
}

export default LinkResourceCreator;
