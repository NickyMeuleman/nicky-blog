import React from 'react';

const ThemeContext = React.createContext({
  theme: {},
  toggleTheme: () => null,
});

export { ThemeContext };
