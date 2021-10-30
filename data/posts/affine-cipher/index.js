/* eslint-disable */
/** @jsx jsx */
import { jsx } from "theme-ui";
import { useState, useEffect, useRef } from "react";

// the uses of window and document here don't cause crashes.
// because the only usages exist after a pointerdown event is fired, at which point, they're present.

const LOWERCASE_ASCII_A = 97;

function mod(a, b) {
  // the % operator is NOT the same as the modulo operation
  // this is different for negative numbers
  return ((a % b) + b) % b;
}

function egcd(a, b) {
  if (a == 0) {
    return [b, 0, 1];
  }
  if (b == 0) {
    return [a, 1, 0];
  }
  let quotient = Math.floor(b / a);
  let remainder = b % a;
  let [g, x, y] = egcd(remainder, a);
  return [g, y - quotient * x, x];
}

function mmi(a, b) {
  let [gcd, v] = egcd(a, b);
  if (gcd == 1) {
    return mod(v, b);
  }
}

function encipherChar(plainChar, a, b, m) {
  let plainCharNum = plainChar.toLowerCase().charCodeAt(0) - LOWERCASE_ASCII_A;
  let cipherCharNum = a * plainCharNum + b;
  let cipherCharNumMod = mod(cipherCharNum, m);
  let cipherChar = String.fromCharCode(cipherCharNumMod + LOWERCASE_ASCII_A);
  return { cipherChar, plainCharNum, cipherCharNum, cipherCharNumMod };
}

function decipherChar(cipherChar, inverse, b, m) {
  let cipherCharNum =
    cipherChar.toLowerCase().charCodeAt(0) - LOWERCASE_ASCII_A;
  let plainCharNum = inverse * (cipherCharNum - b);
  let plainCharNumMod = mod(plainCharNum, m);
  let plainChar = String.fromCharCode(plainCharNumMod + LOWERCASE_ASCII_A);
  return { plainChar, cipherCharNum, inverse, plainCharNum, plainCharNumMod };
}

function encipherString(plaintext, a, b, m) {
  return plaintext
    .trim()
    .toLowerCase()
    .split("")
    .map((char) => encipherChar(char, a, b, m).cipherChar)
    .join("");
}

function decipherString(ciphertext, a, b, m) {
  const inverse = mmi(a, m);

  return ciphertext
    .trim()
    .toLowerCase()
    .split("")
    .map((char) => decipherChar(char, inverse, b, m).plainChar)
    .join("");
}

const FinalDemo = () => {
  const [mode, setMode] = useState("ENCIPHER");
  const [message, setMessage] = useState(null);
  const [output, setOutput] = useState(null);
  const [input, setInput] = useState("racecar");
  const [a, setA] = useState(5);
  const [b, setB] = useState(7);

  useEffect(() => {
    if (mode == "ENCIPHER") {
      setOutput(encipherString(input, a, b, 26));
    } else {
      setOutput(decipherString(input, a, b, 26));
    }
  }, [input, mode, a, b]);

  useEffect(() => {
    if (!mmi(a, 26)) {
      setMessage("a and m (26) have to be coprime");
    } else {
      setMessage(null);
    }
  }, [a]);

  return (
    <div>
      <DemoArea title="Input area">
        <div sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <label>
            <input
              type="radio"
              checked={mode === "ENCIPHER"}
              onChange={() => setMode("ENCIPHER")}
            />
            Encipher
          </label>
          <label>
            <input
              type="radio"
              checked={mode == "DECIPHER"}
              onChange={() => setMode("DECIPHER")}
            />
            Decipher
          </label>
        </div>
        <Input
          title="Key a"
          type="number"
          value={a}
          handleChange={(e) => {
            const num = Number(e.target.value);
            if (Number.isNaN(num)) {
              return;
            }
            setA(num);
          }}
        />
        <Input
          title="Key b"
          type="number"
          value={b}
          handleChange={(e) => {
            const num = Number(e.target.value);
            if (Number.isNaN(num)) {
              return;
            }
            setB(num);
          }}
        />
        <Input
          title={mode === "ENCIPHER" ? "plaintext" : "ciphertext"}
          type="text"
          width="100%"
          value={input}
          handleChange={(e) => setInput(e.target.value)}
        />
      </DemoArea>
      {message ? (
        <DemoArea>
          <Output value={message} />
        </DemoArea>
      ) : (
        <DemoArea
          title={`${mode == "ENCIPHER" ? "enciphered" : "deciphered"} text`}
        >
          <Output value={output} />
        </DemoArea>
      )}
    </div>
  );
};

