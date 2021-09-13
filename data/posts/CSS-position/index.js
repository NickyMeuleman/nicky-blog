/** @jsx jsx */
import { jsx } from "theme-ui";
import { useState } from "react";
import { CodeBlock } from "@nickymeuleman/gatsby-theme-blog";
import { alpha } from "@theme-ui/color";
import { Slider } from "./Slider";

/* eslint-disable */

const AbsoluteChart = () => {
  // svg-source:excalidraw
  // removed font rules so it uses my site's default, changed some things to fit this theme and changed some CSS to object syntax
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 638.6667175292969 216.00015258789062"
      width="1916.0001525878906"
      height="648.0004577636719"
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
      <rect
        x="0"
        y="0"
        width="638.6667175292969"
        height="216.00015258789062"
        fill="#ffffff"
      ></rect>
      <g
        stroke-linecap="round"
        transform="translate(140.6666259765625 10) rotate(0 173.6666717529297 24.666671752929688)"
      >
        <path
          d="M-0.88 0.88 C119.28 0.59, 237.23 0.27, 347.94 0.64 M-0.11 -0.44 C70.81 1.42, 143.34 1.6, 346.7 0.48 M348.14 -0.6 C345.6 16.17, 346.76 30.39, 348.48 48.91 M346.63 0.34 C346.99 12.44, 347.94 23.42, 346.67 50.27 M347.03 49.29 C252.15 49.98, 158.22 51.27, 0.18 49.12 M347.85 49.63 C272.04 50.73, 196.44 50.32, 0.63 49.38 M1.49 50.3 C-0.69 28.26, -0.06 8.73, 1.01 -1.97 M0.16 50.09 C1.24 37.69, -0.38 28.72, 0.84 0.78"
          stroke="#000000"
          stroke-width="1"
          fill="none"
        ></path>
      </g>
      <g transform="translate(153.66661071777344 22.166732788085938) rotate(0 160 12.5)">
        <text
          x="160"
          y="18"
          font-size="20px"
          fill="#000000"
          text-anchor="middle"
          style={{ whiteSpace: "pre" }}
          direction="ltr"
        >
          affect other elements' location?
        </text>
      </g>
      <g
        stroke-linecap="round"
        transform="translate(10 156.66680908203125) rotate(0 142.83331298828125 24.666671752929688)"
      >
        <path
          d="M1.46 -0.95 C60.96 -1.51, 119.4 -1.67, 286.22 1.04 M-0.07 0.63 C64.56 -0.6, 130.17 -0.32, 286.29 -0.52 M286.27 0.52 C283.55 13.58, 286.15 27.71, 286.44 50.17 M285.9 -0.35 C284.76 13.91, 285.02 27.09, 285.68 49.09 M285.29 48.79 C215.83 51.14, 142.08 51.82, 1.23 48.55 M286.1 49.95 C194.63 47.71, 105.43 48.31, -0.45 49.66 M0.34 48.59 C-2 36.96, -1.42 23.51, -0.82 -0.96 M0.34 48.98 C0.47 39.01, 0.45 26.44, 0.18 0.22"
          stroke="#000000"
          stroke-width="1"
          fill="none"
        ></path>
      </g>
      <g transform="translate(63 168.66668701171875) rotate(0 95 12.5)">
        <text
          x="0"
          y="18"
          font-size="20px"
          fill="#000000"
          text-anchor="start"
          style={{ whiteSpace: "pre" }}
          direction="ltr"
        >
          absolute positioning
        </text>
      </g>
      <g stroke-linecap="round">
        <g transform="translate(298.6936054031695 71.60277414755853) rotate(0 -44.469971772056 36.54413250362077)">
          <path
            d="M0.32 -0.81 C-14.44 11.1, -74.33 60.23, -89.26 72.51 M-0.97 1.38 C-15.3 13.99, -72.72 61.76, -87.04 73.9"
            stroke="#000000"
            stroke-width="1"
            fill="none"
          ></path>
        </g>
        <g transform="translate(298.6936054031695 71.60277414755853) rotate(0 -44.469971772056 36.54413250362077)">
          <path
            d="M-73.39 46.35 C-75.93 52.7, -78.98 62.39, -85.54 73.68 M-71.6 48.16 C-76.95 54.44, -79.98 62.1, -88 73.68"
            stroke="#000000"
            stroke-width="1"
            fill="none"
          ></path>
        </g>
        <g transform="translate(298.6936054031695 71.60277414755853) rotate(0 -44.469971772056 36.54413250362077)">
          <path
            d="M-60.2 62.07 C-66.08 64.64, -72.33 70.51, -85.54 73.68 M-58.4 63.88 C-67.43 65.68, -74.14 68.97, -88 73.68"
            stroke="#000000"
            stroke-width="1"
            fill="none"
          ></path>
        </g>
      </g>
      <g transform="translate(188.66671752929688 80.00003051757812) rotate(0 13.5 12.5)">
        <text
          x="0"
          y="18"
          font-size="20px"
          fill="#000000"
          text-anchor="start"
          style={{ whiteSpace: "pre" }}
          direction="ltr"
        >
          NO
        </text>
      </g>
      <g
        stroke-linecap="round"
        transform="translate(332.6667175292969 153.3333740234375) rotate(0 148 25.833343505859375)"
      >
        <path
          d="M-0.35 -0.65 C63.98 1.07, 128.22 -0.04, 296.17 1.21 M0.37 -0.02 C115.26 1.66, 229.16 1.92, 295.27 0.62 M294.38 -1.38 C297.21 18.42, 296.02 40.08, 297.52 50.25 M295.96 -0.79 C296.01 16.72, 295.41 34.01, 296.31 50.85 M295.52 51.22 C212.66 53.88, 130.1 52.35, -0.83 51.63 M295.41 52.16 C215.21 51.12, 133.46 50.39, -0.37 52.33 M0.31 53.66 C-0.4 35.12, 0.58 20.32, -0.28 -0.47 M0.09 52.23 C0.29 33.16, -0.14 12.78, 0.8 0.48"
          stroke="#000000"
          stroke-width="1"
          fill="none"
        ></path>
      </g>
      <g transform="translate(409.0000305175781 165.66671752929688) rotate(0 69 12.5)">
        <text
          x="0"
          y="18"
          font-size="20px"
          fill="#000000"
          text-anchor="start"
          style={{ whiteSpace: "pre" }}
          direction="ltr"
        >
          something else
        </text>
      </g>
      <g stroke-linecap="round">
        <g transform="translate(335.1304683027864 71.73334460449186) rotate(0 40.10186067100119 34.116240618994766)">
          <path
            d="M-1.07 0.22 C12.49 11.71, 67.52 56.52, 81.27 68.03 M0.57 -0.71 C13.94 10.97, 66.75 57.06, 80.08 68.95"
            stroke="#000000"
            stroke-width="1"
            fill="none"
          ></path>
        </g>
        <g transform="translate(335.1304683027864 71.73334460449186) rotate(0 40.10186067100119 34.116240618994766)">
          <path
            d="M52.5 57.22 C58.25 60.98, 68.45 64.48, 80.04 68.12 M51.31 58.54 C62.09 62, 73.55 66.51, 80.72 69.73"
            stroke="#000000"
            stroke-width="1"
            fill="none"
          ></path>
        </g>
        <g transform="translate(335.1304683027864 71.73334460449186) rotate(0 40.10186067100119 34.116240618994766)">
          <path
            d="M66.07 41.82 C67.73 49.96, 73.97 57.94, 80.04 68.12 M64.88 43.14 C70.72 52.35, 77.12 62.6, 80.72 69.73"
            stroke="#000000"
            stroke-width="1"
            fill="none"
          ></path>
        </g>
      </g>
      <g transform="translate(416.2597052176344 79.91337177558802) rotate(0 18 12.5)">
        <text
          x="18"
          y="18"
          font-size="20px"
          fill="#000000"
          text-anchor="middle"
          style={{ whiteSpace: "pre" }}
          direction="ltr"
        >
          YES
        </text>
      </g>
    </svg>
  );
};

