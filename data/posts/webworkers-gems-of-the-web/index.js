/* eslint-disable no-bitwise, no-continue, react-hooks/exhaustive-deps */
/** @jsx jsx */
import { jsx } from "theme-ui";
import React, { useState, useEffect, useRef } from "react";
import partyCorgiSrc from "./party-corgi.gif";

const Button = ({ children, onClick, ...props }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      sx={{
        outlineWidth: "1px",
        outlineOffset: "2px",
        cursor: "pointer",
        px: 3,
        py: 2,
        backgroundColor: "transparent",
        color: "text",
        borderStyle: "solid",
        borderWidth: "1px",
        borderColor: "text",
        ":hover": {
          color: "primary",
          borderColor: "mutedPrimary",
        },
        ":disabled": {
          color: "mutedText",
          backgroundColor: "gray",
          borderColor: "inherit",
          cursor: "not-allowed",
        },
      }}
      {...props}
    >
      {children}
    </button>
  );
};

const DemoArea = ({ title, children, internalSx }) => {
  return (
    <div
      sx={{
        border: `1px solid`,
        borderColor: "watermarkBg",
        padding: 3,
        mb: 2,
        flex: 1,
      }}
    >
      <p
        sx={{
          margin: 0,
          mb: 2,
          textTransform: `uppercase`,
          letterSpacing: `wider`,
          fontWeight: `bold`,
          color: "mutedTextBg",
          fontSize: 1,
        }}
      >
        {title}
      </p>
      <div
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat( auto-fill, minmax(200px, 1fr) )",
          gap: 3,
          gridAutoFlow: "dense",
          ...internalSx,
        }}
      >
        {children}
      </div>
    </div>
  );
};

const Input = ({ title, children, ...props }) => {
  return (
    <div sx={{ display: "flex", flexDirection: "column" }} {...props}>
      <p
        sx={{
          margin: 0,
          mb: 1,
          textTransform: `uppercase`,
          letterSpacing: `wider`,
          fontWeight: `bold`,
          color: `mutedText`,
          fontSize: 0,
        }}
      >
        {title}
      </p>
      {children}
    </div>
  );
};

const Output = ({ title, children, passedSx, ...props }) => {
  return (
    <div
      sx={{
        color: `mutedText`,
        ...passedSx,
      }}
      {...props}
    >
      <p
        sx={{
          margin: 0,
          mb: 1,
          textTransform: `uppercase`,
          letterSpacing: `wider`,
          fontWeight: `bold`,
          fontSize: 0,
        }}
      >
        {title}
      </p>
      {children}
    </div>
  );
};

const ProblemDemo = () => {
  const jsAnimEl = useRef(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    let degrees = 0;
    function animate() {
      // eslint-disable-next-line no-use-before-define
      requestId = requestAnimationFrame(animate);
      degrees += 1;
      jsAnimEl?.current.style.setProperty(`--degrees`, `${degrees}deg`);
    }
    let requestId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestId);
  }, []);

  return (
    <React.Fragment>
      <DemoArea>
        <Input title="Main thread">
          <Button
            type="button"
            onClick={() => {
              const start = Date.now();
              // eslint-disable-next-line no-empty
              while (start + 3000 > Date.now()) {}
            }}
          >
            Block 3 seconds
          </Button>
        </Input>
        <Input title="Main thread">
          <Button
            type="button"
            onClick={() => {
              const intervalId = setInterval(() => {
                const start = Date.now();
                // eslint-disable-next-line no-empty
                while (start + 180 > Date.now()) {}
              }, 200);
              setTimeout(() => clearInterval(intervalId), 3000);
            }}
          >
            Jank / heavy work 3 seconds
          </Button>
        </Input>
        <Input title="Main thread">
          <Button
            type="button"
            onClick={() => {
              setCount(count + 1);
            }}
          >
            increment
          </Button>
        </Input>
      </DemoArea>
      <DemoArea>
        <Output
          title="JS Animation"
          sx={{
            display: "grid",
            gridTemplateRows: "auto 1fr",
          }}
        >
          <div
            ref={jsAnimEl}
            sx={{
              backgroundColor: "primary",
              transform: `rotate(var(--degrees))`,
              minWidth: "1rem",
              minHeight: "4rem",
              alignSelf: "center",
              justifySelf: "center",
              borderRadius: "sm",
            }}
          />
        </Output>
        <Output title="GIF">
          <img src={partyCorgiSrc} alt="walking rainbow corgi" />
        </Output>
        <Output title="Count">{count}</Output>
      </DemoArea>
    </React.Fragment>
  );
};