const Circle = ({ value, maxValue, children }) => {
  const turn = ((100 / maxValue) * value) / 100;
  return (
    <div
      sx={{
        position: "relative",
        minWidth: "200px",
        width: "200px",
        height: "200px",
      }}
    >
      {/* inactive circle */}
      <div
        sx={{
          position: "absolute",
          overflow: "hidden",
          top: 0,
          left: 0,
          backgroundColor: "mutedBackground",
          borderRadius: "50%",
          width: "100%",
          height: "100%",
        }}
      />
      {/* active part */}
      <div
        sx={{
          position: "absolute",
          top: 0,
          left: "50%",
          backgroundImage: ({ colors }) => {
            const { primary } = colors;
            return `linear-gradient(50deg, ${primary} 56%, ${primary})`;
          },
          borderRadius: "0",
          width: "10%",
          height: "50%",
          transformOrigin: "bottom center",
          transform: `translateX(-50%) rotate(${turn}turn)`,
          transition: "transform 0.5s",
        }}
      />
      {/* smaller inner circle blank plate */}
      <div
        sx={{
          position: "absolute",
          overflow: "hidden",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "background",
          borderRadius: "50%",
          width: "90%",
          height: "90%",
        }}
      />
      {children}
    </div>
  );
};

const ModuloButton = ({ handleClick, children }) => {
  // forgive me, state machine enthusiasts
  const [active, setActive] = useState(false);
  const first = useRef(true);

  useEffect(() => {
    if (active) {
      const id = setInterval(handleClick, 200);
      return () => clearInterval(id);
    }
  }, [active]);

  return (
    <button
      onPointerDown={(e) => {
        if (first.current) {
          handleClick();
          first.current = false;
        }
        setActive(true);
        document.addEventListener(
          "pointerup",
          () => {
            first.current = true;
            setActive(false);
          },
          { once: true }
        );
      }}
      type="button"
      sx={{
        cursor: "pointer",
        px: 3,
        py: 1,
        backgroundColor: "transparent",
        color: "text",
        borderStyle: "solid",
        borderWidth: "1px",
        borderColor: "text",
      }}
    >
      {children}
    </button>
  );
};

const ModuloControls = ({ val, setVal }) => {
  return (
    <div sx={{ display: "flex", gap: 1 }}>
      <button
        onClick={async (e) => {
          const timer = (ms) => new Promise((res) => setTimeout(res, ms));
          for (let i = 0; i < 26; i++) {
            setVal((count) => count - 1);
            // timeout and transition duration for the indicator can't be far off
            // if they are, the indicator and the number inside get out of sync
            await timer(200);
          }
        }}
        type="button"
        sx={{
          cursor: "pointer",
          px: 3,
          py: 1,
          backgroundColor: "transparent",
          color: "text",
          borderStyle: "solid",
          borderWidth: "1px",
          borderColor: "text",
        }}
      >
        - 26
      </button>
      <ModuloButton
        handleClick={() => {
          setVal((count) => count - 1);
        }}
      >
        -
      </ModuloButton>
      <input
        sx={{
          all: "unset",
          backgroundColor: "transparent",
          fontSize: 3,
          maxWidth: "5ch",
          textAlign: "center",
          cursor: "text",
          px: 2,
          py: 1,
          color: "text",
          borderStyle: "solid",
          borderWidth: "1px",
          borderColor: "text",
          MozAppearance: "textfield",
          "::-webkit-inner-spin-button, ::-webkit-outer-spin-button": {
            appearance: "none",
            margin: 0,
          },
        }}
        type="number"
        value={val}
        onChange={(e) => {
          const num = Number(e.target.value);
          if (Number.isNaN(num)) {
            return;
          }
          setVal(num);
        }}
      />
      <ModuloButton
        handleClick={() => {
          setVal((count) => count + 1);
        }}
      >
        +
      </ModuloButton>
      <button
        onClick={async (e) => {
          const timer = (ms) => new Promise((res) => setTimeout(res, ms));
          for (let i = 0; i < 26; i++) {
            setVal((count) => count + 1);
            await timer(200);
          }
        }}
        type="button"
        sx={{
          cursor: "pointer",
          px: 3,
          py: 1,
          backgroundColor: "transparent",
          color: "text",
          borderStyle: "solid",
          borderWidth: "1px",
          borderColor: "text",
        }}
      >
        + 26
      </button>
    </div>
  );
};

const ModuloDemo = () => {
  const [inputNum, setInputNum] = useState(0);
  const maxNum = 26;
  return (
    <div
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        gap: 4,
        my: 4,
      }}
    >
      <ModuloControls val={inputNum} setVal={setInputNum} />
      <p>mod 26</p>
      <Circle value={inputNum} maxValue={maxNum}>
        <span
          sx={{
            top: "50%",
            left: "50%",
            width: "100%",
            textAlign: "center",
            position: "absolute",
            transform: "translate(-50%, -50%)",
          }}
        >
          {mod(inputNum, maxNum)}
        </span>
      </Circle>
    </div>
  );
};

const DemoArea = ({ title, children }) => {
  return (
    <div
      sx={{
        border: `1px solid`,
        borderColor: "watermarkBg",
        padding: 3,
        mb: 2,
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
          gridTemplateColumns: "repeat( auto-fit, minmax(200px, 1fr) )",
          gap: 2,
        }}
      >
        {children}
      </div>
    </div>
  );
};

