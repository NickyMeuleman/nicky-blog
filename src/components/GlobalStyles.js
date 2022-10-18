import { Global } from "@emotion/react";
import "typeface-source-sans-pro";

const GlobalStyles = () => (
  <Global
    styles={{
      html: {
        fontSize: `1.25rem`,
      },
    }}
  />
);

export { GlobalStyles };
