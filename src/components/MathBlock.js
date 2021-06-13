/** @jsx jsx */
import React from "react";
import { jsx } from "theme-ui";
import "katex/dist/katex.min.css";
import TeX from "@matejmazur/react-katex";

// Reused CodeBlock styles for the MathBlock, it should look the same
const MathBlock = ({ title, children, math }) => {
  return (
    <React.Fragment>
      {title && <div sx={{ variant: `styles.CodeBlock.title` }}>{title}</div>}
      <TeX
        block
        sx={{
          variant: `styles.CodeBlock`,
          borderTopLeftRadius: title ? `0` : undefined,
          borderTopRightRadius: title ? `0` : undefined,
          ".newline": {
            height: 3,
          },
        }}
        math={math}
      >
        {/*
            either use the math prop or the children prop. So children can be undefined.
            if children exists, extra whitespace is required around them so it's not a string but an object,
            the string with the raw katex will be inside children.props.children 
          */}
        {children?.props?.children}
      </TeX>
    </React.Fragment>
  );
};

export { MathBlock };
