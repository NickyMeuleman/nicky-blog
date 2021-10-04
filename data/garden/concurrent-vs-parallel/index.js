/** @jsx jsx */
import { jsx } from "theme-ui";
import { alpha } from "@theme-ui/color";
import React from "react";

const DemoBase = ({ children }) => {
  return (
    <div
      sx={{
        position: "relative",
        overflow: "hidden",
        ":hover": {
          ".line": {
            left: "100%",
            transform: "translateX(100%)",
          },
        },
      }}
    >
      <div
        className="line"
        sx={{
          position: "absolute",
          width: "10px",
          height: "100%",
          backgroundColor: "primary",
          left: 0,
          transform: "translateX(-100%)",
          transition: "left 4s linear",
          opacity: 0.3,
        }}
      />
      {children}
    </div>
  );
};

const Core = ({ children }) => {
  return (
    <React.Fragment>
      <p
        sx={{
          position: "relative",
          m: 0,
          p: 0,
          backgroundColor: "background",
          textTransform: "uppercase",
          letterSpacing: 1,
          fontWeight: 700,
          color: "mutedTextBg",
        }}
      >
        Core
      </p>
      <div
        className="core"
        sx={{
          p: 1,
          border: "5px solid ",
          borderColor: alpha("mutedTextBg", 0.2),
        }}
      >
        {children}
      </div>
    </React.Fragment>
  );
};

const Thread = ({ children }) => {
  return (
    <React.Fragment>
      <p
        sx={{
          position: "relative",
          m: 0,
          p: 0,
          textTransform: "uppercase",
          letterSpacing: 1,
          fontWeight: 700,
          color: "mutedPrimary",
        }}
      >
        Thread
      </p>
      <div
        className="thread"
        sx={{
          position: "relative",
          display: "flex",
          gap: 1,
          p: 1,
          border: "5px solid",
          textAlign: "center",
          borderColor: alpha("mutedPrimary", 0.2),
        }}
      >
        {children}
      </div>
    </React.Fragment>
  );
};

const Sequential = () => {
  return (
    <DemoBase>
      <Core>
        <Thread>
          <div sx={{ flex: 1, border: "2px solid rgba(0, 0, 0, 0.3)" }}>
            TASK 1
          </div>
          <div sx={{ flex: 1, border: "2px solid rgba(0, 0, 0, 0.3)" }}>
            TASK 2
          </div>
          <div sx={{ flex: 1, border: "2px solid rgba(0, 0, 0, 0.3)" }}>
            TASK 3
          </div>
        </Thread>
      </Core>
    </DemoBase>
  );
};

const Concurrent = () => {
  return (
    <DemoBase>
      <Core>
        <Thread>
          <div sx={{ flex: 1, border: "2px solid rgba(0, 0, 0, 0.3)" }}>
            TASK 1
          </div>
          <div sx={{ flex: 1, border: "2px solid rgba(0, 0, 0, 0.3)" }} />
          <div sx={{ flex: 1, border: "2px solid rgba(0, 0, 0, 0.3)" }}>
            TASK 3
          </div>
        </Thread>
        <Thread>
          <div sx={{ flex: 1, border: "2px solid rgba(0, 0, 0, 0.3)" }} />
          <div sx={{ flex: 1, border: "2px solid rgba(0, 0, 0, 0.3)" }}>
            TASK 2
          </div>
          <div sx={{ flex: 1, border: "2px solid rgba(0, 0, 0, 0.3)" }} />
        </Thread>
      </Core>
    </DemoBase>
  );
};

const Parallel = () => (
  <DemoBase>
    <Core>
      <Thread>
        <div sx={{ flex: 1, border: "2px solid rgba(0, 0, 0, 0.3)" }}>
          TASK 1
        </div>
        <div sx={{ flex: 1, border: "2px solid rgba(0, 0, 0, 0.3)" }}>
          TASK 2
        </div>
        <div sx={{ flex: 1, border: "2px solid rgba(0, 0, 0, 0.3)" }}>
          TASK 3
        </div>
      </Thread>
    </Core>
    <Core>
      <Thread>
        <div sx={{ flex: 1, border: "2px solid rgba(0, 0, 0, 0.3)" }}>
          TASK 4
        </div>
        <div sx={{ flex: 1, border: "2px solid rgba(0, 0, 0, 0.3)" }}>
          TASK 5
        </div>
        <div sx={{ flex: 1, border: "2px solid rgba(0, 0, 0, 0.3)" }}>
          TASK 6
        </div>
      </Thread>
    </Core>
  </DemoBase>
);

const Both = () => (
  <DemoBase>
    <Core>
      <Thread>
        <div sx={{ flex: 1, border: "2px solid rgba(0, 0, 0, 0.3)" }}>
          TASK 1
        </div>
        <div sx={{ flex: 1, border: "2px solid rgba(0, 0, 0, 0.3)" }}>
          TASK 2
        </div>
        <div sx={{ flex: 1, border: "2px solid rgba(0, 0, 0, 0.3)" }} />
      </Thread>
      <Thread>
        <div sx={{ flex: 1, border: "2px solid rgba(0, 0, 0, 0.3)" }} />
        <div sx={{ flex: 1, border: "2px solid rgba(0, 0, 0, 0.3)" }} />
        <div sx={{ flex: 1, border: "2px solid rgba(0, 0, 0, 0.3)" }}>
          TASK 3
        </div>
      </Thread>
    </Core>
    <Core>
      <Thread>
        <div sx={{ flex: 1, border: "2px solid rgba(0, 0, 0, 0.3)" }}>
          TASK 4
        </div>
        <div sx={{ flex: 1, border: "2px solid rgba(0, 0, 0, 0.3)" }} />
        <div sx={{ flex: 1, border: "2px solid rgba(0, 0, 0, 0.3)" }}>
          TASK 6
        </div>
      </Thread>
      <Thread>
        <div sx={{ flex: 1, border: "2px solid rgba(0, 0, 0, 0.3)" }} />
        <div sx={{ flex: 1, border: "2px solid rgba(0, 0, 0, 0.3)" }}>
          TASK 5
        </div>
        <div sx={{ flex: 1, border: "2px solid rgba(0, 0, 0, 0.3)" }} />
      </Thread>
    </Core>
  </DemoBase>
);

export { Sequential, Concurrent, Parallel, Both };