const RelativeDemo = () => {
  const [top, setTop] = useState(50);
  const [right, setRight] = useState(null);
  const [bottom, setBottom] = useState(null);
  const [left, setLeft] = useState(50);

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
          backdropFilter: "blur(5px)",
          gap: 3,
          mt: 3,
          gridTemplateColumns: ["1fr", null, "1fr 1fr"],
        }}
      >
        <Slider
          labelText="top"
          idPrepend="relative"
          val={top}
          setVal={setTop}
        />
        <Slider
          labelText="bottom"
          idPrepend="relative"
          val={bottom}
          setVal={setBottom}
        />
        <Slider
          labelText="left"
          idPrepend="relative"
          val={left}
          setVal={setLeft}
        />
        <Slider
          labelText="right"
          idPrepend="relative"
          val={right}
          setVal={setRight}
        />
      </div>
      <CodeBlock className="language-css" title="styles.css">
        {codeStr}
      </CodeBlock>
    </div>
  );
};

const AbsoluteDemo = () => {
  const [top, setTop] = useState(50);
  const [right, setRight] = useState(null);
  const [bottom, setBottom] = useState(null);
  const [left, setLeft] = useState(50);

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
  position: absolute;
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
          position: "relative",
        }}
      >
        <div sx={{ ...boxStyles }}>1</div>
        <div
          sx={{
            ...boxStyles,
            aspectRatio: "unset",
            position: "absolute",
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
          backdropFilter: "blur(5px)",
          gap: 3,
          mt: 3,
          gridTemplateColumns: ["1fr", null, "1fr 1fr"],
        }}
      >
        <Slider
          labelText="top"
          idPrepend="absolute"
          val={top}
          setVal={setTop}
        />
        <Slider
          labelText="bottom"
          idPrepend="absolute"
          val={bottom}
          setVal={setBottom}
        />
        <Slider
          labelText="left"
          idPrepend="absolute"
          val={left}
          setVal={setLeft}
        />
        <Slider
          labelText="right"
          idPrepend="absolute"
          val={right}
          setVal={setRight}
        />
      </div>
      <CodeBlock className="language-css" title="styles.css">
        {codeStr}
      </CodeBlock>
    </div>
  );
};

