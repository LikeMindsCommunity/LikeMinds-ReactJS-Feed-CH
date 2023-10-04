import React, { useMemo, useState } from 'react';
import {
  AllPost,
  Post,
  User,
  Widget
} from '../../../services/models/resourceResponses/articleResponse';
import '../../../assets/css/pdf-resource-view.css';
import PostHeader from '../side-component/PostHeader';

import PostFooter from '../side-component/PostFooter';
import { useLocation } from 'react-router-dom';
import PdfMediaViewComponent from './PdfMediaViewComponent';

interface PdfResponseViewProps {
  post: Post;
  user: User;
  index: number;
  feedModerationHandler: (action: string, index: number, value: any) => void;
  rightSidebarHandler: (action: string, value: any) => void;
}
function PdfResourceView({
  post,
  user,
  index,
  feedModerationHandler,
  rightSidebarHandler
}: PdfResponseViewProps) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const location = useLocation();
  function getMediaData() {
    const postTitle = post.heading;
    const postBody = post.text;
    setTitle(postTitle);
    setBody(postBody);
  }
  useMemo(() => getMediaData(), [post]);
  switch (location.pathname.includes('/post')) {
    case false: {
      return (
        <div className="ResourceViewWrapper">
          <PdfMediaViewComponent attachment={post.attachments[0]} />
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
          <PdfMediaViewComponent attachment={post.attachments[0]} />
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

export default PdfResourceView;
