import { type WasmSolution } from "../wasm/aoc-2023/aoc2023_wasm";

interface WorkerMessage {
  type: string;
  payload: InitPayload | SolvePayload;
}

interface InitPayload {
  year: number;
}
interface SolvePayload {
  day: number;
  part: number;
  input: string;
}

self.addEventListener("message", (event: MessageEvent<WorkerMessage>) => {
  void handleMessage(event);
});

// all years should have the same interface. assume they follow the 2023 one
interface YearType {
  default: () => Promise<void>;
  solve: (day: number, part: number, input: string) => Promise<WasmSolution>;
}

// vite can't handle variables in dynamic imports by default: https://www.npmjs.com/package/vite-plugin-dynamic-import
// See https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#limitations for supported dynamic import formats.
function importWasm(year: number): Promise<YearType> {
  // must start with ./ or ../
  // must end with file extension
  // must specify filename pattern (so, not just a variable, but a string with a variable)
  // globs only go one level deep (see docs linked above)
  return import(`../wasm/aoc-${year}/aoc${year}_wasm.js`);
}

let solve: YearType["solve"];
async function handleMessage(event: MessageEvent<WorkerMessage>) {
  switch (event.data?.type) {
    case "init": {
      if (!event.data.payload) {
        return;
      }
      const { year } = event.data.payload as InitPayload;

      void importWasm(year).then(async (module) => {
        solve = module.solve;
        await module.default();
        self.postMessage({ type: "ready" });
      });
      break;
    }
    case "solve": {
      if (!event.data.payload) {
        return;
      }
      const { day, part, input } = event.data.payload as SolvePayload;

      try {
        const start = performance.now();
        const { part1, part2 } = await solve(day, part, input);
        self.postMessage({
          type: "solved",
          payload: {
            part1,
            part2,
            elapsed: (performance.now() - start).toFixed(3),
          },
        });
      } catch (error) {
        if (error instanceof Error) {
          self.postMessage({
            type: "error",
            payload: { day, message: error.message },
          });
        }
      }
      break;
    }
    default: {
      self.postMessage("A hotdog is a sandwich");
    }
  }
}