const SolutionDemo = () => {
  const jsAnimEl = useRef(null);
  const [count, setCount] = useState(0);
  const [countWorker, setCountWorker] = useState(null);

  useEffect(() => {
    let degrees = 0;
    function animate() {
      // eslint-disable-next-line no-use-before-define
      requestId = requestAnimationFrame(animate);
      degrees += 1;
      jsAnimEl?.current.style.setProperty(`--degrees`, `${degrees}deg`);
    }
    let requestId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestId);
  }, []);

  useEffect(() => {
    const worker = new Worker(new URL("./countWorker.js", import.meta.url), {
      name: "countWorker",
      type: "module",
    });

    // do I want to show the updated count in this demo?
    // worker.addEventListener("message", (event) => {
    //   setCount(event.data);
    // });

    setCountWorker(worker);
  }, []);

  return (
    <React.Fragment>
      <DemoArea>
        <Input title="Web Worker">
          <Button
            type="button"
            onClick={() => {
              countWorker.postMessage("block");
            }}
          >
            Block 3 seconds
          </Button>
        </Input>
        <Input title="Web Worker">
          <Button
            type="button"
            onClick={() => {
              countWorker.postMessage("jank");
            }}
          >
            Jank / heavy work 3 seconds
          </Button>
        </Input>
        <Input title="Main thread">
          <Button
            type="button"
            onClick={() => {
              setCount(count + 1);
            }}
          >
            increment
          </Button>
        </Input>
      </DemoArea>
      <DemoArea>
        <Output
          title="JS Animation"
          sx={{
            display: "grid",
            gridTemplateRows: "auto 1fr",
          }}
        >
          <div
            ref={jsAnimEl}
            sx={{
              backgroundColor: "primary",
              transform: `rotate(var(--degrees))`,
              minWidth: "1rem",
              minHeight: "4rem",
              alignSelf: "center",
              justifySelf: "center",
              borderRadius: "sm",
            }}
          />
        </Output>
        <Output title="GIF">
          <img src={partyCorgiSrc} alt="walking rainbow corgi" />
        </Output>
        <Output title="Count">{count}</Output>
      </DemoArea>
    </React.Fragment>
  );
};

