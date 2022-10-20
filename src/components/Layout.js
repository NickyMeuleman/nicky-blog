/** @jsx jsx */
import { jsx, Box } from "theme-ui";
import { Main } from "@nickymeuleman/gatsby-theme-blog";
import { GlobalStyles } from "./GlobalStyles";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { MDXProvider } from "@mdx-js/react";
import { Aside } from "./Aside";
import { Div } from "./Div";
import { Span } from "./Span";
import { BlockQuote } from "./BlockQuote";
import { CodeBlock } from "@nickymeuleman/gatsby-theme-blog";

const preToCodeBlock = (preProps) => {
  if (preProps?.children?.props) {
    const {
      children: codeString,
      className = ``,
      ...props
    } = preProps.children.props;
    const match = className.match(/language-([\0-\uFFFF]*)/);

    return {
      codeString: codeString.trim(),
      className: className,
      language: match !== null ? match[1] : ``,
      ...props,
    };
  }

  return undefined;
};

const mdxComponents = {
  Aside,
  div: Div,
  span: Span,
  blockquote: BlockQuote,
  pre: (preProps) => {
    const props = preToCodeBlock(preProps);
    // if there's a codeString and some props, we passed the test
    if (props) {
      return <CodeBlock {...props} />;
    }
    // it's possible to have a pre without a code in it
    return <pre {...preProps} />;
  },
};

const Layout = ({ children, ...props }) => (
  <MDXProvider components={mdxComponents}>
    <Box
      sx={{
        minHeight: `100vh`,
        display: `flex`,
        flexDirection: `column`,
        variant: `styles.Layout`,
      }}
    >
      <GlobalStyles />
      <Header {...props} />
      <Main {...props}>{children}</Main>
      <Footer {...props} />
    </Box>
  </MDXProvider>
);

export { Layout };
