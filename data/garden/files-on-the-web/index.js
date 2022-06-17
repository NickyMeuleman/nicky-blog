/** @jsx jsx */
import { jsx } from "theme-ui";
import React, { useState, useEffect } from "react";

const DemoArea = ({ title, children, internalSx }) => {
  return (
    <div
      sx={{
        border: `1px solid`,
        borderColor: "watermarkBg",
        padding: 3,
        mb: 2,
        flex: 1,
      }}
    >
      <p
        sx={{
          margin: 0,
          mb: 2,
          textTransform: `uppercase`,
          letterSpacing: `wider`,
          fontWeight: `bold`,
          color: "mutedTextBg",
          fontSize: 1,
        }}
      >
        {title}
      </p>
      <div
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat( auto-fill, minmax(200px, 1fr) )",
          gap: 3,
          gridAutoFlow: "dense",
          ...internalSx,
        }}
      >
        {children}
      </div>
    </div>
  );
};

const Input = ({ title, children, ...props }) => {
  return (
    <div sx={{ display: "flex", flexDirection: "column" }} {...props}>
      <p
        sx={{
          margin: 0,
          mb: 1,
          textTransform: `uppercase`,
          letterSpacing: `wider`,
          fontWeight: `bold`,
          color: `mutedText`,
          fontSize: 0,
        }}
      >
        {title}
      </p>
      {children}
    </div>
  );
};

const Output = ({ title, children, passedSx, ...props }) => {
  return (
    <div
      sx={{
        color: `mutedText`,
        ...passedSx,
      }}
      {...props}
    >
      <p
        sx={{
          margin: 0,
          mb: 1,
          textTransform: `uppercase`,
          letterSpacing: `wider`,
          fontWeight: `bold`,
          fontSize: 0,
        }}
      >
        {title}
      </p>
      {children}
    </div>
  );
};

const Demo = () => {
  const [file, setFile] = useState(null);
  const [output, setOutput] = useState(null);

  useEffect(() => {
    if (file) {
      const { type } = file;
      if (type.startsWith("image/")) {
        setOutput(
          <img
            src={URL.createObjectURL(file)}
            alt={file.name}
            sx={{ width: "100%", objectFit: "contain" }}
          />
        );
        return;
      }
      if (type.startsWith("video/")) {
        setOutput(
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video controls sx={{ width: "100%" }}>
            <source src={URL.createObjectURL(file)} type={file.type} />
          </video>
        );
        return;
      }
      file.text().then((text) => {
        setOutput(<p>{text}</p>);
      });
    }
  }, [file]);

  return (
    <React.Fragment>
      <DemoArea
        title="input area"
        internalSx={{
          gridTemplateColumns: ["1fr", null, null, "1fr 1fr"],
        }}
      >
        <Input title={`input type="file"`}>
          <input
            type="file"
            onChange={(event) => {
              setFile(event.target.files[0]);
            }}
          />
        </Input>
        <Input title="File System Access API">
          <button
            type="button"
            onClick={async () => {
              const [handle] = await window.showOpenFilePicker();
              const chosenFile = await handle.getFile();
              setFile(chosenFile);
            }}
          >
            Open filepicker
          </button>
        </Input>
        <Input
          title="Dropzone"
          sx={{ gridColumn: [null, null, null, "span 2"] }}
        >
          <div
            sx={{
              minHeight: 32,
              border: "3px dashed red",
              borderColor: "primary",
            }}
            onDragOver={(event) => {
              event.stopPropagation();
              event.preventDefault();
              // eslint-disable-next-line no-param-reassign
              event.dataTransfer.dropEffect = "copy";
            }}
            onDrop={(event) => {
              event.stopPropagation();
              event.preventDefault();
              const fileList = event.dataTransfer.files;
              const droppedFile = fileList[0];
              // detect if the "file" is actually a directory, directories have no type
              if (droppedFile?.type) {
                setFile(droppedFile);
              }
            }}
          />
        </Input>
      </DemoArea>
      <DemoArea
        title="output area"
        internalSx={{
          gridTemplateColumns: ["1fr", null, null, "1fr 1fr"],
        }}
      >
        <Output title="Name">{file?.name}</Output>
        <Output title="Size">
          {file &&
            new Intl.NumberFormat(undefined, {
              style: "unit",
              unit: "kilobyte",
              unitDisplay: "long",
            }).format(file.size / 1000)}
        </Output>
        <Output title="type">{file?.type}</Output>
        <Output title="lastModified">
          {file && new Date(file?.lastModified)?.toLocaleDateString()}
        </Output>
        <Output
          title="content"
          sx={{ gridColumn: [null, null, null, "span 2"] }}
        >
          {output}
        </Output>
      </DemoArea>
    </React.Fragment>
  );
};

export { Demo };
