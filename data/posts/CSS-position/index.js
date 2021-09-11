/** @jsx jsx */
import { jsx } from "theme-ui";
import { useState } from "react";
import { CodeBlock } from "@nickymeuleman/gatsby-theme-blog";
import { alpha } from "@theme-ui/color";

/* eslint-disable */

const Beef = () => {
  const [childPosition, setChildPosition] = useState("static");
  const [childTop, setChildTop] = useState("0");
  const [childLeft, setChildLeft] = useState("0");

  return (
    <div>
      <div
        sx={{ position: "relative", height: "30vh", backgroundColor: "green" }}
      >
        Parent
        <div
          sx={{
            position: childPosition,
            top: `${childTop}%`,
            left: `${childLeft}%`,
            backgroundColor: "blue",
          }}
        >
          Child
        </div>
      </div>
      <input
        type="radio"
        id="static"
        name="position"
        value="static"
        checked={childPosition == "static"}
        onChange={(e) => {
          setChildPosition(e.target.value);
        }}
      />
      <label htmlFor="static">static</label>
      <input
        type="radio"
        id="absolute"
        name="position"
        value="absolute"
        checked={childPosition == "absolute"}
        onChange={(e) => setChildPosition(e.target.value)}
      />
      <label htmlFor="absolute">absolute</label>
      <input
        type="radio"
        id="relative"
        name="position"
        value="relative"
        checked={childPosition == "relative"}
        onChange={(e) => {
          setChildPosition(e.target.value);
        }}
      />
      <label htmlFor="relative">relative</label>
      <input
        type="range"
        id="top"
        name="top"
        min="0"
        max="100"
        value={childTop}
        onChange={(e) => {
          const { value } = e.target;
          setChildTop(value);
        }}
      />
      <label htmlFor="top">top</label>
      <input
        type="range"
        id="left"
        name="left"
        min="0"
        max="100"
        value={childLeft}
        onChange={(e) => {
          const { value } = e.target;
          setChildLeft(value);
        }}
      />
      <label htmlFor="left">left</label>
    </div>
  );
};

