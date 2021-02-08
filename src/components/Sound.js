/** @jsx jsx */
import { jsx } from "theme-ui";
import { useState, useEffect, useRef } from "react";
import Tooltip from "@reach/tooltip";
import "@reach/tooltip/styles.css";

const Span = ({ fileName, inner }) => {
  const [src, setSrc] = useState();
  useEffect(() => {
    async function loadSound() {
      const soundModule = await import(`../../data/assets/${fileName}`);
      const path = soundModule.default;
      setSrc(path);
    }
    loadSound();
  }, [fileName]);

  const audioEl = useRef();
  const handlePlay = () => {
    audioEl.current.play();
  };
  return (
    <>
      {/* eslint-disable-next-line */}
    <audio ref={audioEl} src={src}>
        Your browser does not support the <code>audio</code> element.
      </audio>
      <button
        type="button"
        onClick={handlePlay}
        sx={{
          display: "inline-flex",
          alignItems: "center",
          cursor: "pointer",
          textDecoration: "underline",
          textDecorationStyle: "dashed",
          backgroundColor: "inherit",
          color: "inherit",
          border: "inherit",
          fontSize: "inherit",
          fontFamily: "inherit",
          p: 0,
        }}
      >
        {inner}
        <svg
          role="img"
          width="20"
          height="20"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
          sx={{ display: "inline", marginLeft: 1 }}
        >
          <title>speaker icon</title>
          <path
            fillRule="evenodd"
            d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </>
  );
};

const Sound = ({ fileName, label = fileName, children }) => {
  const Component =
    typeof window === `undefined` ? (
      <Span fileName={fileName} inner={children} />
    ) : (
      <Tooltip label={label}>
        <span>
          <Span fileName={fileName} inner={children} />
        </span>
      </Tooltip>
    );

  return Component;
};

export { Sound };
