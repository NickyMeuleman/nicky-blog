// TODO: get this code into the CodeBlock component of @nickymeuleman/gatsby-theme-blog

// imported from @nickymeuleman/gatsby-theme-blog
// eslint-disable-next-line import/no-extraneous-dependencies
import Prism from "prism-react-renderer/prism";

(typeof global !== "undefined" ? global : window).Prism = Prism;

// adding the entirety of prismjs to get at one file feels dirty
require("prismjs/components/prism-rust");
