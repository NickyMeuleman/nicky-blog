/* eslint-disable */
/** @jsx jsx */
import { jsx } from "theme-ui";
import { useState } from "react";

function mod(n, m) {
  // the % operator is NOT the same as the modulo operation
  // this is different for negative numbers
  return ((n % m) + m) % m;
}

function modInverse(a, m) {
  // validate inputs
  [a, m] = [Number(a), Number(m)];
  if (Number.isNaN(a) || Number.isNaN(m)) {
    return NaN; // invalid input
  }
  a = ((a % m) + m) % m;
  if (!a || m < 2) {
    return NaN; // invalid input
  }
  // find the gcd
  const s = [];
  let b = m;
  while (b) {
    [a, b] = [b, a % b];
    s.push({ a, b });
  }
  if (a !== 1) {
    return NaN; // inverse does not exists
  }
  // find the inverse
  let x = 1;
  let y = 0;
  for (let i = s.length - 2; i >= 0; --i) {
    [x, y] = [y, x - y * Math.floor(s[i].a / s[i].b)];
  }
  return ((y % m) + m) % m;
}

function encode(char, a, b) {
  const plainCharNum = char.charCodeAt(0) - 97;
  const num = a * plainCharNum + b;
  const modNum = mod(num, 26);
  const cipherChar = String.fromCharCode(modNum + 97);
  return { cipherChar, plainCharNum, num, modNum };
}

function decode(char, a, b) {
  const cipherCharNum = char.charCodeAt(0) - 97;
  const inverse = modInverse(a, 26);
  const num = inverse * (cipherCharNum - b);
  const modNum = mod(num, 26);
  const plainChar = String.fromCharCode(modNum + 97);
  return { plainChar, cipherCharNum, inverse, num, modNum };
}

