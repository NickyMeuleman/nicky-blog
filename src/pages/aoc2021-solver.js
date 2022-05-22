/* eslint-disable jsx-a11y/label-has-associated-control */
/** @jsx jsx */
import React, { useState, useReducer, useEffect, useRef } from "react";
import { graphql } from "gatsby";
import { jsx } from "theme-ui";
import { alpha } from "@theme-ui/color";
import { keyframes } from "@emotion/react";
import { SEO } from "../components/SEO";
import { Layout } from "../components/Layout";

const ellipsis = keyframes({ to: { width: "3ch" } });
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

function useAnimatedUnmount(condition) {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (condition) {
      setShouldRender(true);
    }
  }, [condition]);

  return [shouldRender, setShouldRender];
}

const DemoArea = ({ title, children }) => {
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
          gridTemplateColumns: "repeat( auto-fit, minmax(260px, 1fr) )",
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
        cursor: "pointer",
        px: 2,
        // horizontally visually align the text inside the button with the text above the button
        mx: -2,
        py: 1,
        backgroundColor: "transparent",
        color: "text",
        borderWidth: "1px",
        borderRadius: "sm",
        borderColor: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        transition: "border-color ease 0.3s",
        svg: {
          opacity: 0,
          fill: "mutedText",
          transition: "opacity ease 0.3s",
          "&:hover": {
            opacity: 1,
          },
        },
        ":hover": {
          borderColor: "mutedText",
          svg: {
            opacity: 1,
          },
        },
        // reset default button styles
        borderStyle: "solid",
      }}
    >
      <span sx={{ mr: 2 }}> {copied ? "Copied" : val}</span>
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

function getExectionText(executing, time) {
  if (executing) {
    return (
      <span
        sx={{
          ":after": {
            overflow: "hidden",
            display: "inline-block",
            verticalAlign: "bottom",
            animation: `${ellipsis} steps(4,end) 2s infinite`,
            content: '"\\2026"' /* ascii code for the ellipsis character */,
            width: "0px",
          },
        }}
      >
        Calculating
      </span>
    );
  }
  if (time) {
    return `${time} ms`;
  }
  return "Nothing calculating yet";
}

function getCodeLink(day) {
  const padded = String(day).padStart(2, "0");
  return `https://github.com/NickyMeuleman/scrapyard/blob/main/advent_of_code/2021/src/day_${padded}.rs`;
}

