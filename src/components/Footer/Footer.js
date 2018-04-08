import React from 'react';
import styled from 'styled-components';
import Link from 'gatsby-link';
import { rhythm } from '../../utils/typography';
import { scaleSC } from '../../utils/scale';

const Container = styled.footer`
  background-color: #222;
  background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNTIiIGhlaWdodD0iMTUyIiB2aWV3Qm94PSIwIDAgMTUyIDE1MiI+PGcgZmlsbC1ydWxlPSJldmVub2RkIj48ZyBpZD0idGVtcGxlIiBmaWxsPSIjMDAwIj48cGF0aCBkPSJNMTUyIDE1MHYySDB2LTJoMjh2LThIOHYtMjBIMHYtMmg4VjgwaDQydjIwaDIwdjQySDMwdjhoOTB2LThIODB2LTQyaDIwVjgwaDQydjQwaDhWMzBoLTh2NDBoLTQyVjUwSDgwVjhoNDBWMGgydjhoMjB2MjBoOFYwaDJ2MTUwem0tMiAwdi0yOGgtOHYyMGgtMjB2OGgyOHpNODIgMzB2MThoMThWMzBIODJ6bTIwIDE4aDIwdjIwaDE4VjMwaC0yMFYxMEg4MnYxOGgyMHYyMHptMCAydjE4aDE4VjUwaC0xOHptMjAtMjJoMThWMTBoLTE4djE4em0tNTQgOTJ2LTE4SDUwdjE4aDE4em0tMjAtMThIMjhWODJIMTB2MzhoMjB2MjBoMzh2LTE4SDQ4di0yMHptMC0yVjgySDMwdjE4aDE4em0tMjAgMjJIMTB2MThoMTh2LTE4em01NCAwdjE4aDM4di0yMGgyMFY4MmgtMTh2MjBoLTIwdjIwSDgyem0xOC0yMEg4MnYxOGgxOHYtMTh6bTItMmgxOFY4MmgtMTh2MTh6bTIwIDQwdi0xOGgxOHYxOGgtMTh6TTMwIDBoLTJ2OEg4djIwSDB2Mmg4djQwaDQyVjUwaDIwVjhIMzBWMHptMjAgNDhoMThWMzBINTB2MTh6bTE4LTIwSDQ4djIwSDI4djIwSDEwVjMwaDIwVjEwaDM4djE4ek0zMCA1MGgxOHYxOEgzMFY1MHptLTItNDBIMTB2MThoMThWMTB6Ii8+PC9nPjwvZz48L3N2Zz4=);
  a {
    text-shadow: none;
    background-image: none;
    text-decoration: none;
    color: inherit;
  }
`;

const Top = styled.div`
  display: grid;
  grid-template-rows: ${rhythm(1)} 1fr ${rhythm(1)};
  grid-template-columns: ${rhythm(4)} 1fr 1fr ${rhythm(4)};
  color: #999;
  background-color: #222;
  background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNTIiIGhlaWdodD0iMTUyIiB2aWV3Qm94PSIwIDAgMTUyIDE1MiI+PGcgZmlsbC1ydWxlPSJldmVub2RkIj48ZyBpZD0idGVtcGxlIiBmaWxsPSIjMDAwIj48cGF0aCBkPSJNMTUyIDE1MHYySDB2LTJoMjh2LThIOHYtMjBIMHYtMmg4VjgwaDQydjIwaDIwdjQySDMwdjhoOTB2LThIODB2LTQyaDIwVjgwaDQydjQwaDhWMzBoLTh2NDBoLTQyVjUwSDgwVjhoNDBWMGgydjhoMjB2MjBoOFYwaDJ2MTUwem0tMiAwdi0yOGgtOHYyMGgtMjB2OGgyOHpNODIgMzB2MThoMThWMzBIODJ6bTIwIDE4aDIwdjIwaDE4VjMwaC0yMFYxMEg4MnYxOGgyMHYyMHptMCAydjE4aDE4VjUwaC0xOHptMjAtMjJoMThWMTBoLTE4djE4em0tNTQgOTJ2LTE4SDUwdjE4aDE4em0tMjAtMThIMjhWODJIMTB2MzhoMjB2MjBoMzh2LTE4SDQ4di0yMHptMC0yVjgySDMwdjE4aDE4em0tMjAgMjJIMTB2MThoMTh2LTE4em01NCAwdjE4aDM4di0yMGgyMFY4MmgtMTh2MjBoLTIwdjIwSDgyem0xOC0yMEg4MnYxOGgxOHYtMTh6bTItMmgxOFY4MmgtMTh2MTh6bTIwIDQwdi0xOGgxOHYxOGgtMTh6TTMwIDBoLTJ2OEg4djIwSDB2Mmg4djQwaDQyVjUwaDIwVjhIMzBWMHptMjAgNDhoMThWMzBINTB2MTh6bTE4LTIwSDQ4djIwSDI4djIwSDEwVjMwaDIwVjEwaDM4djE4ek0zMCA1MGgxOHYxOEgzMFY1MHptLTItNDBIMTB2MThoMThWMTB6Ii8+PC9nPjwvZz48L3N2Zz4=);
  ul {
    list-style: none;
    margin: 0;
  }
  a:hover {
    color: #fff;
  }
  & > div {
    grid-column: 2/3;
    grid-row: 2/3;
    align-self: start;
  }
  & > ul {
    grid-column: 3/4;
    grid-row: 2/3;
    text-align: right;
    display: flex;
    justify-content: flex-end;
    & > li {
      margin-left: 4rem;
    }
    & > li > a {
      color: #ddd;
      ${scaleSC(0.5)};
      font-weight: 700;
    }
  }
`;

