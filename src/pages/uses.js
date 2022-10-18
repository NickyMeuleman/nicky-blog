/** @jsx jsx */
import { jsx } from "theme-ui";
import { Themed } from "@theme-ui/mdx";
import { Link } from "gatsby";
import { Tweet } from "@nickymeuleman/gatsby-theme-blog";
import { SEO } from "../components/SEO";
import { Layout } from "../components/Layout";

const Uses = () => {
  return (
    <Layout>
      <SEO />
      <div
        sx={{
          display: `grid`,
          gridTemplateColumns: `1fr minmax(20ch, 70ch) 1fr`,
        }}
      >
        <div sx={{ gridColumn: `2/3`, py: 5 }}>
          <Themed.h1 sx={{ mt: 0 }}>What I use</Themed.h1>
          <Themed.p>
            My dev computer runs Windows 10 and uses the Windows Subsystem for
            Linux 2.
          </Themed.p>
          <Themed.p>
            <Link
              to="/blog/linux-on-windows-wsl2-zsh-docker/"
              sx={{ variant: `styles.a` }}
            >
              I wrote about how to set it up
            </Link>
            . Starting from scratch and ending with launching a project in
            Docker through a tricked out terminal.
          </Themed.p>
          <Themed.h2>Code Editor</Themed.h2>
          <Themed.p>
            The code editor I spend the most time in is{` `}
            <Themed.a href="https://code.visualstudio.com/">
              Visual Studio Code
            </Themed.a>
          </Themed.p>
          <Themed.p>Some of my favorite extensions are:</Themed.p>
          <ul>
            <li>
              Theme -{` `}
              <Themed.a href="https://marketplace.visualstudio.com/items?itemName=sdras.night-owl">
                Night Owl
              </Themed.a>
            </li>
            <li>
              Font -{` `}
              <Themed.a href="https://github.com/tonsky/FiraCode">
                Fira Code
              </Themed.a>
              {` `}
              with ligatures turned on.
            </li>
            <li>
              Icons -{` `}
              <Themed.a href="https://marketplace.visualstudio.com/items?itemName=PKief.material-icon-theme">
                Material Icon Theme
              </Themed.a>
            </li>
            <li>
              More Extensions - I gathered some of my favorites in a{` `}
              <Themed.a href="https://twitter.com/i/events/1227594604872114178">
                Twitter moment.
              </Themed.a>
            </li>
          </ul>
          <Themed.h2>Terminal</Themed.h2>
          <Themed.p>
            When not using the built-in terminal in VSCode, I use the{` `}
            <Themed.a href="https://github.com/microsoft/terminal">
              Windows Terminal
            </Themed.a>
          </Themed.p>
          <Themed.p>
            <Link to="blog/windows-terminal/" sx={{ variant: `styles.a` }}>
              I think it&apos;s awesome.
            </Link>
          </Themed.p>
          <Themed.h2>Other Software</Themed.h2>
          <ul>
            <li>
              <Themed.a href="https://github.com/sindresorhus/refined-github">
                Refined GitHub
              </Themed.a>
              {` `}- Browser extension that adds useful features to the GitHub
              website.
            </li>
            <li>
              <Themed.a href="https://getsharex.com/">ShareX</Themed.a> -
              Screenshot utility.
            </li>
            <li>
              <Themed.a href="https://justgetflux.com/">f.lux</Themed.a> -
              Adjusts screen temperature to the time of day.
            </li>
          </ul>
          <Themed.h2>Hardware</Themed.h2>
          <ul>
            <li>
              PC - Self-assembled desktop (Feel free to ask me questions about
              it!)
            </li>
            <li>
              Keyboard -{` `}
              <Themed.a href="https://www.duckychannel.com.tw/en/Ducky-One2-Mini-Pure-White-RGB">
                Ducky one 2 mini Pure White
              </Themed.a>
            </li>
            <li>
              Mouse -{` `}
              <Themed.a href="https://www.pcgamingrace.com/products/glorious-model-o-white">
                Glorious Model O in Matte White
              </Themed.a>
            </li>
            <li>
              Deskmat -{` `}
              <Themed.a href="https://www.pcgamingrace.com/products/glorious-xxl-gaming-mouse-pad">
                Glorious XXL Extended
              </Themed.a>
            </li>
          </ul>
          <Themed.p>
            That deskmat is <strong>LARGE</strong>. Highly recommend.
          </Themed.p>
          <Tweet
            theme="dark"
            tweetLink="NMeuleman/status/1209168210379132928"
          />
        </div>
      </div>
    </Layout>
  );
};

export default Uses;
