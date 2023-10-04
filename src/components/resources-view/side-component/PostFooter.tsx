import React, { useEffect, useRef, useState } from 'react';
import './../../../assets/css/post-view-footer.css';
import PostFooterAction from '../../PostFooter';
import { Post } from '../../../services/models/resourceResponses/articleResponse';
import { useLocation } from 'react-router-dom';
import { convertTextToHTML } from '../../../services/utilityFunctions';
import { Parser } from 'html-to-react';
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
  const [isReadMore, setIsReadMore] = useState(true);
  const postTitleRef = useRef<HTMLDivElement | null>(null);

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
        <div className="postFooterContainer" ref={postTitleRef}>
          <div className="postFooterContainer--title">{title}</div>
          {body?.length ? (
            <div
              className="postFooterContainer--body"
              // dangerouslySetInnerHTML={{ __html: convertTextToHTML(body).innerHTML }}
              suppressContentEditableWarning={true}>
              {isReadMore && body?.length > 300
                ? Parser().parse(convertTextToHTML(body?.substring(0, 300)).innerHTML)
                : Parser().parse(convertTextToHTML(body).innerHTML)}
              {isReadMore && body.length > 300 ? (
                <span
                  style={{
                    color: 'gray',
                    fontWeight: '400',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                  onClick={() => setIsReadMore(false)}>
                  ...ReadMore
                </span>
              ) : null}
            </div>
          ) : null}
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
