/** @jsx jsx */
import { jsx } from "theme-ui";
import { MathBlock } from "./MathBlock";

const Div = ({ className, children, ...rest }) => {
  if (className?.includes(`math-display`)) {
    return <MathBlock math={children} {...rest} />;
  }
  return (
    <div className={className} {...rest}>
      {children}
    </div>
  );
};

export { Div };
