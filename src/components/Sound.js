/** @jsx jsx */
import { jsx } from "theme-ui";
import React from "react"

const Sound = ({ fileName, children }) => {
    const [src, setSrc] = React.useState();
    React.useEffect(() => {
        async function loadSound() {
            // eslint, stop trying to help and respect the ignore comment, kthxbye
            // eslint-disable-next-line
            const soundModule = await import(`../../data/assets/${fileName}`);
            const path = soundModule.default;
            setSrc(path);
        };
        loadSound();
    }, [fileName]);
    console.log("comp", src);
    const audioEl = React.useRef();
    const handlePlay = () => {
        audioEl.current.play();
    };

    return (
        <span>
            <audio ref={audioEl} controls src={src}>
                Your browser does not support the <code>audio</code> element.
            </audio>
            <button onClick={handlePlay}>
                {children}
            </button>
        </span>
    );
};

export { Sound };