---
title: Pagination in GatsbyJS
date: "2018-08-16"
author: "Nicky Meuleman"
cover: "./cover.jpg"
---

<!-- Photo by Austris Augusts on Unsplash -->

A page that lists all your posts can get incredibly long as more posts are added.

Pagination offers a solution to that problem.
You can break up that long single page into multiple, smaller pages.
Here is how to achieve that in [GatsbyJS](https://www.gatsbyjs.org/)

## Create listing pages

Create a new file in `src/templates/` that will serve as a blueprint for every page that lists a few posts.

If you already have one, often the current component you use to list all the posts can fulfill this role.

Calculate the amount of pages you need to display all posts (`numPages`), with `postsPerPage` as a maximum amount of posts to display on a single page.

The path for each page will be `/<number>`, with an exception for `/1`, that page will use `/` instead.

```js
// file: gatsby-node.js

// Create blog post list pages
const postsPerPage = 2;
const numPages = Math.ceil(posts.length / postsPerPage);

Array.from({ length: numPages }).forEach((_, i) => {
  createPage({
    path: i === 0 ? `/` : `/${i + 1}`,
    component: path.resolve("./src/templates/blog-list.js")
  });
});
```

## Get data to your template-pages

You can pass some data along with the pages you create in `context`.

```js{7-12}
// file: gatsby-node.js

Array.from({ length: numPages }).forEach((_, i) => {
  createPage({
    path: i === 0 ? `/` : `/${i + 1}`,
    component: path.resolve("./src/templates/blog-list.js"),
    context: {
      limit: postsPerPage,
      skip: i * postsPerPage,
      numPages,
      currentPage: i + 1
    }
  });
});
```

The `context` object will be available in the created pages on the `pageContext` prop in React. You will also be able to access the keys in your GraphQL query for those pages.

```js{4}
// file: src/templates/blog-list.js

class BlogList extends React.component {
  console.log(this.props.pageContext)

  render() {
    return ( /* your code to display a list of posts */)
  }
}
```

## Only query GraphQL for wanted posts

Use `limit` and `skip` to only fetch data for the posts you want in your GraphQL query for those pages.

```js{4-9}
// file: src/templates/blog-list.js

export const pageQuery = graphql`
  query blogPageQuery($skip: Int!, $limit: Int!) {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          excerpt
          frontmatter {
            date(formatString: "DD MMMM, YYYY")
            title
          }
        }
      }
    }
  }
`;
```

## Navigate to previous/next page

## Add numbering

## Example

As an example, I converted the standard [gatsby-starter-blog](https://github.com/gatsbyjs/gatsby-starter-blog) [(demo)](http://gatsbyjs.github.io/gatsby-starter-blog/) to work with pagination.
[gatsby-paginated-blog](https://github.com/NickyMeuleman/gatsby-paginated-blog) [(demo)](https://nickymeuleman.github.io/gatsby-paginated-blog/)
