import React from "react";
import { Global } from "@emotion/core";
import "typeface-source-sans-pro";

const GlobalStyles = () => (
  <Global
    styles={{
      html: {
        fontSize: "1.25rem",
      },
    }}
  />
);

export default GlobalStyles;