const MainToWorkerChart = () => {
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 853.274826279263 248.17158325446064"
      width="1706.549652558526"
      height="496.3431665089213"
      sx={{
        maxWidth: "100%",
        height: "auto",
        rect: {
          fill: "background",
        },
        path: {
          stroke: "mutedPrimary",
        },
        text: {
          fill: "text",
        },
      }}
    >
      <g strokeLinecap="round">
        <g transform="translate(116.1042413053508 112.55211605875456) rotate(0 42.66299042826665 48.33584897910919)">
          <path
            d="M0.96 -1.06 C6.43 -2.84, 19.1 -12.24, 32.92 -11.85 C46.74 -11.47, 71.19 -7.48, 83.87 1.25 C96.55 9.99, 108.62 25.48, 108.99 40.57 C109.37 55.67, 99.48 80.65, 86.14 91.81 C72.8 102.96, 45.95 110.01, 28.93 107.52 C11.92 105.02, -7.28 89.3, -15.93 76.81 C-24.58 64.32, -25.68 45.51, -22.96 32.56 C-20.25 19.62, -3.76 4.5, 0.35 -0.86 M0 0.99 C5.31 -1.03, 18.01 -13.35, 31.95 -13.65 C45.89 -13.95, 70.7 -10.04, 83.64 -0.82 C96.58 8.41, 108.86 26.15, 109.6 41.7 C110.35 57.24, 101.86 81.1, 88.11 92.45 C74.36 103.8, 44.36 112.65, 27.1 109.81 C9.83 106.96, -7.49 88.33, -15.48 75.39 C-23.47 62.45, -23.74 44.56, -20.85 32.15 C-17.96 19.75, -2.08 6.3, 1.84 0.96"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(116.1042413053508 112.55211605875456) rotate(0 42.66299042826665 48.33584897910919)">
          <path
            d="M-7.46 19.5 C-2.16 15.52, -0.04 9.26, 1.89 0.27 M-5.99 19.45 C-4.08 13.16, -1.48 6.22, 2.16 1.26"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(116.1042413053508 112.55211605875456) rotate(0 42.66299042826665 48.33584897910919)">
          <path
            d="M-17.66 10.31 C-9.32 9.06, -4.08 5.61, 1.89 0.27 M-16.18 10.26 C-10.74 7.15, -4.68 3.34, 2.16 1.26"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
      </g>
      <g strokeLinecap="round">
        <g transform="translate(320.3208258336614 108.40953226625282) rotate(0 109.5506552947216 -2.4136614565381933)">
          <path
            d="M-1.01 -0.4 C35.86 -0.98, 183.43 -3.6, 220.11 -4.43 M0.66 -1.65 C37.57 -1.96, 183.49 -2.49, 219.77 -3"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(320.3208258336614 108.40953226625282) rotate(0 109.5506552947216 -2.4136614565381933)">
          <path
            d="M191 9.41 C197.26 5.7, 201.5 4.66, 220.08 -4.27 M191.08 8.33 C198.33 5.96, 204.19 2.2, 220.01 -3"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(320.3208258336614 108.40953226625282) rotate(0 109.5506552947216 -2.4136614565381933)">
          <path
            d="M190.84 -11.11 C196.97 -10.55, 201.24 -7.32, 220.08 -4.27 M190.92 -12.19 C198.29 -10.02, 204.18 -9.26, 220.01 -3"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
      </g>
      <g transform="translate(364.94891983056175 74.46197078904095) rotate(0 63 12.5)">
        <text
          x="0"
          y="18"
          fontFamily="Virgil, Segoe UI Emoji"
          fontSize="20px"
          fill="#000000"
          textAnchor="start"
          style={{ whiteSpace: "pre" }}
          direction="ltr"
        >
          postMessage
        </text>
      </g>
      <g transform="translate(132.76415624022115 134.67545216231156) rotate(0 28 25)">
        <text
          x="0"
          y="18"
          fontFamily="Virgil, Segoe UI Emoji"
          fontSize="20px"
          fill="#000000"
          textAnchor="start"
          style={{ whiteSpace: "pre" }}
          direction="ltr"
        >
          Event
        </text>
        <text
          x="0"
          y="43"
          fontFamily="Virgil, Segoe UI Emoji"
          fontSize="20px"
          fill="#000000"
          textAnchor="start"
          style={{ whiteSpace: "pre" }}
          direction="ltr"
        >
          Loop
        </text>
      </g>
      <g transform="translate(52.78975417550987 10) rotate(0 106.5 22.5)">
        <text
          x="0"
          y="32"
          fontFamily="Virgil, Segoe UI Emoji"
          fontSize="36px"
          fill="#000000"
          textAnchor="start"
          style={{ whiteSpace: "pre" }}
          direction="ltr"
        >
          Main thread
        </text>
      </g>
      <g transform="translate(569.7151050353431 11.657138179982951) rotate(0 126 22.5)">
        <text
          x="0"
          y="32"
          fontFamily="Virgil, Segoe UI Emoji"
          fontSize="36px"
          fill="#000000"
          textAnchor="start"
          style={{ whiteSpace: "pre" }}
          direction="ltr"
        >
          Worker thread
        </text>
      </g>
      <g
        strokeLinecap="round"
        transform="translate(14.824803296902928 62.44359257561473) rotate(0 146.80977527127328 87.86399533942296)"
      >
        <path
          d="M-1.4 -0.66 C85.94 1.84, 170.23 0.25, 292.67 1.1 M0.35 -0.58 C105.49 -1.58, 211.58 -1.51, 293.65 -0.68 M294.29 1.41 C293.93 53.45, 296.83 103.09, 293.68 177.4 M293.56 -0.43 C292.96 38.78, 293.12 76.98, 293.71 175.28 M293.8 175.94 C224.46 174.1, 152.53 175.95, 0.84 175.61 M293.33 175.56 C192.08 174.23, 91.82 173.82, -0.26 175.02 M1.17 176.25 C-2.43 119.93, -0.78 65.57, -1.64 1.21 M-0.39 176.62 C-0.78 122.82, -1.03 68.7, -0.84 -0.64"
          stroke="#000000"
          strokeWidth="1"
          fill="none"
        />
      </g>
      <g strokeLinecap="round">
        <g transform="translate(11.1316220711916 86.36303517550175) rotate(0 147.70072404801334 0.639337429879248)">
          <path
            d="M-1.13 -0.53 C48.22 -0.3, 247.03 1.03, 296.53 1.08 M0.48 1.81 C49.69 1.75, 246.84 -0.34, 295.96 -0.47"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
      </g>
      <g
        strokeLinecap="round"
        transform="translate(25.37221524572226 72.25105884068057) rotate(0 5.742208231357779 5.742208231357779)"
      >
        <path
          d="M11.48 5.74 C11.48 6.07, 11.45 6.41, 11.4 6.74 C11.34 7.07, 11.25 7.39, 11.14 7.71 C11.02 8.02, 10.88 8.33, 10.72 8.61 C10.55 8.9, 10.35 9.18, 10.14 9.43 C9.93 9.69, 9.69 9.93, 9.43 10.14 C9.18 10.35, 8.9 10.55, 8.61 10.72 C8.33 10.88, 8.02 11.02, 7.71 11.14 C7.39 11.25, 7.07 11.34, 6.74 11.4 C6.41 11.45, 6.07 11.48, 5.74 11.48 C5.41 11.48, 5.07 11.45, 4.75 11.4 C4.42 11.34, 4.09 11.25, 3.78 11.14 C3.47 11.02, 3.16 10.88, 2.87 10.72 C2.58 10.55, 2.31 10.35, 2.05 10.14 C1.8 9.93, 1.56 9.69, 1.34 9.43 C1.13 9.18, 0.94 8.9, 0.77 8.61 C0.6 8.33, 0.46 8.02, 0.35 7.71 C0.23 7.39, 0.14 7.07, 0.09 6.74 C0.03 6.41, 0 6.07, 0 5.74 C0 5.41, 0.03 5.07, 0.09 4.75 C0.14 4.42, 0.23 4.09, 0.35 3.78 C0.46 3.47, 0.6 3.16, 0.77 2.87 C0.94 2.58, 1.13 2.31, 1.34 2.05 C1.56 1.8, 1.8 1.56, 2.05 1.34 C2.31 1.13, 2.58 0.94, 2.87 0.77 C3.16 0.6, 3.47 0.46, 3.78 0.35 C4.09 0.23, 4.42 0.14, 4.75 0.09 C5.07 0.03, 5.41 0, 5.74 0 C6.07 0, 6.41 0.03, 6.74 0.09 C7.07 0.14, 7.39 0.23, 7.71 0.35 C8.02 0.46, 8.33 0.6, 8.61 0.77 C8.9 0.94, 9.18 1.13, 9.43 1.34 C9.69 1.56, 9.93 1.8, 10.14 2.05 C10.35 2.31, 10.55 2.58, 10.72 2.87 C10.88 3.16, 11.02 3.47, 11.14 3.78 C11.25 4.09, 11.34 4.42, 11.4 4.75 C11.45 5.07, 11.47 5.58, 11.48 5.74 C11.5 5.91, 11.5 5.58, 11.48 5.74"
          stroke="none"
          strokeWidth="0"
          fill="#fa5252"
        />
        <path
          d="M11.48 5.74 C11.48 6.07, 11.45 6.41, 11.4 6.74 C11.34 7.07, 11.25 7.39, 11.14 7.71 C11.02 8.02, 10.88 8.33, 10.72 8.61 C10.55 8.9, 10.35 9.18, 10.14 9.43 C9.93 9.69, 9.69 9.93, 9.43 10.14 C9.18 10.35, 8.9 10.55, 8.61 10.72 C8.33 10.88, 8.02 11.02, 7.71 11.14 C7.39 11.25, 7.07 11.34, 6.74 11.4 C6.41 11.45, 6.07 11.48, 5.74 11.48 C5.41 11.48, 5.07 11.45, 4.75 11.4 C4.42 11.34, 4.09 11.25, 3.78 11.14 C3.47 11.02, 3.16 10.88, 2.87 10.72 C2.58 10.55, 2.31 10.35, 2.05 10.14 C1.8 9.93, 1.56 9.69, 1.34 9.43 C1.13 9.18, 0.94 8.9, 0.77 8.61 C0.6 8.33, 0.46 8.02, 0.35 7.71 C0.23 7.39, 0.14 7.07, 0.09 6.74 C0.03 6.41, 0 6.07, 0 5.74 C0 5.41, 0.03 5.07, 0.09 4.75 C0.14 4.42, 0.23 4.09, 0.35 3.78 C0.46 3.47, 0.6 3.16, 0.77 2.87 C0.94 2.58, 1.13 2.31, 1.34 2.05 C1.56 1.8, 1.8 1.56, 2.05 1.34 C2.31 1.13, 2.58 0.94, 2.87 0.77 C3.16 0.6, 3.47 0.46, 3.78 0.35 C4.09 0.23, 4.42 0.14, 4.75 0.09 C5.07 0.03, 5.41 0, 5.74 0 C6.07 0, 6.41 0.03, 6.74 0.09 C7.07 0.14, 7.39 0.23, 7.71 0.35 C8.02 0.46, 8.33 0.6, 8.61 0.77 C8.9 0.94, 9.18 1.13, 9.43 1.34 C9.69 1.56, 9.93 1.8, 10.14 2.05 C10.35 2.31, 10.55 2.58, 10.72 2.87 C10.88 3.16, 11.02 3.47, 11.14 3.78 C11.25 4.09, 11.34 4.42, 11.4 4.75 C11.45 5.07, 11.47 5.58, 11.48 5.74 C11.5 5.91, 11.5 5.58, 11.48 5.74"
          stroke="#000000"
          strokeWidth="1"
          fill="none"
        />
      </g>
      <g
        strokeLinecap="round"
        transform="translate(48.93522434503973 72.25105884068057) rotate(0 5.742208231357779 5.742208231357779)"
      >
        <path
          d="M11.48 5.74 C11.48 6.07, 11.45 6.41, 11.4 6.74 C11.34 7.07, 11.25 7.39, 11.14 7.71 C11.02 8.02, 10.88 8.33, 10.72 8.61 C10.55 8.9, 10.35 9.18, 10.14 9.43 C9.93 9.69, 9.69 9.93, 9.43 10.14 C9.18 10.35, 8.9 10.55, 8.61 10.72 C8.33 10.88, 8.02 11.02, 7.71 11.14 C7.39 11.25, 7.07 11.34, 6.74 11.4 C6.41 11.45, 6.07 11.48, 5.74 11.48 C5.41 11.48, 5.07 11.45, 4.75 11.4 C4.42 11.34, 4.09 11.25, 3.78 11.14 C3.47 11.02, 3.16 10.88, 2.87 10.72 C2.58 10.55, 2.31 10.35, 2.05 10.14 C1.8 9.93, 1.56 9.69, 1.34 9.43 C1.13 9.18, 0.94 8.9, 0.77 8.61 C0.6 8.33, 0.46 8.02, 0.35 7.71 C0.23 7.39, 0.14 7.07, 0.09 6.74 C0.03 6.41, 0 6.07, 0 5.74 C0 5.41, 0.03 5.07, 0.09 4.75 C0.14 4.42, 0.23 4.09, 0.35 3.78 C0.46 3.47, 0.6 3.16, 0.77 2.87 C0.94 2.58, 1.13 2.31, 1.34 2.05 C1.56 1.8, 1.8 1.56, 2.05 1.34 C2.31 1.13, 2.58 0.94, 2.87 0.77 C3.16 0.6, 3.47 0.46, 3.78 0.35 C4.09 0.23, 4.42 0.14, 4.75 0.09 C5.07 0.03, 5.41 0, 5.74 0 C6.07 0, 6.41 0.03, 6.74 0.09 C7.07 0.14, 7.39 0.23, 7.71 0.35 C8.02 0.46, 8.33 0.6, 8.61 0.77 C8.9 0.94, 9.18 1.13, 9.43 1.34 C9.69 1.56, 9.93 1.8, 10.14 2.05 C10.35 2.31, 10.55 2.58, 10.72 2.87 C10.88 3.16, 11.02 3.47, 11.14 3.78 C11.25 4.09, 11.34 4.42, 11.4 4.75 C11.45 5.07, 11.47 5.58, 11.48 5.74 C11.5 5.91, 11.5 5.58, 11.48 5.74"
          stroke="none"
          strokeWidth="0"
          fill="#fab005"
        />
        <path
          d="M11.48 5.74 C11.48 6.07, 11.45 6.41, 11.4 6.74 C11.34 7.07, 11.25 7.39, 11.14 7.71 C11.02 8.02, 10.88 8.33, 10.72 8.61 C10.55 8.9, 10.35 9.18, 10.14 9.43 C9.93 9.69, 9.69 9.93, 9.43 10.14 C9.18 10.35, 8.9 10.55, 8.61 10.72 C8.33 10.88, 8.02 11.02, 7.71 11.14 C7.39 11.25, 7.07 11.34, 6.74 11.4 C6.41 11.45, 6.07 11.48, 5.74 11.48 C5.41 11.48, 5.07 11.45, 4.75 11.4 C4.42 11.34, 4.09 11.25, 3.78 11.14 C3.47 11.02, 3.16 10.88, 2.87 10.72 C2.58 10.55, 2.31 10.35, 2.05 10.14 C1.8 9.93, 1.56 9.69, 1.34 9.43 C1.13 9.18, 0.94 8.9, 0.77 8.61 C0.6 8.33, 0.46 8.02, 0.35 7.71 C0.23 7.39, 0.14 7.07, 0.09 6.74 C0.03 6.41, 0 6.07, 0 5.74 C0 5.41, 0.03 5.07, 0.09 4.75 C0.14 4.42, 0.23 4.09, 0.35 3.78 C0.46 3.47, 0.6 3.16, 0.77 2.87 C0.94 2.58, 1.13 2.31, 1.34 2.05 C1.56 1.8, 1.8 1.56, 2.05 1.34 C2.31 1.13, 2.58 0.94, 2.87 0.77 C3.16 0.6, 3.47 0.46, 3.78 0.35 C4.09 0.23, 4.42 0.14, 4.75 0.09 C5.07 0.03, 5.41 0, 5.74 0 C6.07 0, 6.41 0.03, 6.74 0.09 C7.07 0.14, 7.39 0.23, 7.71 0.35 C8.02 0.46, 8.33 0.6, 8.61 0.77 C8.9 0.94, 9.18 1.13, 9.43 1.34 C9.69 1.56, 9.93 1.8, 10.14 2.05 C10.35 2.31, 10.55 2.58, 10.72 2.87 C10.88 3.16, 11.02 3.47, 11.14 3.78 C11.25 4.09, 11.34 4.42, 11.4 4.75 C11.45 5.07, 11.47 5.58, 11.48 5.74 C11.5 5.91, 11.5 5.58, 11.48 5.74"
          stroke="#000000"
          strokeWidth="1"
          fill="none"
        />
      </g>
      <g
        strokeLinecap="round"
        transform="translate(73.533083094061 73.2859084903987) rotate(0 5.742208231357779 5.742208231357779)"
      >
        <path
          d="M11.48 5.74 C11.48 6.07, 11.45 6.41, 11.4 6.74 C11.34 7.07, 11.25 7.39, 11.14 7.71 C11.02 8.02, 10.88 8.33, 10.72 8.61 C10.55 8.9, 10.35 9.18, 10.14 9.43 C9.93 9.69, 9.69 9.93, 9.43 10.14 C9.18 10.35, 8.9 10.55, 8.61 10.72 C8.33 10.88, 8.02 11.02, 7.71 11.14 C7.39 11.25, 7.07 11.34, 6.74 11.4 C6.41 11.45, 6.07 11.48, 5.74 11.48 C5.41 11.48, 5.07 11.45, 4.75 11.4 C4.42 11.34, 4.09 11.25, 3.78 11.14 C3.47 11.02, 3.16 10.88, 2.87 10.72 C2.58 10.55, 2.31 10.35, 2.05 10.14 C1.8 9.93, 1.56 9.69, 1.34 9.43 C1.13 9.18, 0.94 8.9, 0.77 8.61 C0.6 8.33, 0.46 8.02, 0.35 7.71 C0.23 7.39, 0.14 7.07, 0.09 6.74 C0.03 6.41, 0 6.07, 0 5.74 C0 5.41, 0.03 5.07, 0.09 4.75 C0.14 4.42, 0.23 4.09, 0.35 3.78 C0.46 3.47, 0.6 3.16, 0.77 2.87 C0.94 2.58, 1.13 2.31, 1.34 2.05 C1.56 1.8, 1.8 1.56, 2.05 1.34 C2.31 1.13, 2.58 0.94, 2.87 0.77 C3.16 0.6, 3.47 0.46, 3.78 0.35 C4.09 0.23, 4.42 0.14, 4.75 0.09 C5.07 0.03, 5.41 0, 5.74 0 C6.07 0, 6.41 0.03, 6.74 0.09 C7.07 0.14, 7.39 0.23, 7.71 0.35 C8.02 0.46, 8.33 0.6, 8.61 0.77 C8.9 0.94, 9.18 1.13, 9.43 1.34 C9.69 1.56, 9.93 1.8, 10.14 2.05 C10.35 2.31, 10.55 2.58, 10.72 2.87 C10.88 3.16, 11.02 3.47, 11.14 3.78 C11.25 4.09, 11.34 4.42, 11.4 4.75 C11.45 5.07, 11.47 5.58, 11.48 5.74 C11.5 5.91, 11.5 5.58, 11.48 5.74"
          stroke="none"
          strokeWidth="0"
          fill="#40c057"
        />
        <path
          d="M11.48 5.74 C11.48 6.07, 11.45 6.41, 11.4 6.74 C11.34 7.07, 11.25 7.39, 11.14 7.71 C11.02 8.02, 10.88 8.33, 10.72 8.61 C10.55 8.9, 10.35 9.18, 10.14 9.43 C9.93 9.69, 9.69 9.93, 9.43 10.14 C9.18 10.35, 8.9 10.55, 8.61 10.72 C8.33 10.88, 8.02 11.02, 7.71 11.14 C7.39 11.25, 7.07 11.34, 6.74 11.4 C6.41 11.45, 6.07 11.48, 5.74 11.48 C5.41 11.48, 5.07 11.45, 4.75 11.4 C4.42 11.34, 4.09 11.25, 3.78 11.14 C3.47 11.02, 3.16 10.88, 2.87 10.72 C2.58 10.55, 2.31 10.35, 2.05 10.14 C1.8 9.93, 1.56 9.69, 1.34 9.43 C1.13 9.18, 0.94 8.9, 0.77 8.61 C0.6 8.33, 0.46 8.02, 0.35 7.71 C0.23 7.39, 0.14 7.07, 0.09 6.74 C0.03 6.41, 0 6.07, 0 5.74 C0 5.41, 0.03 5.07, 0.09 4.75 C0.14 4.42, 0.23 4.09, 0.35 3.78 C0.46 3.47, 0.6 3.16, 0.77 2.87 C0.94 2.58, 1.13 2.31, 1.34 2.05 C1.56 1.8, 1.8 1.56, 2.05 1.34 C2.31 1.13, 2.58 0.94, 2.87 0.77 C3.16 0.6, 3.47 0.46, 3.78 0.35 C4.09 0.23, 4.42 0.14, 4.75 0.09 C5.07 0.03, 5.41 0, 5.74 0 C6.07 0, 6.41 0.03, 6.74 0.09 C7.07 0.14, 7.39 0.23, 7.71 0.35 C8.02 0.46, 8.33 0.6, 8.61 0.77 C8.9 0.94, 9.18 1.13, 9.43 1.34 C9.69 1.56, 9.93 1.8, 10.14 2.05 C10.35 2.31, 10.55 2.58, 10.72 2.87 C10.88 3.16, 11.02 3.47, 11.14 3.78 C11.25 4.09, 11.34 4.42, 11.4 4.75 C11.45 5.07, 11.47 5.58, 11.48 5.74 C11.5 5.91, 11.5 5.58, 11.48 5.74"
          stroke="#000000"
          strokeWidth="1"
          fill="none"
        />
      </g>
      <g strokeLinecap="round">
        <g transform="translate(651.8375450778607 104.43685564198574) rotate(0 42.18327342177713 47.333263539944426)">
          <path
            d="M-1.18 0.49 C4.37 -1.63, 18.65 -12, 32.77 -12.05 C46.9 -12.1, 71.01 -8.55, 83.56 0.19 C96.12 8.92, 107.66 25.19, 108.1 40.37 C108.53 55.54, 99.39 79.94, 86.16 91.24 C72.94 102.55, 45.62 110.58, 28.76 108.2 C11.89 105.81, -6.59 89.51, -15.04 76.93 C-23.48 64.35, -24.59 45.38, -21.9 32.69 C-19.21 20, -2.94 6.27, 1.11 0.78 M0.41 -0.3 C5.82 -2.85, 17.93 -14.19, 31.73 -13.94 C45.52 -13.69, 70.42 -8, 83.17 1.22 C95.92 10.43, 107.4 26.32, 108.23 41.38 C109.06 56.44, 101.71 80.62, 88.15 91.59 C74.58 102.56, 43.87 109.85, 26.82 107.18 C9.78 104.52, -5.82 88.05, -14.11 75.58 C-22.4 63.1, -25.74 44.97, -22.89 32.35 C-20.04 19.72, -0.83 5.34, 2.99 -0.19"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(651.8375450778607 104.43685564198574) rotate(0 42.18327342177713 47.333263539944426)">
          <path
            d="M-4.22 17.89 C-2.34 14.72, -1.9 8.41, 2.7 -0.84 M-4.58 18.19 C-2.71 12.8, -0.58 8.06, 3.87 -0.4"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(651.8375450778607 104.43685564198574) rotate(0 42.18327342177713 47.333263539944426)">
          <path
            d="M-14.16 8.43 C-9.65 7.8, -6.65 3.94, 2.7 -0.84 M-14.53 8.73 C-9.69 6.11, -4.64 4.14, 3.87 -0.4"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
      </g>
      <g transform="translate(668.497460012731 126.56019174554274) rotate(0 28 25)">
        <text
          x="0"
          y="18"
          fontFamily="Virgil, Segoe UI Emoji"
          fontSize="20px"
          fill="#000000"
          textAnchor="start"
          style={{ whiteSpace: "pre" }}
          direction="ltr"
        >
          Event
        </text>
        <text
          x="0"
          y="43"
          fontFamily="Virgil, Segoe UI Emoji"
          fontSize="20px"
          fill="#000000"
          textAnchor="start"
          style={{ whiteSpace: "pre" }}
          direction="ltr"
        >
          Loop
        </text>
      </g>
      <g
        strokeLinecap="round"
        transform="translate(549.6552757367166 62.002398486761365) rotate(0 146.80977527127322 87.86399533942296)"
      >
        <path
          d="M0.54 0.89 C58.59 0.08, 118.33 -0.15, 293.52 0.74 M0.04 0 C89.33 0.51, 179.55 -0.13, 293.95 0.31 M294.29 1.71 C294.04 62.83, 294.88 126.21, 293.57 176.14 M294.47 0.6 C292.41 43.45, 293.16 87.88, 293.01 176.54 M293.96 175.26 C193.92 177.51, 93.55 178.13, 0.41 175.6 M293.73 175.34 C189.96 176.77, 86.57 177.19, -0.14 175.67 M-0.69 177.03 C-1.94 122.28, 1.23 65.41, -1.48 -0.18 M0.13 175.6 C1.63 118.68, 2.55 64.16, 0.82 0.73"
          stroke="#000000"
          strokeWidth="1"
          fill="none"
        />
      </g>
      <g strokeLinecap="round">
        <g transform="translate(320.9823203522718 175.12200279344256) rotate(180.93311273962846 109.33870699754874 -1.952580094227386)">
          <path
            d="M-0.5 -0.64 C36.06 -1.15, 182.46 -2.96, 219.18 -3.7 M1.43 1.63 C37.88 0.82, 182.01 -4.57, 218.35 -5.54"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(320.9823203522718 175.12200279344256) rotate(180.93311273962846 109.33870699754874 -1.952580094227386)">
          <path
            d="M189.44 6.01 C199.31 4.04, 204.86 -1.23, 217.19 -5.9 M189.53 5.28 C199.14 1.8, 209.5 -2.85, 217.6 -5.72"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(320.9823203522718 175.12200279344256) rotate(180.93311273962846 109.33870699754874 -1.952580094227386)">
          <path
            d="M188.77 -14.5 C198.72 -10.69, 204.46 -10.17, 217.19 -5.9 M188.86 -15.23 C198.74 -11.89, 209.32 -9.71, 217.6 -5.72"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
      </g>
      <g transform="translate(370.87532275152546 142.81149485090953) rotate(359.48680928870846 63 12.5)">
        <text
          x="0"
          y="18"
          fontFamily="Virgil, Segoe UI Emoji"
          fontSize="20px"
          fill="#000000"
          textAnchor="start"
          style={{ whiteSpace: "pre" }}
          direction="ltr"
        >
          postMessage
        </text>
      </g>
    </svg>
  );
};

