import React from 'react';
import theme from './theme';

// default themeContext values
const ThemeContext = React.createContext({
  theme: theme.light,
  toggleTheme: () => null,
});

export { ThemeContext };
