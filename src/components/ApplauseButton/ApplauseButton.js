import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { rhythm } from '../../utils/typography';

export default class ApplauseButton extends Component {
  componentDidMount() {
    console.log('APPLAUSEBUTTON DID MOUNT');
  }
  componentDidUpdate() {
    console.log('APPLAUSEBUTTON DID UPDATE');
  }

  render() {
    return (
      <div key={this.props.location.href}>
        <Helmet>
          <link
            rel="stylesheet"
            href="https://unpkg.com/applause-button/dist/applause-button.css
"
          />
          <script
            src="https://unpkg.com/applause-button/dist/applause-button.js
"
          />
        </Helmet>
        <applause-button
          color="rgba(21,87,153,1)"
          style={{ width: '58px', height: '58px', zIndex: '9999', marginBottom: rhythm(1) }}
        />
      </div>
    );
  }
}
