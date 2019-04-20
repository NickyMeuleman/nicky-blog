import React from 'react';
import { ThemeContext } from './src/utils/context';
import theme from './src/utils/theme';

/* eslint-disable import/prefer-default-export, no-empty */
function getThemeChoice() {
  let choice;
  try {
    choice = localStorage.getItem('theme') || 'light';
  } catch (err) {}
  return choice;
}

const ThemeWrapperComponent = ({ children }) => {
  const [themeChoice, setThemeChoice] = React.useState(() => getThemeChoice());

  const toggleTheme = () => {
    const newChoice = themeChoice === 'light' ? 'dark' : 'light';
    setThemeChoice(newChoice);
  };

  React.useEffect(() => {
    localStorage.setItem('theme', themeChoice);
    document.body.className = themeChoice;
  }, [themeChoice]);

  const activeTheme = themeChoice === 'light' ? theme.light : theme.dark;

  return (
    <ThemeContext.Provider value={{ theme: activeTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const wrapRootElement = ({ element }) => (
  <ThemeWrapperComponent>{element}</ThemeWrapperComponent>
);