const Bottom = styled.div`
  ${scaleSC(-0.25)};
  background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNTIiIGhlaWdodD0iMTUyIiB2aWV3Qm94PSIwIDAgMTUyIDE1MiI+PGcgZmlsbC1ydWxlPSJldmVub2RkIj48ZyBpZD0idGVtcGxlIiBmaWxsPSIjMDAwIj48cGF0aCBkPSJNMTUyIDE1MHYySDB2LTJoMjh2LThIOHYtMjBIMHYtMmg4VjgwaDQydjIwaDIwdjQySDMwdjhoOTB2LThIODB2LTQyaDIwVjgwaDQydjQwaDhWMzBoLTh2NDBoLTQyVjUwSDgwVjhoNDBWMGgydjhoMjB2MjBoOFYwaDJ2MTUwem0tMiAwdi0yOGgtOHYyMGgtMjB2OGgyOHpNODIgMzB2MThoMThWMzBIODJ6bTIwIDE4aDIwdjIwaDE4VjMwaC0yMFYxMEg4MnYxOGgyMHYyMHptMCAydjE4aDE4VjUwaC0xOHptMjAtMjJoMThWMTBoLTE4djE4em0tNTQgOTJ2LTE4SDUwdjE4aDE4em0tMjAtMThIMjhWODJIMTB2MzhoMjB2MjBoMzh2LTE4SDQ4di0yMHptMC0yVjgySDMwdjE4aDE4em0tMjAgMjJIMTB2MThoMTh2LTE4em01NCAwdjE4aDM4di0yMGgyMFY4MmgtMTh2MjBoLTIwdjIwSDgyem0xOC0yMEg4MnYxOGgxOHYtMTh6bTItMmgxOFY4MmgtMTh2MTh6bTIwIDQwdi0xOGgxOHYxOGgtMTh6TTMwIDBoLTJ2OEg4djIwSDB2Mmg4djQwaDQyVjUwaDIwVjhIMzBWMHptMjAgNDhoMThWMzBINTB2MTh6bTE4LTIwSDQ4djIwSDI4djIwSDEwVjMwaDIwVjEwaDM4djE4ek0zMCA1MGgxOHYxOEgzMFY1MHptLTItNDBIMTB2MThoMThWMTB6Ii8+PC9nPjwvZz48L3N2Zz4=);
  display: grid;
  grid-template-rows: ${rhythm(0.5)} 1fr ${rhythm(0.5)};
  grid-template-columns: ${rhythm(4)} 1fr 1fr ${rhythm(4)};
  background-color: #111;
  color: #777;
  & > nav {
    grid-column: 2/3;
    grid-row: 2/3;
    justify-self: start;
  }
  & > div {
    grid-column: 3/4;
    grid-row: 2/3;
    justify-self: end;
  }
  ul {
    list-style: none;
    display: flex;
    margin: 0;
    li {
      margin: 0;
      margin-right: ${rhythm(3 / 4)};
    }
  }
`;

const Footer = () => (
  <Container>
    <Top>
      <div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad nesciunt molestias saepe assumenda culpa adipisci
        repellat illum aperiam expedita quos ipsa beatae fugiat delectus, dolorem, ex placeat impedit fuga. Voluptas,
        deserunt laborum? Incidunt, vero neque libero quos officia error tempora similique consequuntur veritatis, vitae
        odit optio nemo id, exercitationem recusandae?
      </div>
      <ul>
        <li>
          <Link to="/">Rook</Link>
          <ul>
            <li>
              <Link to="/posts">Posts</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>
        </li>

        <li>
          <Link to="/">Contact</Link>
          <ul>
            <li>
              <a href="https://github.com/NickyMeuleman">Github</a>
            </li>
            <li>
              <a href="https://twitter.com/NMeuleman">Twitter</a>
            </li>
            <li>
              <a href="mailto:nicky.meuleman+dev@gmail.com">E-mail</a>
            </li>
          </ul>
        </li>
      </ul>
    </Top>
    <Bottom>
      <nav>
        <ul>
          <li>
            <Link to="/">Contact</Link>
          </li>
          <li>
            <Link to="/">Posts</Link>
          </li>
          <li>
            <Link to="/">About</Link>
          </li>
        </ul>
      </nav>
      <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod, nesciunt.</div>
    </Bottom>
  </Container>
);

export default Footer;
