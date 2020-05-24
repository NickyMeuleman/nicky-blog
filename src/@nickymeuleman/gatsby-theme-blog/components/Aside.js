/** @jsx jsx */
import { jsx } from "theme-ui";
import { alpha } from "@theme-ui/color";

const Aside = ({ variant = "default", children }) => {
  const variantStyles = {
    default: {
      borderLeftColor: `primary`,
      backgroundColor: alpha(`primary`, 0.07),
    },
    info: {
      borderLeftColor: `info`,
      backgroundColor: alpha(`info`, 0.07),
      "::before": {
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        content: '"i"',
        position: "absolute",
        width: "35px",
        height: "35px",
        top: "0",
        left: "0",
        transform: "translateX(-50%) translateY(-25%)",
        backgroundColor: "info",
        color: "background",
        fontStyle: "normal",
        fontWeight: "700",
        fontSize: 2,
        borderRadius: "50%",
      },
    },
    danger: {
      borderLeftColor: `danger`,
      backgroundColor: alpha(`danger`, 0.07),
      "::before": {
        display: "inline-flex",
        justifyContent: "center",
        textAlign: "center",
        content: '"!"',
        position: "absolute",
        width: "35px",
        height: "35px",
        top: "0",
        left: "0",
        transform: "translateX(-50%) translateY(-25%)",
        backgroundColor: "danger",
        color: "background",
        fontStyle: "normal",
        fontWeight: "700",
        fontSize: 2,
        clipPath: "polygon(50% 0,0 100%,100% 100%)",
      },
    },
    success: {
      borderLeftColor: `success`,
      backgroundColor: alpha(`success`, 0.07),
      "::before": {
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        content: '"\\2713"',
        position: "absolute",
        width: "35px",
        height: "35px",
        top: "0",
        left: "0",
        transform: "translateX(-50%) translateY(-25%)",
        backgroundColor: "success",
        color: "background",
        fontStyle: "normal",
        fontWeight: "700",
        fontSize: 2,
        borderRadius: "50%",
      },
    },
  };
  return (
    <aside
      sx={{
        position: "relative",
        borderLeft: `3px solid`,
        borderTopRightRadius: `default`,
        borderBottomRightRadius: `default`,
        fontStyle: `italic`,
        mt: 3,
        px: 3,
        py: 3,
        "em, strong": {
          color: `inherit`,
        },
        ...variantStyles[variant],
        variant: `styles.Aside`,
      }}
    >
      {children}
    </aside>
  );
};

export { Aside };
