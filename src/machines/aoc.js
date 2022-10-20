import { assign, createMachine } from "xstate";

export const aocMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QEMD2BjAss9ALAlgHZgB0A7vgC66oCulA6qgE4DWYzAxIqAA6qwq+VIR4gAHogCsAdgA0IAJ6IAzFIBsJGTPUAGAEwAOKVP0yALAE5D5gL62FaLDgLFyVXEzYcSsMJVpeTmYwZAhlJBB+QUphUUjJBH19cxIARjVzNMM1FJUrKQUI9Ut9EllLFRL9NOyZUvtHDGw8IlIKai92ZhJ8CAAbME48VAEwABFkCL4BIRExRI0VEnNzUxk1E2M0osR1GTLdQ2t9ww3KtP1GkCcW13aPLp8+weGaMYAxfEGxaLn40CJCypKQqSy6FS6eoqQxHSy7BA5NIkI76Ay6S5SI4yNLXW4uNruTosbq9AZDX6zWLzBKIYHlMEQqGVWHHBG1DEkdRSQyGNJZDRncwqPHNAluDqeEk+EJhIhQL6vdCDZDMRVgACKtDA2spMTiC0QaV0VhIvKkwsuwv0JwRNksDKkaSklmhJqhoucrQlj2lPVlEHl6uCoQgHAAMqgwpA9f9DQh6aDwZDoaz4Uo6at0uYcc60ZZTClPXdCZKnv7Q0HvkMAxwAKLMZgsWPUgESI1Q5Y1XSVWQyYwqDYI13I-sw9TCi1WXTqYvih7E7w9dDIfroWj9ZCUIYrtcbrcxyJ-VvxlQ1LTc9T6F058w1Szmdn38qyfSDtLg6yyOfehdSpckLu66btunAcE2zAtgatIIJcnKVFYaiXIYKT6Oo7IzroJApHCD78uozo-vcRL-qSQH7qBIxjJM0xRFS0GAkaeiaCcro6HUBiPhmsHZFIWgwscroqCoH7aERpa+gB5EgTu7x+OqUE0oxsHMSQrHaARZycRhtRmliBa8vyZh3uJPqLqSkoNhBbyjH4NGKW2QJZkmTKpnCCJ6HxaT1OoV4yE6FgGKZf7liRVksDZnzVg58bGj2Ky6BiPkFsKPYIvUMgkDCSXmH5V7csFJGhZKADKqD9PQcSRXZUwxTBZ6jpe14PhY95cRE2gOk61our5rp2A4Nxir+RV+iRZUVa21VgApR70Up7YIA1F4aM1t5tcOBFqSYuZWOog7CsFYGNiwACChD4AAtgeEAAPL0HVymVGUqylMkGyWio7LGGaJSwrUlhwcCR2wOVlUiOdV03fdlCPYtb1ZTiPaWL5JhVDs3HWGp+THH5Gh3mcIP+OqACShC8PQABKYAAGZw4kD58f5iXGqc145k+9iDYQqBhvAkT4iNkp0Iwfr00afKHP2H77BseiVBhOJZT2KSGARKsioNgvEWWY1+AEvDiwgpTpTOKIERkvlq7y-aFbrAEvGARtrMsePJjaehq-I3E6KknE4m+cXCoYduSaSAZVj8c36gtiRCth-a+f5No1IYw5ZCsMiJetZxXqH5k+NJB5GyjmW5WcWIlCakLphEtTcthLozjCLpGLiWvDTrYc+JZJ3LquwFbnE4WQdHcYwRkKRZRo-mDgRawWBhFrYVUlj9czxgDU0XpdwXPS9xBJA09W1NhCPRuT6kaj7KC7EL+1iBfthl7o1YuUYvnpE9x459jyeE+QiwtfWed9ZAP0RFtfIg5ShownBoT+xUPATXBm2Y8DF4b6GHKYFYV40Kwh0BiNYCCxZ-3QYkdQaduLmD5I3bQNhepvksMFI2wkERGGWLCXKVgWpGB7FILmtggA */
  createMachine(
    {
      context: {
        day: 1,
        min: 1,
        max: 25,
        input: ``,
        worker: null,
        calculationStatus: ``,
        fileInputRef: null,
        errorStatus: null,
        renderError: false,
        solutions: { part1: null, part2: null },
        renderSolution: false,
        queuedFile: null,
      },
      id: `aocMachine`,
      initial: `withoutWorker`,
      on: {
        errorAnimatedOut: {
          actions: `stopRenderingError`,
        },
        solutionAnimatedOut: {
          actions: `stopRenderingSolution`,
        },
        setFileInputRef: {
          actions: `setFileInputRef`,
        },
      },
      states: {
        withoutWorker: {
          always: {
            target: `withWorker`,
          },
        },
        withWorker: {
          invoke: {
            src: `setupWorker`,
          },
          initial: `setup`,
          states: {
            setup: {
              on: {
                ready: {
                  actions: `setWorker`,
                  target: `idle`,
                },
              },
            },
            idle: {
              entry: `clearCalculationStatus`,
              always: [
                {
                  cond: `hasQueuedFile`,
                  target: `readingFile`,
                },
                {
                  cond: `hasBothInputs`,
                  target: `calculate`,
                },
              ],
              on: {
                chooseDay: {
                  actions: `setDay`,
                },
                chooseFile: {
                  target: `readingFile`,
                },
              },
            },
            readingFile: {
              invoke: {
                src: `readFile`,
              },
              on: {
                clearFileQueue: {
                  actions: `clearFileQueue`,
                },
                readerLoaded: {
                  actions: `setInput`,
                  target: `idle`,
                },
                readerError: {
                  actions: `clearInput`,
                  target: `#aocMachine.withWorker.withError.fileReadError`,
                },
              },
            },
            calculate: {
              entry: `setCalculating`,
              invoke: {
                src: `doCalculation`,
              },
              on: {
                calculated: {
                  actions: `setSolution`,
                  target: `withSolution`,
                },
                error: {
                  target: `#aocMachine.withWorker.withError.calculationError`,
                },
                chooseDay: {
                  actions: [
                    `clearInput`,
                    `setDay`,
                    `stopWorker`,
                    `clearCalculationStatus`,
                  ],
                  target: `#aocMachine.withoutWorker`,
                },
                chooseFile: {
                  actions: [
                    `clearDay`,
                    `stopWorker`,
                    `clearCalculationStatus`,
                    `queueFile`,
                  ],
                  target: `#aocMachine.withoutWorker`,
                },
              },
            },
            withError: {
              entry: `enterError`,
              initial: `calculationError`,
              states: {
                calculationError: {},
                fileReadError: {},
              },
              on: {
                chooseDay: {
                  actions: `setDay`,
                  target: `idle`,
                },
                chooseFile: {
                  target: `readingFile`,
                },
              },
            },
            withSolution: {
              entry: `enterSolution`,
              on: {
                chooseDay: {
                  actions: [`clearInput`, `setDay`],
                  target: `idle`,
                },
                chooseFile: {
                  actions: `clearDay`,
                  target: `readingFile`,
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
            new URL(`../utils/worker.js`, import.meta.url),
            {
              name: `AoCWorker`,
              type: `module`,
            }
          );
          worker.onmessage = (msg) => {
            switch (msg.data.type) {
              case `ready`: {
                callback({
                  type: `ready`,
                  worker,
                });
                break;
              }
              case `solved`: {
                callback({
                  type: `calculated`,
                  part1: msg.data.payload.part1,
                  part2: msg.data.payload.part2,
                  elapsed: msg.data.payload.elapsed,
                });
                break;
              }
              default: {
                callback({ type: `error`, day: msg.data.payload.day });
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
            callback({ type: `clearFileQueue` });
          }
          const reader = new FileReader();
          reader.addEventListener(
            `load`,
            () => {
              callback({ type: `readerLoaded`, data: reader.result });
            },
            { once: true }
          );
          reader.addEventListener(
            `error`,
            () => {
              callback({ type: `readerError`, fileName: file.name });
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
          return { calculationStatus: `Calculating` };
        }),
        setDay: assign((ctx, evt) => {
          if (evt.day === ``) {
            return { day: `` };
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
          return { calculationStatus: `` };
        }),
        enterSolution: assign((ctx, evt) => {
          return { renderSolution: true };
        }),
        enterError: assign((ctx, evt) => {
          const errorStatus = evt.day
            ? { day: evt.day }
            : { fileName: evt.fileName };
          return {
            calculationStatus: `Error`,
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
            day: ``,
          };
        }),
        clearInput: assign((ctx, evt) => {
          ctx.fileInputRef.current.value = ``;
          return {
            input: ``,
          };
        }),
      },
    }
  );