const MainStillNeededDemo = () => {
  const [message, setMessage] = useState("It's quiet");
  const [helloWorker, setHelloWorker] = useState(null);

  useEffect(() => {
    const worker = new Worker(new URL("./worker.js", import.meta.url), {
      name: "helloWorker",
      type: "module",
    });

    let audio;
    async function getSound() {
      const soundModule = await import(`./other-side.mp3`);
      const path = soundModule.default;
      audio = new Audio(path);
      audio.addEventListener("ended", () => {
        setMessage("Quiet...");
      });
    }

    worker.addEventListener("message", () => {
      audio.play();
      setMessage("HELLO FROM THE OTHER SIIIIIIDE");
    });

    getSound();
    setHelloWorker(worker);
  }, []);

  return (
    <React.Fragment>
      <DemoArea>
        <Input title="Communicate with worker">
          <Button
            type="button"
            onClick={() => {
              helloWorker.postMessage("");
            }}
          >
            Say hi
          </Button>
        </Input>
        <Output title="Message from Worker">{message}</Output>
      </DemoArea>
    </React.Fragment>
  );
};

const ProgressDemo = () => {
  const jsAnimEl = useRef(null);
  const [count, setCount] = useState(0);
  const [countWorker, setCountWorker] = useState(null);

  useEffect(() => {
    let degrees = 0;
    function animate() {
      // eslint-disable-next-line no-use-before-define
      requestId = requestAnimationFrame(animate);
      degrees += 1;
      jsAnimEl?.current.style.setProperty(`--degrees`, `${degrees}deg`);
    }
    let requestId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestId);
  }, []);

  useEffect(() => {
    const worker = new Worker(new URL("./countWorker.js", import.meta.url), {
      name: "countWorker",
      type: "module",
    });

    worker.addEventListener("message", (event) => {
      setCount(event.data);
    });

    setCountWorker(worker);
  }, []);

  return (
    <React.Fragment>
      <DemoArea>
        <Input title="Main Thread">
          <Button
            type="button"
            onClick={() => {
              let mainthreadCount = 0;
              const startTime = Date.now();
              while (Date.now() < startTime + 3000) {
                mainthreadCount += 1;
                if (mainthreadCount % 50_000 === 0) {
                  // The next line never executes because this entire function is one task
                  // only the last value for the new count is considered
                  // explanation: https://www.youtube.com/watch?v=cCOL7MC4Pl0
                  setCount(mainthreadCount);
                }
              }
              setCount(mainthreadCount);
            }}
          >
            Count for 3 seconds
          </Button>
        </Input>
        <Input title="Web Worker">
          <Button
            type="button"
            onClick={() => {
              countWorker.postMessage("block");
            }}
          >
            Count for 3 seconds
          </Button>
        </Input>
        <Input title="Main thread">
          <Button
            type="button"
            onClick={() => {
              setCount(count + 1);
            }}
          >
            increment
          </Button>
        </Input>
      </DemoArea>
      <DemoArea>
        <Output
          title="JS Animation"
          sx={{
            display: "grid",
            gridTemplateRows: "auto 1fr",
          }}
        >
          <div
            ref={jsAnimEl}
            sx={{
              backgroundColor: "primary",
              transform: `rotate(var(--degrees))`,
              minWidth: "1rem",
              minHeight: "4rem",
              alignSelf: "center",
              justifySelf: "center",
              borderRadius: "sm",
            }}
          />
        </Output>
        <Output title="GIF">
          <img src={partyCorgiSrc} alt="walking rainbow corgi" />
        </Output>
        <Output title="Count">{count}</Output>
      </DemoArea>
    </React.Fragment>
  );
};

export {
  ProblemDemo,
  SolutionDemo,
  MainToWorkerChart,
  ProgressDemo,
  MainStillNeededDemo,
};
