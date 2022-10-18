/** @jsx jsx */
import { jsx } from "theme-ui";
import { MathBlock } from "./MathBlock";

const Div = ({ className, children, ...rest }) => {
  if (className.includes(`math-display`)) {
    const validProps = [`title`];
    let math = children;
    let metaString = null;

    // check if the first line was a metaString
    const [firstLine, ...restOfLines] = children.split(`\n`);
    if (validProps.some((propName) => firstLine.includes(propName))) {
      math = restOfLines.join(`\n`);
      metaString = firstLine;
    }

    const metaObj =
      metaString &&
      metaString.split(` `).reduce((acc, cur) => {
        if (cur.split(`=`).length > 1) {
          const [key, value] = cur.split(`=`);
          acc[key] = value;
          return acc;
        }
        acc[cur] = true;
        return acc;
      }, {});

    return <MathBlock {...metaObj} math={math} {...rest} />;
  }
  return (
    <div className={className} {...rest}>
      {children}
    </div>
  );
};

export { Div };
