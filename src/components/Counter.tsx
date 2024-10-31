import { useState } from "react";

export const Counter = () => {
  const [count, setCount] = useState(0);
  const t = "allez";
  const h = "allez";
  return <button onClick={() => setCount((old) => old + 1)}>{count}</button>;
};
