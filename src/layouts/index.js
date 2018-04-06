import React from 'react';
import Helmet from 'react-helmet';

import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import './index.css';

const TemplateWrapper = ({ children }) => (
  <React.Fragment>
    <Helmet
      title="Nicky blogs"
      meta={[{ name: 'description', content: 'Sample' }, { name: 'keywords', content: 'sample, something' }]}
    />
    <Header />
    <main>{children()}</main>
    <Footer />
  </React.Fragment>
);

export default TemplateWrapper;
