import React, { Component } from 'react';
import Typed from 'typed.js';

class TypedStrings extends Component {
  componentDidMount() {
    // If you want to pass more options as props, simply add
    // your desired props to this destructuring assignment.
    const { strings } = this.props;
    // You can pass other options here, such as typing speed, back speed, etc.
    const options = {
      strings,
      typeSpeed: 50,
      backSpeed: 20,
      loop: true,
    };
    // this.el refers to the <span> in the render() method
    this.typed = new Typed(this.el, options);
  }

  componentWillUnmount() {
    // Make sure to destroy Typed instance on unmounting
    // to prevent memory leaks
    this.typed.destroy();
  }

  render() {
    return (
      <div className="type-wrap">
        <span
          style={{ whiteSpace: 'pre', minHeight: '1em' }}
          ref={el => {
            this.el = el;
          }}
        />
      </div>
    );
  }
}

export default TypedStrings;
