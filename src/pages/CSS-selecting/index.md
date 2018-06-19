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

## Combinator selectors

These characteristics can be leveraged to select a certain element in CSS.
Say you want to give all descendants of the quarter-finals a border. I could do something like

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

We can select it with the adjacent **sibling combinator**.

```css
.champion + div {
  background-color: yellow;
}
```

The **plus** between `.champion` and `div` is the **adjacent sibling combinator**.  
You could read that selector like this: "Select any div-element that immediately follows a div-element with the class champion and has the same parent."

<iframe height='265' scrolling='no' title='QxaLMP' src='//codepen.io/MrNime/embed/preview/QxaLMP/?height=265&theme-id=dark&default-tab=css,result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/MrNime/pen/QxaLMP/'>QxaLMP</a> by Nicky (<a href='https://codepen.io/MrNime'>@MrNime</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

If any element comes between the `.champion` and the `.runner-up` so they no longer directly follow eachother, the adjacent sibling combinator won't work. That's a good time to use the **general sibling combinator**.

```html{5}
    <div class="quarter-finals">
        <div class="semi-finals">
            <div class="final">
                <div class="champion"></div>
                <span>won against</span>
                <div class="runner-up"></div>
            </div>
        </div>
    </div>
```

This means our `.runner-up` will no longer have a yellow background. It doesn't immediately follow the `.champion` anymore so the CSS we wrote above won't style it. Let's fix it

```css
.champion ~ div {
  background-color: yellow;
}
```

The **tilde** between `.champion` and `div` is the **general sibling combinator**.  
You could read that selector like this: "Select any div-element that follows a div-element with the class champion and has the same parent."

## Pseudo-class selectors

If you want to apply CSS-rules based on the **state** of an element, or **structure** (only target every odd element) within that element, pseudo-classes are for you!

```css
a:hover {
  color: white;
}
```

The rule above only targets a-elements that are being hovered. It falls under the **state** part.

If we want to select the first element in a list, we rely on a **structure** pseudoselector `:first-child`

We forgot to give the `.champion` above a special color.

```css
.final :first-child {
  background-color: gold;
}
```

This selector is very specific, what if a different element appears above the `.champion`?

```html{4}
    <div class="quarter-finals">
        <div class="semi-finals">
            <div class="final">
                <span>In this match</span>
                <div class="champion"></div>
                <span>won against</span>
                <div class="runner-up"></div>
            </div>
        </div>
    </div>
```

Gone is that glorious background-color for the champion. `:first-child` does exactly what it says, it selects the first child of the element the pseudoclass is attached to.
Don't fear, we can select the first-child _of a certain type_ with `:first-of-type`

```css
.final div:first-of-type {
  background-color: gold;
}
```

It doesn't stop at the first of something. You also have to opposite: `:last-child` and `:last-of-type`.
You can also select an element at a specific position with `:nth-child()` and `:n-th-of-type()`.

What should be between those parenteses is a number. Or math that evaluates to a number.
Every programmer should be delighted that CSS starts counting at 1, not 0. That is not a source of confusion at all.

**insert arrays start at 0 joke here**

TODO: Combinating, selecting by attribute, pseudo-selectors

Disclaimer: I'm reading a book on CSS and want to learn more by writing about what I read.
sources:

* [MDN docs](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors)
* [CSS-tricks](https://css-tricks.com/)
* [CSS: The definitive guide](http://shop.oreilly.com/product/0636920012726.do)
