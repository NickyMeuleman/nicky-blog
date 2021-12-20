/* eslint-disable jsx-a11y/label-has-associated-control */
/** @jsx jsx */
import { useState, useEffect } from "react";
import { graphql } from "gatsby";
import { jsx } from "theme-ui";
import { SEO } from "../components/SEO";
import { Layout } from "../components/Layout";

const DemoArea = ({ title, passedSx, children }) => {
  return (
    <div
      sx={{
        border: `1px solid`,
        borderColor: "watermarkBg",
        padding: 3,
        mb: 2,
        ...passedSx,
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

const Output = ({ title, value }) => {
  return (
    <div>
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
      {value}
    </div>
  );
};

const AoC2021SolverPage = ({ data }) => {
  const [, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [codeLink, setCodeLink] = useState(
    "https://github.com/NickyMeuleman/scrapyard/blob/main/advent_of_code/2021/day_01/src/main.rs"
  );
  const [wasm, setWasm] = useState(null);
  const [day, setDay] = useState(1);
  const [solutions, setSolutions] = useState({ part1: null, part2: null });
  const [executionTime, setExecutionTime] = useState(null);

  const loadWasm = async () => {
    // TODO: this concat stuff isn't needed anymore I think
    try {
      /* eslint no-useless-concat: "off" */
      const wasmModule = await import(
        "@nickymeuleman/aoc2021" + "/aoc2021_bg.js"
      );
      setWasm(wasmModule);
      setLoading(false);
    } catch (err) {
      // console.error(`Unexpected error in loadWasm. [Message: ${err.message}]`);
    }
  };

  // load WASM and JS glue
  useEffect(() => {
    loadWasm();
  }, []);

  // clear execution time and solutions every time a day changes
  useEffect(() => {
    setExecutionTime(null);
    setSolutions({ part1: null, part2: null });
  }, [day]);

  let displayExecutionTime = "Nothing calculating yet";
  // hello boolean value state explosion, how do you do?
  if (calculating) {
    displayExecutionTime = "Calculating...";
  } else if (executionTime) {
    displayExecutionTime = `${executionTime} ms`;
  }

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
        <DemoArea title="Input area" passedSx={{ flex: 1 }}>
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
                Day
              </p>
              <select
                name="days"
                value={day}
                onChange={(e) => {
                  const newDay = Number(e.target.value);
                  let dayPart = "day_01";
                  if (newDay < 10) {
                    dayPart = `day_0${newDay}`;
                  } else {
                    dayPart = `day_${newDay}`;
                  }
                  const newLink = `https://github.com/NickyMeuleman/scrapyard/blob/main/advent_of_code/2021/${dayPart}/src/main.rs`;
                  setCodeLink(newLink);
                  setDay(newDay);
                }}
                sx={{ fontSize: 1 }}
              >
                {Array(20)
                  .fill()
                  .map((_, idx) => {
                    return <option>{idx + 1}</option>;
                  })}
              </select>
            </label>
          </div>
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
                Input file
              </p>
              <input
                type="file"
                onChange={(e) => {
                  const chosenFile = e.target.files[0];

                  // can error if file doesn't exist

                  setCalculating(true);

                  const reader = new FileReader();

                  reader.addEventListener(
                    "load",
                    () => {
                      const input = reader.result;
                      if (wasm) {
                        // can error if input isn't in the correct format
                        // choosing an image will make it explode for instance
                        // this is fine, but TODO: display error of "invalid input file" to user
                        const startTime = performance.now();
                        const result = wasm.solve(day, input);
                        const [part1, part2] = result.split(",");
                        // call into rust with the day state, and set the result states
                        setSolutions({
                          part1,
                          part2,
                        });
                        const elapsed = performance.now() - startTime;
                        setExecutionTime(elapsed.toFixed(3));
                        setCalculating(false);
                      }
                    },
                    false
                  );

                  if (chosenFile) {
                    reader.readAsText(chosenFile);
                  }
                }}
                sx={{ fontSize: 1, width: "100%" }}
              />
            </label>
          </div>
        </DemoArea>
        <DemoArea title="Output area" passedSx={{ flex: 1 }}>
          <Output
            title={`Day ${day} code`}
            value={
              <a href={codeLink} sx={{ variant: "styles.a" }}>
                Rust
              </a>
            }
          />
          <Output title="Time to calculate" value={displayExecutionTime} />
          <Output
            title="Part 1 solution"
            value={
              solutions.part1 ? (
                <Solution val={solutions.part1} />
              ) : (
                <Solution val="..." />
              )
            }
          />
          <Output
            title="Part 2 solution"
            value={
              solutions.part2 ? (
                <Solution val={solutions.part2} />
              ) : (
                <Solution val="..." />
              )
            }
          />
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
