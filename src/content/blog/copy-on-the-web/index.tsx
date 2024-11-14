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
    <div className="mb-4 border border-watermarkBg p-4">
      <p>{text}</p>
      <button
        onClick={() => void copy()}
        type="button"
        className="cursor-pointer border border-text bg-transparent px-2 py-1 text-text"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
};

export { CopyDemo };
