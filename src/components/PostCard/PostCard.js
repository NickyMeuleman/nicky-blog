import React, { Component } from 'react';
import Link from 'gatsby-link';
import Img from 'gatsby-image';
import styled from 'styled-components';
import { rhythm } from '../../utils/typography';

const LinkU = styled(Link)`
  border-bottom: none;
  box-shadow: none;
`;

const Card = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 250px 100px;
`;
const Top = styled.div`
  grid-column: 1/2;
  grid-row: 1/2;
  background: green;
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
  grid-column: 1/2;
  grid-row: 2/3;
  background: #fff;
`;

export default class PostCard extends Component {
  render() {
    return (
      <LinkU to={this.props.url}>
        <Card>
          <Top>{this.props.coverSizes && <Img sizes={this.props.coverSizes} />}</Top>
          <Bottom>{this.props.title}</Bottom>
        </Card>
      </LinkU>
    );
  }
}

// export default class PostCard extends Component {
//   render() {
//     console.log('blogpage props: ', this.props);
//     return (
//       <div className="card">
//         <Link to={this.props.url}>
//           <div className="card__image">{this.props.coverSizes && <Img sizes={this.props.coverSizes} />}</div>
//           <div className="card__content">
//             <h3 className="card__title">{this.props.title}</h3>
//             <p className="card__more">{this.props.date}</p>
//           </div>
//         </Link>
//       </div>
//     );
//   }
// }
