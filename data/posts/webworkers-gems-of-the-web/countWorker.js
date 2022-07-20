/* eslint-disable no-restricted-globals */
let count = 0;

addEventListener("message", (msg) => {
  switch (msg.data) {
    case "block": {
      const startTime = Date.now();
      while (Date.now() < startTime + 2500) {
        count += 1;
        if (count % 50_000 === 0) {
          postMessage(count);
        }
      }
      postMessage(count);
      break;
    }
    case "jank": {
      const intervalId = setInterval(() => {
        const startTime = Date.now();
        while (Date.now() < startTime + 2500) {
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
      console.log("default case");
    }
  }
});
