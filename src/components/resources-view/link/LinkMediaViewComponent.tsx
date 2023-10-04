import React from 'react';
import '../../../assets/css/link-media-view.css';
import { OgTag } from '../../../services/models/resourceResponses/articleResponse';
import { useLocation } from 'react-router-dom';
interface LinkMediaViewComponentProps {
  ogTag: OgTag;
  isEditMode?: boolean;
  isCreationMode?: boolean;
  deleteCallback?: () => void;
}
function LinkMediaViewComponent({
  ogTag,
  isEditMode,
  isCreationMode,
  deleteCallback
}: LinkMediaViewComponentProps) {
  const location = useLocation();
  console.log(ogTag);
  switch (location.pathname.includes('/post')) {
    case true: {
      switch (isEditMode) {
        case true: {
          return (
            <div>
              <div
                className="linkMediaWrapper"
                style={{
                  padding: '0px',
                  position: 'relative'
                }}>
                <div className="deleteIconEdit" onClick={deleteCallback}>
                  <svg
                    width="14"
                    height="19"
                    viewBox="0 0 14 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M10.5 1.5H14V3.5H0V1.5H3.5L4.5 0.5H9.5L10.5 1.5ZM3 18.5C1.9 18.5 1 17.6 1 16.5V4.5H13V16.5C13 17.6 12.1 18.5 11 18.5H3Z"
                      fill="#333333"
                    />
                  </svg>
                </div>
                <div className="ogTagContent">
                  {ogTag?.image?.length ? (
                    <img className="ogPreview" src={ogTag.image} />
                  ) : (
                    <svg
                      width="100%"
                      height="216"
                      viewBox="0 0 544 216"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <rect width="544" height="216" fill="black" fillOpacity="0.0413571" />
                      <rect width="544" height="216" fill="url(#pattern0)" />
                      <defs>
                        <pattern
                          id="pattern0"
                          patternContentUnits="objectBoundingBox"
                          width="1"
                          height="1">
                          <use transform="matrix(0.00193424 0 0 0.00487141 0 -1.39011)" />
                        </pattern>
                        <image id="image0_1444_280318" width="517" height="776" />
                      </defs>
                    </svg>
                  )}

                  <div className="ogDetails">
                    <div className="ogDetails--title">{ogTag.title}</div>
                    <div className="ogDetails--description">{ogTag?.description}</div>
                    <div className="ogDetails--subtitle">{ogTag.url}</div>
                  </div>
                </div>
              </div>
              <div className="separator"></div>
            </div>
          );
        }
        default: {
          return (
            <div
              className="linkMediaWrapper"
              style={{
                paddingTop: '8px',
                paddingBottom: '2px'
              }}>
              <div className="ogTagContent">
                {ogTag?.image?.length ? (
                  <img className="ogPreview" src={ogTag?.image} />
                ) : (
                  <svg
                    width="544"
                    height="216"
                    viewBox="0 0 544 216"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <rect width="544" height="216" fill="black" fillOpacity="0.0413571" />
                    <rect width="544" height="216" fill="url(#pattern0)" />
                    <defs>
                      <pattern
                        id="pattern0"
                        patternContentUnits="objectBoundingBox"
                        width="1"
                        height="1">
                        <use transform="matrix(0.00193424 0 0 0.00487141 0 -1.39011)" />
                      </pattern>
                      <image id="image0_1444_280318" width="517" height="776" />
                    </defs>
                  </svg>
                )}
                <div className="ogDetails">
                  <div className="ogDetails--title">{ogTag?.title}</div>
                  <div className="ogDetails--description">{ogTag?.description}</div>
                  <div className="ogDetails--subtitle">{ogTag?.url}</div>
                </div>
              </div>
            </div>
          );
        }
      }
    }
    case false: {
      switch (isCreationMode) {
        case true: {
          return (
            <div>
              <div className="creation">
                <div className="creation--imgContainer">
                  {ogTag?.image ? (
                    <img src={ogTag?.image} alt="resource creation link logo" />
                  ) : (
                    <svg
                      width="78"
                      height="57"
                      viewBox="0 0 78 57"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <rect y="0.5" width="78" height="56" fill="black" fillOpacity="0.0413571" />
                      <rect y="0.5" width="78" height="56" fill="url(#pattern0)" />
                      <defs>
                        <pattern
                          id="pattern0"
                          patternContentUnits="objectBoundingBox"
                          width="1"
                          height="1">
                          <use transform="matrix(0.00193424 0 0 0.00269411 0 -0.545316)" />
                        </pattern>
                        <image id="image0_2976_82064" width="517" height="776" />
                      </defs>
                    </svg>
                  )}
                </div>
                <div className="creation--content">
                  <div className="creation--content--title">
                    <p>{ogTag?.title}</p>
                  </div>
                  <div className="creation--content--description">
                    <p>{ogTag?.description}</p>
                  </div>
                  <div className="creation--content--link">
                    <p>{ogTag?.url}</p>
                  </div>
                </div>
                <div className="deleteIcon" onClick={deleteCallback}>
                  <svg
                    width="14"
                    height="19"
                    viewBox="0 0 14 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M10.5 1.5H14V3.5H0V1.5H3.5L4.5 0.5H9.5L10.5 1.5ZM3 18.5C1.9 18.5 1 17.6 1 16.5V4.5H13V16.5C13 17.6 12.1 18.5 11 18.5H3Z"
                      fill="#333333"
                    />
                  </svg>
                </div>
              </div>
              <div className="separator"></div>
            </div>
          );
        }
        default: {
          return (
            <div
              className="linkMediaWrapper"
              style={{
                paddingTop: '0px'
              }}>
              <div className="ogTagContent">
                {ogTag?.image?.length ? (
                  <img className="ogPreview" src={ogTag.image} />
                ) : (
                  <svg
                    width="544"
                    height="216"
                    viewBox="0 0 544 216"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <rect width="544" height="216" fill="black" fillOpacity="0.0413571" />
                    <rect width="544" height="216" fill="url(#pattern0)" />
                    <defs>
                      <pattern
                        id="pattern0"
                        patternContentUnits="objectBoundingBox"
                        width="1"
                        height="1">
                        <use transform="matrix(0.00193424 0 0 0.00487141 0 -1.39011)" />
                      </pattern>
                      <image id="image0_1444_280318" width="517" height="776" />
                    </defs>
                  </svg>
                )}
                <div className="ogDetails">
                  <div className="ogDetails--title">{ogTag.title}</div>
                  <div className="ogDetails--description">{ogTag?.description}</div>
                  <div className="ogDetails--subtitle">{ogTag.url}</div>
                </div>
              </div>
            </div>
          );
        }
      }
    }
  }
}

export default LinkMediaViewComponent;
