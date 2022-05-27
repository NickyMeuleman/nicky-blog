import { assign, createMachine } from "xstate";

export const aocMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QEMD2BjAss9ALAlgHZgB0sYALgK4AOAxAE5jIQCeioNqs+F+qhDiAAeiAKwAGMSQDMUgGzyA7AA4xayTIA0IdggAsAThUkxARnkyzAJmsSV+1UoC+znWiw4CxEvggAbMDo8VG4wABFkPU5uXn5BJBFEJRl5EmMrQwk5MzMVGX0dPX1rEwdrMyVDM0N9CUVrV3cMbDwiUj9A4NxQ8gAxfEChLh4+ASFRBBVlEgkJJQrDGTElGtUi8SySfXM7JX15LP2XNxAPVu8OgKDh2LGE0EnJaTkxRVV1MU0NhFSlbesjn0NQKZisYhkTTOLS87RITBYRCgAy6CIgYAYABlUCxILdRvEJohpv85gsQSs1iofppTBYrLZ7I4VCdmp42j50Mh-OgqP5kBQglyeXyBXjEiM4uNEpM7IZ0vJmdZVvoHDIlGIfoc0iozEZLPllip6lDzrDOdzefzBXQMQxUAx8VKHkkEHKFUqVWqNVq9SQWakzGJrF8VjIVKaYRzSAB3Xi4ACiDHtDG6vQiUSd9yJCGesgUyjUGmyNLU2128wOR0ckfZlxIcYoieTDrTYRRYCzhJl4ik+behc+310yRUJleqV1jle+lrFzhjdwAGVUP4qPc2+RItEQJLsz3c33Xu8i18SyOEMprLJpmYJMrrIZlFI5+bY-GV2uNyF24NOxK7m7R5exeAsPmLbQL3yNJrHkMdb0MdQqgjU4zWjW0WwYABBQh8AAWzFCAAHl1y7aVgMPf5VHveoZBkWD5CDH48mkaZDCqKQKhqPJGlQqNLjoWBV3XeIcPwwiSIoMiXUmIwqJo6ix2yH0L2MdIChURDYKkRDqlfdCWAgDsAElCBodcACUwAAM2knNzBMcwkKURjYMMYxmN405CFQdF4ESND63IagaDsg86nHYxGQkfRUnsQwaQqf0UnYtQUnMKp9PrTp-xiAlyNdFITGsZZSt2RwbESiQSCUWrKx2A55FsLK4TRJEOzCii72VdIpCUGjjBsYNS0chxjFWFlgwqFqLRFa1ct3QCCtkpQfhkdzZGDA5KnS6owRm98myTFNOtdOKSCa9iCho+QxCfVaL3kbJTB2OQ5FVO79r4usFw-YT9zy50c1KkgbDHIwJDvTS6kKC9+v0dIFnDOiWX65QDtO2VIL0QEZFMe81DouYrBSSFXGcIA */
  createMachine(
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
          actions: ["stopRenderingError"],
        },
        solutionAnimatedOut: {
          actions: ["stopRenderingSolution"],
        },
        addFileInputRef: {
          actions: ["addFileInputRef"],
        },
      },
      states: {
        setup: {
          on: {
            ready: {
              actions: ["addWorker"],
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
              actions: ["setDay"],
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
              actions: ["setInput"],
              target: "idle",
            },
            readerError: {
              actions: ["clearInput"],
              target: "withError",
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
              actions: ["addSolution"],
              target: "withSolution",
            },
            error: {
              target: "withError",
            },
          },
        },
        withError: {
          entry: "enterError",
          on: {
            chooseDay: {
              actions: ["setDay"],
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
              actions: ["clearDay"],
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
        enterSolution: assign((ctx, evt) => {
          return { renderSolution: true };
        }),
        stopRenderingSolution: assign((ctx, evt) => {
          return { renderSolution: false, solutions: null };
        }),
        stopRenderingError: assign((ctx, evt) => {
          return { renderError: false, errorStatus: null };
        }),
        enterIdle: assign((ctx, evt) => {
          return { calculationStatus: "" };
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
        addFileInputRef: assign((ctx, evt) => {
          return {
            fileInputRef: evt.fileInputRef,
          };
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
        addWorker: assign((ctx, evt) => {
          return {
            worker: evt.worker,
          };
        }),
        addSolution: assign((ctx, evt) => {
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
      },
    }
  );