const AoC2021SolverPage = ({ data }) => {
  const fileInputRef = useRef(null);
  const initialState = {
    calculating: false,
    day: 1,
    input: "",
    part1Solution: null,
    part2Solution: null,
    executionTime: null,
    worker: null,
    WASMReady: false,
    error: null,
  };
  function aocReducer(state, action) {
    // I should learn state machines, eh?
    switch (action.type) {
      case "WASMReady": {
        return {
          ...state,
          WASMReady: true,
        };
      }
      case "startCalculating": {
        return {
          ...state,
          calculating: true,
        };
      }
      case "dayInput": {
        // if we're not calculating and there is an executionTime, that means a day has been chosen after a previous calculation
        // wipe the input to prevent starting a new calculation with that mismatched input
        let { input } = state;
        if (state.executionTime && !state.calculating) {
          // reset file input and state with the contents of that file
          fileInputRef.current.value = "";
          input = null;
        }
        return {
          ...state,
          day: action.payload.day,
          input,
          executionTime: null,
          part1Solution: null,
          part2Solution: null,
          error: null,
        };
      }
      case "fileInput": {
        // if we're not calculating and there is an executionTime, that means an input file has been chosen after a previous calculation
        // wipe the day to prevent starting a new calculation with that mismatched day
        return {
          ...state,
          input: action.payload.input,
          day: state.executionTime && !state.calculating ? null : state.day,
          executionTime: null,
          part1Solution: null,
          part2Solution: null,
          error: null,
        };
      }
      case "calculated": {
        return {
          ...state,
          part1Solution: action.payload.part1,
          part2Solution: action.payload.part2,
          calculating: false,
          executionTime: action.payload.executionTime,
        };
      }
      case "setupWorker": {
        return {
          ...state,
          worker: action.payload.worker,
        };
      }
      case "error": {
        return {
          ...state,
          calculating: false,
          error: true,
        };
      }
      default: {
        return state;
      }
    }
  }

  const [state, dispatch] = useReducer(aocReducer, initialState);
  const {
    calculating,
    day,
    input,
    part1Solution,
    part2Solution,
    executionTime,
    worker,
    WASMReady,
    error,
  } = state;
  const [renderError, setRenderError] = useAnimatedUnmount(error);
  const [renderSolution, setRenderSolution] = useAnimatedUnmount(part1Solution);

  // load WASM and JS glue
  useEffect(() => {
    const loadWasm = async () => {
      try {
        const myWorker = new Worker(
          new URL("../utils/worker.js", import.meta.url),
          {
            name: "AoCWorker",
            type: "module",
          }
        );
        myWorker.onmessage = (msg) => {
          switch (msg.data.type) {
            case "ready": {
              dispatch({ type: "WASMReady" });
              break;
            }
            case "solved": {
              dispatch({
                type: "calculated",
                payload: {
                  part1: msg.data.payload.part1,
                  part2: msg.data.payload.part2,
                  executionTime: msg.data.payload.elapsed,
                },
              });
              break;
            }
            case "error": {
              dispatch({ type: "error" });
              break;
            }
            default: {
              break;
            }
          }
        };
        dispatch({ type: "setupWorker", payload: { worker: myWorker } });
      } catch (err) {
        console.error(
          `Unexpected error in loadWasm. [Message: ${err.message}]`
        );
      }
    };
    loadWasm();
  }, []);

  // execute
  useEffect(() => {
    if (WASMReady && day && input && !executionTime) {
      const args = { day, input };
      worker.postMessage(args);
    }
  }, [WASMReady, worker, day, input, executionTime]);

  return (
    <Layout>
      <SEO
        title="Advent of Code 2021 solver"
        image={data.file.childImageSharp.original.src}
        slug="aoc2021-solver"
        twitterHandle="NMeuleman"
        description="Choose a day, choose an input file, get the answers!"
      />
      <div
        sx={{
          display: "flex",
          maxWidth: "60ch",
          margin: "auto",
          gap: 2,
          flexWrap: "wrap",
          my: 4,
          justifyContent: "center",
        }}
      >
        <DemoArea title="Input area">
          <Input title="Day">
            <select
              name="days"
              value={day || "default"}
              onChange={(e) => {
                // the secret sauce to having the execution text update to calculating and not going from idle straight to done
                if (WASMReady && input && !executionTime) {
                  dispatch({ type: "startCalculating" });
                }
                dispatch({
                  type: "dayInput",
                  payload: { day: Number(e.target.value) },
                });
              }}
              sx={{ fontSize: 1 }}
            >
              <option key="default" value="default">
                Pick a day
              </option>
              {Array(25)
                .fill()
                .map((_, idx) => {
                  return <option key={`day-${idx + 1}`}>{idx + 1}</option>;
                })}
            </select>
          </Input>
          <Input title="Input File">
            <input
              ref={fileInputRef}
              type="file"
              onChange={(e) => {
                const chosenFile = e.target.files[0];
                // the secret sauce to having the execution text update to calculating and not going from idle straight to done
                if (WASMReady && day && !executionTime) {
                  dispatch({ type: "startCalculating" });
                }

                const reader = new FileReader();
                reader.addEventListener(
                  "load",
                  async () => {
                    dispatch({
                      type: "fileInput",
                      payload: { input: reader.result },
                    });
                  },
                  false
                );

                if (chosenFile) {
                  reader.readAsText(chosenFile);
                }
              }}
              sx={{ fontSize: 1, width: "100%" }}
            />
          </Input>
        </DemoArea>
        <DemoArea title="Output area">
          <Output title={`Day ${day} code`}>
            <a href={getCodeLink(day)} sx={{ variant: "styles.a" }}>
              Rust
            </a>
          </Output>
          <Output title="Time to calculate">
            {getExectionText(calculating, executionTime)}
          </Output>
          {renderError ? (
            <Output
              title="Error"
              passedSx={{
                gridColumn: "1/-1",
                gridRow: "2/3",
                animation: `${
                  error
                    ? `${inAnimation} 3000ms ease-in`
                    : `${outAnimation} 3000ms ease-in`
                }`,
              }}
              onAnimationEnd={() => {
                if (!error) {
                  setRenderError(false);
                }
              }}
            >
              <div sx={{ color: alpha("danger", 0.9) }}>
                <p>
                  Failed to calculate day {day} with the current input file.
                  Please make sure the selected day and input match.
                </p>
                <p>
                  Files have to use UNIX style line endings (LF, not CRLF) for
                  this tool to work correctly. The default if you download an
                  input file from the advent of code website is correct.
                </p>
              </div>
            </Output>
          ) : null}
          {renderSolution ? (
            <React.Fragment>
              <Output
                title="Part 1 solution"
                passedSx={{
                  gridColumn: "1/2",
                  gridRow: "2/3",
                  animation: `${
                    part1Solution
                      ? `${inAnimation} 3000ms ease-in`
                      : `${outAnimation} 3000ms ease-in`
                  }`,
                }}
                onAnimationEnd={() => {
                  if (!part1Solution) {
                    setRenderSolution(false);
                  }
                }}
              >
                <Solution val={part1Solution} />
              </Output>

              <Output
                title="Part 2 solution"
                passedSx={{
                  gridColumn: "2/3",
                  gridRow: "2/3",
                  animation: `${
                    part2Solution
                      ? `${inAnimation} 3000ms ease-in`
                      : `${outAnimation} 3000ms ease-in`
                  }`,
                }}
                onAnimationEnd={() => {
                  if (!part2Solution) {
                    setRenderSolution(false);
                  }
                }}
              >
                <Solution val={part2Solution} />
              </Output>
            </React.Fragment>
          ) : null}
        </DemoArea>
      </div>
    </Layout>
  );
};

export const aoc2021SolverQuery = graphql`
  query aoc2021SolverQuery {
    file(name: { regex: "/aoc2021/" }) {
      childImageSharp {
        original {
          src
        }
      }
    }
  }
`;

export default AoC2021SolverPage;