const AbsoluteChart = () => {
  // svg-source:excalidraw
  // removed font rules so it uses my site's default, changed some things to fit this theme and changed some CSS to object syntax
  return (
    <div>
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 638.6667175292969 279.0001525878906"
        width="1916.0001525878906"
        height="837.0004577636719"
        sx={{
          maxWidth: "100%",
          height: "auto",
          rect: {
            fill: "background",
          },
          path: {
            stroke: "watermarkBg",
          },
          text: {
            fill: "text",
          },
        }}
      >
        <defs />
        <rect
          x="0"
          y="0"
          width="638.6667175292969"
          height="279.0001525878906"
        />
        <g
          strokeLinecap="round"
          transform="translate(140.6666259765625 10) rotate(0 170.6666717529297 48.66667175292969)"
        >
          <path
            d="M-0.9 0.89 C117.25 0.6, 233.15 0.27, 341.95 0.65 M-0.12 -0.45 C69.57 1.42, 140.88 1.6, 340.69 0.49 M342.14 -0.6 C339.18 31.48, 340.34 61.02, 342.48 96.91 M340.63 0.34 C341.12 24.05, 342.07 46.63, 340.67 98.27 M341.03 97.28 C247.76 97.98, 155.45 99.29, 0.18 97.12 M341.86 97.63 C267.34 98.73, 193.04 98.31, 0.64 97.38 M1.49 98.3 C-0.8 57.06, -0.18 18.35, 1.01 -1.97 M0.16 98.09 C1.48 75.28, -0.14 55.9, 0.84 0.78"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(148.66661071777344 44.16673278808594) rotate(0 160 12.5)">
          <text
            x="160"
            y="18"
            fontSize="20px"
            fill="#000000"
            textAnchor="middle"
            style={{ whiteSpace: "pre" }}
            direction="ltr"
          >
            affect other elements&apos; location?
          </text>
        </g>
        <g
          strokeLinecap="round"
          transform="translate(10 204.66680908203125) rotate(0 142.83331298828125 32.16667175292969)"
        >
          <path
            d="M1.46 -0.95 C60.96 -1.51, 119.4 -1.67, 286.22 1.04 M-0.07 0.63 C64.56 -0.6, 130.17 -0.32, 286.29 -0.52 M286.27 0.52 C283.49 17.93, 286.09 36.42, 286.44 65.17 M285.9 -0.35 C284.75 18.1, 285.01 35.46, 285.68 64.09 M285.29 63.79 C215.83 66.14, 142.08 66.82, 1.23 63.55 M286.1 64.95 C194.63 62.71, 105.43 63.31, -0.45 64.66 M0.34 63.59 C-2.04 47.86, -1.46 30.3, -0.82 -0.96 M0.34 63.98 C0.48 50.66, 0.46 34.75, 0.18 0.22"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(64 224.66668701171875) rotate(0 88.5 12.5)">
          <text
            x="0"
            y="18"
            fontSize="20px"
            fill="#000000"
            textAnchor="start"
            style={{ whiteSpace: "pre" }}
            direction="ltr"
          >
            position: absolute;
          </text>
        </g>
        <g strokeLinecap="round">
          <g transform="translate(289.3836572013728 112.00009155273438) rotate(0 -42.13913297775355 42.146830357233995)">
            <path
              d="M0.32 -0.81 C-13.67 12.97, -70.45 69.57, -84.6 83.71 M-0.97 1.38 C-14.53 15.85, -68.84 71.09, -82.38 85.1"
              stroke="#000000"
              strokeWidth="1"
              fill="none"
            />
          </g>
          <g transform="translate(289.3836572013728 112.00009155273438) rotate(0 -42.13913297775355 42.146830357233995)">
            <path
              d="M-71.39 56.2 C-73.27 62.87, -75.67 72.89, -80.88 84.89 M-69.59 58.01 C-74.2 64.68, -76.5 72.73, -83.34 84.89"
              stroke="#000000"
              strokeWidth="1"
              fill="none"
            />
          </g>
          <g transform="translate(289.3836572013728 112.00009155273438) rotate(0 -42.13913297775355 42.146830357233995)">
            <path
              d="M-56.7 70.52 C-62.27 73.76, -68.24 80.3, -80.88 84.89 M-54.9 72.33 C-63.6 74.91, -69.99 78.96, -83.34 84.89"
              stroke="#000000"
              strokeWidth="1"
              fill="none"
            />
          </g>
        </g>
        <g transform="translate(188.66671752929688 128.00003051757812) rotate(0 13.5 12.5)">
          <text
            x="0"
            y="18"
            fontSize="20px"
            fill="#000000"
            textAnchor="start"
            style={{ whiteSpace: "pre" }}
            direction="ltr"
          >
            NO
          </text>
        </g>
        <g
          strokeLinecap="round"
          transform="translate(332.6667175292969 201.3333740234375) rotate(0 148 33.333343505859375)"
        >
          <path
            d="M-0.35 -0.65 C63.98 1.07, 128.22 -0.04, 296.17 1.21 M0.37 -0.02 C115.26 1.66, 229.16 1.92, 295.27 0.62 M294.38 -1.38 C297.1 24.15, 295.91 51.54, 297.52 65.25 M295.96 -0.79 C295.9 21.63, 295.31 43.84, 296.31 65.85 M295.52 66.22 C212.66 68.88, 130.1 67.35, -0.83 66.63 M295.41 67.16 C215.21 66.12, 133.46 65.39, -0.37 67.33 M0.31 68.66 C-0.38 45.76, 0.6 26.6, -0.28 -0.47 M0.09 67.23 C0.39 42.51, -0.04 16.49, 0.8 0.48"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(408.0000305175781 220.66671752929688) rotate(0 69 12.5)">
          <text
            x="0"
            y="18"
            fontSize="20px"
            fill="#000000"
            textAnchor="start"
            style={{ whiteSpace: "pre" }}
            direction="ltr"
          >
            something else
          </text>
        </g>
        <g strokeLinecap="round">
          <g transform="translate(339.1429219851841 111.33340454101562) rotate(0 41.706116150107846 42.016226458838204)">
            <path
              d="M-1.07 0.22 C13.03 14.35, 70.19 69.69, 84.48 83.83 M0.57 -0.71 C14.47 13.6, 69.42 70.23, 83.29 84.75"
              stroke="#000000"
              strokeWidth="1"
              fill="none"
            />
          </g>
          <g transform="translate(339.1429219851841 111.33340454101562) rotate(0 41.706116150107846 42.016226458838204)">
            <path
              d="M56.7 70.78 C62.14 75.19, 72.05 79.33, 83.25 83.92 M55.51 72.09 C65.94 76.39, 77.02 81.74, 83.93 85.53"
              stroke="#000000"
              strokeWidth="1"
              fill="none"
            />
          </g>
          <g transform="translate(339.1429219851841 111.33340454101562) rotate(0 41.706116150107846 42.016226458838204)">
            <path
              d="M71.47 56.54 C72.49 64.97, 78.09 73.27, 83.25 83.92 M70.28 57.85 C75.32 67.47, 80.9 78.12, 83.93 85.53"
              stroke="#000000"
              strokeWidth="1"
              fill="none"
            />
          </g>
        </g>
        <g transform="translate(416.2597052176344 127.91337177558802) rotate(0 18 12.5)">
          <text
            x="18"
            y="18"
            fontSize="20px"
            fill="#000000"
            textAnchor="middle"
            style={{ whiteSpace: "pre" }}
            direction="ltr"
          >
            YES
          </text>
        </g>
      </svg>
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 638.6667175292969 279.0001525878906"
        width="1916.0001525878906"
        height="837.0004577636719"
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
        <defs />
        <rect
          x="0"
          y="0"
          width="638.6667175292969"
          height="279.0001525878906"
        />
        <g
          strokeLinecap="round"
          transform="translate(140.6666259765625 10) rotate(0 170.6666717529297 48.66667175292969)"
        >
          <path
            d="M-0.9 0.89 C117.25 0.6, 233.15 0.27, 341.95 0.65 M-0.12 -0.45 C69.57 1.42, 140.88 1.6, 340.69 0.49 M342.14 -0.6 C339.18 31.48, 340.34 61.02, 342.48 96.91 M340.63 0.34 C341.12 24.05, 342.07 46.63, 340.67 98.27 M341.03 97.28 C247.76 97.98, 155.45 99.29, 0.18 97.12 M341.86 97.63 C267.34 98.73, 193.04 98.31, 0.64 97.38 M1.49 98.3 C-0.8 57.06, -0.18 18.35, 1.01 -1.97 M0.16 98.09 C1.48 75.28, -0.14 55.9, 0.84 0.78"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(148.66661071777344 44.16673278808594) rotate(0 160 12.5)">
          <text
            x="160"
            y="18"
            fontSize="20px"
            fill="#000000"
            textAnchor="middle"
            style={{ whiteSpace: "pre" }}
            direction="ltr"
          >
            affect other elements&apos; location?
          </text>
        </g>
        <g
          strokeLinecap="round"
          transform="translate(10 204.66680908203125) rotate(0 142.83331298828125 32.16667175292969)"
        >
          <path
            d="M1.46 -0.95 C60.96 -1.51, 119.4 -1.67, 286.22 1.04 M-0.07 0.63 C64.56 -0.6, 130.17 -0.32, 286.29 -0.52 M286.27 0.52 C283.49 17.93, 286.09 36.42, 286.44 65.17 M285.9 -0.35 C284.75 18.1, 285.01 35.46, 285.68 64.09 M285.29 63.79 C215.83 66.14, 142.08 66.82, 1.23 63.55 M286.1 64.95 C194.63 62.71, 105.43 63.31, -0.45 64.66 M0.34 63.59 C-2.04 47.86, -1.46 30.3, -0.82 -0.96 M0.34 63.98 C0.48 50.66, 0.46 34.75, 0.18 0.22"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(64 224.66668701171875) rotate(0 88.5 12.5)">
          <text
            x="0"
            y="18"
            fontSize="20px"
            fill="#000000"
            textAnchor="start"
            style={{ whiteSpace: "pre" }}
            direction="ltr"
          >
            position: absolute;
          </text>
        </g>
        <g strokeLinecap="round">
          <g transform="translate(289.3836572013728 112.00009155273438) rotate(0 -42.13913297775355 42.146830357233995)">
            <path
              d="M0.32 -0.81 C-13.67 12.97, -70.45 69.57, -84.6 83.71 M-0.97 1.38 C-14.53 15.85, -68.84 71.09, -82.38 85.1"
              stroke="#000000"
              strokeWidth="1"
              fill="none"
            />
          </g>
          <g transform="translate(289.3836572013728 112.00009155273438) rotate(0 -42.13913297775355 42.146830357233995)">
            <path
              d="M-71.39 56.2 C-73.27 62.87, -75.67 72.89, -80.88 84.89 M-69.59 58.01 C-74.2 64.68, -76.5 72.73, -83.34 84.89"
              stroke="#000000"
              strokeWidth="1"
              fill="none"
            />
          </g>
          <g transform="translate(289.3836572013728 112.00009155273438) rotate(0 -42.13913297775355 42.146830357233995)">
            <path
              d="M-56.7 70.52 C-62.27 73.76, -68.24 80.3, -80.88 84.89 M-54.9 72.33 C-63.6 74.91, -69.99 78.96, -83.34 84.89"
              stroke="#000000"
              strokeWidth="1"
              fill="none"
            />
          </g>
        </g>
        <g transform="translate(188.66671752929688 128.00003051757812) rotate(0 13.5 12.5)">
          <text
            x="0"
            y="18"
            fontSize="20px"
            fill="#000000"
            textAnchor="start"
            style={{ whiteSpace: "pre" }}
            direction="ltr"
          >
            NO
          </text>
        </g>
        <g
          strokeLinecap="round"
          transform="translate(332.6667175292969 201.3333740234375) rotate(0 148 33.333343505859375)"
        >
          <path
            d="M-0.35 -0.65 C63.98 1.07, 128.22 -0.04, 296.17 1.21 M0.37 -0.02 C115.26 1.66, 229.16 1.92, 295.27 0.62 M294.38 -1.38 C297.1 24.15, 295.91 51.54, 297.52 65.25 M295.96 -0.79 C295.9 21.63, 295.31 43.84, 296.31 65.85 M295.52 66.22 C212.66 68.88, 130.1 67.35, -0.83 66.63 M295.41 67.16 C215.21 66.12, 133.46 65.39, -0.37 67.33 M0.31 68.66 C-0.38 45.76, 0.6 26.6, -0.28 -0.47 M0.09 67.23 C0.39 42.51, -0.04 16.49, 0.8 0.48"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(408.0000305175781 220.66671752929688) rotate(0 69 12.5)">
          <text
            x="0"
            y="18"
            fontSize="20px"
            fill="#000000"
            textAnchor="start"
            style={{ whiteSpace: "pre" }}
            direction="ltr"
          >
            something else
          </text>
        </g>
        <g strokeLinecap="round">
          <g transform="translate(339.1429219851841 111.33340454101562) rotate(0 41.706116150107846 42.016226458838204)">
            <path
              d="M-1.07 0.22 C13.03 14.35, 70.19 69.69, 84.48 83.83 M0.57 -0.71 C14.47 13.6, 69.42 70.23, 83.29 84.75"
              stroke="#000000"
              strokeWidth="1"
              fill="none"
            />
          </g>
          <g transform="translate(339.1429219851841 111.33340454101562) rotate(0 41.706116150107846 42.016226458838204)">
            <path
              d="M56.7 70.78 C62.14 75.19, 72.05 79.33, 83.25 83.92 M55.51 72.09 C65.94 76.39, 77.02 81.74, 83.93 85.53"
              stroke="#000000"
              strokeWidth="1"
              fill="none"
            />
          </g>
          <g transform="translate(339.1429219851841 111.33340454101562) rotate(0 41.706116150107846 42.016226458838204)">
            <path
              d="M71.47 56.54 C72.49 64.97, 78.09 73.27, 83.25 83.92 M70.28 57.85 C75.32 67.47, 80.9 78.12, 83.93 85.53"
              stroke="#000000"
              strokeWidth="1"
              fill="none"
            />
          </g>
        </g>
        <g transform="translate(416.2597052176344 127.91337177558802) rotate(0 18 12.5)">
          <text
            x="18"
            y="18"
            fontSize="20px"
            fill="#000000"
            textAnchor="middle"
            style={{ whiteSpace: "pre" }}
            direction="ltr"
          >
            YES
          </text>
        </g>
      </svg>
    </div>
  );
};

