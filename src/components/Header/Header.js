import React from 'react';
import Link from 'gatsby-link';
import styled from 'styled-components';

const Container = styled.header`
  background: #333;
  height: 5rem;
`;

const Header = () => (
  <Container>
    <h1>
      <Link to="/">Nicky</Link>
    </h1>
  </Container>
);

export default Header;
