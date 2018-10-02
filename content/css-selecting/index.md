---
title: Selecting in CSS
date: "2018-06-21"
author: "Nicky Meuleman"
cover: "./cover.jpg"
tags: ["CSS", "Howto"]
---

<!-- Photo by Andrew Ridley on Unsplash -->

Targeting a specific HTML-element doesn't have to cause headaches. Don't be afraid of CSS, it's here to help.
Many are comfortable with selecting by class (with a dot `.`) or IDs (with the octothorpe `#`). Those are far from the only tools in the CSS shed.
I hope after reading this blogpost your toolchest will be a little bit bigger!

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
Say you want to give all descendants of the quarter-finals a background color. You could do something like

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
You could read that selector like this: "Select any div-element that immediately follows an element with the class champion and has the same parent."

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
You could read that selector like this: "Select any div-element that follows an element with the class champion and has the same parent."

## Pseudo-class selectors

If you want to apply CSS-rules based on the **state** of an element, or **structure** (eg: only target every odd element) within that element, pseudo-classes are for you! You can recognize them by their colon `:`.

```css
a:hover {
  color: white;
}
```

The rule above only targets a-elements that are being hovered. It falls under the **state** part.

If we want to select the first element in a list, we rely on a **structure** pseudoselector, like `:first-child`

We forgot to give the `.champion` above a special color.

```css
.final :first-child {
  background-color: gold;
}
```

Notice that space between `.final` and `:first-child`? It's the descendant selector we talked about earlier. It should be there because **pseudo-classes only target the element it is attached to**.  
This selector is very specific, what if a different element appears above the `.champion`?

```html{4}
    <div class="quarter-finals">
        <div class="semi-finals">
            <div class="final">
                <span>in this match</span>
                <div class="champion"></div>
                <span>won against</span>
                <div class="runner-up"></div>
            </div>
        </div>
    </div>
```

Gone is that glorious background-color for the champion. `:first-child` does exactly what it says, it selects the element it is attached to if it is the first child. It's not attached to anything, you say? Think of it like it's written like this: `.final *:first-child`  
Don't fear for the champion, we can select the first-child _of a certain type_ with `:first-of-type`

```css
.final div:first-of-type {
  background-color: gold;
}
```

It doesn't stop at the first of something. You also have to opposite: `:last-child` and `:last-of-type`.
You can also select an element at a specific position with `:nth-child()` and `:nth-of-type()`.

What should be between those parenteses is a number. Or simple math that evaluates to numbers.

`li:nth-of-type(3)` will select the third list item. Not the fourth one like a lot of programmers who are accustomed to start counting at 0 would think!

![arrays start at 0](https://i.imgur.com/VRSkSGd.jpg)

```css
li:nth-child(2n + 1) {
  font-weight: bold;
}
```

Will bold every odd element in a list. The browser runs that simple equation and enters 0,1,2,... in place of `n` and uses the resulting number.

Those are only a couple examples, I encourage you to explore more about [pseudo-classes on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes).

## Pseudo-elements

Closely related to the pseudo-classes are the pseudo-elements.  
Where the **pseudo-classes** selected an **element**.  
The **pseudo-elements** will select **part of an element**.

The syntax is also very similar.  
With pseudo-classes you use a single colon `:`.  
With pseudo-elements you use two colons `::`

Many browsers will let you get away with only using a single colon. Just because you _can_ doesn't mean you _should_.

```css
span::first-letter {
  color: green;
}
```

This bit of CSS would make the starting letters of our 2 `spans` in our example green.

There are many more options, you can read/learn about them on [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/pseudo-elements).

## Attribute selectors

You can also select elements based on their attributes and the values of their attributes. Which is really what you are already doing when using the ID(`#`) or class(`.`) selector if you think about it.

```html
    <div class="really-fast-drive lemans-winner tiny">
        Fernando Alonso
    </div>
    <div class="really-slow-driver non-lemans-winner tall">
        Nicky Meuleman
    </div>
```

The simplest form is just checking if an attribute is present.

```css
div[class] {
  /* Fernando Alonso is so tiny in real life */
}
```

This will only target divs that have a class attribute.

To match an element that has an exact value for an attribute

```css
span[class="really-fast-driver"] {
  font-weight: bold;
}
```

This would make Alonso bold right? Wrong! The value has to be exact, we are only specifying one class, not all of them (they also needed to be in exactly the right order for this to work.)

```css
div[class~="really-fast-driver"] {
  font-weight: bold;
}
```

This hits the spot.  
The **tilde** selects any element with an attribute whose value is **within a space-seperated list**

Let's select all elements that have a class attribute that starts with `really`

```css
div[class^="really"] {
  color: red;
}
```

The **up-caret** selects any element with an attribute that **starts with** the given value.
Remember: this wouldn't work if `really-fast-driver` and `really-slow-driver` weren't the first in the list of classes!

```css
div[class|="really"] {
  color: red;
}
```

The **pipe** selects any element with an attribute that **starts with** the given value, optionally **followed by a dash**.

```css
div[class$="driver"] {
  background-color: black;
}
```

The **dollar-sign** selects any element with an attribute that **ends with** the given value.

```css
div[class*="lemans"] {
  border: 1px solid blue;
}
```

The **asterisk** selects any element with an attribute that **contains** the **substring** of the given value.

#### Case sensitivity

Including an `i` before the closing bracket will make the selector insensitive to case.

```css
div[class*="LeMans" i] {
  border: 1px solid blue;
}
```

The selector above will match the same elements as the example without the capitals and the i.

## Combining

We already had a taste of combining when we used the descendant selector in the section about pseudo-classes.

How would you go about selecting the label for a checkbox that is checked? You have this HTML to work with, the author didn't follow proper accessibility-guidelines and left off the [`for` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label).

```html
<input type="checkbox">
<label>Belgium wins the world cup</label>
```

A possible way to do that would be:

```css
input[type="checkbox"]:checked + label {
  color: red;
}
```

You could read that selector like this: "Select any `label` element that has an `input` immediately preceding it. That input should have `checkbox` as value for the `type` attribute and it should be checked."  
The CSS-rule will only be applied when all these conditions are met!

## Even more tools

CSS has many more useful features, you can come accross some symbols you don't recognize as being at home in CSS.
You might even be looking at a CSS (pre)processor, like [SASS/SCSS](https://sass-lang.com/). A symbol you see very often there that's not available in regular CSS is the ampersand `&`. It is used to refer to the the parent selector (yes, nesting in CSS 🤯).
CSS-tricks has a great [article](https://css-tricks.com/the-sass-ampersand/) that will help you understand it.

Sources used:

- [MDN docs](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors)
- [CSS-tricks](https://css-tricks.com/)
- [CSS: The definitive guide](http://shop.oreilly.com/product/0636920012726.do)
