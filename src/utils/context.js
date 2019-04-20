import React from 'react';

const ThemeContext = React.createContext({
  theme: 'dark',
  toggleTheme: () => null,
});

export { ThemeContext };
