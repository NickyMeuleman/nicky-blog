import React from "react";
import { useContext, useState } from "react";

export const Counter = () => {
  if (false) {
    const theme = useContext("");
  }
  const [count, setCount] = useState(0);
  const t = "allez";
  const h = "allez";
  console.log(h, t);
  if (h) {
    return <React.Fragment>stuff</React.Fragment>;
  }
  return <button onClick={() => setCount((old) => old + 1)}>{count}</button>;
};
