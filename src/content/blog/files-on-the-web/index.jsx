import React, { useState, useEffect } from "react";

const DemoArea = ({ title, children }) => {
  return (
    <div className="mb-2 grid gap-4 border border-watermarkBg p-4">
      <p className="m-0 mb-2 font-bold uppercase tracking-wider text-mutedTextBg">
        {title}
      </p>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">{children}</div>
    </div>
  );
};

const Input = ({ title, children, ...props }) => {
  return (
    <div className="data-[span]:col-span-full" {...props}>
      <p className="m-0 mb-1 text-sm font-bold uppercase tracking-wider text-mutedText">
        {title}
      </p>
      {children}
    </div>
  );
};

const Output = ({ title, children, passedSx, ...props }) => {
  return (
    <div className="text-mutedText data-[span]:col-span-full" {...props}>
      <p className="m-0 mb-1 text-sm font-bold uppercase tracking-wider">
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
            className="w-full object-contain"
          />,
        );
        return;
      }
      if (type.startsWith("video/")) {
        setOutput(
          <video controls className="w-full">
            <source src={URL.createObjectURL(file)} type={file.type} />
          </video>,
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
      <DemoArea title="input area">
        <Input title={`input type="file"`}>
          <input
            type="file"
            className="outline-1 outline-offset-2 file:border file:border-text file:bg-transparent file:px-4 file:py-2 file:text-text file:hover:border-mutedPrimary file:hover:text-primary disabled:cursor-not-allowed disabled:border-inherit disabled:bg-gray-800/90 disabled:text-mutedText"
            onChange={(event) => {
              setFile(event.target.files[0]);
            }}
          />
        </Input>
        <Input title="File System Access API">
          <button
            type="button"
            className="border border-text bg-transparent px-4 py-2 text-text outline-1 outline-offset-2 hover:border-mutedPrimary hover:text-primary disabled:cursor-not-allowed disabled:border-inherit disabled:bg-gray-800/90 disabled:text-mutedText"
            onClick={async () => {
              const [handle] = await window.showOpenFilePicker();
              const chosenFile = await handle.getFile();
              setFile(chosenFile);
            }}
          >
            Open filepicker
          </button>
        </Input>
        <Input title="Dropzone" data-span={true}>
          <div
            className="min-h-32 border-4 border-dashed border-primary"
            onDragOver={(event) => {
              event.stopPropagation();
              event.preventDefault();
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
      <DemoArea title="output area">
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
        <Output title="content" data-span={true}>
          {output}
        </Output>
      </DemoArea>
    </React.Fragment>
  );
};

export { Demo };
