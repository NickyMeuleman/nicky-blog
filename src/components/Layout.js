/** @jsx jsx */
import { jsx, Box } from 'theme-ui';
import { Main } from '@nickymeuleman/gatsby-theme-blog';
import GlobalStyles from './GlobalStyles';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children, ...props }) => (
  <Box
    sx={{
      minHeight: `100vh`,
      display: `flex`,
      flexDirection: `column`,
      variant: `styles.Layout`,
    }}
  >
    <GlobalStyles />
    <Header {...props} />
    <Main {...props}>{children}</Main>
    <Footer {...props} />
  </Box>
);

export default Layout;
