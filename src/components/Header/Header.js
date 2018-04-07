import React from 'react';
import Link from 'gatsby-link';
import styled from 'styled-components';
import { rhythm } from '../../utils/typography';

const Container = styled.header`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  grid-template-rows: ${rhythm(3)};
  background: #333;
  color: #eee;
`;

const Nav = styled.div`
  grid-column: 1/2;
  grid-row: 1/2;
  justify-self: end;
  align-self: center;
  ul {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  li {
    padding-left: ${rhythm(1)};
    margin: 0;
  }
  a {
    color: inherit;
    text-decoration: none;
  }
  .is-active {
    border-bottom: 5px solid #18a1ff;
  }
`;

const Logo = styled.div`
  grid-column: 2/3;
  grid-row: 1/2;
  align-self: center;
  padding: 0;
  margin: 0 ${rhythm(1)};
  width: ${rhythm(4)};
  height: ${rhythm(4)};
  padding: ${rhythm(1 / 2)};
  border: 5px solid #333;
  border-radius: 50%;
  background-color: #999;
  transform: translateY(25%);
`;

const Social = styled.div`
  justify-self: start;
  align-self: center;
  grid-column: 3/4;
  grid-row: 1/2;
`;

const Header = () => (
  <Container>
    <Nav>
      <ul>
        <li>
          <Link exact to="/" activeClassName="is-active">
            Home
          </Link>
        </li>
        <li>
          <Link to="/posts" activeClassName="is-active">
            Articles
          </Link>
        </li>
        <li>
          <Link to="/about" activeClassName="is-active">
            About
          </Link>
        </li>
      </ul>
    </Nav>
    <Logo>
      <Link to="/">
        <svg xmlns="http://www.w3.org/2000/svg" version="1.0" viewBox="0 0 504 504">
          <path d="M 90,430.5 L 90,412 L 102.5,412 L 115,412 L 115,390.6452 L 115,369.29041 L 136,346.9288 L 157,324.56719 L 157,250.00884 L 157,175.45049 L 132.55624,156.97524 L 108.11248,138.5 L 108.05624,104.75 L 108,71 L 136.5,71 L 165,71 L 165,86 L 165,101 L 191,101 L 217,101 L 217,86 L 217,71 L 252,71 L 287,71 L 287,86 L 287,101 L 313,101 L 339,101 L 339,86 L 339,71 L 367.5,71 L 396,71 L 395.94794,104.75 L 395.89588,138.5 L 371.44945,157 L 347.00303,175.5 L 347.00151,250.19619 L 347,324.89237 L 367.97107,347.19619 L 388.94214,369.5 L 388.97107,390.75 L 389,412 L 401.5,412 L 414,412 L 414,430.5 L 414,449 L 252,449 L 90,449 L 90,430.5 z M 379.73331,417.03383 C 383.68969,413.3479 383.42932,408.61599 379.08666,405.2818 C 377.85933,404.33949 349.06386,404.0564 251.93856,404.0318 C 128.45676,404.00053 126.34217,404.03257 124.26669,405.96617 C 120.31031,409.6521 120.57068,414.38401 124.91334,417.7182 C 126.14067,418.66051 154.93614,418.9436 252.06144,418.9682 C 375.54324,418.99947 377.65783,418.96743 379.73331,417.03383 z M 379.73331,375.03383 C 383.68969,371.3479 383.42932,366.61599 379.08666,363.2818 C 377.85933,362.33949 349.06386,362.0564 251.93856,362.0318 C 128.45676,362.00053 126.34217,362.03257 124.26669,363.96617 C 120.31031,367.6521 120.57068,372.38401 124.91334,375.7182 C 126.14067,376.66051 154.93614,376.9436 252.06144,376.9682 C 375.54324,376.99947 377.65783,376.96743 379.73331,375.03383 z M 337.54545,329.54545 C 340.67373,326.41718 340.67373,322.58282 337.54545,319.45455 L 335.09091,317 L 252,317 L 168.90909,317 L 166.45455,319.45455 C 163.32627,322.58282 163.32627,326.41718 166.45455,329.54545 L 168.90909,332 L 252,332 L 335.09091,332 L 337.54545,329.54545 z M 337.54545,180.54545 C 340.67373,177.41718 340.67373,173.58282 337.54545,170.45455 L 335.09091,168 L 252,168 L 168.90909,168 L 166.45455,170.45455 C 163.32627,173.58282 163.32627,177.41718 166.45455,180.54545 L 168.90909,183 L 252,183 L 335.09091,183 L 337.54545,180.54545 z M 387.54545,142.54545 C 390.67373,139.41718 390.67373,135.58282 387.54545,132.45455 L 385.09091,130 L 252,130 L 118.90909,130 L 116.45455,132.45455 C 113.32627,135.58282 113.32627,139.41718 116.45455,142.54545 L 118.90909,145 L 252,145 L 385.09091,145 L 387.54545,142.54545 z " />
        </svg>
      </Link>
    </Logo>
    <Social>SOCIAL</Social>
  </Container>
);

export default Header;
