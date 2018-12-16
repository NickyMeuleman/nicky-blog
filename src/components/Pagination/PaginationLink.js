import React from 'react';
import { Link } from 'gatsby';

export default ({ to, children, ...props }) => {
  if (to) {
    return (
      <Link to={to} {...props}>
        {children}
      </Link>
    );
  }
  return <span {...props}>{children}</span>;
};
