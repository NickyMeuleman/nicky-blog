import React, { Component } from 'react';

const API = 'https://api.applause-button.com';

export default class ClapButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      totalClaps: null,
    };
  }

  componentDidMount() {
    console.log('DID MOUNT', 'claps:', this.state.totalClaps);
    this.getClaps(this.props.location.href).then(claps => this.setState({ totalClaps: Number(claps), isLoaded: true }));
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log('SHOULD UPDATE', 'claps:', this.state.totalClaps, 'nextClaps:', nextState.totalClaps);
    return nextState.totalClaps !== this.state.totalClaps;
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('DID UPDATE', 'claps:', this.state.totalClaps);
  }

  getClaps = url =>
    fetch(`${API}/get-claps${url ? `?url=${url}` : ''}`, {
      headers: {
        'Content-Type': 'text/plain',
      },
    }).then(
      response => response.text(),
      error => {
        this.setState({
          isLoaded: true,
          error,
        });
      }
    );

  updateClaps = (claps, url) =>
    fetch(`${API}/update-claps${url ? `?url=${url}` : ''}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify(claps),
    }).then(
      response => response.text(),
      error => {
        this.setState({
          isLoaded: true,
          error,
        });
      }
    );

  clapClick = () => {
    // send request and on response update state
    // this.updateClaps(1, this.props.location.href).then(claps => this.setState({ totalClaps: Number(claps) }));

    // send request and immediately update state, feels responsive
    // logic to handle when API request are sent in lifecycle methods
    this.updateClaps(1, this.props.location.href);
    this.setState(prevState => ({ totalClaps: prevState.totalClaps + 1 }));
  };

  render() {
    const { error, isLoaded, totalClaps } = this.state;
    const { style } = this.props;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    }
    return (
      <button style={style} onClick={this.clapClick}>
        CLAPS: {totalClaps}
      </button>
    );
  }
}
