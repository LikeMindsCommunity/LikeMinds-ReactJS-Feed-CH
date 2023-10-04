import React, { useMemo, useState } from 'react';
import { OgTag, Post, User } from '../../../services/models/resourceResponses/articleResponse';
import PostHeader from '../side-component/PostHeader';
import PostFooter from '../side-component/PostFooter';
import '../../../assets/css/article-view.css';
import LinkMediaViewComponent from './LinkMediaViewComponent';
import { useLocation } from 'react-router-dom';
interface LinkResourceViewProps {
  post: Post;
  user: User;
  index: number;
  feedModerationHandler: (action: string, index: number, value: any) => void;
  rightSidebarHandler: (action: string, value: any) => void;
}
function LinkResourceView({
  post,
  user,
  index,
  feedModerationHandler,
  rightSidebarHandler
}: LinkResourceViewProps) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [ogTag, setOgTag] = useState<OgTag>({
    title: '',
    description: '',
    image: '',
    url: ''
  });
  const location = useLocation();
  function getMediaData() {
    const postTitle = post.heading;
    const postBody = post.text;
    setTitle(postTitle);
    setBody(postBody);
    setOgTag(post.attachments[0].attachmentMeta.ogTags!);
  }
  useMemo(() => getMediaData(), [post]);
  switch (location.pathname.includes('/post')) {
    case false: {
      return (
        <div className="ResourceViewWrapper">
          <LinkMediaViewComponent ogTag={ogTag} />
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
          <LinkMediaViewComponent ogTag={ogTag} />
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

export default LinkResourceView;
