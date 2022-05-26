import { assign, createMachine } from "xstate";

export const aocMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QEMD2BjAss9ALAlgHZgB0sYALgK4AOAxAE5jIQCeioNqs+F+qhDiAAeiAKwAGMSQDMUgOwBGGQDYZAFgCci+WPUAaEOwSr5JTQA558lZu2X1isQF9nhtFhwFiJfBAA2YHR4qNxgACLIxpzcvPyCSCKI8qrmFjIATHZammIqGWKGxjKKGSQWUhYZipYymuoWLm4gHth4RKR+gcG4oeQAYviBQlw8fAJCoggWKmYSEvLVmjJiSpryFkWI6vLqJI4NkgUWubau7hht3p0BQSOx4wmgU5LScqvKalo6elsIBRISBITjJ5Os9GJNBIMhZzi1Ll4OiQmCwiFBBt0URAwAwADKoFiQe5jeKTRAzOYLJYrNYbP4yKz7MG5HLpFSKOGtRE+dDIfzoKj+ZAUIK8-mC4VExKjOITRJTDISTTmFQNGHfaqKP6Q6QZeQLbT6mpVJoXTztHl8gVCkV0HEMVAMYmyp5Jf5KlVqiwaxRaoziZSyLJ1MRiRTpdbyTkIi2kADuvFwAFEGA6GD0+hEos7HmSEK9ZApPhpDb9-QgGjJzAsJCsZKCdipTfDzdcSAmKMnU46M2EMWAc6T5eIpIWPqoSz8DOWVDMSDZfZoVBInPrdtHW0iO7gAMqofxUR698iRaIgGW54f50fvJQT766afGVaA701d6WKnqDdXLeJvcHkeIR9kMA7Sg8Q7PCObxFvepZPskGjzhkOyKOoEiqjCOg-tyQT2o6ACChD4AAtpKEAAPKHoOcpQdeZgbCueS7E46x+sYljmBoJxiBky46poGQ4bGdCwPuh7xERpHkVRFA0a6UxaAx0LQt6S7rHI8h-KUrjNIQqDYvAiRcrGZCULQ8l5uhFiyJYfFiBYNTrOyMh-Oh0jpDY1T3vMQnNCZbZdGBMQkrRbopDZGR1nYMIWOk3puRIey7AsOgoeoejqN+-kxm2WJov2llXoo0JmFCL6KpYpS8W5iwkHoMwLMuGFWMJbZitakpFXROx-DCZQrmuyhxYspxtX+nYpmm3VuqogL5JG6zrNCtjatCQIrsoVVgmIGgqONPjbgBElhRekGzbtJClHF9QbIsLl-MuVbqP1voFOywL7Tlm7EDNCqueWOhmL6zIbL6GqwrpQA */
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
        errorDay: null,
        renderError: false,
        solutions: { part1: null, part2: null },
        renderSolution: false,
      },
      id: "aocMachine",
      initial: "setup",
      invoke: {
        src: "setupWorker",
      },
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
            async () => {
              callback({ type: "readerLoaded", data: reader.result });
            },
            false
          );

          reader.readAsText(file);
        },
      },
      actions: {
        enterSolution: assign((ctx, evt) => {
          return { renderSolution: true };
        }),
        stopRenderingSolution: assign((ctx, evt) => {
          return { renderSolution: false };
        }),
        stopRenderingError: assign((ctx, evt) => {
          return { renderError: false };
        }),
        enterIdle: assign((ctx, evt) => {
          return { calculationStatus: "" };
        }),
        enterError: assign((ctx, evt) => {
          return {
            calculationStatus: "Error",
            errorDay: evt.day,
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
