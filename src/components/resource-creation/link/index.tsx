import React, { useState } from 'react';
import InputField from '../side-components/InputField';
import InputArea from '../side-components/InputArea';
import { ResourceCreator } from '../article';
import { fields, takeInTakeOut } from '../../../services/utilityFunctions';
import { OgTag } from '../../../services/models/resourceResponses/articleResponse';

function LinkResourceCreator({ setPostDetails, postDetails, setOgTagHolder }: ResourceCreator) {
  function setTitle(formattedString: string) {
    setPostDetails(takeInTakeOut(postDetails, fields.title, formattedString));
  }
  function setDescription(formattedString: string) {
    setPostDetails(takeInTakeOut(postDetails, fields.description, formattedString));
  }
  function setLinkResource(ogTag: OgTag) {
    console.log(ogTag);
    setOgTagHolder!(ogTag);
  }
  return (
    <div>
      <InputField isRequired={true} update={setTitle} title="Add Title" />
      <InputField
        isRequired={true}
        update={setLinkResource}
        title="Share the link resource"
        isSubtitle={true}
        shouldCheckForLink={true}
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
