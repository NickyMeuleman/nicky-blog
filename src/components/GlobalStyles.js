import React from 'react';
import { Global } from '@emotion/core';

const GlobalStyles = () => (
  <Global
    styles={{
      html: {
        fontSize: '1.25rem',
      },
    }}
  />
);

export default GlobalStyles;
