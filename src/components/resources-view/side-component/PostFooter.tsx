import React from 'react';
import './../../../assets/css/post-view-footer.css';
import PostFooterAction from '../../PostFooter';
import { Post } from '../../../services/models/resourceResponses/articleResponse';
import { useLocation } from 'react-router-dom';
interface PostFooterProps {
  title: string;
  body: string;
  post: Post;
  index: number;
  feedModerationHandler: (action: string, index: number, value: any) => void;
  rightSidebarHandler: (action: string, value: any) => void;
}
function PostFooter({
  title,
  body,
  post,
  index,
  feedModerationHandler,
  rightSidebarHandler
}: PostFooterProps) {
  const location = useLocation();
  switch (location.pathname.includes('/post')) {
    case false: {
      return (
        <div className="postFooterContainer postFooterContainer--view">
          <PostFooterAction
            postId={post.Id}
            isEdited={post.isEdited}
            isLiked={post.isLiked}
            isPinned={post.isPinned}
            isSaved={post.isSaved}
            likesCount={post.likesCount}
            feedModerationHandler={feedModerationHandler}
            index={index}
            commentsCount={post.commentsCount}
            rightSidebarHandler={rightSidebarHandler}
          />
        </div>
      );
    }
    case true: {
      return (
        <div className="postFooterContainer">
          <div className="postFooterContainer--title">{title}</div>
          <div className="postFooterContainer--body">{body}</div>
          <PostFooterAction
            postId={post.Id}
            isEdited={post.isEdited}
            isLiked={post.isLiked}
            isPinned={post.isPinned}
            isSaved={post.isSaved}
            likesCount={post.likesCount}
            feedModerationHandler={feedModerationHandler}
            index={index}
            commentsCount={post.commentsCount}
            rightSidebarHandler={rightSidebarHandler}
          />
        </div>
      );
    }
    default:
      return null;
  }
}

export default PostFooter;
