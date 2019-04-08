---
title: React memo
date: '2019-04-09'
author: 'Nicky Meuleman'
cover: './cover.jpg'
tags: ['React']
---

In many situations, a React component will re-render when it doesn't have to.
If the result of rendering would be exactly the same as the previous time the component rendered, skipping that render ([reconciliation](https://reactjs.org/docs/reconciliation.html)) step entirely is desirable.

In class components, the method `shouldComponentUpdate` allows this.
It's a [lifecycle method](https://reactjs.org/docs/react-component.html#commonly-used-lifecycle-methods) that is called before [`render()`](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/). The method returns a boolean. That boolean tells React if `render()` can be skipped. When `true`, the `render()` will be executed like it normally would. When `false`, that tells React it **can** skip executing the `render()`.

`shouldComponentUpdate()` is called with the next props and the next state. This allows complex logic where the current props/state are compared to the previous props/state in order to determine if the output would be different and thus, the _component should update_.

By default, `shouldComponentUpdate()` returns `true`.
Not specifying this method at all is the same as

```js
shouldComponentUpdate(nextProps, nextState) {
 return true
}
```

Don't rely on this to prevent rendering altogether. It might work right now, but it can lead to bugs and is likely to change in [the future](https://youtu.be/nLF0n9SACd4). Instead, treat it as a hint to React that tells it _"you can safely skip rendering this, the result will be the same as the previous result anyway"_.

The logic in `shouldComponentUpdate` can quickly get very complex and is prone to mistakes.
Before you know it, that method will look something like this

```js
shouldComponentUpdate(nextProps, nextState) {
  const propsComparison = this.props.a !== nextProps.a && this.props.b !== nextProps.b && this.props.c !== nextProps.c && this.props.d !== nextProps.d
  const stateComparison = this.state.one !== nextState.one && this.state.two !== nextState.two && this.state.three !== nextState.three
 return propsComparison && stateComparison
}
```

_😢 I just wanted to check if **any** props or state changed, why is that so hard?_

`React.PureComponent` does exactly that! 😎

`PureComponent` performs a shallow comparison of props and state (by using [Object.is](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)).
This reduces the chance that you’ll skip a necessary update.
Unless you are confident you need a custom `shouldComponentUpdate`, prefer `PureComponent`.

That means these two snippets are equivalent

```js
class Driver extends React.Component {
  shouldComponentUpdate() {
    // a shallow comparison of all the props and state
  }
  render() {
    <p>{this.props.name}</p>;
  }
}
```

```js
class Driver extends React.PureComponent {
  render() {
    <p>{this.props.name}</p>;
  }
}
```

When trying to apply that same optimization to function components instead of class based ones, a problem rears its head. Function components can't really skip that render step. The function component (which is really just a function) is either executed or it isn't.

This is where [memoization](https://en.wikipedia.org/wiki/Memoization) helps.
Memoization is basically technobabble for _remembering something for later_.

React can't just remember pieces of data for later, it can remember _entire components_.

`React.memo` does this!

What the previous two examples were for class based components, `React.memo` is for function components.

Instead of skipping the render-step like in class based components when the props are equal between two renders. `React.memo` will reuse the last rendered result instead.

```js
// the function component
const Driver = props => {
  return <p>{props.name}</p>;
};
// exporting the memoized function component
export default React.memo(Driver);
```

- Initial render of the memoized Driver component with props `{ name: "Charles Leclerc" }`
  The function component renders `<p>Charles Leclerc</p>`.
- The props change to `{ name: "Daniel Ricciardo" }`
  The components renders `<p>Daniel Ricciardo</p>`
- Something else changes and triggers an update to our Driver component
  `React.memo` sees that the props haven't changed.
  Instead of calculating the render result, React uses the previous result: `<p>Daniel Ricciardo</p>`
