import React, { useState } from 'react';
import InputField from '../side-components/InputField';
import InputArea from '../side-components/InputArea';
import { ResourceCreator } from '../article';
import { fields, takeInTakeOut } from '../../../services/utilityFunctions';

function LinkResourceCreator({ setPostDetails, postDetails }: ResourceCreator) {
  function setTitle(formattedString: string) {
    setPostDetails(takeInTakeOut(postDetails, fields.title, formattedString));
  }
  function setDescription(formattedString: string) {
    setPostDetails(takeInTakeOut(postDetails, fields.description, formattedString));
  }
  function setLinkResource(formattedString: string) {
    setPostDetails(takeInTakeOut(postDetails, fields.linkResource, formattedString));
  }
  return (
    <div>
      <InputField isRequired={true} update={setTitle} title="Add Title" />
      <InputField
        isRequired={true}
        update={setLinkResource}
        title="Share the link resource"
        isSubtitle={true}
      />
      <InputArea
        update={setDescription}
        placeholder="Write something (optional)"
        minHeight="100px"
      />
    </div>
  );
}

export default LinkResourceCreator;
