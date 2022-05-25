import { assign, createMachine } from "xstate";

export const fileInputMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QDMCWAbMBaVA7ADgK4AuAdKhJgMR5HGKj4D2sqxqTuDIAHogIwAWAEykA7AGYxAVn4AOCfwAM0wQDY5cgDQgAnogCcg8YKNqZiuYKVL+AXzs60mHARKkATmACGEPFAACZzAqL18wDwAZJnCIbmZWdk5uPgQJNSVSA2FhCQM1aWkJTTFhMR19BCMTIysZJQNpfPsHHVwmCDhuYNc6ckoweJY2Di4kXkQRCsNpUgz+QvMxMUbBFqcMbFp3ML9cQOChxNGUxFyJUiU1CRs1YUaGuWFphGXSYSapMv4fuX41QStEA9bZkAAW3lgAVBRxGyXGqVk-FITyUT34EmKOQMkhejTmtkWyxWqnWwM2vRIsKSY1AqXkL2Mwk0SmE-FKEhEBnSYgcDiAA */
  createMachine(
    {
      context: { value: "" },
      id: "file-input",
      initial: "idle",
      states: {
        idle: {
          on: {
            input: {
              target: "reading file",
            },
          },
        },
        "reading file": {
          invoke: {
            src: "readFile",
          },
          on: {
            readerLoaded: {
              actions: "setValue",
              target: "idle",
            },
          },
        },
      },
    },
    {
      services: {
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
        setValue: assign((ctx, evt) => {
          return { value: evt.data };
        }),
      },
    }
  );
