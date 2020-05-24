/** @jsx jsx */
import { jsx, Styled } from "theme-ui";
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
          display: "grid",
          gridTemplateColumns: "1fr minmax(20ch, 70ch) 1fr",
        }}
      >
        <div sx={{ gridColumn: "2/3", py: 5 }}>
          <Styled.h1 sx={{ mt: 0 }}>What I use</Styled.h1>
          <Styled.p>
            My dev computer runs Windows 10 and uses the Windows Subsystem for
            Linux 2.
          </Styled.p>
          <Styled.p>
            <Link
              to="/blog/linux-on-windows-wsl2-zsh-docker/"
              sx={{ variant: "styles.a" }}
            >
              I wrote about how to set it up
            </Link>
            . Starting from scratch and ending with launching a project in
            Docker through a tricked out terminal.
          </Styled.p>
          <Styled.h2>Code Editor</Styled.h2>
          <Styled.p>
            The code editor I spend the most time in is{" "}
            <Styled.a href="https://code.visualstudio.com/">
              Visual Studio Code
            </Styled.a>
          </Styled.p>
          <Styled.p>Some of my favorite extensions are:</Styled.p>
          <ul>
            <li>
              Theme -{" "}
              <Styled.a href="https://marketplace.visualstudio.com/items?itemName=sdras.night-owl">
                Night Owl
              </Styled.a>
            </li>
            <li>
              Font -{" "}
              <Styled.a href="https://github.com/tonsky/FiraCode">
                Fira Code
              </Styled.a>{" "}
              with ligatures turned on.
            </li>
            <li>
              Icons -{" "}
              <Styled.a href="https://marketplace.visualstudio.com/items?itemName=PKief.material-icon-theme">
                Material Icon Theme
              </Styled.a>
            </li>
            <li>
              More Extensions - I gathered some of my favorites in a{" "}
              <Styled.a href="https://twitter.com/i/events/1227594604872114178">
                Twitter moment.
              </Styled.a>
            </li>
          </ul>
          <Styled.h2>Terminal</Styled.h2>
          <Styled.p>
            When not using the built-in terminal in VSCode, I use the{" "}
            <Styled.a href="https://github.com/microsoft/terminal">
              Windows Terminal
            </Styled.a>
          </Styled.p>
          <Styled.p>
            <Link to="blog/windows-terminal/" sx={{ variant: "styles.a" }}>
              I think it&apos;s awesome.
            </Link>
          </Styled.p>
          <Styled.h2>Other Software</Styled.h2>
          <ul>
            <li>
              <Styled.a href="https://github.com/sindresorhus/refined-github">
                Refined GitHub
              </Styled.a>{" "}
              - Browser extension that adds useful features to the GitHub
              website.
            </li>
            <li>
              <Styled.a href="https://getsharex.com/">ShareX</Styled.a> -
              Screenshot utility.
            </li>
            <li>
              <Styled.a href="https://justgetflux.com/">f.lux</Styled.a> -
              Adjusts screen temperature to the time of day.
            </li>
          </ul>
          <Styled.h2>Hardware</Styled.h2>
          <ul>
            <li>
              PC - Self-assembled desktop (Feel free to ask me questions about
              it!)
            </li>
            <li>
              Keyboard -{" "}
              <Styled.a href="https://www.duckychannel.com.tw/en/Ducky-One2-Mini-Pure-White-RGB">
                Ducky one 2 mini Pure White
              </Styled.a>
            </li>
            <li>
              Mouse -{" "}
              <Styled.a href="https://www.pcgamingrace.com/products/glorious-model-o-white">
                Glorious Model O in Matte White
              </Styled.a>
            </li>
            <li>
              Deskmat -{" "}
              <Styled.a href="https://www.pcgamingrace.com/products/glorious-xxl-gaming-mouse-pad">
                Glorious XXL Extended
              </Styled.a>
            </li>
          </ul>
          <Styled.p>
            That deskmat is <strong>LARGE</strong>. Highly recommend.
          </Styled.p>
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
