import React, { useEffect, useState } from 'react';
import '../../assets/css/post-details-header.css';
// import backIcon from '../../assets/images/postDetailsBackIcon.png';

import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { IPost } from 'testpackageforlikeminds';
import { lmFeedClient } from '../..';
import AllMembers from '../AllMembers';
import { SHOW_SNACKBAR } from '../../services/feedModerationActions';
import { CircularProgress } from '@mui/material';
import { Post, User, Widget } from '../../services/models/resourceResponses/articleResponse';
import ArticleResourceView from '../resources-view/article';
import LinkResourceView from '../resources-view/link';
import VideoResourceView from '../resources-view/video';
import PdfResourceView from '../resources-view/pdf';
import ResourceEditHeadbar from '../resource-headbar/editHeadbar';
interface PostDetailsProps {
  callBack: (action: string, index: number, value: any) => void;
  feedArray: Post[];
  users: { [key: string]: User };
  rightSidebarHandler: (action: string, value: any) => void;
  rightSideBar: any;
  widgets: Record<string, Widget>;
  isEditPost?: boolean;
}
function PostDetails({
  callBack,
  feedArray,
  rightSidebarHandler,
  rightSideBar,
  widgets,
  users,
  isEditPost
}: PostDetailsProps) {
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  console.log(location.pathname);
  const [post, setPost] = useState<Post | null>(null);
  const [user, setUser] = useState<null | User>(null);
  const [index, setIndex] = useState<number | null>(null);
  useEffect(() => {
    async function setPostDetails() {
      try {
        let newPostIndex: any = feedArray.findIndex((post: Post) => post.Id === params.postId);
        let newPost: any;
        setIndex(newPostIndex);
        const resp: any = await lmFeedClient.getPostDetails(params.postId!, 1);
        if (resp?.data === null) {
          navigate('/');
          callBack!(SHOW_SNACKBAR, 0, 'The Post does not exists anymore');
        }
        newPost = resp?.data?.post;
        setPost(newPost!);
        setUser(resp?.data?.users[newPost?.uuid]);
      } catch (error) {
        alert('Post Doesnt Exist');
        navigate('/');
        callBack!(SHOW_SNACKBAR, 0, 'The Post does not exists anymore');
      }
    }
    if (params?.postId) {
      setPostDetails();
    }
    return () => {
      setPost(null);
      setUser(null);
    };
  }, [params.postId, feedArray]);
  function renderPost() {
    const attachmentArray = post?.attachments;
    const attachment = post?.attachments[0];
    if (!attachment) {
      // alert('An post with empty attachments encountered');
      console.log(post);
      return;
    }
    const attachmentType = attachment.attachmentType;
    const user = users[post.uuid];
    switch (attachmentType) {
      case 7: {
        const widget = widgets[attachment.attachmentMeta.entityId];

        return (
          <ArticleResourceView
            user={user}
            post={post}
            widget={widget}
            feedModerationHandler={callBack}
            rightSidebarHandler={rightSidebarHandler}
            index={index!}
          />
        );
      }
      case 4: {
        const user = users[post.uuid];
        return (
          <LinkResourceView
            post={post}
            user={user}
            feedModerationHandler={callBack}
            rightSidebarHandler={rightSidebarHandler}
            index={index!}
          />
        );
      }
      case 2: {
        return (
          <VideoResourceView
            user={user}
            post={post}
            feedModerationHandler={callBack}
            rightSidebarHandler={rightSidebarHandler}
            index={index!}
          />
        );
      }
      case 3: {
        return (
          <PdfResourceView
            post={post}
            user={user}
            feedModerationHandler={callBack}
            rightSidebarHandler={rightSidebarHandler}
            index={index!}
          />
        );
      }
    }
  }
  return (
    <div
      id="postDetailsContainer"
      style={{
        maxHeight: '100vh',
        overflowY: 'auto'
      }}>
      <div className="lmWrapper">
        <div
          style={{
            flexGrow: 1
          }}>
          <div className="postDetailsHeaderWrapper">
            <div
              className="postDetailsHeaderWrapper--backIconHolder"
              onClick={() => {
                //   navigate('/');
                window.history.back();
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
                  d="M20 11H7.8L13.4 5.4L12 4L4 12L12 20L13.4 18.6L7.8 13H20V11Z"
                  fill="#333333"
                />
              </svg>
            </div>
            <div className="postDetailsHeaderWrapper--toolBarArea">
              <span>Back to Feed</span>
            </div>
          </div>
          {post && user ? (
            <div className="lmWrapper__feed">
              <div className="postDetailsContentWrapper">
                {/* <Post
                  index={index!}
                  feedModerationHandler={callBack!}
                  post={post!}
                  user={user!}
                  rightSidebarHandler={rightSidebarHandler}
                /> */}
                {renderPost()}
              </div>
            </div>
          ) : (
            <div className="progressContainer">
              <CircularProgress />
            </div>
          )}
        </div>
        <div className="lmWrapper__allMembers">{rightSideBar}</div>
      </div>
      {isEditPost ? (
        <ResourceEditHeadbar
          post={post}
          feedModerationHandler={callBack}
          isEditMode={isEditPost}
          widget={widgets[post?.attachments[0].attachmentMeta.entityId!]}
          shouldOpenEditBox={isEditPost}
        />
      ) : null}
      {/* </div> */}
    </div>
  );
}

export default PostDetails;
