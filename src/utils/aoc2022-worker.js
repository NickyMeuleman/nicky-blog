/*eslint quotes: ["error", "double"]*/
import init, { solve } from "@nickymeuleman/aoc2022";

init().then((res) => {
  self.postMessage({ type: "ready" });
});

// It may look like this: `await init('./pkg/without_a_bundler_bg.wasm');`,
// but there is also a handy default inside `init` function, which uses
// `import.meta` to locate the wasm file relatively to js file.

self.onmessage = async ({ data }) => {
  try {
    console.log(data);
    const startTime = performance.now();
    const result = await solve(data.day, data.input);
    self.postMessage({
      type: "solved",
      payload: {
        part1: result.part1,
        part2: result.part2,
        elapsed: (performance.now() - startTime).toFixed(3),
      },
    });
  } catch (err) {
    self.postMessage({ type: "error", payload: { day: data.day } });
  }
};
