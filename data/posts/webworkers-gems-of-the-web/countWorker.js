/* eslint-disable no-restricted-globals */
addEventListener(`message`, (msg) => {
  let count = 0;
  switch (msg.data) {
    case `block`: {
      const startTime = Date.now();
      while (Date.now() < startTime + 3000) {
        count += 1;
        if (count % 50_000 === 0) {
          postMessage(count);
        }
      }
      postMessage(count);
      break;
    }
    case `jank`: {
      const intervalId = setInterval(() => {
        const startTime = Date.now();
        while (Date.now() < startTime + 3000) {
          count += 1;
          if (count % 50_000 === 0) {
            postMessage(count);
          }
        }
        postMessage(count);
      }, 200);
      setTimeout(() => clearInterval(intervalId), 3000);
      break;
    }
    default: {
      console.log(`default case`);
    }
  }
});
