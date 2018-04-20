import React, { Component } from 'react';
import Link from 'gatsby-link';

import Img from 'gatsby-image';
import './PostCard.css';

export default class PostCard extends Component {
  render() {
    console.log('blogpage props: ', this.props);
    return (
      <div className="card">
        <Link to={this.props.url}>
          <div className="card__image">{this.props.coverSizes && <Img sizes={this.props.coverSizes} />}</div>
          <div className="card__content">
            <h3 className="card__title">{this.props.title}</h3>
            <p className="card__more">{this.props.date}</p>
          </div>
        </Link>
      </div>
    );
  }
}
