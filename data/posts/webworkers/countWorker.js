/* eslint-disable no-restricted-globals */
addEventListener("message", () => {
  let count = 0;
  const startTime = Date.now();
  while (Date.now() < startTime + 2500) {
    count += 1;
    if (count % 50_000 === 0) {
      postMessage(count);
    }
  }
  postMessage(count);
});
