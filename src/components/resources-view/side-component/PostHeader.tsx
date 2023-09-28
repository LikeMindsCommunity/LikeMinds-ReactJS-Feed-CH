import React, { useContext, useRef, useState } from 'react';
import '../../../assets/css/post-header.css';
import { setTagUserImageInResourceView } from '../../../services/utilityFunctions';
import UserContext from '../../../contexts/UserContext';
import { User } from '../../../services/models/user/userModel';
import {
  AllPost,
  MenuItem,
  Post,
  Widget
} from '../../../services/models/resourceResponses/articleResponse';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Menu } from '@mui/material';
import { useLocation } from 'react-router-dom';
dayjs.extend(relativeTime);
interface PostHeaderProps {
  user: User;
  post: Post;
  isArticle?: boolean;
  widget?: Widget;
}
function PostHeader({ user, post, isArticle, widget }: PostHeaderProps) {
  const userContext = useContext(UserContext);
  const [anchorRef, setAnchorRef] = useState<null | HTMLDivElement>(null);
  const location = useLocation();
  function handleMenu(e: React.MouseEvent<HTMLDivElement>) {
    anchorRef ? setAnchorRef(null) : setAnchorRef(e.currentTarget);
  }
  function handleMenuItemClick(menuId: string) {}
  function renderPostMenuItems() {
    return anchorRef ? (
      <Menu
        anchorEl={anchorRef}
        open={Boolean(anchorRef)}
        onClose={handleMenu}
        onClick={handleMenu}>
        {post.menuItems.map((menuItem: MenuItem) => {
          return (
            <div
              className="menuItem"
              key={menuItem.id}
              onClick={() => handleMenuItemClick(menuItem.id.toString())}>
              {menuItem.title}
            </div>
          );
        })}
      </Menu>
    ) : (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8 12C8 10.9 7.1 10 6 10C4.9 10 4 10.9 4 12C4 13.1 4.9 14 6 14C7.1 14 8 13.1 8 12ZM10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10C10.9 10 10 10.9 10 12ZM16 12C16 13.1 16.9 14 18 14C19.1 14 20 13.1 20 12C20 10.9 19.1 10 18 10C16.9 10 16 10.9 16 12Z"
          fill="#666666"
        />
      </svg>
    );
  }
  const postDetailHeader = (
    <div className="resourceViewheader">
      <div className="userInformationWrapper">
        <div className="userInformationWrapper--imgContainer">
          {setTagUserImageInResourceView(user, userContext)}
        </div>
        <div className="userInformationWrapper--profileDetailsContainer">
          <div className="userInformationWrapper__profileDetailsContainer--mainTitle">
            <span className="userInformationWrapper__profileDetailsContainer__mainTitle--username">
              {user?.name}
            </span>
            {user?.customTitle?.length ? (
              <span className="userInformationWrapper__profileDetailsContainer__mainTitle--userTitle">
                {user?.customTitle}
              </span>
            ) : null}
          </div>
          <div className="userInformationWrapper__profileDetailsContainer--subTitle">
            {user?.questionAnswers}
          </div>
          <div className="userInformationWrapper__profileDetailsContainer--duration">
            {dayjs(post.createdAt).fromNow()}
          </div>
        </div>
      </div>
      <div className="menuItemWrapper" onClick={handleMenu}>
        {renderPostMenuItems()}
      </div>
    </div>
  );
  const postViewHeader = (
    <div className="resourceViewheader resourceViewheader--view ">
      <div className="userInformationWrapper">
        <div className="userInformationWrapper--imgContainer">
          {setTagUserImageInResourceView(user, userContext)}
        </div>
        <div className="userInformationWrapper--profileDetailsContainer">
          <div className="userInformationWrapper__profileDetailsContainer--mainTitle">
            <span className="userInformationWrapper__profileDetailsContainer__mainTitle--username">
              {isArticle ? widget?.metadata.title : post.heading}
            </span>
            {/* {user.customTitle?.length ? (
              <span className="userInformationWrapper__profileDetailsContainer__mainTitle--userTitle">
                {user.customTitle}
              </span>
            ) : null} */}
          </div>
          <div className="userInformationWrapper__profileDetailsContainer--subTitle">
            <span
              style={{
                lineHeight: '20px',
                fontSize: '14px',
                fontWeight: '400',
                color: '#666666'
              }}>
              {user?.name}
              {'  '}
              <svg
                width="4"
                height="4"
                viewBox="0 0 4 4"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <circle cx="2" cy="2" r="2" fill="#666666" />
              </svg>
              {'  '}
              {dayjs(post.createdAt).fromNow()}
            </span>
          </div>
          {/* <div className="userInformationWrapper__profileDetailsContainer--duration">
            {dayjs(post.createdAt).fromNow()}
          </div> */}
        </div>
      </div>
      {/* <div className="menuItemWrapper" onClick={handleMenu}>
        {renderPostMenuItems()}
      </div> */}
    </div>
  );
  console.log(location.pathname);
  switch (location.pathname.includes('/post')) {
    case false: {
      return postViewHeader;
    }
    case true: {
      return postDetailHeader;
    }
    default:
      return null;
  }
}

export default PostHeader;
