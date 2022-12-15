/** @jsx jsx */
import React, { useState, useEffect, useRef } from "react";
import { graphql } from "gatsby";
import { jsx } from "theme-ui";
import { alpha } from "@theme-ui/color";
import { keyframes } from "@emotion/react";
import { useMachine } from "@xstate/react";
import { SEO } from "../components/SEO";
import { Layout } from "../components/Layout";
import { aoc2022Machine } from "../machines/aoc2022";

const ellipsis = keyframes({ to: { width: `3ch` } });
const inAnimation = keyframes({
  "0%": {
    opacity: 0,
  },
  "100%": {
    opacity: 1,
  },
});
const outAnimation = keyframes({
  "0%": {
    opacity: 1,
  },
  "100%": {
    opacity: 0,
  },
});

const DemoArea = ({ title, children }) => {
  return (
    <div
      sx={{
        border: `1px solid`,
        borderColor: `watermarkBg`,
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
          color: `mutedTextBg`,
          fontSize: 1,
        }}
      >
        {title}
      </p>
      <div
        sx={{
          display: `grid`,
          gridTemplateColumns: `repeat( auto-fit, minmax(260px, 1fr) )`,
          gap: 3,
        }}
      >
        {children}
      </div>
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

const Input = ({ title, children }) => {
  return (
    <div>
      <label>
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
      </label>
    </div>
  );
};

const Solution = ({ val }) => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(val);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };
  return (
    <button
      onClick={copy}
      type="button"
      sx={{
        fontSize: 1,
        cursor: `pointer`,
        px: 2,
        // horizontally visually align the text inside the button with the text above the button
        mx: -2,
        py: 1,
        backgroundColor: `transparent`,
        color: `text`,
        borderWidth: `1px`,
        borderRadius: `sm`,
        borderColor: `transparent`,
        display: `flex`,
        alignItems: `center`,
        justifyContent: `space-between`,
        width: `100%`,
        transition: `border-color ease 0.3s`,
        svg: {
          opacity: 0,
          fill: `mutedText`,
          transition: `opacity ease 0.3s`,
          "&:hover": {
            opacity: 1,
          },
        },
        ":hover": {
          borderColor: `mutedText`,
          svg: {
            opacity: 1,
          },
        },
        // reset default button styles
        borderStyle: `solid`,
      }}
    >
      <span sx={{ mr: 2 }}> {copied ? `Copied` : val}</span>
      <svg
        width="24"
        height="25"
        viewBox="0 0 24 25"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M18 20h2v3c0 1-1 2-2 2H2c-.998 0-2-1-2-2V5c0-.911.755-1.667 1.667-1.667h5A3.323 3.323 0 0110 0a3.323 3.323 0 013.333 3.333h5C19.245 3.333 20 4.09 20 5v8.333h-2V9H2v14h16v-3zM3 7h14c0-.911-.793-1.667-1.75-1.667H13.5c-.957 0-1.75-.755-1.75-1.666C11.75 2.755 10.957 2 10 2s-1.75.755-1.75 1.667c0 .911-.793 1.666-1.75 1.666H4.75C3.793 5.333 3 6.09 3 7z" />
        <path d="M4 19h6v2H4zM12 11H4v2h8zM4 17h4v-2H4zM15 15v-3l-4.5 4.5L15 21v-3l8.027-.032L23 15z" />
      </svg>
    </button>
  );
};

function getExectionText(executionState) {
  if (executionState === `Calculating`) {
    return (
      <span
        sx={{
          ":after": {
            overflow: `hidden`,
            display: `inline-block`,
            verticalAlign: `bottom`,
            animation: `${ellipsis} steps(4,end) 2s infinite`,
            content: `"\\2026"` /* ascii code for the ellipsis character */,
            width: `0px`,
          },
        }}
      >
        {executionState}
      </span>
    );
  }
  if (executionState.includes(`ms`)) {
    return executionState;
  }
  return `Nothing calculating yet`;
}

function getCodeLink(day) {
  const padded = String(day).padStart(2, `0`);
  return `https://github.com/NickyMeuleman/scrapyard/blob/main/advent_of_code/2022/src/day_${padded}.rs`;
}

