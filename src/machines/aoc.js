import { assign, createMachine } from "xstate";

export const aocMachine = createMachine(
  {
    context: {
      day: 1,
      min: 1,
      max: 25,
      input: "",
      worker: null,
      calculationStatus: "Not calculating yet.",
      fileInputRef: null,
      errorStatus: null,
      renderError: false,
      solutions: { part1: null, part2: null },
      renderSolution: false,
    },
    invoke: {
      src: "setupWorker",
    },
    id: "aocMachine",
    initial: "setup",
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
      setup: {
        on: {
          ready: {
            actions: "setWorker",
            target: "idle",
          },
        },
      },
      idle: {
        entry: "enterIdle",
        always: {
          cond: "hasBothInputs",
          target: "calculate",
        },
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
        invoke: {
          src: "readFile",
        },
        on: {
          readerLoaded: {
            actions: "setInput",
            target: "idle",
          },
          readerError: {
            actions: "clearInput",
            target: "withError.fileReadError",
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
            target: "withError.calculationError",
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
  {
    guards: {
      hasBothInputs: (ctx, evt) => {
        return !!ctx.day && !!ctx.input;
      },
    },
    services: {
      setupWorker: (ctx, evt) => (callback, onReceive) => {
        const worker = new Worker(
          new URL("../utils/worker.js", import.meta.url),
          {
            name: "AoCWorker",
            type: "module",
          }
        );
        worker.onmessage = (msg) => {
          switch (msg.data.type) {
            case "ready": {
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
        const { file } = evt;
        const reader = new FileReader();
        reader.addEventListener(
          "load",
          () => {
            callback({ type: "readerLoaded", data: reader.result });
          },
          false
        );
        reader.addEventListener(
          "error",
          () => {
            callback({ type: "readerError", fileName: file.name });
          },
          false
        );

        reader.readAsText(file);
        // to test the error case:
        // reader.dispatchEvent(new Event("error"));
      },
    },
    actions: {
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
      enterIdle: assign((ctx, evt) => {
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
