import React, { useMemo, useState } from 'react';
import {
  AllPost,
  Post,
  User,
  Widget
} from '../../../services/models/resourceResponses/articleResponse';
import '../../../assets/css/video-resource-view.css';
import PostHeader from '../side-component/PostHeader';

import PostFooter from '../side-component/PostFooter';
import { useLocation } from 'react-router-dom';
import VideoMediaViewComponent from './VideoMediaViewComponent';
interface VideoResponseViewProps {
  post: Post;
  user: User;
  index: number;
  feedModerationHandler: (action: string, index: number, value: any) => void;
  rightSidebarHandler: (action: string, value: any) => void;
}
function VideoResourceView({
  post,
  user,
  index,
  feedModerationHandler,
  rightSidebarHandler
}: VideoResponseViewProps) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [vidUrl, setVidUrl] = useState('');
  const location = useLocation();
  function getMediaData() {
    const postTitle = post.heading;
    const postBody = post.text;
    const postImgUrl = post.attachments[0].attachmentMeta.url;
    setTitle(postTitle);
    setBody(postBody);
    setVidUrl(postImgUrl);
  }
  useMemo(() => getMediaData(), [post]);
  switch (location.pathname.includes('/post')) {
    case false: {
      return (
        <div className="ResourceViewWrapper noPaddingTop">
          <VideoMediaViewComponent videoSrc={vidUrl} />
          <PostHeader
            index={index}
            user={user}
            post={post}
            feedModerationHandler={feedModerationHandler}
          />
          <PostFooter
            title={title}
            body={body}
            index={index}
            feedModerationHandler={feedModerationHandler}
            rightSidebarHandler={rightSidebarHandler}
            post={post}
          />
        </div>
      );
    }
    case true: {
      return (
        <div className="ResourceViewWrapper--details">
          <PostHeader
            index={index}
            user={user}
            post={post}
            feedModerationHandler={feedModerationHandler}
          />
          <VideoMediaViewComponent videoSrc={vidUrl} />
          <PostFooter
            title={title}
            body={body}
            index={index}
            feedModerationHandler={feedModerationHandler}
            rightSidebarHandler={rightSidebarHandler}
            post={post}
          />
        </div>
      );
    }
    default:
      return null;
  }
}

export default VideoResourceView;
