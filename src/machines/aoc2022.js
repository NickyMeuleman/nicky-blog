/*eslint quotes: ["error", "double"]*/
// !WARNING: paths have to be double quoted or there are weird errors
// backticks are not allowed. because. why David K Piano, why?
import { assign, createMachine } from "xstate";
export const aoc2022Machine =
  /** @xstate-layout N4IgpgJg5mDOIC5QEMD2BjATABk5gtsugBYCWAdmAHQDupALsagK70DqqATgNZicDEAbWwBdRKAAOqWA1Kpy4kAA9EAVkwAaEAE9EARkwBOVVQBsADlyZzAZgAsAdifnMAX1da0WK4RIVqdIwcPHxUsGD0zBL8nGDIENrCYkggUjL0cgopKgh22KZUeqbFpnYGNqoVRVq6CAZGZjY46pWm2Hr57p4YOHi+ZJS0DMTBvJxUpBAANmD8JKjSYAAiyImiimmy8oo5bdiFNnqODhWqxg41+no2DlRl5qrY2HZ2mI92hl0gXr0ERAMBYajUKTGZzJiLABipBmSQ20i2WVAOQcRyo2EMpiM2FU5lsDnMhkudUwNkMVEJpnsmLJhMwpi+Px8-38QyCXDGE2mszhKU2GW22UQqLs6Mx2Nx+MJxIMhn2FUMhj0qjsxRs2HMDI83x6zL8g0CIw5IO5Qj0yUkCIFSOUiGKeioxlMKtUqj0ejx1R0iDl+xeqLw7raePMjN1fRZBqBxvGsXiFCg0LB6BmyE4SbAAEVmGAc7zLelMjsfViqI8nNdDgTUXoZQYTMq2vW8i6w94I-rAeyQrG4hAExmYn2+AAZVDxSD51JWotChAisVYuWSm7S711I42Ck2GwuUwON0ODFt379VmG4G9+PkRMw2ZxiB8ACinE4XCn-NnyP0z1FGqa1yWKYyqkjKeAFGUbo3EYpTPDYJ56gCbJGj2VDoMgUzoMwUzIPQszoZh2G4ZO6x8jOgrfgg9j7IY5h2DuFiVLgJx2MSliirudhnIYeAOMu8HakyHZIReMZoRhWE4Xh-B8G+nAfuRNo5Iq5L2DYVKumcGqaOuljkpgqq4jxuB4hqCHCee0aoQRknEeCCzhCsawWtOhYUbaCCGA4BSqN5DiYO6Sp5FixJUlu1FNGSLwYh65l-J2yGXuJhFSfhELhBmCluUpPpOFQDivBqth6NW7rElxtz0S2moPOqmAOHFZ5Rt2nKGi+cn2YsTlZYixa5PkhQlKU5SVG6pgyhU+ztLYFROI4ZJat07bxSJVmtcM7VcJ1GV3j11p9cFg0lGUpKjV6tRHJUjpnOqzrXKqdGNZGXYoetjAAMqoFMrCZNtyyrHtX4eZNjp0QxtXMfYdYDcYHz0RW6l4E9CWiahhqfd91p-ZlpEFr1c4g7R9HqRD9VQ+uipbni-m7oqdHXHo7jauQqCPvAKRCSt-jwtlfUALTjeuAvI6tjAsOwMY8-jlGvGxDqOEqw2nVUi06stTUvZeUv7XO7oOvkbrtFiFQq8STSYKD5gFcBpMNYJ4Zc81r2hOEkQSNrQM5CVtwGx0RTK2NYHqI6HrqEYHwBZqIuWS1JozB77k5K6+zezio0hvuYG7nc5gdKSO75HiqjR07SUPgOd4JzlCBW+YdxebdLg3OqqhgfSVCR6NrxW9Yxf2+rz2JWJNlEXhVd9fTjrqg9BnXCc5hsaU+V+8nRgwZ8-enoPqNvcQm2cOPutnOid1GwH536EYW55LnOLtBimpuJviEx874xta+XDJbZ1r74flE4B9qff2JtA7riOPVCklQygHg6LRLEJdNZiQ-nJKgAAzO8AAlPsf8yK8znAFW4ZN4at3AXYTUVB7BGEVL5eqlRQzPwsqXZBwwMY-Xcp+RO+g8q+zPqAi+dQMSVUPNgQ4mpRF93cEAA */
  createMachine(
    {
      context: {
        day: 1,
        min: 1,
        max: 25,
        input: "",
        worker: null,
        calculationStatus: "",
        fileInputRef: null,
        errorStatus: null,
        renderError: false,
        solutions: { part1: null, part2: null },
        renderSolution: false,
        queuedFile: null,
      },
      id: "aoc2022machine",
      initial: "withoutWorker",

      on: {
        errorAnimatedOut: {
          actions: "stopRenderingError",
        },
        solutionAnimatedOut: {
          actions: "stopRenderingSolution",
        },
        setFileInputRef: {
          actions: "setFileInputRef",
        },
      },

      states: {
        withoutWorker: {
          always: {
            target: "withWorker",
          },
        },

        withWorker: {
          initial: "setup",
          invoke: {
            src: "setupWorker",
          },
          states: {
            setup: {
              on: {
                ready: {
                  actions: ["setWorker"],
                  target: "idle",
                },
              },
            },
            idle: {
              entry: ["clearCalculationStatus"],
              always: [
                {
                  cond: "hasQueuedFile",
                  target: "readingFile",
                },
                {
                  cond: "hasBothInputs",
                  target: "calculate",
                },
              ],
              on: {
                chooseDay: {
                  actions: "setDay",
                },
                chooseFile: {
                  target: "readingFile",
                },
              },
            },
            readingFile: {
              invoke: { src: "readFile" },
              on: {
                clearFileQueue: { actions: ["clearFileQueue"] },
                readerLoaded: { actions: ["setInput"], target: "idle" },
                readerError: {
                  actions: ["clearInput"],
                  target: "#aoc2022machine.withWorker.withError.fileReadError",
                },
              },
            },
            calculate: {
              entry: "setCalculating",
              invoke: {
                src: "doCalculation",
              },
              on: {
                calculated: {
                  actions: "setSolution",
                  target: "withSolution",
                },
                error: {
                  target:
                    "#aoc2022machine.withWorker.withError.calculationError",
                },
                chooseDay: {
                  actions: [
                    "clearInput",
                    "setDay",
                    "stopWorker",
                    "clearCalculationStatus",
                  ],
                  target: "#aoc2022machine.withoutWorker",
                },
                chooseFile: {
                  actions: [
                    "clearDay",
                    "stopWorker",
                    "clearCalculationStatus",
                    "queueFile",
                  ],
                  target: "#aoc2022machine.withoutWorker",
                },
              },
            },
            withError: {
              entry: "enterError",
              initial: "calculationError",
              states: {
                calculationError: {},
                fileReadError: {},
              },
              on: {
                chooseDay: {
                  actions: "setDay",
                  target: "idle",
                },
                chooseFile: {
                  target: "readingFile",
                },
              },
            },
            withSolution: {
              entry: "enterSolution",
              on: {
                chooseDay: {
                  actions: ["clearInput", "setDay"],
                  target: "idle",
                },
                chooseFile: {
                  actions: "clearDay",
                  target: "readingFile",
                },
              },
            },
          },
        },
      },
    },
    {
      guards: {
        hasBothInputs: (ctx, evt) => {
          return !!ctx.day && !!ctx.input;
        },
        hasQueuedFile: (ctx, evt) => {
          return !!ctx.queuedFile;
        },
      },
      services: {
        setupWorker: (ctx, evt) => (callback, onReceive) => {
          const worker = new Worker(
            new URL("../utils/aoc2022-worker.js", import.meta.url),
            {
              name: "AoC2022Worker",
              type: "module",
            }
          );
          worker.onmessage = (msg) => {
            switch (msg.data.type) {
              case "ready": {
                console.log("MACHINE WORKER: received ready");
                callback({
                  type: "ready",
                  worker,
                });
                break;
              }
              case "solved": {
                callback({
                  type: "calculated",
                  part1: msg.data.payload.part1,
                  part2: msg.data.payload.part2,
                  elapsed: msg.data.payload.elapsed,
                });
                break;
              }
              default: {
                callback({ type: "error", day: msg.data.payload.day });
                break;
              }
            }
          };
        },
        doCalculation: (ctx, evt) => {
          ctx.worker.postMessage({ day: ctx.day, input: ctx.input });
        },
        readFile: (ctx, evt) => (callback, onReceive) => {
          const file = ctx.queuedFile ? ctx.queuedFile : evt.file;
          if (ctx.queuedFile) {
            callback({ type: "clearFileQueue" });
          }
          const reader = new FileReader();
          reader.addEventListener(
            "load",
            () => {
              callback({ type: "readerLoaded", data: reader.result });
            },
            { once: true }
          );
          reader.addEventListener(
            "error",
            () => {
              callback({ type: "readerError", fileName: file.name });
            },
            { once: true }
          );

          reader.readAsText(file);
          // to test the error case:
          // reader.dispatchEvent(new Event("error"));
        },
      },
      actions: {
        clearFileQueue: assign((ctx, evt) => {
          return { queuedFile: null };
        }),
        queueFile: assign((ctx, evt) => {
          return { queuedFile: evt.file };
        }),
        stopWorker: assign((ctx, evt) => {
          ctx.worker.terminate();
          return { worker: null };
        }),
        setFileInputRef: assign((ctx, evt) => {
          return {
            fileInputRef: evt.fileInputRef,
          };
        }),
        setWorker: assign((ctx, evt) => {
          return {
            worker: evt.worker,
          };
        }),
        setSolution: assign((ctx, evt) => {
          return {
            solutions: { part1: evt.part1, part2: evt.part2 },
            calculationStatus: `${evt.elapsed} ms`,
          };
        }),
        setCalculating: assign((ctx, evt) => {
          return { calculationStatus: "Calculating" };
        }),
        setDay: assign((ctx, evt) => {
          if (evt.day === "") {
            return { day: "" };
          }
          const num = Number(evt.day);
          if (num >= ctx.min && num <= ctx.max) {
            return { day: num };
          }
          // out of range, do nothing
          return { day: ctx.day };
        }),
        setInput: assign((ctx, evt) => {
          return { input: evt.data };
        }),
        clearCalculationStatus: assign((ctx, evt) => {
          return { calculationStatus: "" };
        }),
        enterSolution: assign((ctx, evt) => {
          return { renderSolution: true };
        }),
        enterError: assign((ctx, evt) => {
          const errorStatus = evt.day
            ? { day: evt.day }
            : { fileName: evt.fileName };
          return {
            calculationStatus: "Error",
            errorStatus,
            renderError: true,
          };
        }),
        stopRenderingSolution: assign((ctx, evt) => {
          return { renderSolution: false, solutions: null };
        }),
        stopRenderingError: assign((ctx, evt) => {
          return { renderError: false, errorStatus: null };
        }),
        clearDay: assign((ctx, evt) => {
          return {
            day: "",
          };
        }),
        clearInput: assign((ctx, evt) => {
          ctx.fileInputRef.current.value = "";
          return {
            input: "",
          };
        }),
      },
    }
  );
