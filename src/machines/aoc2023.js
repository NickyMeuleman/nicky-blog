/*eslint quotes: ["error", "double"]*/
// !WARNING: paths have to be double quoted or there are weird errors
// backticks are not allowed. because. why David K Piano, why?
import { assign, createMachine } from "xstate";
export const aoc2023Machine = createMachine(
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
    id: "aoc2023machine",
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
                target: "#aoc2023machine.withWorker.withError.fileReadError",
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
                target: "#aoc2023machine.withWorker.withError.calculationError",
              },
              chooseDay: {
                actions: [
                  "clearInput",
                  "setDay",
                  "stopWorker",
                  "clearCalculationStatus",
                ],
                target: "#aoc2023machine.withoutWorker",
              },
              chooseFile: {
                actions: [
                  "clearDay",
                  "stopWorker",
                  "clearCalculationStatus",
                  "queueFile",
                ],
                target: "#aoc2023machine.withoutWorker",
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
          new URL("../utils/aoc2023-worker.js", import.meta.url),
          {
            name: "AoC2023Worker",
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
