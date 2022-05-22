/* eslint-disable */
let wasm;
import("@nickymeuleman/aoc2021" + "/aoc2021_bg").then((res) => {
  wasm = res;
  self.postMessage({ type: "ready" });
});

self.onmessage = ({ data }) => {
  const startTime = performance.now();
  wasm
    .solve(data.day, data.input)
    .then((res) => {
      const data = {
        part1: res.part1,
        part2: res.part2,
        elapsed: (performance.now() - startTime).toFixed(3),
      };
      self.postMessage({ type: "solved", payload: data });
    })
    .catch((err) => self.postMessage({ type: "error" }));
};