const RelativeDemo = () => {
  const [top, setTop] = useState(null);
  const [right, setRight] = useState(null);
  const [bottom, setBottom] = useState(null);
  const [left, setLeft] = useState(null);

  const boxStyles = {
    backgroundColor: "mutedBackground",
    display: "grid",
    placeItems: "center",
    fontSize: "50px",
    aspectRatio: "1",
    border: "5px solid rgba(0, 0, 0, 0.3)",
    borderRadius: "sm",
  };
  const codeStr = `
.two {
  position: relative;
${top != null ? `  top: ${top}px;\n` : ""}${
    bottom != null ? `  bottom: ${bottom}px;\n` : ""
  }${left != null ? `  left: ${left}px;\n` : ""}${
    right != null ? `  right: ${right}px;\n` : ""
  }}`;
  return (
    <div>
      <div
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(100px, 1fr))",
        }}
      >
        <div sx={{ ...boxStyles }}>1</div>
        <div
          sx={{
            ...boxStyles,
            position: "relative",
            backgroundColor: "primary",
            top: `${top}px`,
            right: `${right}px`,
            left: `${left}px`,
            bottom: `${bottom}px`,
          }}
        >
          2
        </div>
        <div sx={{ ...boxStyles }}>3</div>
      </div>
      <div
        sx={{
          display: "grid",
          // make sure the controls are above the boxes
          position: "relative",
          backgroundColor: alpha("background", 0.5),
          gap: 3,
          gridTemplateColumns: ["1fr", null, "1fr 1fr"],
        }}
      >
        <label htmlFor="relative-top">
          <div sx={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <label htmlFor="relative-top-checkbox">
                <input
                  id="relative-top-checkbox"
                  type="checkbox"
                  checked={typeof top === "number" || typeof top === "string"}
                  onChange={(e) => {
                    if (!e.target.checked) {
                      setTop(null);
                    } else {
                      setTop(0);
                    }
                  }}
                />
                top
              </label>
            </div>
            <div>{top || 0}px</div>
          </div>
          <input
            type="range"
            id="relative-top"
            name="relative-top"
            min="0"
            max="100"
            value={top || 0}
            onChange={(e) => {
              const { value } = e.target;
              setTop(value);
            }}
            sx={{
              width: "100%",
              outlineOffset: "6px",
              cursor: "pointer",
            }}
          />
        </label>
        <label htmlFor="relative-bottom">
          <div sx={{ display: "flex", justifyContent: "space-between" }}>
            <label htmlFor="relative-bottom-checkbox">
              <input
                id="relative-bottom-checkbox"
                type="checkbox"
                checked={
                  typeof bottom === "number" || typeof bottom === "string"
                }
                onChange={(e) => {
                  if (!e.target.checked) {
                    setBottom(null);
                  } else {
                    setBottom(0);
                  }
                }}
              />
              bottom
            </label>
            <div>{bottom || 0}px</div>
          </div>
          <input
            type="range"
            id="relative-bottom"
            name="relative-bottom"
            min="0"
            max="100"
            value={bottom || 0}
            onChange={(e) => {
              const { value } = e.target;
              setBottom(value);
            }}
            sx={{
              width: "100%",
              outlineOffset: "6px",
              cursor: "pointer",
            }}
          />
        </label>
        <label htmlFor="relative-left">
          <div sx={{ display: "flex", justifyContent: "space-between" }}>
            <label htmlFor="relative-left-checkbox">
              <input
                id="relative-left-checkbox"
                type="checkbox"
                checked={typeof left === "number" || typeof left === "string"}
                onChange={(e) => {
                  if (!e.target.checked) {
                    setLeft(null);
                  } else {
                    setLeft(0);
                  }
                }}
              />
              left
            </label>
            <div>{left || 0}px</div>
          </div>
          <input
            type="range"
            id="relative-left"
            name="relative-left"
            min="0"
            max="100"
            value={left || 0}
            onChange={(e) => {
              const { value } = e.target;
              setLeft(value);
            }}
            sx={{
              width: "100%",
              outlineOffset: "6px",
              cursor: "pointer",
            }}
          />
        </label>
        <label htmlFor="relative-right">
          <div sx={{ display: "flex", justifyContent: "space-between" }}>
            <label htmlFor="relative-right-checkbox">
              <input
                id="relative-right-checkbox"
                type="checkbox"
                checked={typeof right === "number" || typeof right === "string"}
                onChange={(e) => {
                  if (!e.target.checked) {
                    setRight(null);
                  } else {
                    setRight(0);
                  }
                }}
              />
              right
            </label>
            <div>{right}px</div>
          </div>
          <input
            type="range"
            id="relative-right"
            name="relative-right"
            min="0"
            max="100"
            value={right || 0}
            onChange={(e) => {
              const { value } = e.target;
              setRight(value);
            }}
            sx={{
              width: "100%",
              outlineOffset: "6px",
              cursor: "pointer",
            }}
          />
        </label>
      </div>
      <CodeBlock className="language-css" title="styles.css">
        {codeStr}
      </CodeBlock>
    </div>
  );
};

export { Beef, AbsoluteChart, RelativeDemo };
