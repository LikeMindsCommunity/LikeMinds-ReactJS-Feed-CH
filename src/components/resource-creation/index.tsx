import React, { useContext, useState } from 'react';
import '../../assets/css/resource-creation.css';
import { setUserImage } from '../../services/utilityFunctions';
import UserContext from '../../contexts/UserContext';
import ArticleResourceCreator from './article';
import LinkResourceCreator from './link';
import PDFResourceCreator from './pdf';
import VideoResourceCreator from './video';
import PostDetails from '../post-details';
import { lmFeedClient } from '../..';
import { addPost } from '../../services/helper';
import {
  Attachment,
  OgTag,
  Post,
  Widget
} from '../../services/models/resourceResponses/articleResponse';
import {
  LENGTH_BELOW_MINIMUM,
  NEW_POST,
  POST_EDITED_SUCCESSFULLY,
  SHOW_SNACKBAR
} from '../../services/feedModerationActions';
import { AttachmentMeta } from 'testpackageforlikeminds';
import { Widgets } from '@mui/icons-material';
interface ResourceCreationProps {
  resourceType: number;
  closeDialog: () => void;
  postObject: PostSchema;
  setPostObject: React.Dispatch<PostSchema>;
  isEditMode?: boolean;
  attachmentBlock?: Attachment | Widget;
  feedModerationHandler?: (action: string, index: number, value: any) => void;
  currentPost?: Post;
  index?: number;
}
export interface PostSchema {
  mediaFile?: File | null;
  title: string;
  linkResource?: string;
  description?: string;
}
export default function ResourceCreation({
  resourceType,
  closeDialog,
  postObject,
  setPostObject,
  isEditMode,
  attachmentBlock,
  feedModerationHandler,
  currentPost,
  index
}: ResourceCreationProps) {
  const userContext = useContext(UserContext);
  const [ogTagHolder, setOgTagHolder] = useState<OgTag | null>(null);
  function setResourceHeader() {
    switch (resourceType) {
      case 0:
        return <>Add Article</>;
      case 1:
        return <>Add Video Resource</>;
      case 2:
        return <>Add PDF Resource</>;
      case 3:
        return <>Add Link Resource</>;
    }
  }
  async function post() {
    if (postObject?.description?.length! < 200 && resourceType === 0) {
      feedModerationHandler!(SHOW_SNACKBAR, -1, LENGTH_BELOW_MINIMUM);
      return;
    }
    switch (isEditMode) {
      case null:
      case undefined:
      case false: {
        if (resourceType === 3) {
          addPost(
            resourceType,
            postObject,
            userContext.user?.sdkClientInfo.uuid,
            ogTagHolder!
          ).then((resp) => {
            feedModerationHandler!(NEW_POST, 0, resp);
          });

          closeDialog();
          return null;
        }
        addPost(resourceType, postObject, userContext.user?.sdkClientInfo.uuid).then((resp) => {
          feedModerationHandler!(NEW_POST, 0, resp);
        });
        closeDialog();
        return;
      }
      default: {
        console.log('Reached here');
        let { title, description, linkResource, mediaFile } = postObject;
        let response: any;
        switch (resourceType) {
          // case for editing article post
          case 0: {
            response = await lmFeedClient.editArticlePost(
              currentPost?.Id!,
              mediaFile!,
              userContext.user?.sdkClientInfo.uuid,
              postObject,
              attachmentBlock as any
            );
            break;
          }
          case 1:
          case 2: {
            response = await lmFeedClient.editVideoOrDocumentPost(
              currentPost?.Id!,
              description!,
              title,
              currentPost?.attachments as any
            );
            break;
          }
          case 3: {
            response = await lmFeedClient.editPostWithOGTags(
              currentPost?.Id!,
              title!,
              description!,
              linkResource!
            );
          }
        }
        console.log(response);
        feedModerationHandler!(POST_EDITED_SUCCESSFULLY, index!, {
          post: response?.data?.post,
          widget: response?.data?.widgets
        });
        closeDialog();
        return;
      }
    }
  }
  function setResourceCreationBlock() {
    switch (resourceType) {
      case 0:
        return (
          <ArticleResourceCreator
            postDetails={postObject}
            setPostDetails={setPostObject}
            isEditMode={isEditMode!}
            attachmentBlock={attachmentBlock}
          />
        );
      case 1:
        return (
          <VideoResourceCreator
            postDetails={postObject}
            setPostDetails={setPostObject}
            isEditMode={isEditMode!}
            attachmentBlock={attachmentBlock}
          />
        );
      case 2:
        return (
          <PDFResourceCreator
            postDetails={postObject}
            setPostDetails={setPostObject}
            isEditMode={isEditMode!}
            attachmentBlock={attachmentBlock}
          />
        );
      case 3:
        return (
          <LinkResourceCreator
            setOgTagHolder={setOgTagHolder}
            postDetails={postObject}
            setPostDetails={setPostObject}
            isEditMode={isEditMode!}
            attachmentBlock={attachmentBlock}
          />
        );
    }
  }
  return (
    <div className="resourceCreationWrapper">
      <div className="headingWrapper">
        <p className="headingWrapper__title">{setResourceHeader()}</p>
        <span onClick={closeDialog}>
          <svg
            width="19"
            height="18"
            viewBox="0 0 19 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M1.29445 17.5254C1.71632 17.9356 2.40773 17.9356 2.80617 17.5254L9.81398 10.5176L16.8218 17.5254C17.2319 17.9356 17.9234 17.9473 18.3335 17.5254C18.7437 17.1035 18.7554 16.4121 18.3452 16.002L11.3374 8.99416L18.3452 1.99806C18.7554 1.58791 18.7554 0.884781 18.3335 0.474625C17.9116 0.0644686 17.2319 0.0644686 16.8218 0.474625L9.81398 7.48244L2.80617 0.474625C2.40773 0.0644686 1.70461 0.0527498 1.29445 0.474625C0.884293 0.8965 0.884293 1.58791 1.29445 1.99806L8.29054 8.99416L1.29445 16.002C0.884293 16.4121 0.872574 17.1152 1.29445 17.5254Z"
              fill="#484F67"
            />
          </svg>
        </span>
      </div>
      <div className="bodyWrapper">
        <div className="bodyWrapper--user">
          <span>{setUserImage(userContext.user)}</span>
          <div>
            <span>{userContext.user?.name}</span>
          </div>
        </div>
        {setResourceCreationBlock()}
        <div className="postFeed">
          <button onClick={post}>Post</button>
        </div>
      </div>
    </div>
  );
}
