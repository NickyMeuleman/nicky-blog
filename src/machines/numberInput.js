import { assign, createMachine } from "xstate";

export const numberInputMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QQIYE8C0BLAdgBwFcAXAYgGUBRAFQH0A1AQQBkBVCxUPAe1iyKy44OIAB6IArAE4AdABYAjOIDMkpfNXiAbACYA7JIA0INIm0AOJdO3b5SgAzz5Z2bs0PZAXy9GcXCHGFUTFxCImksCAAbMGFuXn5BYTEEcV1peW0lXVszR0yzTSMTFIVpTXKpM2dJM21NTw8jIOx8YliePgEhJFFEJUsMrJy8pQKixFlNMzLJcXNZSQXZOzNdLy8gA */
  createMachine(
    {
      context: { value: 1, min: 1, max: 25 },
      id: "day-input",
      initial: "idle",
      on: {
        SET_VALUE: {
          actions: "setValue",
        },
      },
      states: {
        idle: {},
      },
    },
    {
      actions: {
        setValue: assign((ctx, evt) => {
          if (evt.value === "") {
            return { value: "" };
          }
          const num = Number(evt.value);
          if (num >= ctx.min && num <= ctx.max) {
            return { value: num };
          }
          // out of range, do nothing
          return { value: ctx.value };
        }),
      },
    }
  );
