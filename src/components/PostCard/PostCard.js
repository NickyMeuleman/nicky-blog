import React from 'react';
import Link from 'gatsby-link';
import Img from 'gatsby-image';
import styled from 'styled-components';
import { rhythm } from '../../utils/typography';
import theme from '../../utils/theme';

const LinkU = styled(Link)`
  border-bottom: none;
  box-shadow: none;
  height: auto;
  width: auto;
  &:hover {
    background: inherit;
  }
`;

const Card = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 150px 1fr;
  @media (min-width: 55rem) {
    grid-template-rows: 250px 1fr;
  }
`;
const Top = styled.div`
  grid-column: 1/2;
  grid-row: 1/2;
  background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNTIiIGhlaWdodD0iMTUyIiB2aWV3Qm94PSIwIDAgMTUyIDE1MiI+PGcgZmlsbC1ydWxlPSJldmVub2RkIj48ZyBpZD0idGVtcGxlIiBmaWxsPSIjMDAwIj48cGF0aCBkPSJNMTUyIDE1MHYySDB2LTJoMjh2LThIOHYtMjBIMHYtMmg4VjgwaDQydjIwaDIwdjQySDMwdjhoOTB2LThIODB2LTQyaDIwVjgwaDQydjQwaDhWMzBoLTh2NDBoLTQyVjUwSDgwVjhoNDBWMGgydjhoMjB2MjBoOFYwaDJ2MTUwem0tMiAwdi0yOGgtOHYyMGgtMjB2OGgyOHpNODIgMzB2MThoMThWMzBIODJ6bTIwIDE4aDIwdjIwaDE4VjMwaC0yMFYxMEg4MnYxOGgyMHYyMHptMCAydjE4aDE4VjUwaC0xOHptMjAtMjJoMThWMTBoLTE4djE4em0tNTQgOTJ2LTE4SDUwdjE4aDE4em0tMjAtMThIMjhWODJIMTB2MzhoMjB2MjBoMzh2LTE4SDQ4di0yMHptMC0yVjgySDMwdjE4aDE4em0tMjAgMjJIMTB2MThoMTh2LTE4em01NCAwdjE4aDM4di0yMGgyMFY4MmgtMTh2MjBoLTIwdjIwSDgyem0xOC0yMEg4MnYxOGgxOHYtMTh6bTItMmgxOFY4MmgtMTh2MTh6bTIwIDQwdi0xOGgxOHYxOGgtMTh6TTMwIDBoLTJ2OEg4djIwSDB2Mmg4djQwaDQyVjUwaDIwVjhIMzBWMHptMjAgNDhoMThWMzBINTB2MTh6bTE4LTIwSDQ4djIwSDI4djIwSDEwVjMwaDIwVjEwaDM4djE4ek0zMCA1MGgxOHYxOEgzMFY1MHptLTItNDBIMTB2MThoMThWMTB6Ii8+PC9nPjwvZz48L3N2Zz4=);
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
  img {
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
  }
  ${Card}:hover & {
    filter: brightness(110%) contrast(120%);
  }
`;
const Bottom = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  grid-column: 1/2;
  grid-row: 2/3;
  background: #fff;
  padding: ${rhythm(0.25)};
  & h2 {
    margin: 0;
  }
  @media (min-width: 55rem) {
    padding: ${rhythm(0.5)};
  }
`;

const Info = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${rhythm(0.5)};
  & > p {
    margin: 0;
  }
`;

const PostCard = props => (
  <Card>
    <Top>
      <LinkU to={props.url}>
        {props.coverSizes ? (
          <Img sizes={props.coverSizes} />
        ) : (
          <div
            style={{
              height: '100%',
              backgroundImage: `linear-gradient(120deg, ${theme.primary}, ${theme.secondary})`,
              opacity: '0.95',
            }}
          />
        )}
      </LinkU>
    </Top>
    <Bottom>
      <LinkU to={props.url}>
        <h2>{props.title}</h2>
      </LinkU>
      <Info>
        <p>{props.author}</p>
        <p>{props.date}</p>
      </Info>
    </Bottom>
  </Card>
);

export default PostCard;
