import React, { useEffect, useState } from 'react';
import '../../assets/css/post-details-header.css';
import backIcon from '../../assets/images/postDetailsBackIcon.png';

import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { IPost } from '@likeminds.community/feed-js';
import { lmFeedClient } from '../..';
import AllMembers from '../AllMembers';
import { SHOW_SNACKBAR } from '../../services/feedModerationActions';
import { CircularProgress } from '@mui/material';
import { Post, User, Widget } from '../../services/models/resourceResponses/articleResponse';
import ArticleResourceView from '../resources-view/article';
import LinkResourceView from '../resources-view/link';
interface PostDetailsProps {
  callBack: (action: string, index: number, value: any) => void;
  feedArray: Post[];
  users: { [key: string]: User };
  rightSidebarHandler: (action: string, value: any) => void;
  rightSideBar: any;
  widgets: Record<string, Widget>;
}

function PostDetails({
  callBack,
  feedArray,
  rightSidebarHandler,
  rightSideBar,
  widgets,
  users
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
        console.log(newPost);
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
  }, [params.postId]);
  function renderPost() {
    const attachmentArray = post?.attachments;
    const attachment = post?.attachments[0];
    if (!attachment) {
      // alert('An post with empty attachments encountered');
      console.log(post);
      return;
    }
    const attachmentType = attachment.attachmentType;
    switch (attachmentType) {
      case 7: {
        const widget = widgets[attachment.attachmentMeta.entityId];
        const user = users[post.uuid];
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
              <img src={backIcon} alt="back icon" />
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
      {/* </div> */}
    </div>
  );
}

export default PostDetails;
