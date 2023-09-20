import React, { useEffect, useMemo, useRef, useState } from 'react';
import '../../../assets/css/inputfield.css';
import { DecodeUrlModelSX } from '../../../services/models';
import { lmFeedClient } from '../../..';
import { validateUrl } from '../../../services/utilityFunctions';

interface InputFieldProps {
  width?: string;
  title: string;
  isRequired?: boolean;
  isSubtitle?: boolean;
  update: React.Dispatch<string>;
  shouldCheckForLink?: boolean | null | undefined;
}
function InputField({
  width,
  title,
  isRequired,
  update,
  isSubtitle,
  shouldCheckForLink
}: InputFieldProps) {
  const [text, setText] = useState('');
  const [ogTagData, setOgTagData] = useState<any>(null);
  const ref = useRef<any>(null);
  async function checkForOGTags(ogTagLinkArray: string[]) {
    try {
      // (ogTagLinkArray);
      if (ogTagLinkArray.length) {
        const getOgTag: DecodeUrlModelSX = await lmFeedClient.decodeUrl(ogTagLinkArray[0]);
        // ('the og tag call is :', getOgTag);
        setOgTagData(getOgTag);
      }
    } catch (error) {
      // (error);
    }
  }
  useEffect(() => {
    const timeOut = setTimeout(() => {
      // const ogTagLinkArray: string[] = lmFeedClient.detectLinks(text);
      // if (!text.includes(ogTagLinkArray[0])) {
      //   ogTagLinkArray.splice(0, 1);
      // }
      const ogTagLinkArray = validateUrl(text) ? text : null;
      if (ogTagLinkArray === null) {
        return;
      }
      checkForOGTags([ogTagLinkArray]);
    }, 500);
    return () => {
      clearTimeout(timeOut);
    };
  }, [text]);
  const wrapperStyle = useMemo(() => {
    return {
      width: width
    };
  }, [width]);
  function formatText(text: string) {
    return text.trim();
  }
  function hanldeBlur() {
    update(formatText(text));
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
        return (
          <input
            className="input"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
            }}
            onBlur={hanldeBlur}
          />
        );
      }
      default: {
        return (
          <input
            className="input"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
            }}
            onBlur={hanldeBlur}
          />
        );
      }
    }
  }
  return (
    <div style={wrapperStyle} className="inputFieldWrapper">
      <p className="heading" style={getTextStyles()}>
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
      </p>
      {renderInputField()}
    </div>
  );
}

export default InputField;
