/* eslint-disable no-bitwise, no-continue, react-hooks/exhaustive-deps */
/** @jsx jsx */
import { jsx } from "theme-ui";
import React, { useState, useEffect, useRef } from "react";
import { keyframes } from "@emotion/react";

const Button = ({ children, ...props }) => {
  return (
    <button
      type="button"
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

const WebWorkerDemo = () => {
  const jsBar = useRef(null);
  const animationContainer = useRef(null);
  const [animationContainerWidth, setAnimationContainerWidth] = useState(0);
  const [countWorker, setCountWorker] = useState(null);
  const [count, setCount] = useState(0);
  const [helloWorker, setHelloWorker] = useState(null);
  const [adele, setAdele] = useState("Quiet...");

  useEffect(() => {
    const worker = new Worker(new URL("./worker.js", import.meta.url), {
      name: "helloWorker2",
      type: "module",
    });

    let audio;
    async function getSound() {
      const soundModule = await import(`./other-side.mp3`);
      const path = soundModule.default;
      audio = new Audio(path);
      audio.addEventListener("ended", () => {
        setAdele("Quiet...");
      });
    }

    worker.addEventListener("message", () => {
      audio.play();
      setAdele("HELLO FROM THE OTHER SIIIIIIDE");
    });

    getSound();
    setHelloWorker(worker);
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

  useEffect(() => {
    if (jsBar.current) {
      const jsBarFrames = [
        { transform: "translateX(0px)" },
        {
          transform: `translateX(${
            animationContainerWidth ? animationContainerWidth - 25 : 180
          }px)`,
        },
        { transform: "translateX(0px)" },
      ];

      const jsBarTiming = {
        duration: 4000,
        iterations: Infinity,
      };

      jsBar.current.animate(jsBarFrames, jsBarTiming);
    }
  }, [jsBar.current]);

  useEffect(() => {
    if (animationContainer.current) {
      setAnimationContainerWidth(animationContainer.current.offsetWidth);
    }
  }, [animationContainer.current]);

  const slide = keyframes({
    "0%": {
      transform: "translateX(0px)",
    },
    "50%": {
      transform: `translateX(${`${
        animationContainerWidth ? animationContainerWidth - 25 : 180
      }px`})`,
    },
    "100%": {
      transform: "translateX(0px)",
    },
  });

  return (
    <React.Fragment>
      <DemoArea
        title="input area"
        internalSx={{
          gridTemplateColumns: ["1fr", null, null, "1fr 1fr"],
        }}
      >
        <Input title="Sync">
          <Button
            type="button"
            onClick={() => {
              const startTime = Date.now();
              let currCount = 0;

              while (Date.now() < startTime + 2500) {
                currCount += 1;
                if (currCount % 50_000 === 0) {
                  setCount(currCount);
                }
              }

              setCount(currCount);
            }}
          >
            Start counting
          </Button>
        </Input>
        <Input title="Async">
          <Button
            type="button"
            onClick={async () => {
              const countPromise = new Promise((resolve, reject) => {
                const startTime = Date.now();
                let currCount = 0;

                while (Date.now() < startTime + 2500) {
                  currCount += 1;
                  if (currCount % 50_000 === 0) {
                    setCount(currCount);
                  }
                }

                resolve(currCount);
              });

              const finalCount = await countPromise;
              setCount(finalCount);
            }}
          >
            Start counting
          </Button>
        </Input>
        <Input title="Web Worker">
          <Button
            type="button"
            onClick={() => {
              countWorker.postMessage("go");
            }}
          >
            Start counting
          </Button>
        </Input>
        <Input title="Web Worker">
          <Button
            type="button"
            onClick={() => {
              helloWorker.postMessage("");
            }}
          >
            Call Adele
          </Button>
        </Input>
      </DemoArea>
      <DemoArea
        title="output area"
        internalSx={{
          gridTemplateColumns: ["1fr", null, null, "1fr 1fr"],
        }}
      >
        <Output title="CSS animation">
          <div
            ref={animationContainer}
            sx={{ backgroundColor: "mutedBackground" }}
          >
            <div
              sx={{
                height: 4,
                width: "25px",
                backgroundColor: "primary",
                animation: `${slide} 4s linear infinite`,
              }}
            />
          </div>
        </Output>
        <Output title="JS animation">
          <div sx={{ backgroundColor: "mutedBackground" }}>
            <div
              ref={jsBar}
              sx={{
                height: 4,
                width: 5,
                backgroundColor: "primary",
              }}
            />
          </div>
        </Output>
        <Output title="count">{count}</Output>
        <Output title="Adele">{adele}</Output>
      </DemoArea>
    </React.Fragment>
  );
};

export { WebWorkerDemo };