const Input = ({ title, value, handleChange, width, ...props }) => {
  return (
    <div>
      <label>
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
        <input
          value={value}
          onChange={handleChange}
          sx={{
            all: "unset",
            boxSizing: "border-box",
            backgroundColor: "transparent",
            fontSize: 2,
            maxWidth: `${width || "5ch"}`,
            textAlign: "center",
            cursor: "text",
            px: 2,
            py: 1,
            color: "text",
            borderStyle: "solid",
            borderWidth: "1px",
            borderColor: "text",
            MozAppearance: "textfield",
            "::-webkit-inner-spin-button, ::-webkit-outer-spin-button": {
              appearance: "none",
              margin: 0,
            },
          }}
          {...props}
        />
      </label>
    </div>
  );
};

const Output = ({ title, value }) => {
  return (
    <div>
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
      <p sx={{ my: 1 }}>{value}</p>
    </div>
  );
};

const EncipherCharDemo = () => {
  const [message, setMessage] = useState(null);
  const [char, setChar] = useState("a");
  const [a, setA] = useState(5);
  const [b, setB] = useState(7);
  const { cipherChar, plainCharNum, cipherCharNum, cipherCharNumMod } =
    encipherChar(char, a, b, 26);

  useEffect(() => {
    if (!mmi(a, 26)) {
      setMessage("a and m (26) have to be coprime");
    } else {
      setMessage(null);
    }
  }, [a]);

  return (
    <div sx={{ my: 4 }}>
      <DemoArea title="Input area">
        <Input
          title="Key a"
          type="number"
          value={a}
          handleChange={(e) => {
            const num = Number(e.target.value);
            if (Number.isNaN(num)) {
              return;
            }
            setA(num);
          }}
        />
        <Input
          title="Key b"
          type="number"
          value={b}
          handleChange={(e) => {
            const num = Number(e.target.value);
            if (Number.isNaN(num)) {
              return;
            }
            setB(num);
          }}
        />
        <Input
          title="Plaintext char"
          type="text"
          maxLength={1}
          value={char}
          handleChange={(e) => setChar(e.target.value)}
        />
      </DemoArea>
      {message ? (
        <DemoArea>
          <Output value={message} />
        </DemoArea>
      ) : (
        <DemoArea title="Output area">
          <Output
            title="Plaintext char as number"
            value={Number.isNaN(plainCharNum) ? "..." : plainCharNum}
          />
          <Output
            title="Cipher number before modulo"
            value={Number.isNaN(cipherCharNum) ? "..." : cipherCharNum}
          />
          <Output
            title="Cipher number after modulo"
            value={Number.isNaN(cipherCharNumMod) ? "..." : cipherCharNumMod}
          />
          <Output
            title="Cipher char"
            value={
              /* check  if cipherchar is between "a" and "z" */ cipherChar.charCodeAt(
                0
              ) >= 97 && cipherChar.charCodeAt(0) <= 122
                ? cipherChar
                : "..."
            }
          />
        </DemoArea>
      )}
    </div>
  );
};

const DecipherCharDemo = () => {
  const [message, setMessage] = useState(null);
  const [char, setChar] = useState("a");
  const [a, setA] = useState(5);
  const [b, setB] = useState(7);
  const inverse = mmi(a, 26);
  const { plainChar, cipherCharNum, plainCharNum, plainCharNumMod } =
    decipherChar(char, a, b, 26);

  useEffect(() => {
    if (!mmi(a, 26)) {
      setMessage("a and m (26) have to be coprime");
    } else {
      setMessage(null);
    }
  }, [a]);

  return (
    <div sx={{ my: 4 }}>
      <DemoArea title="Input area">
        <Input
          title="Key a"
          type="number"
          value={a}
          handleChange={(e) => {
            const num = Number(e.target.value);
            if (Number.isNaN(num)) {
              return;
            }
            setA(num);
          }}
        />
        <Input
          title="Key b"
          type="number"
          value={b}
          handleChange={(e) => {
            const num = Number(e.target.value);
            if (Number.isNaN(num)) {
              return;
            }
            setB(num);
          }}
        />
        <Input
          title="Ciphertext char"
          type="text"
          maxLength={1}
          value={char}
          handleChange={(e) => setChar(e.target.value)}
        />
      </DemoArea>
      {message ? (
        <DemoArea>
          <Output value={message} />
        </DemoArea>
      ) : (
        <DemoArea title="Output area">
          <Output
            title="Cipher char as number"
            value={Number.isNaN(cipherCharNum) ? "..." : cipherCharNum}
          />
          <Output
            title="Modular inverse of a"
            value={Number.isNaN(inverse) ? "..." : inverse}
          />
          <Output
            title="Plain char number before modulo"
            value={Number.isNaN(plainCharNum) ? "..." : plainCharNum}
          />
          <Output
            title="Plain char number after modulo"
            value={Number.isNaN(plainCharNumMod) ? "..." : plainCharNumMod}
          />
          <Output
            title="Plain char"
            value={
              /* check if plainchar is between "a" and "z" */ plainChar.charCodeAt(
                0
              ) >= 97 && plainChar.charCodeAt(0) <= 122
                ? plainChar
                : "..."
            }
          />
        </DemoArea>
      )}
    </div>
  );
};

export { ModuloDemo, EncipherCharDemo, DecipherCharDemo, FinalDemo };
