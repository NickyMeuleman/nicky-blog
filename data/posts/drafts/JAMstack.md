---
title: RE:JAMstack
date: '2019-12-13'
authors: ['nicky']
cover: './cover.jpg'
tags: ['JAMstack', 'GraphQL']
published: false
---

back-end used to be dominant (LAMP/MAMP/WAMP), then a mix of back-end and front-end. (MEAN/MERN/MEVN) https://www.mongodb.com/blog/post/the-mean-stack-mongodb-expressjs-angularjs-and
now mostly front-end (JAM)

what is frontend?
https://twitter.com/laurieontech/status/1207672668725624832
There are loads of tools involved, but ultimately it comes down to HTML, CSS, and JavaScript.
JAMstack embraces those 3. In fact, static generation linked.

Stack used to be higher level. Linux Apache MySQL PHP.
Operating-system ??? database programming-language.
What does stack even mean?
then MERN Mongo express react node
database, backend framework, frontend framework, backend language
https://css-tricks.com/star-apps-a-new-generation-of-front-end-tooling-for-development-workflows/
all of the things in JAM and STAR are super front-end
Stack now is more about what frontend choices you make rather than backend choices.
so what does full _stack_ mean? It used to mean using every part of the things in the named stack.
now it's mostly frontend things that are named in stacks.
What it is: https://www.swyx.io/writing/netlify-jamstack-indiehackers/

Bad name https://css-tricks.com/jamstack-more-like-shamstack/
more about generated ahead of time. Ready to go
other neat things about static files. Security?
faster: static > SSR > clientside

Tweet from Grant "stop naming stacks"
introducing RE:JAMstack, realtime enhanced

the RE part is optional, like white snow, tall Chris Biscardi...

https://shoptalkshow.com/episodes/369/

acronym. acronym is not great but momentum behind it is already there.
Javascript and APIs are kinda the same in meaning there. Use APIs most often with JS.
The Markup is part. it's not required that every page is prebuilt markup.
The prebuilt part is the important part to me. That's where a lot of the benefits come from. https://jamstack.wtf/ benefits

- High speed (CDN, the "Edge")
- Low cost (or free)
- hosting is easy (auto https)
- secure (often don't need to worry about it)
- scales (static files, work done beforehand)

very front-end developer friendly

no backend. GitHub pages, Netlify, S3 bucket, ...
What gets associated most is static site generators https://serverless.css-tricks.com/services/ssgs/
like jekyll, eleventy, ...

Some restrictions. Using a framework on top of that to get more functionality. Like React > Gatsby or Vue > Gridsome
You CAN prerender everything. It can do more.
prerender and hydrate with framework stuff

When you go to a page there is no request to generate that page, it's already there, ready to go. That's fast. That's the great part.
Static hosting is important to the JAMstack. unnamed in acronym.

Not all positives, also downsides

CRUD
a database? (airtable? pssst, serverless. serverless DBs like Fauna)

- list some downsides -
  build entire site again for one change. Excludes huge sites from using that strategy. Imagine an e-commerce site with 100K pages having to be entirely rebuilt because you changed a typo in 1 product discription.

not perfect for every site, but much wider usage than you might think it's useful for. Not very limited. The A in JAM gets a lot of that work done.
There is no server, where is the business logic? Secure things? Databases? Payments? Forms?
Also serverless functions fill a lot of the holes in entirely pregenerated sites. Forms, auth, ecommerce, payments (Nick's stripe thing)
sms: twilio
email: mailgun, sparkpost, sendgrid, ...
often hybrid approach. like Gatsby swag store: shopify, some parts static, some parts client-only.
That is a problem for data that changes often. Since pages are built before the site is online. That's where it is often recommended not pre-build you pages and the JAMstack might not be ideal.

Other extreme. one index.html file with div#root. that JAMstack? Chris Coyier says yes https://twitter.com/chriscoyier/status/1130999825078657024
very different, but still connected. statically hosted.

https://css-tricks.com/the-all-powerful-front-end-developer/
https://full-stack.netlify.com/

Full-stack JAMstack

https://css-tricks.com/static-first-pre-generated-jamstack-sites-with-serverless-rendering-as-a-fallback/

GraphQL. serverless GraphQL. Single source of truth. Get data from it during build. also get data from it during runtime. Make same queries. No more loading states. Spinners, not even skeleton-states - link, image? -
Make sure queries are stable. return same data during build and during clientside. only the clientside query will no longer have stale data.
JaSON API does that. The Jasons don't change often, the votes do.
get all data for build. Request data again when you visit the site to get up-to-date data. No more loading states. React is smart, only things that need to be replaced will be. With CSS we can mark the votes at "loading".

prebuild a "shell" that shell (better than skeleton state) hydrates from the endpoint.
Can't do this for everything. Data that HAS to be live can't be done this way. Data is not often _completely_ volatile like that.
