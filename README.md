# Nicky Meuleman's website

Site made with [Gatsby](https://www.gatsbyjs.org/).
Hosted on [Netlify](https://www.netlify.com/).

Primarily home to my blog, using [my Gatsby blog theme](https://github.com/NickyMeuleman/gatsby-theme-nicky-blog).

### Dev notes

- [ ] Interact sidebar to accompany Metadata on blogposts.
      Houses share links. An "edit on GitHub" button.
- [ ] Table of contents in sidebar
- [ ] Make sidebar items collapsible (they are on top on mobile, taking up lots of space.)
- [ ] Flesh out author page and use it as stand-in for the old "/about" route. (redirect in `gatsby-node`)
- [ ] Add subtle animations to all the things!
- [ ] More sections for index page. (email? Newsletter? Something about racing 🏎?)
- [ ] RSS feed
- [ ] Simpler analytics, or none. I'm only interested in amount of visitors, roughly.

Remove `.trim()` here:
https://github.com/NickyMeuleman/gatsby-theme-nicky-blog/blob/291e16080135b570d065026fde9decc183956ccb/theme/src/components/CodeBlock.tsx#L97

Caused Advent of Code input that starts with significant spaces to be changed.
