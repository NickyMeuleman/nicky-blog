---
title: Selecting in CSS
date: "2018"
author: "Nicky Meuleman"
cover: './cover.jpg'
---

<!-- Photo by Andrew Ridley on Unsplash -->

Targeting a specific HTML-element doesn't have to cause headaches. Don't be afraid of CSS, it's here to help.

## CSS family tree

An HTML-element is a **descendant** of another element when it is found **within** the other element.  
An HTML-element is a **child** of another element when it is found a **single level within** the other element.

Ok, that explanation sounded confusing even to me, let's look at an example.

```html
    <div class="quarter-finals">
        <div class="semi-finals">
            <div class="final">
                <div class="champion"></div>
            </div>
        </div>
    </div>
```

In this example, `quarter-finals` is the ancestor of every other element.
`final` is the child(so also descendant!) of `semi-finals`.

```html{5}
    <div class="quarter-finals">
        <div class="semi-finals">
            <div class="final">
                <div class="champion"></div>
                <div class="runner-up"></div>
            </div>
        </div>
    </div>
```

Apart from being an ancestor/parent or descandant/child, an element can also be a **sibling** of another element.
This is the case when the element is found **at the same level** of the other element.
The `runner-up` is the sibling of the `champion`.

These characteristics can be leveraged to select a certain element in CSS.
Say I want to give all descendants of the quarter-finals a border. I could do something like

```css
.quarter-finals div {
  background-color: black;
}
```

That **space** between `.quarter-finals` and `div` is **the descendant combinator**. (the other space before the curly brace is just there for formatting)  
You could read that selector like this: "Select any div-element that is a descendant of any element with the class quarter-finals".

Let's overwite the black background on `semi-finals` with a red one.
We'll use the **child combinator** for this.

```css
.quarter-finals > div {
  background-color: red;
}
```

The **caret** between `.quarter-finals` and `div` is the **child combinator**.  
You could read that selector like this: "Select any div-element that is a child of any element with the class quarter-finals".

The `runner-up` is looking a bit sad, it got so close to the championship.

We can select it with the adjactent **sibling combinator**.

```css
.champion + div {
  background-color: yellow;
}
```

The **plus** between `.champion` and `div` is the **direct sibling combinator**.  
You could read that selector like this: "Select any div-element that immediately follows a div-element with the class champion that has the same parent.

<iframe height='265' scrolling='no' title='QxaLMP' src='//codepen.io/MrNime/embed/preview/QxaLMP/?height=265&theme-id=dark&default-tab=css,result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/MrNime/pen/QxaLMP/'>QxaLMP</a> by Nicky (<a href='https://codepen.io/MrNime'>@MrNime</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

TODO: Combinating, selecting by attribute, pseudo-selectors

Disclaimer: I'm reading a book on CSS and want to learn more by writing about what I read.