const Circle = ({ value, maxValue, children }) => {
  // get progress, then subtract half of a step to center the step
  const turn = ((100 / maxValue) * value) / 100;
  return (
    <div sx={{ position: "relative", width: "200px", height: "200px" }}>
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

// const Circle = ({ radius, stroke, progress, children }) => {
//   const normalizedRadius = radius - stroke * 2;
//   const circumference = normalizedRadius * 2 * Math.PI;
//   const strokeDashoffset = circumference - (progress / 100) * circumference;

//   return (
//     <div sx={{ position: "relative" }}>
//       {/* background circle */}
//       <svg
//         height={radius * 2}
//         width={radius * 2}
//         sx={{ position: "absolute", top: 0, left: 0 }}
//       >
//         <circle
//           sx={{
//             transition: "stroke-dashoffset 0.35s",
//             transform: "rotate(-90deg)",
//             transformOrigin: "50% 50%",
//             fill: "transparent",
//             strokeDashoffset: `0`,
//             strokeWidth: stroke,
//             stroke: "mutedBackground",
//             strokeDasharray: `${circumference} ${circumference}`,
//           }}
//           r={normalizedRadius}
//           cx={radius}
//           cy={radius}
//         />
//       </svg>
//       {/* progress circle */}
//       <svg height={radius * 2} width={radius * 2} sx={{ position: "relative" }}>
//         <circle
//           sx={{
//             transition: "stroke-dashoffset 0.35s",
//             transform: "rotate(-90deg)",
//             transformOrigin: "50% 50%",
//             fill: "transparent",
//             strokeDashoffset,
//             strokeWidth: stroke,
//             stroke: "primary",
//             strokeDasharray: `${circumference} ${circumference}`,
//           }}
//           r={normalizedRadius}
//           cx={radius}
//           cy={radius}
//         />
//       </svg>

//       {children}
//     </div>
//   );
// };

const NumberInput = ({ val, setVal }) => {
  return (
    <div sx={{ display: "flex", gap: 1 }}>
      <button
        onClick={() => {
          setVal(val - 1);
        }}
        type="button"
        sx={{
          cursor: "pointer",
          px: 2,
          py: 1,
          backgroundColor: "transparent",
          color: "text",
          borderStyle: "solid",
          borderWidth: "1px",
          borderColor: "text",
        }}
      >
        -
      </button>
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
          " -moz-appearance": "textfield",
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

      <button
        onClick={() => {
          setVal(val + 1);
        }}
        type="button"
        sx={{
          cursor: "pointer",
          px: 2,
          py: 1,
          backgroundColor: "transparent",
          color: "text",
          borderStyle: "solid",
          borderWidth: "1px",
          borderColor: "text",
        }}
      >
        +
      </button>
    </div>
  );
};

const Modulo = () => {
  const [inputNum, setInputNum] = useState(0);
  const maxNum = 26;
  return (
    <div
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 4,
        my: 4,
      }}
    >
      <div>
        <NumberInput val={inputNum} setVal={setInputNum} />
      </div>
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

const EncodeDemo = () => {
  const [char, setChar] = useState("a");
  const [a, setA] = useState(5);
  const [b, setB] = useState(7);
  const { cipherChar, plainCharNum, num, modNum } = encode(char, a, b);
  return (
    <div sx={{ my: 4 }}>
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
          Input area
        </p>
        <div
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat( auto-fit, minmax(250px, 1fr) )",
            alignItems: "center",
            gap: 2,
          }}
        >
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
              Key a
            </p>
            <input
              type="number"
              value={a}
              onChange={(e) => {
                const num = Number(e.target.value);
                if (Number.isNaN(num)) {
                  return;
                }
                setA(num);
              }}
              sx={{
                all: "unset",
                backgroundColor: "transparent",
                fontSize: 2,
                maxWidth: "3ch",
                textAlign: "center",
                cursor: "text",
                px: 2,
                py: 1,
                color: "text",
                borderStyle: "solid",
                borderWidth: "1px",
                borderColor: "text",
                " -moz-appearance": "textfield",
                "::-webkit-inner-spin-button, ::-webkit-outer-spin-button": {
                  appearance: "none",
                  margin: 0,
                },
              }}
            />
          </div>
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
              Key b
            </p>
            <input
              type="number"
              value={b}
              onChange={(e) => {
                const num = Number(e.target.value);
                if (Number.isNaN(num)) {
                  return;
                }
                setB(num);
              }}
              sx={{
                all: "unset",
                backgroundColor: "transparent",
                fontSize: 2,
                maxWidth: "3ch",
                textAlign: "center",
                cursor: "text",
                px: 2,
                py: 1,
                color: "text",
                borderStyle: "solid",
                borderWidth: "1px",
                borderColor: "text",
                " -moz-appearance": "textfield",
                "::-webkit-inner-spin-button, ::-webkit-outer-spin-button": {
                  appearance: "none",
                  margin: 0,
                },
              }}
            />
          </div>
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
              Plaintext char
            </p>
            <input
              type="text"
              maxLength={1}
              value={char}
              onChange={(e) => setChar(e.target.value)}
              sx={{
                all: "unset",
                backgroundColor: "transparent",
                fontSize: 2,
                maxWidth: "3ch",
                textAlign: "center",
                cursor: "text",
                px: 2,
                py: 1,
                color: "text",
                borderStyle: "solid",
                borderWidth: "1px",
                borderColor: "text",
                " -moz-appearance": "textfield",
                "::-webkit-inner-spin-button, ::-webkit-outer-spin-button": {
                  appearance: "none",
                  margin: 0,
                },
              }}
            />
          </div>
        </div>
      </div>
      <div
        sx={{
          border: `1px solid`,
          borderColor: "watermarkBg",
          padding: 3,
          mb: 4,
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
          Output area
        </p>
        <div
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat( auto-fit, minmax(250px, 1fr) )",
            gap: 2
          }}
        >
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
              Plaintext char as number
            </p>
            <p sx={{ my: 1 }}>
              {Number.isNaN(plainCharNum) ? "..." : plainCharNum}
            </p>
          </div>
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
              Cipher number before modulo
            </p>
            <p sx={{ my: 1 }}>{Number.isNaN(num) ? "..." : num}</p>
          </div>
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
              Cipher number after modulo
            </p>
            <p sx={{ my: 1 }}>{Number.isNaN(modNum) ? "..." : modNum}</p>
          </div>
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
              Cipher char
            </p>
            {/* check  if cipherchar is between "a" and "z" */}
            <p sx={{ my: 1 }}>
              {cipherChar.charCodeAt(0) >= 97 && cipherChar.charCodeAt(0) <= 122
                ? cipherChar
                : "..."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const DecodeDemo = () => {
  const [char, setChar] = useState("a");
  const [a, setA] = useState(5);
  const [b, setB] = useState(7);
  const { plainChar, cipherCharNum, inverse, num, modNum } = decode(char, a, b);
  console.log({ plainChar, cipherCharNum, inverse, num, modNum });
  return (
    <div sx={{ my: 4 }}>
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
          Input area
        </p>
        <div
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat( auto-fit, minmax(250px, 1fr) )",
            alignItems: "center",
            gap: 2,
          }}
        >
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
              Key a
            </p>
            <input
              type="number"
              value={a}
              onChange={(e) => {
                const num = Number(e.target.value);
                if (Number.isNaN(num)) {
                  return;
                }
                setA(num);
              }}
              sx={{
                all: "unset",
                backgroundColor: "transparent",
                fontSize: 2,
                maxWidth: "3ch",
                textAlign: "center",
                cursor: "text",
                px: 2,
                py: 1,
                color: "text",
                borderStyle: "solid",
                borderWidth: "1px",
                borderColor: "text",
                " -moz-appearance": "textfield",
                "::-webkit-inner-spin-button, ::-webkit-outer-spin-button": {
                  appearance: "none",
                  margin: 0,
                },
              }}
            />
          </div>
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
              Key b
            </p>
            <input
              type="number"
              value={b}
              onChange={(e) => {
                const num = Number(e.target.value);
                if (Number.isNaN(num)) {
                  return;
                }
                setB(num);
              }}
              sx={{
                all: "unset",
                backgroundColor: "transparent",
                fontSize: 2,
                maxWidth: "3ch",
                textAlign: "center",
                cursor: "text",
                px: 2,
                py: 1,
                color: "text",
                borderStyle: "solid",
                borderWidth: "1px",
                borderColor: "text",
                " -moz-appearance": "textfield",
                "::-webkit-inner-spin-button, ::-webkit-outer-spin-button": {
                  appearance: "none",
                  margin: 0,
                },
              }}
            />
          </div>
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
              Ciphertext char
            </p>
            <input
              type="text"
              maxLength={1}
              value={char}
              onChange={(e) => setChar(e.target.value)}
              sx={{
                all: "unset",
                backgroundColor: "transparent",
                fontSize: 2,
                maxWidth: "3ch",
                textAlign: "center",
                cursor: "text",
                px: 2,
                py: 1,
                color: "text",
                borderStyle: "solid",
                borderWidth: "1px",
                borderColor: "text",
                " -moz-appearance": "textfield",
                "::-webkit-inner-spin-button, ::-webkit-outer-spin-button": {
                  appearance: "none",
                  margin: 0,
                },
              }}
            />
          </div>
        </div>
      </div>
      <div
        sx={{
          border: `1px solid`,
          borderColor: "watermarkBg",
          padding: 3,
          mb: 4,
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
          Output area
        </p>
        <div
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat( auto-fit, minmax(250px, 1fr) )",
            gap: 2
          }}
        >
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
              Cipher char as number
            </p>
            <p sx={{ my: 1 }}>
              {Number.isNaN(cipherCharNum) ? "..." : cipherCharNum}
            </p>
          </div>
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
              Modular inverse of a
            </p>
            <p sx={{ my: 1 }}>
              {Number.isNaN(inverse) ? "..." : inverse}
            </p>
          </div>
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
              Plain char number before modulo
            </p>
            <p sx={{ my: 1 }}>{Number.isNaN(num) ? "..." : num}</p>
          </div>
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
              Plain char number after modulo
            </p>
            <p sx={{ my: 1 }}>{Number.isNaN(modNum) ? "..." : modNum}</p>
          </div>
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
              Plain char
            </p>
            {/* check if plainchar is between "a" and "z" */}
            <p sx={{ my: 1 }}>
              {plainChar.charCodeAt(0) >= 97 && plainChar.charCodeAt(0) <= 122
                ? plainChar
                : "..."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Modulo, EncodeDemo, DecodeDemo };
