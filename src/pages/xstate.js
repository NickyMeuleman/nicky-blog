/* eslint-disable jsx-a11y/label-has-associated-control */
/** @jsx jsx */
import { useMachine } from "@xstate/react";
// import React from "react";
import { jsx } from "theme-ui";
import { Layout } from "../components/Layout";
import { numberInputMachine } from "../machines/numberInput";
import { fileInputMachine } from "../machines/fileInput";

const Xstate = ({ data }) => {
  const [numberState, numberSend] = useMachine(numberInputMachine);
  const [fileState, fileSend] = useMachine(fileInputMachine);

  return (
    <Layout>
      <div>
        <pre>{JSON.stringify(numberState.value, null, 2)}</pre>
        <br />
        <pre>{JSON.stringify(numberState.context, null, 2)}</pre>
        DAY
        <input
          type="number"
          placeholder="Choose a day"
          value={numberState.context.value}
          onChange={(evt) => {
            numberSend("SET_VALUE", { value: evt.target.value });
          }}
        />
      </div>
      <div>
        <pre>{JSON.stringify(fileState.value, null, 2)}</pre>
        <br />
        <pre>{JSON.stringify(fileState.context, null, 2)}</pre>
        FILE
        <input
          type="file"
          onChange={(evt) => {
            fileSend("input", { file: evt.target.files[0] });
          }}
        />
      </div>
    </Layout>
  );
};

export default Xstate;
