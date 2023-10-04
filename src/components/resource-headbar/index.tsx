import { Dialog, Menu } from '@mui/material';
import '../../assets/css/resource-header.css';
import { useState, useRef } from 'react';
import * as React from 'react';
import ResourceCreation, { PostSchema } from '../resource-creation';
import { Post, Widget } from '../../services/models/resourceResponses/articleResponse';
interface ResourceHeaderProps {
  index?: number;
  post?: Post | null;
  feedModerationHandler?: (action: string, index: number, value: any) => void;
  isEditMode?: boolean;
  widget?: Widget;
  shouldOpenEditBox?: boolean;
}

export default function ResourceHeadbar({
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
  const [resourceType, setResourceType] = useState<number>(0);
  const [postObject, setPostObject] = useState<PostSchema>({
    mediaFile: null,
    title: '',
    linkResource: '',
    description: ''
  });
  React.useEffect(() => {
    if (isEditMode) {
      const newPostObject = {
        mediaFile: null,
        title: '',
        linkResource: '',
        description: ''
      };
      const resourceType = post?.attachments[0].attachmentType;
      if (resourceType === 7) {
        newPostObject.title = widget?.metadata.title!;
        newPostObject.description = widget?.metadata.body!;
      } else {
        newPostObject.title = post?.heading!;
        newPostObject.description = post?.text!;
      }
      setPostObject(newPostObject);
      setResourceType(resourceType!);
      setOpenContentCreationDialog(true);
    }
  }, []);
  React.useEffect(() => {
    if (shouldOpenEditBox) {
      setOpenContentCreationDialog(true);
    }
  });
  function openDialog(resourceType: number) {
    setOpenContentCreationDialog(true);
    setResourceType(resourceType);
    closeMenuBox();
  }
  function closeDialog() {
    setOpenContentCreationDialog(false);
    setResourceType(0);
  }
  function openMenuBox(e: React.MouseEvent) {
    setMenuAnchor(menuRef.current);
  }
  function closeMenuBox() {
    setMenuAnchor(null);
  }
  function uploadMediaAndOpenDialog(e: React.ChangeEvent<HTMLInputElement>, resourceType: number) {
    const newPostObject = { ...postObject };
    if (e?.target.files) {
      newPostObject.mediaFile = e.target.files[0];
      setPostObject(newPostObject);
    }
    openDialog(resourceType);
  }
  function renderMenu() {
    return Array(4)
      .fill(0)
      .map((_item: number, index: number) => {
        switch (index) {
          case 0: {
            return (
              <div
                className="resourceMenuTile"
                key={'Add Article'}
                onClick={() => {
                  openDialog(index);
                }}>
                {/* svg icon */}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M17.3571 4.50001H14.1429V0.642869C14.1429 0.287816 13.855 0 13.5 0H0.642869C0.287816 0 0 0.287816 0 0.642869V15.4286C0 16.8487 1.15127 18 2.57144 18H15.4286C16.8487 18 18 16.8487 18 15.4286V5.14284C18 4.78783 17.7122 4.50001 17.3571 4.50001ZM5.14284 3.21427H8.99998C9.35503 3.21427 9.64285 3.50209 9.64285 3.85714C9.64285 4.21219 9.35503 4.50001 8.99998 4.50001H5.14284C4.78779 4.50001 4.49997 4.21219 4.49997 3.85714C4.49997 3.50209 4.78783 3.21427 5.14284 3.21427ZM10.9286 15.4286H3.21427C2.85922 15.4286 2.5714 15.1407 2.5714 14.7857C2.5714 14.4306 2.85922 14.1428 3.21427 14.1428H10.9286C11.2836 14.1428 11.5714 14.4306 11.5714 14.7857C11.5714 15.1407 11.2836 15.4286 10.9286 15.4286ZM10.9286 12.8571H3.21427C2.85922 12.8571 2.5714 12.5693 2.5714 12.2143C2.5714 11.8592 2.85922 11.5714 3.21427 11.5714H10.9286C11.2836 11.5714 11.5714 11.8592 11.5714 12.2143C11.5714 12.5693 11.2836 12.8571 10.9286 12.8571ZM10.9286 10.2857H3.21427C2.85922 10.2857 2.5714 9.9979 2.5714 9.64285C2.5714 9.2878 2.85922 8.99998 3.21427 8.99998H10.9286C11.2836 8.99998 11.5714 9.2878 11.5714 9.64285C11.5714 9.9979 11.2836 10.2857 10.9286 10.2857ZM10.9286 7.71428H3.21427C2.85922 7.71428 2.5714 7.42646 2.5714 7.07141C2.5714 6.71636 2.85922 6.42854 3.21427 6.42854H10.9286C11.2836 6.42854 11.5714 6.71636 11.5714 7.07141C11.5714 7.42646 11.2836 7.71428 10.9286 7.71428ZM16.7143 15.4286C16.7143 16.1386 16.1386 16.7143 15.4286 16.7143C14.7185 16.7143 14.1429 16.1386 14.1429 15.4286V5.78571H16.7143V15.4286H16.7143Z"
                    fill="#06C3AF"
                  />
                </svg>
                <span>Add Article</span>
              </div>
            );
          }
          case 1: {
            return (
              <div key={'Add Video'}>
                <label>
                  <div className="resourceMenuTile">
                    <input
                      type="file"
                      className="addVideoInput"
                      onChange={(e) => uploadMediaAndOpenDialog(e, index)}
                    />
                    <svg
                      width="24"
                      height="16"
                      viewBox="0 0 24 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M16.5 4.625V13.625C16.5 14.0228 16.342 14.4044 16.0607 14.6857C15.7794 14.967 15.3978 15.125 15 15.125H4.5C4.00754 15.125 3.51991 15.028 3.06494 14.8395C2.60997 14.6511 2.19657 14.3749 1.84835 14.0267C1.14509 13.3234 0.75 12.3696 0.75 11.375V2.375C0.75 1.97718 0.908035 1.59564 1.18934 1.31434C1.47064 1.03304 1.85218 0.875 2.25 0.875H12.75C13.7446 0.875 14.6984 1.27009 15.4017 1.97335C16.1049 2.67661 16.5 3.63044 16.5 4.625ZM22.875 2.85312C22.762 2.78442 22.6323 2.74808 22.5 2.74808C22.3677 2.74808 22.238 2.78442 22.125 2.85312L18.375 4.99063C18.26 5.05702 18.1647 5.15276 18.0988 5.26806C18.0329 5.38336 17.9988 5.51408 18 5.64688V10.3531C17.9988 10.4859 18.0329 10.6166 18.0988 10.7319C18.1647 10.8472 18.26 10.943 18.375 11.0094L22.125 13.1469C22.2393 13.2124 22.3683 13.2479 22.5 13.25C22.6319 13.2492 22.7612 13.2136 22.875 13.1469C22.9899 13.0828 23.0854 12.9888 23.1514 12.875C23.2174 12.7611 23.2515 12.6316 23.25 12.5V3.5C23.2515 3.36841 23.2174 3.23886 23.1514 3.12501C23.0854 3.01116 22.9899 2.91723 22.875 2.85312Z"
                        fill="#7B61FF"
                      />
                    </svg>

                    <span>Add Video</span>
                  </div>
                </label>
              </div>
            );
          }
          case 2: {
            return (
              <div key={'Add PDF'}>
                <label>
                  <input
                    type="file"
                    className="addVideoInput"
                    onChange={(e) => uploadMediaAndOpenDialog(e, index)}
                  />
                  <div className="resourceMenuTile">
                    <svg
                      width="22"
                      height="11"
                      viewBox="0 0 22 11"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M17 10.25C17 9.83579 16.6642 9.5 16.25 9.5H5.5C3.29 9.5 1.5 7.71 1.5 5.5C1.5 3.29 3.29 1.5 5.5 1.5H18C19.38 1.5 20.5 2.62 20.5 4C20.5 5.38 19.38 6.5 18 6.5H9.5C8.95 6.5 8.5 6.05 8.5 5.5C8.5 4.95 8.95 4.5 9.5 4.5H16.25C16.6642 4.5 17 4.16421 17 3.75C17 3.33579 16.6642 3 16.25 3H9.5C8.12 3 7 4.12 7 5.5C7 6.88 8.12 8 9.5 8H18C20.21 8 22 6.21 22 4C22 1.79 20.21 0 18 0H5.5C2.46 0 0 2.46 0 5.5C0 8.54 2.46 11 5.5 11H16.25C16.6642 11 17 10.6642 17 10.25Z"
                        fill="#484F67"
                      />
                    </svg>

                    <span>Add PDF</span>
                  </div>
                </label>
              </div>
            );
          }
          case 3: {
            return (
              <div
                className="resourceMenuTile"
                key={'Add Link'}
                onClick={() => {
                  openDialog(index);
                }}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_2743_1422)">
                    <path
                      d="M18.3066 4.436L18.0074 4.53085L16.4139 4.67282L15.9638 5.39156L15.6373 5.28779L14.3691 4.14442L14.1851 3.54982L13.9388 2.91575L13.1417 2.20083L12.2014 2.01685L12.1798 2.4472L13.101 3.3461L13.5517 3.87704L13.0449 4.14188L12.6324 4.02028L12.0143 3.76245L12.0353 3.26398L11.2242 2.93039L10.9549 4.10241L10.1375 4.28766L10.2184 4.94147L11.2834 5.14646L11.4674 4.10177L12.3466 4.23164L12.7553 4.47101H13.411L13.8598 5.36991L15.0497 6.57694L14.9624 7.04613L14.0031 6.9239L12.3453 7.76105L11.1516 9.19281L10.9963 9.82688H10.5679L9.76954 9.45891L8.99414 9.82688L9.18704 10.6449L9.52444 10.256L10.1178 10.2375L10.0764 10.9722L10.5679 11.116L11.0587 11.6673L11.8602 11.442L12.7757 11.5865L13.8388 11.8723L14.3697 11.9347L15.2699 12.9565L17.0073 13.9783L15.8836 16.1249L14.6976 16.6763L14.2475 17.903L12.5312 19.0489L12.3485 19.7097C16.7361 18.653 20 14.7116 20 9.9994C19.9987 7.94122 19.3748 6.02563 18.3066 4.436Z"
                      fill="#484F67"
                    />
                    <path
                      d="M11.1508 15.2259L10.4225 13.8756L11.0909 12.4827L10.4225 12.2828L9.67189 11.5291L8.00904 11.156L7.45709 10.0012V10.6868H7.2139L5.78088 8.74386V7.14786L4.73046 5.43982L3.06252 5.73712H1.93889L1.37357 5.36661L2.09486 4.79492L1.37548 4.96108C0.508405 6.44185 0.00292969 8.16009 0.00292969 10.0005C0.00292969 15.5219 4.47899 19.9999 10.001 19.9999C10.4263 19.9999 10.8433 19.9624 11.2558 19.9127L11.1514 18.7012C11.1514 18.7012 11.6104 16.9021 11.6104 16.841C11.6098 16.7793 11.1508 15.2259 11.1508 15.2259Z"
                      fill="#484F67"
                    />
                    <path
                      d="M3.71861 3.22447L5.49478 2.97683L6.31347 2.52801L7.23465 2.79348L8.70652 2.71199L9.21072 1.9194L9.94601 2.04036L11.7317 1.87293L12.2238 1.33053L12.9177 0.867074L13.8994 1.01477L14.2572 0.960657C12.9642 0.35205 11.5255 0 10.0008 0C6.89725 0 4.12223 1.41457 2.29004 3.63573H2.29513L3.71861 3.22447ZM10.4235 0.994398L11.4446 0.432264L12.1003 0.811052L11.1511 1.53361L10.2446 1.62465L9.83651 1.35982L10.4235 0.994398ZM7.3989 1.07652L7.84963 1.26432L8.43977 1.07652L8.76126 1.63356L7.3989 1.99134L6.74382 1.6081C6.74318 1.6081 7.38426 1.19557 7.3989 1.07652Z"
                      fill="#484F67"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_2743_1422">
                      <rect width="20" height="20" fill="white" />
                    </clipPath>
                  </defs>
                </svg>

                <span>Add Link</span>
              </div>
            );
          }
          default:
            return null;
        }
      });
  }
  return (
    <div className="resourceHeaderWrapper">
      <span>All Resources</span>
      <button ref={menuRef} className="newResourceCreationButton" onClick={openMenuBox}>
        {/* + icon */}
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 6C0 6.16537 0.0593932 6.30749 0.178179 6.42636C0.296966 6.54005 0.436411 6.5969 0.596514 6.5969H5.40736V11.4109C5.40736 11.5711 5.46417 11.708 5.57779 11.8217C5.69658 11.9406 5.83861 12 6.00387 12C6.16398 12 6.30084 11.9406 6.41446 11.8217C6.52808 11.708 6.58489 11.5711 6.58489 11.4109V6.5969H11.4112C11.5713 6.5969 11.7082 6.54005 11.8218 6.42636C11.9406 6.30749 12 6.16537 12 6C12 5.83979 11.9406 5.70284 11.8218 5.58915C11.7082 5.47028 11.5713 5.41085 11.4112 5.41085H6.58489V0.589147C6.58489 0.434109 6.52808 0.297158 6.41446 0.178295C6.30084 0.0594315 6.16398 0 6.00387 0C5.83861 0 5.69658 0.0594315 5.57779 0.178295C5.46417 0.297158 5.40736 0.434109 5.40736 0.589147V5.41085H0.596514C0.436411 5.41085 0.296966 5.47028 0.178179 5.58915C0.0593932 5.70284 0 5.83979 0 6Z"
            fill="white"
          />
        </svg>
        <span>New Resources</span>
      </button>
      <Menu
        sx={{
          borderRadius: '10px'
        }}
        open={Boolean(menuAnchor)}
        anchorEl={menuAnchor}
        onClose={closeMenuBox}>
        {renderMenu()}
      </Menu>
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
        <ResourceCreation
          resourceType={resourceType}
          closeDialog={closeDialog}
          postObject={postObject}
          setPostObject={setPostObject}
          isEditMode={isEditMode}
          feedModerationHandler={feedModerationHandler}
        />
      </Dialog>
    </div>
  );
}
