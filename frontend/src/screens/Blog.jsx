import React from 'react';

import PageHero from '../components/PageHero/PageHero';
import BlogComponents from '../components/BlogComponents/BlogComponents';


const Blog = () => {
  return (
    <>

      <PageHero
        title="BLOG UPDATES"
        bgImage="https://galaxymoversregina.ca/wp-content/uploads/2025/08/galaxy0regina.png"
      />

      <BlogComponents />
    </>
  );
};

export default Blog;