const AoC2022Solver = ({ data }) => {
  console.log(`aoc2022 page loaded`);
  const [state, send] = useMachine(aoc2022Machine);
  const fileInputRef = useRef(null);
  console.log(state.value);
  useEffect(() => {
    send({
      type: `setFileInputRef`,
      fileInputRef,
    });
  }, [send]);
  return (
    <Layout>
      <SEO
        title="Advent of Code 2022 solver"
        image={data.file.childImageSharp.original.src}
        slug="aoc2022-solver"
        twitterHandle="NMeuleman"
        description="Choose a day, choose an input file, get the answers!"
      />
      <div
        sx={{
          display: `flex`,
          maxWidth: `60ch`,
          margin: `auto`,
          gap: 2,
          flexWrap: `wrap`,
          my: 4,
          justifyContent: `center`,
        }}
      >
        <DemoArea title="Input area">
          <Input title="Day">
            <select
              sx={{ fontSize: 1 }}
              disabled={state.matches({ withWorker: `setup` })}
              value={state.context.day}
              onChange={(evt) => {
                send(`chooseDay`, { day: evt.target.value });
              }}
            >
              <option key="default" value="default">
                Pick a day
              </option>
              {Array(14)
                .fill()
                .map((_, idx) => {
                  return <option key={`day-${idx + 1}`}>{idx + 1}</option>;
                })}
            </select>
          </Input>
          <Input title="Input File">
            <input
              sx={{ fontSize: 1, width: `100%` }}
              ref={fileInputRef}
              type="file"
              disabled={state.matches({ withWorker: `setup` })}
              onChange={(evt) => {
                send(`chooseFile`, { file: evt.target.files[0] });
              }}
            />
          </Input>
        </DemoArea>
        <DemoArea title="Output area">
          <Output title={`Day ${state.context.day} code`}>
            <a
              href={getCodeLink(state.context.day)}
              sx={{ variant: `styles.a` }}
            >
              Rust
            </a>
          </Output>
          <Output title="Time to calculate">
            {getExectionText(state.context.calculationStatus)}
          </Output>
          {state.context.renderError ? (
            <Output
              title="Error"
              passedSx={{
                gridColumn: `1/-1`,
                gridRow: `2/3`,
                animation: `${
                  state.matches({ withWorker: `withError` })
                    ? `${inAnimation} 300ms ease-in`
                    : `${outAnimation} 300ms ease-in`
                }`,
              }}
              onAnimationEnd={() => {
                if (!state.matches({ withWorker: `withError` })) {
                  send(`errorAnimatedOut`);
                }
              }}
            >
              <div sx={{ color: alpha(`danger`, 0.9) }}>
                {state.context.errorStatus?.day ? (
                  <React.Fragment>
                    <p>
                      Failed to calculate day {state.context.errorStatus.day}
                      {` `}
                      with the current input file. Please make sure the selected
                      day and input match.
                    </p>
                    <p>
                      Files have to use UNIX style line endings (LF, not CRLF)
                      for this tool to work correctly. The default if you
                      download an input file from the advent of code website is
                      correct.
                    </p>
                  </React.Fragment>
                ) : (
                  <p>
                    There was an error reading the &quot;
                    {state.context.errorStatus.fileName}&quot; file.
                  </p>
                )}
              </div>
            </Output>
          ) : null}
          {state.context.renderSolution ? (
            <React.Fragment>
              <Output
                title="Part 1 solution"
                passedSx={{
                  gridColumn: `1/2`,
                  gridRow: `2/3`,
                  animation: `${
                    state.matches({ withWorker: `withSolution` })
                      ? `${inAnimation} 300ms ease-in`
                      : `${outAnimation} 300ms ease-in`
                  }`,
                }}
                onAnimationEnd={() => {
                  if (!state.matches({ withWorker: `withSolution` })) {
                    // both solutions are animated out at the same time and should have the same animation duration
                    send(`solutionAnimatedOut`);
                  }
                }}
              >
                <Solution val={state.context.solutions.part1} />
              </Output>

              <Output
                title="Part 2 solution"
                passedSx={{
                  gridColumn: `2/3`,
                  gridRow: `2/3`,
                  animation: `${
                    state.matches({ withWorker: `withSolution` })
                      ? `${inAnimation} 300ms ease-in`
                      : `${outAnimation} 300ms ease-in`
                  }`,
                }}
              >
                <Solution val={state.context.solutions.part2} />
              </Output>
            </React.Fragment>
          ) : null}
        </DemoArea>
      </div>
    </Layout>
  );
};

export const aoc2021Query = graphql`
  query aoc2021Query {
    file(name: { regex: "/aoc2022/" }) {
      childImageSharp {
        original {
          src
        }
      }
    }
  }
`;

export default AoC2022Solver;