const StickyDemo = () => {
  const [top, setTop] = useState(50);

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
  position: sticky;
${top != null ? `  top: ${top}px;\n` : ""}}`;
  return (
    <div>
      <div
        sx={{
          p: 2,
          border: "1px solid",
          borderColor: "watermarkBg",
          overflowY: "scroll",
          maxHeight: "500px",
          "::-webkit-scrollbar-thumb": {
            ":hover": {
              backgroundColor: "mutedText",
            },
            ":active": {
              backgroundColor: "text",
            },
            minHeight: "58px",
            backgroundColor: "mutedTextBg",
            borderRadius: "8px",
            borderWidth: "4px",
            borderStyle: "solid",
            borderColor: "background",
          },
          "::-webkit-scrollbar": {
            width: "16px",
          },
        }}
      >
        <div
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(100px, 1fr))",
            overflow: "none",
          }}
        >
          <div sx={{ gridRow: 1, gridColumn: "1/-1", marginBottom: 2 }}>
            Bacon ipsum dolor amet short loin spare ribs alcatra, fatback rump
            ribeye cupim sirloin drumstick picanha shankle pork chop strip
            steak. Ground round filet mignon fatback pork biltong ball tip,
            tenderloin cow bacon. Short ribs salami andouille, pastrami buffalo
            bacon venison.
          </div>
          <div sx={{ ...boxStyles }}>1</div>
          <div
            sx={{
              ...boxStyles,
              position: "sticky",
              backgroundColor: "primary",
              top: `${top}px`,
            }}
          >
            2
          </div>
          <div sx={{ ...boxStyles }}>3</div>
          <div sx={{ gridColumn: "1/-1", marginTop: 2 }}>
            Ham short loin sausage jowl tail chicken. Spare ribs short ribs
            buffalo sausage pig jerky jowl turducken shankle tail drumstick
            pork. Spare ribs beef ribs jerky filet mignon tri-tip turkey,
            capicola meatloaf meatball shank tenderloin cupim chicken. Pastrami
            turkey leberkas t-bone, tenderloin burgdoggen tri-tip bacon picanha
            short loin flank bresaola chicken. Boudin bacon turducken pork loin
            pancetta, ham shoulder pork strip steak chislic sirloin jerky. Rump
            shoulder venison, strip steak t-bone shankle kielbasa beef boudin
            cupim ham jerky picanha landjaeger tail. Turducken drumstick brisket
            salami, frankfurter ham hock spare ribs short ribs chislic tongue
            pork belly landjaeger andouille pancetta chicken. Ribeye turkey
            kevin boudin, doner swine pork belly ham chuck. Ham porchetta ham
            hock, tail drumstick kevin sausage jowl biltong chuck landjaeger
            bresaola hamburger. Pork ball tip frankfurter salami short ribs.
            Landjaeger pork belly boudin flank. Pork drumstick filet mignon,
            chislic bacon frankfurter ball tip venison corned beef alcatra
            shoulder beef sirloin spare ribs sausage. Ball tip hamburger chislic
            boudin chicken t-bone tail tri-tip landjaeger ham andouille
            turducken. Short ribs burgdoggen turducken chicken, pig t-bone rump
            biltong shankle picanha alcatra pork chop. Filet mignon chicken
            tongue, tri-tip pastrami ball tip shank porchetta. Jowl boudin
            fatback turducken corned beef pig frankfurter flank short ribs
            sausage meatloaf brisket ground round bresaola swine. Pancetta
            biltong drumstick, ribeye spare ribs capicola leberkas ground round.
            Ball tip buffalo porchetta short loin picanha drumstick bacon
            bresaola. Spare ribs venison landjaeger biltong meatball short ribs.
            Frankfurter jerky kielbasa ham hock burgdoggen pork ground round
            pork chop turkey ribeye ball tip brisket sausage bresaola alcatra.
            Leberkas t-bone tongue, alcatra rump shoulder buffalo short ribs
            swine pancetta beef ham. Chislic hamburger ribeye, ham capicola
            meatloaf shankle. Pork loin leberkas frankfurter pastrami, beef ribs
            biltong picanha alcatra pork belly turducken kevin ribeye turkey
            shankle. Tail shoulder beef burgdoggen, picanha jowl pastrami
            porchetta spare ribs. Shank ham picanha shoulder t-bone spare ribs.
            Chicken prosciutto alcatra kielbasa bresaola. Biltong picanha shank
            tongue short loin landjaeger kevin short ribs pork loin cupim
            shoulder meatball buffalo porchetta. Chislic t-bone landjaeger, ham
            cupim turducken cow bacon.
          </div>
        </div>
      </div>
      <div
        sx={{
          display: "grid",
          // make sure the controls are above the boxes
          position: "relative",
          backgroundColor: alpha("background", 0.5),
          backdropFilter: "blur(5px)",
          gap: 3,
          gridTemplateColumns: ["1fr", null, "1fr 1fr"],
        }}
      >
        <Slider
          passedSx={{ mt: 3 }}
          labelText="top"
          idPrepend="sticky"
          val={top}
          setVal={setTop}
        />
      </div>
      <CodeBlock className="language-css" title="styles.css">
        {codeStr}
      </CodeBlock>
    </div>
  );
};

export { AbsoluteChart, RelativeDemo, AbsoluteDemo, StickyDemo };
