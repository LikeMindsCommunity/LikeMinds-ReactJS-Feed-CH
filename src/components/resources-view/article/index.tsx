import React, { useMemo, useState } from 'react';
import {
  AllPost,
  Post,
  User,
  Widget
} from '../../../services/models/resourceResponses/articleResponse';
import '../../../assets/css/article-view.css';
import PostHeader from '../side-component/PostHeader';
import ArticleMediaViewComponent from './ArticleMediaViewComponent';
import PostFooter from '../side-component/PostFooter';
import { useLocation } from 'react-router-dom';
interface ArticleResponseViewProps {
  post: Post;
  user: User;
  widget: Widget;
  index: number;
  feedModerationHandler: (action: string, index: number, value: any) => void;
  rightSidebarHandler: (action: string, value: any) => void;
}
function ArticleResourceView({
  post,
  user,
  widget,
  index,
  feedModerationHandler,
  rightSidebarHandler
}: ArticleResponseViewProps) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const location = useLocation();
  function getMediaData() {
    const postTitle = widget?.metadata.title;
    const postBody = widget?.metadata.body;
    const postImgUrl = widget?.metadata.coverImageUrl;
    setTitle(postTitle);
    setBody(postBody);
    setImgUrl(postImgUrl);
  }
  useMemo(() => getMediaData(), [post]);
  switch (location.pathname.includes('/post')) {
    case false: {
      return (
        <div className="ResourceViewWrapper">
          <ArticleMediaViewComponent imgUrl={imgUrl} />
          <PostHeader
            index={index}
            user={user}
            post={post}
            isArticle={true}
            widget={widget}
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
          <ArticleMediaViewComponent imgUrl={imgUrl} />
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

export default ArticleResourceView;
