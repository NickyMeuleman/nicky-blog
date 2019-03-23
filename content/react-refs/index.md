---
title: React refs
date: '2019-03-23'
author: 'Nicky Meuleman'
cover: './cover.jpg'
tags: ['React']
---

<!-- Cover photo of two reference monitors. A funny joke, as you will undoubtedly agree. -->

> TL;DR: In function components, pick `useRef`, otherwise, pick `createRef`

In React, a ref is an object with a mutable `current` property.
That's it. You can see the [implementations](#implementations) below but they boil down to this: `ref = { current: //something }`  
That `current` property is often set to hold a _reference_ to a DOM-element, like an `<audio>`-element

Getting a reference to an element allows you to directly give it commands.
This is useful for controlling media playback, managing focus and more.

It might be tempting to do this everywhere, but [resist](https://reactjs.org/docs/refs-and-the-dom.html#dont-overuse-refs) that temptation.

## Basic usage: DOM Refs

The goal is to get a reference to an `<audio>`-element.
This will allow you to directly call `.play()` and `.pause()` on that element.

There are quite a few ways of achieving the same goal.  
The steps are always the same however.

Several examples can be viewed in this [codesandbox demo](https://codesandbox.io/s/4jzlzr7937)

> Code shown: using createRef in a class based component with a constructor

- Create the ref object

```js
// inside the constructor
this.audioRef = React.createRef();
// this.audioRef = { current: null }
```

- Attach a reference to a DOM-element to that ref object

```js
// inside the render() method
<audio ref={this.audioRef} />
// this.audioRef = { current: <audio /> }
```

- Use it

```js
handlePlay = () => {
  this.audioRef.play();
};
```

## Other usecases

### Referring to React Components

The examples above showed how to get a reference to a DOM-node.
That's not the only thing refs are good for. They can also point to a React-Component

[Codesandbox demo](https://codesandbox.io/s/9jxqj20wqo?expanddevtools=1&fontsize=14&module=%2Fsrc%2FParentComponent.js&moduleview=1)

Important note: you can **only** reference **class based components** this way

### Referring to a DOM-element inside a React Component

What about when you made yourself a fancy `Input` component and want a ref to point directly at the html `<input>`, so you can call `inputRef.current.focus()`?

```jsx
<Input ref={inputRef} />
```

There is a problem! It either points to the React Component object if your `Input` is a class component, or it throws a big fat error if your `Input` is a function component.

That _big fat error_ is actually really helpful:

```error
Warning: Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?
```

This [Codesandbox demo](https://codesandbox.io/s/pyqq0o9mk7) shows three `Input` components.
One is focussed through a ref.

Having to wrap your function component in `React.forwardRef` can become quite tedious.
In the future, this usage of `forwardRef` might become [default behaviour](https://twitter.com/dan_abramov/status/1109512531209584640)

## createRef vs. useRef

While `createRef` and `useRef` are **very** similar. There are some subtle differences.
`useRef` creates an object `{current : initialValue}` and returns it the first time it gets called. If that object already exists, `useRef` will return the existing one instead.
`createRef` will create an object `{current : null}` each time it is called.

## implementations

### createRef

```js
export function createRef() {
  const refObject = {
    current: null
  };
  if (__DEV__) {
    Object.seal(refObject);
  }
  return refObject;
}
```

The [`createRef` implementation](https://github.com/facebook/react/blob/f33e5790b83dc1ae41b2b7d59d53420e7c8383aa/packages/react/src/ReactCreateRef.js) in the React codebase

### useRef

```js
export function useRef(initialValue) {
  currentlyRenderingFiber = resolveCurrentlyRenderingFiber();
  workInProgressHook = createWorkInProgressHook();
  let ref;

  if (workInProgressHook.memoizedState === null) {
    ref = { current: initialValue };
    if (__DEV__) {
      Object.seal(ref);
    }
    workInProgressHook.memoizedState = ref;
  } else {
    ref = workInProgressHook.memoizedState;
  }
  return ref;
}
```

The [`useRef` implementation](https://github.com/facebook/react/blob/8482cbe22d1a421b73db602e1f470c632b09f693/packages/react-reconciler/src/ReactFiberHooks.js#L500-L515) in the React codebase
