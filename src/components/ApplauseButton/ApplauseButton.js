import React, { Component } from 'react';

import 'applause-button';

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
        <applause-button
          multiclap
          color="rgba(21,87,153,1)"
          style={{ width: '58px', height: '58px', zIndex: '9999', marginBottom: rhythm(1) }}
        />
      </div>
    );
  }
}
