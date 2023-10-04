// src/Header/Header.tsx

import React, { useContext, useEffect, useRef, useState } from 'react';

import { Dialog, IconButton, Menu, MenuItem } from '@mui/material';
import { IComment, IMenuItem, IUser } from 'testpackageforlikeminds';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { lmFeedClient } from '..';
import SendIcon from '@mui/icons-material/Send';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Parser } from 'html-to-react';
import './../assets/css/post-footer.css';
import './../assets/css/comments.css';
// import overflowIcon from '../assets/images/commentOverflowMenuIconShape.png';
// import commentLikes from '../assets/images/commentLikes.png';
// import commentLikesFilled from '../assets/images/commentLikesFilled.png';
// import './../assets/css/post-footer.css';
import {
  TagInfo,
  checkAtSymbol,
  findSpaceAfterIndex,
  getCaretPosition,
  setCursorAtEnd
} from './dialog/createPost/CreatePostDialog';
import InfiniteScroll from 'react-infinite-scroll-component';
import UserContext from '../contexts/UserContext';
import ReportPostDialogBox from './ReportPost';
import { truncateSync } from 'fs';
import SeePostLikes from './SeePostLikes';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import DeleteDialog from './DeleteDialog';
import {
  SHOW_COMMENTS_LIKES_BAR,
  UPDATE_LIKES_COUNT_DECREMENT,
  UPDATE_LIKES_COUNT_INCREMENT
} from '../services/feedModerationActions';
import { extractTextFromNode } from '../services/utilityFunctions';
dayjs.extend(relativeTime);
interface CommentProps {
  comment: IComment;
  postId: string;
  commentArray: IComment[];
  setCommentArray: React.Dispatch<IComment[]>;
  index: number;
  user?: IUser;
  setParentCommentsCount: React.Dispatch<number>;
  parentCommentsCount: number;
  rightSidebarHandler: (action: string, value: any) => void;
}
const PostComents: React.FC<CommentProps> = ({
  comment,
  postId,
  commentArray,
  index,
  setCommentArray,
  user,
  setParentCommentsCount,
  parentCommentsCount,
  rightSidebarHandler
}) => {
  const [repliesArray, setRepliesArray] = useState<IComment[]>([]);
  const [openDialogBox, setOpenDialogBox] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(comment.isLiked);
  const [likesCount, setLikesCount] = useState<number>(comment.likesCount);
  const [commentsCount, setCommentsCount] = useState<number>(comment.commentsCount);
  const [pageCount, setPageCount] = useState<number>(1);
  const [usersMap, setUsersMap] = useState<{ [key: string]: IUser }>({});
  const [loadMoreReplies, setLoadMoreReplies] = useState<boolean>(true);
  const [openCommentsLikesDialog, setOpenCommentsDialog] = useState<boolean>(false);
  const [openDeleteConfirmationDialog, setOpenDeleteConfirmationDialog] = useState<boolean>(false);
  function closeDeleteDialog() {
    setOpenDeleteConfirmationDialog(false);
  }
  const repliesDiv = useRef(null);
  useEffect(() => {
    setIsLiked(comment.isLiked);
    setLikesCount(comment.likesCount);
    setCommentsCount(comment.commentsCount);
  }, [comment.isLiked, comment.likesCount, comment.commentsCount]);
  function likeComment() {
    setIsLiked(!isLiked);
    likeAComment();
    if (isLiked) {
      // rightSidebarHandler
      setLikesCount(likesCount - 1);
      rightSidebarHandler(UPDATE_LIKES_COUNT_DECREMENT, {
        postId: postId,
        commentId: comment.Id,
        totalLikes: likesCount - 1
      });
    } else {
      setLikesCount(likesCount + 1);
      rightSidebarHandler(UPDATE_LIKES_COUNT_INCREMENT, {
        postId: postId,
        commentId: comment.Id,
        totalLikes: likesCount + 1
      });
    }
  }
  function renderLikeButton() {
    if (isLiked) {
      return (
        // <img
        //   src={
        //     'https://drive.google.com/file/d/1lOl8qfBn5o4bnm3v6BIbyPiMg9AzVzuz/view?usp=drive_link'
        //   }
        //   alt="like button"
        //   style={{
        //     verticalAlign: 'bottom'
        //   }}
        // />
        <svg
          width="25"
          height="24"
          viewBox="0 0 25 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12.8778 17.299L17.9403 12.2365C19.184 10.9865 19.3653 8.94276 18.1903 7.63651C17.8956 7.30733 17.5369 7.04169 17.1361 6.85581C16.7353 6.66994 16.3008 6.56774 15.8592 6.55546C15.4175 6.54317 14.978 6.62106 14.5675 6.78437C14.157 6.94768 13.7841 7.19297 13.4715 7.50526L12.5215 8.46151L11.7028 7.63651C10.4528 6.39276 8.40905 6.21151 7.1028 7.38651C6.77362 7.68119 6.50797 8.03989 6.3221 8.4407C6.13623 8.84151 6.03403 9.276 6.02174 9.71764C6.00946 10.1593 6.08735 10.5988 6.25066 11.0093C6.41396 11.4198 6.65926 11.7927 6.97155 12.1053L12.1653 17.299C12.2601 17.3929 12.3881 17.4456 12.5215 17.4456C12.655 17.4456 12.783 17.3929 12.8778 17.299Z"
            fill="#FB1609"
            stroke="#FB1609"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    } else {
      return (
        // <img
        //     src={'https://drive.google.com/file/d/1JS8gAeKxBNLdeOzA06QHs7aulpLUmKS4/view?usp=drive_link'}
        //     alt="like button"
        //     style={{
        //         verticalAlign: 'bottom',
        //     }}
        // />
        <svg
          width="25"
          height="24"
          viewBox="0 0 25 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12.8778 17.299L17.9403 12.2365C19.184 10.9865 19.3653 8.94276 18.1903 7.63651C17.8956 7.30733 17.5369 7.04169 17.1361 6.85581C16.7353 6.66994 16.3008 6.56774 15.8592 6.55546C15.4175 6.54317 14.978 6.62106 14.5675 6.78437C14.157 6.94768 13.7841 7.19297 13.4715 7.50526L12.5215 8.46151L11.7028 7.63651C10.4528 6.39276 8.40905 6.21151 7.1028 7.38651C6.77362 7.68119 6.50797 8.03989 6.3221 8.4407C6.13623 8.84151 6.03403 9.276 6.02174 9.71764C6.00946 10.1593 6.08735 10.5988 6.25066 11.0093C6.41396 11.4198 6.65926 11.7927 6.97155 12.1053L12.1653 17.299C12.2601 17.3929 12.3881 17.4456 12.5215 17.4456C12.655 17.4456 12.783 17.3929 12.8778 17.299Z"
            stroke="#0F1E3D"
            strokeOpacity="0.4"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    }
  }
  async function getComments() {
    try {
      const req: any = await lmFeedClient.getComments(postId, comment.Id, pageCount);
      const replyArray = req?.data?.comment?.replies;
      const userMap = req?.data?.users;
      setUsersMap({ ...usersMap, ...userMap });
      if (pageCount === 1) {
        const tempArr: { [key: string]: number } = {};
        repliesArray.forEach((item: IComment) => (tempArr[item.Id] = 1));
        let newResponseReplies = replyArray.filter((item: IComment) => {
          if (tempArr[item.Id] != 1) {
            return item;
          }
        });

        setRepliesArray([...repliesArray, ...newResponseReplies]);
      } else {
        setRepliesArray([...repliesArray].concat(replyArray));
      }

      if (replyArray?.length === 0) {
        setLoadMoreReplies(false);
      }
      setPageCount(pageCount + 1);
    } catch (error) {
      console.log(error);
    }
  }
  async function likeAComment() {
    try {
      const req: any = await lmFeedClient.likeComment(postId, comment.Id);
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteComment() {
    try {
      const req: any = await lmFeedClient.deleteComment(postId, comment.Id);
      const newArray = [...commentArray];
      newArray.splice(index, 1);
      setCommentArray(newArray);
      setParentCommentsCount(parentCommentsCount - 1);
    } catch (error) {
      console.log(error);
    }
  }
  const userContext = useContext(UserContext);

  function setUserImage() {
    const imageLink = userContext?.user?.imageUrl;
    if (imageLink !== '') {
      return (
        <img
          src={imageLink}
          alt={userContext.user?.imageUrl}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%'
          }}
        />
      );
    } else {
      return (
        <span
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'inline-flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#5046e5',
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#fff',
            letterSpacing: '1px'
          }}>
          {userContext.user?.name?.split(' ').map((part: string) => {
            return part.charAt(0)?.toUpperCase();
          })}
        </span>
      );
    }
  }

  function handleMenuClick(e: React.MouseEvent) {
    const clickedElementid = e.currentTarget.id;
    switch (clickedElementid) {
      case '6':
        setOpenDeleteConfirmationDialog(true);
        break;
      case '7':
        openReportDialogBox();
        break;
    }
    setMenuAnchor(null);
  }
  function openReportDialogBox() {
    setOpenDialogBox(true);
  }
  // functions for input box
  const [text, setText] = useState<string>('');
  const [tagString, setTagString] = useState<string | null>(null);
  const [taggingMemberList, setTaggingMemberList] = useState<any[] | null>(null);
  const [openReplyBox, setOpenReplyBox] = useState<boolean>(false);
  const contentEditableDiv = useRef<HTMLDivElement>(null);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [openCommentsSection, setOpenCommentsSection] = useState<boolean>(false);
  useEffect(() => {
    if (contentEditableDiv && contentEditableDiv.current) {
      if (text === '' && !contentEditableDiv.current.isSameNode(document.activeElement)) {
        contentEditableDiv.current.textContent = 'Write something here...';
      }
    }
  }, [text]);
  function openMenu(e: React.MouseEvent<HTMLButtonElement>) {
    setMenuAnchor(e.currentTarget);
  }
  function closeMenu() {
    setMenuAnchor(null);
  }
  function renderMenu() {
    return (
      <Menu
        // className="lmOverflowMenu"
        open={Boolean(menuAnchor)}
        anchorEl={menuAnchor}
        onClose={closeMenu}
        anchorOrigin={{
          horizontal: 'right',
          vertical: 'top'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        sx={{
          paddingY: '0px'
        }}>
        {comment.menuItems.map((item: IMenuItem) => {
          if (item.id === 8) return null;
          return (
            <div
              className="lmOverflowMenuTitle"
              id={item.id.toString()}
              key={item.id.toString()}
              onClick={handleMenuClick}
              style={{
                width: '196px',
                padding: '1rem',
                cursor: 'pointer'
                // boxShadow: '0px 1px 16px 0px rgba(0, 0, 0, 0.24)'
              }}>
              {item.title}
            </div>
          );
        })}
      </Menu>
    );
  }
  function findTag(str: string): TagInfo | undefined {
    // str;
    if (str.length === 0) {
      return undefined;
    }
    const cursorPosition = getCaretPosition();

    const leftLimit = checkAtSymbol(str, cursorPosition - 1);
    // leftLimit;
    if (leftLimit === -1) {
      // setCloseDialog(); // Assuming this function is defined somewhere else and handled separately.
      return undefined;
    }
    const rightLimit = findSpaceAfterIndex(str, cursorPosition - 1);

    const substr = str.substring(leftLimit, rightLimit + 1);

    return {
      tagString: substr,
      limitLeft: leftLimit,
      limitRight: rightLimit
    };
  }

  interface MatchPattern {
    type: number;
    displayName?: string;
    routeId?: string;
    link?: string;
  }
  function convertTextToHTML(text: string) {
    const regex = /<<.*?>>|(?:https?|ftp):\/\/\S+|(?<!www\.)\S+\.\S+/g;
    const matches = text.match(regex) || [];
    const splits = text.split(regex);

    const container = document.createElement('div');

    for (let i = 0; i < splits.length; i++) {
      const splitNode = document.createTextNode(splits[i]);
      container.appendChild(splitNode);

      if (matches[i]) {
        const text = matches[i];
        const getInfoPattern = /<<([^|]+)\|([^>>]+)>>/;
        const match = text.match(getInfoPattern);
        const userObject: MatchPattern = {
          type: 1
        };
        if (match) {
          const userName = match[1];
          const userId = match[2];
          userObject.displayName = userName;
          userObject.routeId = userId;
        } else {
          userObject.type = 2;
          userObject.link = text;
        }
        if (userObject.type === 1) {
          const matchText = matches[i].slice(2, -2); // Remove '<<' and '>>'
          const linkNode = document.createElement('a');
          linkNode.href = '#'; // You can set the appropriate URL here
          linkNode.textContent = userObject.displayName!;
          linkNode.id = userObject.routeId!;
          container.appendChild(linkNode);
        } else {
          const linkNode = document.createElement('a');
          linkNode.href = userObject.link!; // You can set the appropriate URL here
          linkNode.textContent = userObject.link!;
          container.appendChild(linkNode);
        }
      }
    }

    return container;
  }
  function setTagUserImage(user: any, dimension: string) {
    const imageLink = user?.imageUrl;
    if (imageLink !== '') {
      return (
        <img
          src={imageLink}
          alt={userContext.user?.imageUrl}
          style={{
            width: dimension,
            height: dimension,
            borderRadius: '50%'
          }}
        />
      );
    } else {
      return (
        <div
          style={{
            minWidth: '36px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#5046e5',
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#fff',
            letterSpacing: '1px'
          }}>
          {user?.name?.split(' ').map((part: string) => {
            return part.charAt(0)?.toUpperCase();
          })}
        </div>
      );
    }
  }

  function showReplyBox() {
    if (openReplyBox) {
      return (
        <div className="commentInputBox">
          <div className="lmProfile">{setUserImage()}</div>
          <div
            className="inputDiv"
            style={{
              overflow: 'visible'
            }}>
            <div
              ref={contentEditableDiv}
              contentEditable={true}
              suppressContentEditableWarning
              tabIndex={0}
              placeholder="hello world"
              id="editableDiv"
              onBlur={() => {
                if (contentEditableDiv && contentEditableDiv.current) {
                  if (text?.trim().length === 0) {
                    contentEditableDiv.current.textContent = `Write your comment`;
                  }
                }
              }}
              onFocus={() => {
                if (contentEditableDiv && contentEditableDiv.current) {
                  if (text?.trim() === '') {
                    contentEditableDiv.current.textContent = ``;
                  }
                }
              }}
              onKeyDown={(e: React.KeyboardEvent) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  postReply();
                }
              }}
              onInput={(event: React.KeyboardEvent<HTMLDivElement>) => {
                setText(event.currentTarget.textContent!);
                const selection = window.getSelection();
                if (selection === null) return;
                let focusNode = selection.focusNode;
                if (focusNode === null) {
                  return;
                }
                let div = focusNode.parentElement;
                if (div === null) {
                  return;
                }
                let text = div.childNodes;
                // if (focusNode === null || text.length === 0) {
                //   return;
                // }
                let textContentFocusNode = focusNode.textContent;

                let tagOp = findTag(textContentFocusNode!);
                if (tagOp?.tagString !== null && tagOp?.tagString !== undefined) {
                  setTagString(tagOp?.tagString!);
                }
              }}>
              {/*  */}
            </div>
            {taggingMemberList && taggingMemberList?.length > 0 ? (
              <div className="taggingBox">
                {taggingMemberList?.map!((item: any) => {
                  return (
                    <button
                      key={item?.id}
                      className="postTaggingTile"
                      onClick={(e) => {
                        e.preventDefault();
                        let focusNode = window.getSelection()!.focusNode;
                        if (focusNode === null) {
                          return;
                        }

                        let div = focusNode.parentElement;
                        let text = div!.childNodes;
                        if (focusNode === null || text.length === 0) {
                          return;
                        }

                        let textContentFocusNode = focusNode.textContent;
                        if (textContentFocusNode === null) {
                          return;
                        }

                        let tagOp = findTag(textContentFocusNode);

                        if (tagOp === undefined) return;

                        let substr = tagOp?.tagString;
                        const { limitLeft, limitRight } = tagOp;

                        let textNode1Text = textContentFocusNode.substring(0, limitLeft - 1);
                        let textNode2Text = textContentFocusNode.substring(limitRight + 1);

                        let textNode1 = document.createTextNode(textNode1Text);
                        let anchorNode = document.createElement('a');
                        anchorNode.id = item?.id;
                        anchorNode.href = '#';
                        anchorNode.textContent = `@${item?.name.trim()}`;
                        anchorNode.contentEditable = 'false';
                        let textNode2 = document.createTextNode(textNode2Text);
                        const dummyNode = document.createElement('span');
                        div!.replaceChild(textNode2, focusNode);
                        div!.insertBefore(anchorNode, textNode2);
                        div!.insertBefore(dummyNode, anchorNode);

                        div!.insertBefore(textNode1, anchorNode);
                        setTaggingMemberList([]);
                        setCursorAtEnd(contentEditableDiv);
                      }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                        {setTagUserImage(item, '40px')}
                        <div
                          style={{
                            padding: '0px 0.5rem',
                            textTransform: 'capitalize',
                            overflowY: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                          {item?.name}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
          {/* <div className="postCommentButton">
            <IconButton onClick={postReply}>
              <SendIcon />
            </IconButton>
          </div> */}
        </div>
      );
    } else {
      return null;
    }
  }
  async function getTags() {
    if (tagString === undefined || tagString === null) {
      return;
    }
    const tagListResponse = await lmFeedClient.getTaggingList(tagString);

    const memberList = tagListResponse?.data?.members;

    if (memberList && memberList.length > 0) {
      setTaggingMemberList(memberList);
    } else {
      setTaggingMemberList(null);
    }
  }
  // function renamed to post comments
  async function postReply() {
    try {
      let textContent: string = extractTextFromNode(contentEditableDiv.current);
      if (textContent.length === 0) {
        return;
      }
      while (contentEditableDiv.current?.firstChild) {
        contentEditableDiv.current.removeChild(contentEditableDiv.current.firstChild);
      }
      // setOpenReplyBox(false);
      setOpenCommentsSection(true);
      const response: any = await lmFeedClient.replyComment(postId, comment.Id, textContent);
      let newAddedComment: IComment = response.data.comment;
      if (repliesArray.length) {
        let newRepliesArray = [];
        newRepliesArray.push(newAddedComment);
        newRepliesArray = newRepliesArray.concat([...repliesArray]);
        setRepliesArray(newRepliesArray);
      }
      setCommentsCount(commentsCount + 1);
    } catch (error) {
      lmFeedClient.logError(error);
    }
  }
  useEffect(() => {
    if (tagString === null || tagString === undefined) {
      return;
    }

    const timeout = setTimeout(() => {
      getTags();
    }, 500);
    return () => {
      clearTimeout(timeout);
    };
  }, [tagString]);
  const [isReadMore, setIsReadMore] = useState(true);
  useEffect(() => {
    function handleClickOutside(e: any) {
      if (contentEditableDiv && contentEditableDiv?.current) {
        if (
          !contentEditableDiv?.current?.contains(e.target as unknown as any) &&
          !e.currentTarget?.classList?.contains('postTaggingTile')
        ) {
          setTaggingMemberList([]);
        }
      }
    }

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [contentEditableDiv]);
  useEffect(() => {
    if (!tagString) {
      setTaggingMemberList([]);
    }
  }, [tagString]);
  useEffect(() => {
    getComments();
  }, []);
  return (
    <div
      className="commentWrapper"
      style={
        {
          // borderBottom: comment.level > 0 ? 'none' : '1px solid #dde3ed'
        }
      }>
      <Dialog open={openDeleteConfirmationDialog} onClose={closeDeleteDialog}>
        <DeleteDialog onClose={closeDeleteDialog} deleteComment={deleteComment} type={2} />
      </Dialog>
      <div className="commentWrapper--upperLayer">
        <div className="commentWrapper__upperLayer--contentBox">
          <div className="commentWrapper--username">{setTagUserImage(user, '40px')}</div>
          <div className="commentWrapper--contentContainer">
            <div className="commentWrapper--commentContent">
              <div className="commentWrapper__commentContent--username">{user?.name}</div>
              <div
                className="commentWrapper__commentContent--content"
                // dangerouslySetInnerHTML={{
                //   __html: convertTextToHTML(comment.text).innerHTML
                // }}
                style={{
                  overflowWrap: 'anywhere'
                }}>
                {isReadMore && comment.text.length > 300
                  ? Parser().parse(convertTextToHTML(comment.text.substring(0, 300)).innerHTML)
                  : Parser().parse(convertTextToHTML(comment.text).innerHTML)}
                {isReadMore && comment.text.length > 300 ? (
                  <span
                    style={{
                      color: 'gray',
                      fontWeight: '400',
                      cursor: 'pointer',
                      // textDecoration: 'underline',
                      fontSize: '14px'
                    }}
                    onClick={() => setIsReadMore(false)}>
                    ...ReadMore
                  </span>
                ) : null}
                {/* {} */}
              </div>
            </div>
            <div className="commentWrapper--commentActions">
              <span
                className="like"
                style={{
                  height: '24px',
                  width: '24px',
                  textAlign: 'center'
                }}
                onClick={likeComment}>
                {renderLikeButton()}
              </span>
              <span
                className="likes-count"
                onClick={() => {
                  if (likesCount) {
                    rightSidebarHandler(SHOW_COMMENTS_LIKES_BAR, {
                      postId: postId,
                      entityType: 2,
                      totalLikes: likesCount,
                      commentId: comment.Id
                    });
                  } else {
                    likeComment();
                  }
                }}
                style={{ cursor: 'pointer' }}>
                {likesCount ? likesCount : null} {likesCount > 1 ? 'Likes' : 'Like'}
              </span>
              {comment.level === 0 ? (
                <>
                  {' '}
                  <span className="replies"> | </span>
                  <span className="replies">
                    <span
                      style={{
                        cursor: 'pointer'
                      }}
                      onClick={() => {
                        setOpenReplyBox(!openReplyBox);
                        setOpenCommentsSection(true);
                      }}>
                      {commentsCount > 0 ? <span className="dotAfter">Reply</span> : 'Reply'}
                    </span>{' '}
                    <span
                      style={{
                        cursor: 'pointer',
                        color:
                          openCommentsSection && commentsCount > 0
                            ? '#5046E5'
                            : 'rgba(72, 79, 103, 0.7)'
                      }}
                      className="replyCount"
                      onClick={() => {
                        if (commentsCount !== repliesArray.length) {
                          getComments();
                        }
                        setOpenCommentsSection(!openCommentsSection);
                        // if (commentsCount > 0) {

                        // }
                      }}>
                      <span>
                        {commentsCount > 0 ? commentsCount + ' ' : null}
                        {commentsCount === 0 ? '' : commentsCount > 1 ? 'Replies' : 'Reply'}
                      </span>
                    </span>
                  </span>
                </>
              ) : null}

              <span
                className="replies"
                style={{
                  flexGrow: 1,
                  textAlign: 'right'
                }}>
                {dayjs(comment.createdAt).fromNow()}
              </span>
            </div>
          </div>
        </div>
        <div className="commentWrapper__upperLayer--menuActionArea">
          {/* <IconButton
            onClick={openMenu}
            style={{
              height: '24px',
              width: '24px',
              marginLeft: '8px',
              marginRight: '16px',
              cursor: 'pointer'
            }}
            sx={{
              $hover: {
                background: 'none'
              }
            }}> */}
          <span
            onClick={openMenu}
            style={{
              height: '24px',
              width: '24px',
              marginLeft: '8px',
              // marginRight: '10px',
              cursor: 'pointer'
            }}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8 12C8 10.9 7.1 10 6 10C4.9 10 4 10.9 4 12C4 13.1 4.9 14 6 14C7.1 14 8 13.1 8 12ZM10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10C10.9 10 10 10.9 10 12ZM16 12C16 13.1 16.9 14 18 14C19.1 14 20 13.1 20 12C20 10.9 19.1 10 18 10C16.9 10 16 10.9 16 12Z"
                fill="#666666"
              />
            </svg>
          </span>

          {/* </span> */}
          {/* </IconButton> */}
          {renderMenu()}
        </div>
      </div>
      {showReplyBox()}
      <div
        style={{
          paddingLeft: '52px',
          maxHeight: '328.5px',
          overflowY: 'auto'
        }}
        id={comment.Id}>
        <InfiniteScroll
          loader={null}
          hasMore={loadMoreReplies}
          next={getComments}
          dataLength={repliesArray?.length}
          scrollableTarget={comment.Id}>
          {repliesArray.length && openCommentsSection
            ? repliesArray.map((comment: IComment, index: number, commentArray: IComment[]) => {
                return (
                  <PostComents
                    parentCommentsCount={commentsCount}
                    setParentCommentsCount={setCommentsCount}
                    comment={comment}
                    postId={postId}
                    key={comment.Id}
                    index={index}
                    commentArray={commentArray}
                    setCommentArray={setRepliesArray}
                    user={usersMap[comment?.uuid]}
                    rightSidebarHandler={rightSidebarHandler}
                  />
                );
              })
            : null}
        </InfiniteScroll>
        <Dialog
          open={openDialogBox}
          onClose={() => {
            setOpenDialogBox(false);
          }}>
          <ReportPostDialogBox
            entity={comment.level === 0 ? 6 : 7}
            uuid={comment.uuid}
            closeBox={() => {
              setOpenDialogBox(false);
            }}
            reportedPostId={postId}
          />
        </Dialog>
        <Dialog open={openCommentsLikesDialog} onClose={() => setOpenCommentsDialog(false)}>
          <SeePostLikes
            entityType={2}
            entityId={postId}
            onClose={() => setOpenCommentsDialog(false)}
            likesCount={likesCount}
            commentId={comment.Id}
          />
        </Dialog>
      </div>
    </div>
  );
};

export default PostComents;
