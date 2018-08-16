import React from 'react';
import { Link } from 'gatsby';

export default props => {
  if (props.to) {
    return <Link to={props.to}>{props.children}</Link>;
  }
  return <span>{props.children}</span>;
};
