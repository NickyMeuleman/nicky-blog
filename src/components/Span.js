/** @jsx jsx */
import { jsx } from "theme-ui";
import TeX from "@matejmazur/react-katex";

const Span = ({ className, children, ...rest }) => {
  if (className.includes("math-inline")) {
    import("katex/dist/katex.min.css");
    return (
      <TeX className={className} {...rest}>
        {children}
      </TeX>
    );
  }
  return (
    <span className={className} {...rest}>
      {children}
    </span>
  );
};

export { Span };
