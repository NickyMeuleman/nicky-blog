import React from "react";
import { useContext, useState } from "react";
import { Hello } from "./Hello";

export const Counter = () => {
  const [count, setCount] = useState(0);
  const t = "allez";
  const h = "allez";
  if (false) {
    const theme = useContext("");
  }
  console.log(h, t);
  if (h) {
    return (
      <React.Fragment>
        <Hello name="Nicky" name="Tony" />
        <html lang="foo" />
      </React.Fragment>
    );
  }
  return <button onClick={() => setCount((old) => old + 1)}>{count}</button>;
};
