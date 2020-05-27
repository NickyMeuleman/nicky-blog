/** @jsx jsx */
import { jsx } from "theme-ui";
import { alpha } from "@theme-ui/color";

const BlockQuote = ({ children }) => {
  return (
    <blockquote
      sx={{
        position: "relative",
        borderLeft: `3px solid`,
        borderLeftColor: "mutedBackground",
        backgroundColor: alpha("mutedBackground", 0.07),
        borderTopRightRadius: `default`,
        borderBottomRightRadius: `default`,
        fontStyle: `italic`,
        m: 0,
        mt: 3,
        px: 3,
        py: 3,
        fontSize: 2,
        "em, strong": {
          color: `inherit`,
        },
        "p:first-of-type": { mt: 0 },
        "p:only-child": { m: 0 },
        "::before": {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          content: '"\\0201C"',
          position: "absolute",
          width: "35px",
          height: "35px",
          top: "0",
          left: "0",
          transform: "translateX(-50%) translateY(-25%)",
          // center the quotationmark, thanks @jh3yy
          fontVariant: "all-small-caps",
          backgroundColor: "mutedBackground",
          color: "mutedText",
          fontStyle: "normal",
          fontWeight: "700",
          fontSize: 5,
          borderRadius: "50%",
        },
        footer: {
          fontSize: 1,
          fontWeight: "bold",
          fontStyle: "normal",
          "::before": {
            // make sure mdash is on same line as footer
            float: "left",
            content: "'\\02014\\000A0' ",
          },
        },
      }}
    >
      {children}
    </blockquote>
  );
};

export { BlockQuote };
