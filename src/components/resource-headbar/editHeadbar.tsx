import { Dialog, Menu } from '@mui/material';
import '../../assets/css/resource-header.css';
import { useState, useRef } from 'react';
import * as React from 'react';
import ResourceCreation, { PostSchema } from '../resource-creation';
import { Post, Widget } from '../../services/models/resourceResponses/articleResponse';
import { EDIT_POST } from '../../services/feedModerationActions';
interface ResourceHeaderProps {
  index?: number;
  post?: Post | null;
  feedModerationHandler?: (action: string, index: number, value: any) => void;
  isEditMode?: boolean;
  widget?: Widget;
  shouldOpenEditBox?: boolean;
}

export default function ResourceEditHeadbar({
  index,
  post,
  feedModerationHandler,
  isEditMode,
  widget,
  shouldOpenEditBox
}: ResourceHeaderProps) {
  const menuRef = useRef<HTMLButtonElement | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLButtonElement>(null);
  const [openContentCreationDialog, setOpenContentCreationDialog] = useState<boolean>(false);
  const [resourceType, setResourceType] = useState<number | null>(null);
  const [postObject, setPostObject] = useState<PostSchema>({
    mediaFile: null,
    title: '',
    linkResource: '',
    description: ''
  });
  React.useEffect(() => {
    if (isEditMode) {
      const newPostObject = {
        ...postObject
      };
      const resourceType = post?.attachments[0].attachmentType;
      console.log('the resource type is', resourceType);
      if (resourceType === 7) {
        newPostObject.title = widget?.metadata.title!;
        newPostObject.description = widget?.metadata.body!;
      } else {
        newPostObject.title = post?.heading!;
        newPostObject.description = post?.text!;
      }
      if (resourceType === 4) {
        newPostObject.linkResource = post?.attachments[0].attachmentMeta.ogTags?.url;
      }
      console.log(newPostObject);
      setPostObject(newPostObject);
      setResourceType(resourceType!);

      switch (resourceType) {
        case 7: {
          setResourceType(0);
          break;
        }
        case 2: {
          setResourceType(1);
          break;
        }
        case 3: {
          setResourceType(2);
          break;
        }
        default: {
          setResourceType(3);
        }
      }
      setOpenContentCreationDialog(true);
    }
  }, [isEditMode]);

  function openDialog(resourceType: number) {
    setOpenContentCreationDialog(true);
    setResourceType(resourceType);
    closeMenuBox();
  }
  function closeDialog() {
    setOpenContentCreationDialog(false);
    setResourceType(null);
    feedModerationHandler!(EDIT_POST, -1, null);
  }
  function closeMenuBox() {
    setMenuAnchor(null);
  }
  if (!shouldOpenEditBox || !post) {
    return null;
  }
  return (
    <div className="resourceHeaderWrapper">
      <Dialog
        open={openContentCreationDialog}
        fullWidth={true}
        PaperProps={{
          sx: {
            maxWidth: '800px',
            borderRadius: '16px'
          }
        }}
        onClose={closeDialog}>
        {resourceType !== null ? (
          <ResourceCreation
            resourceType={resourceType}
            closeDialog={closeDialog}
            postObject={postObject}
            setPostObject={setPostObject}
            isEditMode={isEditMode}
            attachmentBlock={resourceType === 0 ? widget : post.attachments[0]}
            feedModerationHandler={feedModerationHandler}
            currentPost={post}
            index={index}
          />
        ) : null}
      </Dialog>
    </div>
  );
}
