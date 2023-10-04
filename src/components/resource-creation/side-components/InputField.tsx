import React, { useEffect, useMemo, useRef, useState } from 'react';
import '../../../assets/css/inputfield.css';
import { DecodeUrlModelSX } from '../../../services/models';
import { lmFeedClient } from '../../..';
import { validateUrl } from '../../../services/utilityFunctions';
import { OgTag } from '../../../services/models/resourceResponses/articleResponse';
import LinkMediaViewComponent from '../../resources-view/link/LinkMediaViewComponent';

interface InputFieldProps {
  width?: string;
  title: string;
  isRequired?: boolean;
  isSubtitle?: boolean;
  update: React.Dispatch<any>;
  shouldCheckForLink?: boolean | null | undefined;
  editValuePreset?: boolean;
  editFieldValue?: string;
}
function InputField({
  width,
  title,
  isRequired,
  update,
  isSubtitle,
  shouldCheckForLink,
  editValuePreset,
  editFieldValue
}: InputFieldProps) {
  const [text, setText] = useState('');
  const [linkText, setLinkText] = useState('');
  const [ogTagData, setOgTagData] = useState<any>(null);
  const ref = useRef<any>(null);
  async function checkForOGTags(ogTagLinkArray: string[]) {
    try {
      if (ogTagLinkArray.length) {
        const getOgTag: DecodeUrlModelSX = await lmFeedClient.decodeUrl(ogTagLinkArray[0]);

        if (getOgTag) {
          setOgTagData(getOgTag);
          update(getOgTag);
        }
      }
    } catch (error) {
      // (error);
    }
  }
  useEffect(() => {
    if (shouldCheckForLink) {
      if (editValuePreset) {
        setLinkText(editFieldValue!);
      }
    } else {
      setText(editFieldValue!);
    }
  }, []);
  useEffect(() => {
    const timeOut = setTimeout(() => {
      console.log(validateUrl(linkText));
      const ogTagLinkArray = lmFeedClient.detectLinks(linkText);
      if (ogTagLinkArray === null) {
        return;
      }
      checkForOGTags(ogTagLinkArray);
    }, 500);
    return () => {
      clearTimeout(timeOut);
    };
  }, [linkText]);
  const wrapperStyle = useMemo(() => {
    return {
      width: width
    };
  }, [width]);
  function formatText(text: string) {
    return text.trim();
  }
  function hanldeBlur() {
    console.log(ogTagData);
    if (shouldCheckForLink) {
      console.log(ogTagData);
      update(ogTagData);
      return;
    }
    update(formatText(text));
  }
  function deleteCallback() {
    setLinkText('');
    setOgTagData(null);
  }
  function getTextStyles() {
    const styles: React.CSSProperties = {};
    if (isSubtitle) {
      styles.fontSize = '16px';
      styles.fontWeight = 400;
      styles.color = 'rgba(51, 51, 51, 0.7)';
      return styles;
    } else {
      return {};
    }
  }

  function renderInputField() {
    switch (shouldCheckForLink) {
      case true: {
        switch (ogTagData) {
          case null: {
            return (
              <>
                <input
                  className="input link-text-input"
                  value={linkText}
                  onChange={(e) => {
                    setLinkText(e.target.value);
                  }}
                  onBlur={hanldeBlur}
                  placeholder="Share the link resource *"
                />
                <div className="separator"></div>
              </>
            );
          }
          default: {
            return (
              <LinkMediaViewComponent
                ogTag={ogTagData}
                isEditMode={true}
                isCreationMode={true}
                deleteCallback={deleteCallback}
              />
            );
          }
        }
      }
      default: {
        return (
          <>
            <input
              className="input text-input"
              value={text}
              onChange={(e) => {
                setText(e.target.value);
              }}
              placeholder={title}
              onBlur={hanldeBlur}
            />
            <div className="separator"></div>
            {/* <span></span> */}
          </>
        );
      }
    }
  }
  return (
    <div style={wrapperStyle} className="inputFieldWrapper">
      {/* <p className="heading" style={getTextStyles()}>
        {title}
        {isRequired ? (
          <span
            style={{
              color: 'red'
            }}>
            {' '}
            *
          </span>
        ) : null}
      </p> */}
      {renderInputField()}
    </div>
  );
}

export default InputField;
