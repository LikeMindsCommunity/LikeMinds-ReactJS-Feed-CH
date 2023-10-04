import React from 'react';
import '../../../assets/css/article-media-view.css';
interface ArticleMediaViewComponentProps {
  imgUrl: string;
}
function ArticleMediaViewComponent({ imgUrl }: ArticleMediaViewComponentProps) {
  return (
    <div className="mediaWrapper">
      <div className="imageContainer">
        <img src={imgUrl} alt="img view" />
      </div>
    </div>
  );
}

export default ArticleMediaViewComponent;
