---
title: Setting up a fresh development environment, part 3
date: "2018-05-28"
author: "Nicky Meuleman"
cover: './cover.jpeg'
---

This is part 3, please also check out [part 1](/blog/fresh-development-environment-part-1) and [part 2](/blog/fresh-development-environment-part-2)

## Useful browser extensions for (web)dev

Most of the time I spend sitting behind a computer is dominated by 2 applications, the code editor and the browser.
The browser I use for development is often Chrome (canary), so this list will be entirely filled by chrome-extensions

### [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)

A must-have for anyone coding in React.
React Dev Tools allow you to select a component like an HTML-tag.
You can view/manipulate it's props or state.

_[More info](https://github.com/facebook/react-devtools)_

### [Redux Developer Tools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)

What the React Dev Tools are to React, the Redux Dev Tools are to Redux.
You will be able to see the store, the actions and even dispatch actions.

_[More info](https://github.com/zalmoxisus/redux-devtools-extension)_

### [Apollo Client Devtools](https://chrome.google.com/webstore/detail/apollo-client-developer-t/jdkknkkbebbapilgoeccciglkfbmbnfm)

Continuing in the same direction, the Apollo Client Devtools supplies you with lots of Apollo-GraphQL goodies, including the awesome [GraphiQL](https://github.com/graphql/graphiql)

_[More info](https://github.com/apollographql/apollo-client/blob/master/docs/source/features/developer-tooling.md#apollo-client-devtools)_

### [aXe](https://chrome.google.com/webstore/detail/axe/lhdoppojpmngadmnindnejefpokejbdd?hl=en-US)

Checking for accessibility issues is made easier by the aXe extension.
Tip: use alongside the Chrome Lighthouse accessibility check.

_[More info](https://github.com/dequelabs/axe-core)_

### [Refined Github](https://chrome.google.com/webstore/detail/refined-github/hlepfoohegkhhmjieoechaddaejaokhf)

I love Github, that doesn't mean it can't be better.
Refined Github does that. It adds to and tweaks the default Github-site, making your experience/workflow smoother.

_[More info](https://github.com/sindresorhus/refined-github)_

### [Wappalyzer](https://chrome.google.com/webstore/detail/wappalyzer/gppongmhjkpfnbhagpmjfkannfbllamg?hl=en)

Wondering what technology was used to make an awesome site you are on?
Wappylyzer attempts to answer that question.

_[More info](https://www.wappalyzer.com/)_

### [JSON Formatter](https://chrome.google.com/webstore/detail/json-formatter/bcjindcccaagfpapjjmafapmmgkkhgoa?hl=en)

Often times the data you are working with is presented in the JSON format.
Without formatting, finding what you are looking for in a large JSON-object feels like looking for a needle in a haystack.
JSON Formatter displays JSON in a very readable way.
It is now much easier to get to `MRData.RaceTable.Races[0].QualifyingResults[0]` in that giant object the [Ergast F1 API](https://ergast.com/mrd/) gave me to see my boy Danny Ric [crushed](https://www.formula1.com/en/latest/headlines/2018/5/qualifying-ricciardo-crushes-opposition-monaco-f1.html) qualifying in Monaco.

_[More info](https://github.com/callumlocke/json-formatter)_

## Other setup not directly related to dev

Over the course of 3 posts I told you what I did to setup my dev environment the way I like.
I didn't tell you everything. Here are some programs I use that aren't directly related to programming.

### [f.lux](https://justgetflux.com/)

I'm a night owl, f.lux helps me reduce the eyestrain from looking at a monitor at night.
F.lux adapts your display to the time of day, warming the colors at night.
The yellow color on your screen at night might seem a bit hash at first.
Give it a fair shot, it's fantastic.

### [ShareX](https://getsharex.com/)

A great tools for taking screenshots. No matter if you onoly want to capture an area, your whole screen or the entire webpage, ShareX can handle it.
You can configure the tool to automatically upload your screenshot to a multitude of online services.
It's also a handy tool to make small video's/gifs, has an eyedropper-tool, can check MD5/SHA/... hashes, and much more (I think the developer made this for himself, adding features he could use and the users of this piece of software benefit from it!)

### [KeePass](https://keepass.info/)

An excellent open source password manager.

### [Reddit Enhancement Suite](https://github.com/honestbleeps/Reddit-Enhancement-Suite)

A browser extension that makes changes and additions the reddit site.
I didn't add it to the browser-extension list because it's not really webdev related.
It can be. Here are some subreddits you can follow: [r/webdev](https://www.reddit.com/r/webdev/), [r/reactjs](https://www.reddit.com/r/reactjs/), [r/frontend](https://www.reddit.com/r/Frontend/), [r/javascript](https://www.reddit.com/r/javascript/)

### [HWiNFO64](https://www.hwinfo.com/download.php)

Do you like to keep an eye on your CPU-temperature at all times?
I do and HWiNFO can also show me whatever other hardware information I would like to know about this machine.
