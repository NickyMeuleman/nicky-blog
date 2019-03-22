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
That `current` property is often set to hold a _reference_ to a DOM-element, like an `<input>`

Getting a reference to an element allows you to directly give it commands.
This is useful for controlling media playback, managing focus and more.

It might be tempting to do this everywhere, but [resist](https://reactjs.org/docs/refs-and-the-dom.html#dont-overuse-refs) that temptation.

## Basic usage

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

## insert subtitle here

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
