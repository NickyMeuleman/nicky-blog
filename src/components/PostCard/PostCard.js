import React from 'react';
import { Link } from 'gatsby';
import Img from 'gatsby-image';
import styled, { css } from 'styled-components';
import { TABLET_WIDTH } from 'typography-breakpoint-constants';
import { rhythm, scale } from '../../utils/typography';
import theme from '../../utils/theme';

/* eslint-disable no-use-before-define */

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
  // TODO: find best practice way to do this
  ${props =>
    props.featured &&
    css`
    @media (min-width: ${TABLET_WIDTH}) {
      grid-template-columns: 2fr 1fr;
      grid-template-rows: 415px;
      ${Top} {
        grid-column: 1/2;
        grid-row: 1/2;
      }
      ${Bottom} {
        grid-column: 2/3;
        grid-row: 1/2;
      }
    `};
  }
  @media (min-width: ${TABLET_WIDTH}) {
    ${props => !props.featured && 'grid-template-rows: 250px 1fr'};
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
  background: #fff;
  padding: ${rhythm(0.25)};
  & h2 {
    margin: 0;
  }
  @media (min-width: ${TABLET_WIDTH}) {
    padding: ${rhythm(0.5)};
  }
`;

const Info = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${rhythm(0.5)};
  height: 100%;
  & > p {
    margin: 0;
  }
  & > :last-child {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex: 1;
    ${scale(-1 / 3)};
    height: 70%;
    svg {
      height: 100%;
      width: auto;
    }
  }
`;

const Excerpt = styled.p`
  margin-top: ${rhythm(0.5)};
`;

/* eslint-enable no-use-before-define */

const PostCard = props => (
  <Card featured={props.featured}>
    <Top>
      <LinkU to={props.url} state={{ initialClaps: props.claps }}>
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
      <div>
        <LinkU to={props.url} state={{ initialClaps: props.claps }}>
          <h2>{props.title}</h2>
        </LinkU>
        {props.excerpt && <Excerpt>{props.excerpt}</Excerpt>}
      </div>
      <Info>
        <p>
          {props.author} on {props.date}
        </p>
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" fill="currentColor" stroke="currentColor">
            <g>
              <path d="M37.1910045 6.68944619C37.7313574 6.14566353 38.4431784 5.8737722 39.155207 5.8737722 39.967916 5.8737722 40.7808327 6.22800418 41.3380002 6.93667712 42.2214969 8.06039707 42.0666359 9.69111808 41.0600392 10.7042842L39.777765 11.9949843C39.5801407 12.1276907 39.3877061 12.2695925 39.2075193 12.430303 39.0619998 11.5985371 38.7167801 10.7954023 38.1668781 10.0961338 37.4907623 9.23636364 36.588375 8.62424242 35.5772114 8.31410658L37.1910045 6.68944619zM28.5289586 3.66394984C29.0691039 3.12016719 29.7811325 2.84827586 30.4931611 2.84827586 31.3060777 2.84848485 32.1187868 3.20271682 32.6759543 3.91138976 33.559451 5.03510972 33.40459 6.66562173 32.3979933 7.67878788L17.6760235 22.3467085 17.6276554 20.6499478C17.6149925 19.014629 16.8595779 17.554441 15.6854573 16.5945664L28.5289586 3.66394984zM.624996757 36.9889537C.491717597 36.554099.508245877 35.7327064.906400646 35.2666667L3.45579518 32.2829676C3.45662553 32.2819923 4.33763118 25.8376176 6.09881213 12.9498433 6.09881213 11.4271682 7.33624726 10.1814002 8.84873717 10.1814002 10.3612271 10.1814002 11.5988698 11.4271682 11.5988698 12.9498433L11.6704878 15.4649948C9.18191673 15.8089864 7.24428555 17.9170324 7.14921001 20.492581L4.62804751 38.9475444 3.8946373 39.8060606C3.04504924 39.4926018 2.3776139 39.1458968 1.89233128 38.7659456 1.16440735 38.1960189.758275917 37.4238085.624996757 36.9889537z" />
              <path d="M49.6070811,36.8942529 L42.4182909,44.1316614 C36.2784454,50.3128527 29.8604313,55.2743992 24.2225349,56.5113898 C24.0512744,56.5492163 23.8901857,56.6217346 23.7511014,56.7293626 L20.5013032,59.2417973 C20.2908084,59.4045977 20.1673015,59.6181154 19.5026647,59.6181154 C18.8380279,59.6181154 13.0160695,55.8303982 10.3595306,53.2846814 C7.96626306,50.9912532 3.77432047,43.9549368 4.44453927,43.0079415 L6.99372621,40.0244514 C6.99469496,40.0233368 7.87570061,33.578962 9.63674317,20.6913271 C9.63674317,19.168652 10.8743859,17.922675 12.3868758,17.922675 C13.8993657,17.922675 15.1368008,19.168652 15.1368008,20.6913271 L15.2667512,25.2522466 C15.2883404,26.0100313 15.907577,26.5034483 16.5519317,26.5034483 C16.8662207,26.5034483 17.1867374,26.3857889 17.4464306,26.1245559 L32.0670972,11.4054336 C32.6074501,10.861442 33.3190635,10.5897597 34.0312997,10.5897597 C34.8440088,10.5897597 35.6569254,10.9439916 36.214093,11.6526646 C37.0975897,12.7763845 36.942521,14.4071055 35.9359243,15.4202717 L25.8641449,25.5598746 C25.3412294,26.0865204 25.3412294,26.9398119 25.8641449,27.4660397 C26.1288202,27.7324974 26.4757006,27.8658307 26.822581,27.8658307 C27.1694614,27.8658307 27.5165494,27.7324974 27.7810172,27.4660397 L40.7291431,14.43093 C41.2692884,13.8869383 41.9811094,13.615256 42.6933456,13.615256 C43.5060547,13.615465 44.3189713,13.969697 44.8761389,14.6783699 C45.7596356,15.8018809 45.6045669,17.4326019 44.5979702,18.445768 L31.7106677,31.4198537 C31.1806943,31.953605 31.1806943,32.8183908 31.7106677,33.3521421 C31.9718141,33.615047 32.31392,33.7464995 32.656441,33.7464995 C32.9985469,33.7464995 33.3408603,33.615047 33.6020067,33.3521421 L43.7346096,23.1515152 C44.2749625,22.6075235 44.9867835,22.3358412 45.6988121,22.3358412 C46.5115212,22.3358412 47.3244378,22.6900731 47.8816054,23.3989551 C48.7651021,24.522466 48.6100334,26.153187 47.6034367,27.1663532 L37.5667397,37.2708464 C37.0245185,37.8165099 37.0245185,38.7017764 37.5667397,39.2474399 C37.8334909,39.5161964 38.161896,39.6422153 38.4900934,39.6422153 C38.8184984,39.6422153 39.1469035,39.5161964 39.3972552,39.2639498 L45.6195133,32.999791 C46.1802099,32.4353187 46.93085,32.1368861 47.678999,32.1368861 C48.2741552,32.1368861 48.8676508,32.3258098 49.361919,32.7197492 C50.682182,33.7717868 50.7639719,35.7297806 49.6070811,36.8942529 Z" />
            </g>
          </svg>
          <span>{props.claps}</span>
        </div>
      </Info>
    </Bottom>
  </Card>
);

export default PostCard;
