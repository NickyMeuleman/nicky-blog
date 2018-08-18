---
title: Pagination in GatsbyJS
date: "2018-08-16"
author: "Nicky Meuleman"
cover: "./cover.jpg"
---

<!-- Photo by Austris Augusts on Unsplash -->

A page that lists all your posts will get longer as time progresses and more posts are added.

Pagination is a solution to that problem.
You can break up that long single page into multiple, smaller pages.
Here is how to achieve that in [GatsbyJS](https://www.gatsbyjs.org/)

## Create listing pages

Create a new file in `src/templates/` that will serve as a blueprint for every page that will list a few posts.

Often the current component you use to list all the posts can fulfill this role if you already have one.

As an example, I converted the standard [gatsby-starter-blog](https://github.com/gatsbyjs/gatsby-starter-blog) [(demo)](http://gatsbyjs.github.io/gatsby-starter-blog/) to work with pagination.  
[gatsby-paginated-blog](https://github.com/NickyMeuleman/gatsby-paginated-blog) [(demo)](https://nickymeuleman.github.io/gatsby-paginated-blog/)

Move `src/pages/index.js` to `src/templates/blog-list.js`

In `gatsby-node.js`, where you create your other pages.

```js
// Create blog post list pages
const postsPerPage = 2;
const numPages = Math.ceil(posts.length / postsPerPage);

Array.from({ length: numPages}).forEach((_, i) => {
  createPage({
    path: i === 0 ? `/` : `/${i + 1}`,
    component: path.resolve('./src/templates/blog-list.js'),
  });
})
```

## Get data to your template

## Only query graphQL for wanted posts

## Navigate to previous/next page

## Add numbering

```

```
