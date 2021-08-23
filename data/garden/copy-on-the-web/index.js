/** @jsx jsx */
import { jsx } from "theme-ui";
import { useState } from "react";

const CopyDemo = () => {
  const text = "Boil em, mash em, stick em in a stew.";
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };
  return (
    <div
      sx={{
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "watermarkBg",
        padding: 3,
        mb: 3,
      }}
    >
      <p>{text}</p>
      <button
        onClick={copy}
        type="button"
        sx={{
          cursor: "pointer",
          px: 2,
          py: 1,
          backgroundColor: "transparent",
          color: "text",
          borderWidth: "1px",
          borderColor: "text",
        }}
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
};

export { CopyDemo };
