import React from 'react';
import '../../../assets/css/video-media-view-component.css';
interface VideoMediaViewComponentProps {
  videoSrc: string;
}
function VideoMediaViewComponent({ videoSrc }: VideoMediaViewComponentProps) {
  return (
    <div className="videoMediaWrapper">
      <video src={videoSrc} controls />
    </div>
  );
}

export default VideoMediaViewComponent;
