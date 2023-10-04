import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import '../../../assets/css/input-area.css';
import '../../dialog/createPost/createPostDialog.css';
import {
  Limits,
  convertTextToHTML,
  extractTextFromNode,
  findTag,
  returnCSSForTagging,
  setCursorAtEnd,
  setTagUserImage,
  setUserImage
} from '../../../services/utilityFunctions';
import { DecodeUrlModelSX } from '../../../services/models';
import UserContext from '../../../contexts/UserContext';
import InfiniteScroll from 'react-infinite-scroll-component';
import { lmFeedClient } from '../../..';
import TaggingUserBlock from './TaggingUserBlock';
interface InputFieldProps {
  width?: string;
  placeholder?: string;
  isRequired?: boolean;
  update: React.Dispatch<string>;
  minHeight?: string;
  editValuePreset?: boolean;
  editFieldValue?: string;
}
function InputArea({
  width,
  placeholder,
  isRequired,
  update,
  minHeight,
  editValuePreset,
  editFieldValue
}: InputFieldProps) {
  const userContext = useContext(UserContext);
  const PLACE_HOLDER_TEXT = placeholder;
  const [text, setText] = useState<string>('');
  const [tagString, setTagString] = useState<string | null>(null);
  const [taggingMemberList, setTaggingMemberList] = useState<any[]>([]);
  const contentEditableDiv = useRef<HTMLDivElement | null>(null);
  const [loadMoreTaggingUsers, setLoadMoreTaggingUsers] = useState<boolean>(true);
  const [taggingPageCount, setTaggingPageCount] = useState<number>(1);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wrapperStyle = useMemo(() => {
    return {
      width: width
    };
  }, [width]);
  useEffect(() => {
    if (editValuePreset) {
      if (contentEditableDiv.current) {
        const innnerHTML = convertTextToHTML(editFieldValue!).innerHTML;
        console.log(innnerHTML);
        contentEditableDiv.current!.innerHTML = innnerHTML;
      }
    }
  }, [contentEditableDiv, editValuePreset]);
  function formatText(text: string) {
    return text.trim();
  }
  function hanldeBlur(text: string) {
    const formattedText = formatText(text);
    update(formattedText);
  }
  function handleTagButtonClick(e: React.MouseEvent, item: any) {
    e.preventDefault();

    let focusNode = window.getSelection()!.focusNode;
    if (focusNode === null) {
      return;
    }

    let div = focusNode.parentElement;
    let text = div!.childNodes;
    if (focusNode === null || text.length === 0) {
      return;
    }

    let textContentFocusNode = focusNode.textContent;
    if (textContentFocusNode === null) {
      return;
    }

    let tagOp = findTag(textContentFocusNode, setTaggingPageCount);

    // ('the tag string is ', tagOp!.tagString);
    if (tagOp === undefined) return;

    const { limitLeft, limitRight } = tagOp;

    let textNode1Text = textContentFocusNode.substring(0, limitLeft - 1);

    let textNode2Text = textContentFocusNode.substring(limitRight + 1);

    let textNode1 = document.createTextNode(textNode1Text);
    let anchorNode = document.createElement('a');
    anchorNode.id = item?.id;
    anchorNode.href = '#';
    anchorNode.textContent = `@${item?.name.trim()}`;
    anchorNode.contentEditable = 'false';
    let textNode2 = document.createTextNode(textNode2Text);
    const dummyNode = document.createElement('span');
    div!.replaceChild(textNode2, focusNode);

    div!.insertBefore(anchorNode, textNode2);
    div!.insertBefore(dummyNode, anchorNode);
    div!.insertBefore(textNode1, dummyNode);
    setTaggingMemberList([]);
    setCursorAtEnd(contentEditableDiv);
  }
  function handleInput(event: React.MouseEvent<HTMLDivElement>) {
    const selection = window.getSelection();
    setText(event.currentTarget.textContent!);
    if (selection === null) return;
    let focusNode = selection.focusNode;
    if (focusNode === null) {
      return;
    }
    let div = focusNode.parentElement;
    if (div === null) {
      return;
    }
    let text = div.childNodes;
    if (focusNode === null || text.length === 0) {
      return;
    }
    let textContentFocusNode = focusNode.textContent;

    let tagOp = findTag(textContentFocusNode!, setTaggingPageCount);

    if (tagOp?.tagString !== null && tagOp?.tagString !== undefined) {
      setTagString(tagOp?.tagString!);
    } else {
      setTagString(null);
    }
  }
  async function getTags() {
    if (tagString === undefined || tagString === null) {
      return;
    }

    const tagListResponse = await lmFeedClient.getTaggingList(tagString, taggingPageCount);
    const memberList = tagListResponse?.data?.members;
    if (memberList && memberList.length > 0) {
      if (taggingPageCount === 1) {
        setTaggingMemberList([...memberList]);
      } else {
        setTaggingMemberList([...taggingMemberList].concat([...memberList]));
      }

      setTaggingPageCount(taggingPageCount + 1);
    }
  }

  useEffect(() => {
    const timeOut = setTimeout(() => {
      const ogTagLinkArray: string[] = lmFeedClient.detectLinks(text);
      if (!text.includes(ogTagLinkArray[0])) {
        ogTagLinkArray.splice(0, 1);
      }
      //   checkForOGTags(ogTagLinkArray);
    }, 500);
    if (contentEditableDiv && contentEditableDiv.current) {
      if (text === '' && !contentEditableDiv.current.isSameNode(document.activeElement)) {
        contentEditableDiv.current.textContent = 'Write something here...';
      }
    }
    return () => {
      clearTimeout(timeOut);
    };
  }, [text]);

  useEffect(() => {
    if (tagString === null || tagString === undefined) {
      return;
    }

    const timeout = setTimeout(() => {
      getTags();
    }, 500);
    return () => {
      setTaggingMemberList([]);
      setTaggingPageCount(1);
      setLoadMoreTaggingUsers(true);
      clearTimeout(timeout);
    };
  }, [tagString]);
  useEffect(() => {
    if (!tagString) {
      setTaggingMemberList([]);
    }
  }, [tagString]);

  useEffect(() => {
    function handleClickOutside(e: any) {
      if (contentEditableDiv && contentEditableDiv?.current) {
        if (
          !contentEditableDiv?.current?.contains(e.target as unknown as any) &&
          !e.currentTarget?.classList?.contains('taggingTile')
        ) {
          setTaggingMemberList([]);
        }
      }
    }

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [contentEditableDiv]);

  useEffect(() => {
    if (editValuePreset) {
      if (contentEditableDiv.current) {
        const innnerHTML = convertTextToHTML(editFieldValue!).innerHTML;
        console.log(innnerHTML);
        contentEditableDiv.current!.innerHTML = innnerHTML;
      }
    }
  }, [contentEditableDiv, editValuePreset]);

  return (
    <div
      style={{
        position: 'relative'
      }}>
      {taggingMemberList && taggingMemberList?.length > 0 ? (
        <div
          className="taggingBox"
          id="scrollableTaggingContainer"
          style={returnCSSForTagging(containerRef)}>
          <InfiniteScroll
            loader={null}
            hasMore={loadMoreTaggingUsers}
            next={getTags}
            dataLength={taggingMemberList.length}
            scrollableTarget="scrollableTaggingContainer">
            {taggingMemberList?.map!((item: any) => {
              return (
                <TaggingUserBlock
                  key={item?.id.toString() + Math.random().toString()}
                  clickHandler={handleTagButtonClick}
                  item={item}
                  userContext={userContext}
                />
              );
            })}
          </InfiniteScroll>
        </div>
      ) : null}
      <div ref={containerRef}>
        <div
          ref={contentEditableDiv}
          contentEditable={true}
          suppressContentEditableWarning
          style={{
            height: minHeight ? minHeight : '72px'
          }}
          tabIndex={0}
          className="inputAreaWrapper"
          id="editableDivContainer"
          onBlur={() => {
            if (contentEditableDiv && contentEditableDiv.current) {
              if (text.trim().length === 0) {
                contentEditableDiv.current.textContent = placeholder!;
              }
            }
            hanldeBlur(extractTextFromNode(contentEditableDiv.current));
          }}
          onFocus={() => {
            if (contentEditableDiv && contentEditableDiv.current) {
              if (text.trim() === '') {
                while (contentEditableDiv.current?.firstChild) {
                  contentEditableDiv.current.removeChild(contentEditableDiv.current.firstChild);
                }
              }
            }
          }}
          onInput={handleInput}></div>
      </div>
      {/* <div className="separator"></div> */}
    </div>
  );
}

export default InputArea;
