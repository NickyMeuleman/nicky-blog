/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../../../tailwind.config.mjs";
const fullConfig = resolveConfig(tailwindConfig);
const colors = fullConfig.theme.colors;

const Button = ({ children, ...props }) => {
  return (
    <button
      type="button"
      className="border border-text bg-transparent px-4 py-2 text-text outline-1 outline-offset-2 hover:border-mutedPrimary hover:text-primary disabled:cursor-not-allowed disabled:border-inherit disabled:bg-gray-800/90 disabled:text-mutedText"
      {...props}
    >
      {children}
    </button>
  );
};

const GOLDemo = () => {
  const firstRender = useRef(true);
  const [wasm, setWasm] = useState(null);
  const [wasmMem, setWasmMem] = useState(null);
  const [playing, setPlaying] = useState(false);
  const requestRef = useRef(null);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const universeRef = useRef(null);
  const CELL_SIZE = 8; // px
  const GRID_COLOR = colors?.watermarkBg || "#CCCCCC";
  const DEAD_COLOR = colors?.background || "#FFFFFF";
  const ALIVE_COLOR = colors?.mutedPrimary || "#000000";

  const loadWasm = async () => {
    try {
      // "ESM integration proposal for Wasm" is not supported currently.
      // Use vite-plugin-wasm or other community plugins to handle this. Alternatively, you can use `.wasm?init` or `.wasm?url`.
      // See https://vite.dev/guide/features.html#webassembly for more details.
      await import(
        "../../../wasm/game-of-life/wasm_game_of_life_nmeuleman.js"
      ).then(async (module) => {
        await module.default();
        setWasm(module);
        const mem = module.wasm_memory();
        setWasmMem(mem);
      });
    } catch (err) {
      console.error(`Unexpected error in loadWasm. [Message: ${err.message}]`);
    }
  };

  // load WASM and JS glue
  useEffect(() => {
    loadWasm();
  }, []);

  const getIndex = (row, column) => {
    // 64 width
    return row * 64 + column;
  };

  // determine if a bit inside the Uint8Array is set.
  // we can't index into the array normally, since we use bits for cells now, not bytes, the Uint8Array uses bytes
  const isBitSet = (n, arr) => {
    const byte = Math.floor(n / 8);
    const mask = 1 << n % 8;
    return (arr[byte] & mask) === mask;
  };

  const drawCells = () => {
    const pointer = universeRef.current.cells();
    // access the memory through memory.buffer. That's an ArrayBuffer
    const cells = new Uint8Array(wasmMem.buffer, pointer, (64 * 64) / 8);
    // console.log(cells);
    ctxRef.current.beginPath();

    // draw alive cells
    ctxRef.current.fillStyle = ALIVE_COLOR;
    for (let row = 0; row < 64; row += 1) {
      for (let col = 0; col < 64; col += 1) {
        const idx = getIndex(row, col);
        if (!isBitSet(idx, cells)) {
          continue;
        }

        ctxRef.current.fillRect(
          col * (CELL_SIZE + 1) + 1,
          row * (CELL_SIZE + 1) + 1,
          CELL_SIZE,
          CELL_SIZE,
        );
      }
    }

    // draw dead cells
    ctxRef.current.fillStyle = DEAD_COLOR;
    for (let row = 0; row < 64; row += 1) {
      for (let col = 0; col < 64; col += 1) {
        const idx = getIndex(row, col);
        if (isBitSet(idx, cells)) {
          continue;
        }

        ctxRef.current.fillRect(
          col * (CELL_SIZE + 1) + 1,
          row * (CELL_SIZE + 1) + 1,
          CELL_SIZE,
          CELL_SIZE,
        );
      }
    }

    ctxRef.current.stroke();
  };

  // draw the cells, calculate a tick, loop
  const animate = () => {
    if (
      wasm &&
      wasmMem &&
      requestRef.current &&
      universeRef.current &&
      ctxRef.current
    ) {
      universeRef.current.tick();
      drawCells();
    }

    // do the loopy thing!
    requestRef.current = requestAnimationFrame(animate);
  };

  // initial setup of the board, can be done before the wasm is loaded, that's the reason it's seperate from setting up the cells.
  useEffect(() => {
    if (canvasRef.current && wasm) {
      // room for all cells and a 1px border for each
      canvasRef.current.width = (CELL_SIZE + 1) * 64 + 1;
      canvasRef.current.height = (CELL_SIZE + 1) * 64 + 1;

      ctxRef.current = canvasRef.current.getContext("2d");

      const drawGrid = () => {
        ctxRef.current.beginPath();
        ctxRef.current.strokeStyle = GRID_COLOR;

        // Vertical lines.
        for (let i = 0; i <= 64; i += 1) {
          ctxRef.current.moveTo(i * (CELL_SIZE + 1) + 1, 0);
          ctxRef.current.lineTo(
            i * (CELL_SIZE + 1) + 1,
            (CELL_SIZE + 1) * 64 + 1,
          );
        }

        // Horizontal lines.
        for (let j = 0; j <= 64; j += 1) {
          ctxRef.current.moveTo(0, j * (CELL_SIZE + 1) + 1);
          ctxRef.current.lineTo(
            (CELL_SIZE + 1) * 64 + 1,
            j * (CELL_SIZE + 1) + 1,
          );
        }

        ctxRef.current.stroke();
      };

      universeRef.current = wasm.Universe.new(64, 64);
      drawGrid();
    }
  }, [canvasRef.current, wasm]);

  // kick off the animation loop
  useEffect(() => {
    if (playing) {
      requestRef.current = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [playing]);

  // set up the cells on the first load wher everything is ready
  useEffect(() => {
    // check for the prerequisites of animate first and don't do this with an empty dep array
    if (
      wasm &&
      wasmMem &&
      universeRef.current &&
      ctxRef.current &&
      firstRender.current
    ) {
      drawCells();
      firstRender.current = false;
    }
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Button onClick={() => setPlaying(!playing)}>
          {playing ? "Pause" : "Play"}
        </Button>
        <Button
          onClick={() => {
            universeRef.current.tick();
            drawCells();
          }}
          disabled={playing}
        >
          Step
        </Button>
      </div>
      <canvas
        ref={canvasRef}
        onClick={(e) => {
          if (canvasRef.current && universeRef.current) {
            const boundingRect = canvasRef.current.getBoundingClientRect();
            const scaleX = canvasRef.current.width / boundingRect.width;
            const scaleY = canvasRef.current.height / boundingRect.height;

            const canvasLeft = (e.clientX - boundingRect.left) * scaleX;
            const canvasTop = (e.clientY - boundingRect.top) * scaleY;

            const row = Math.min(
              Math.floor(canvasTop / (CELL_SIZE + 1)),
              64 - 1,
            );
            const col = Math.min(
              Math.floor(canvasLeft / (CELL_SIZE + 1)),
              64 - 1,
            );

            universeRef.current.toggle_cell(row, col);
            drawCells();
          }
        }}
      />
    </div>
  );
};

const JSRuntimeChart = () => {
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1668 323.25"
      width="5004"
      height="969.75"
      className="h-auto max-w-full [&_path]:stroke-mutedPrimary [&_rect]:fill-background [&_text]:fill-text"
    >
      <rect x="0" y="0" width="1668" height="323.25" fill="#ffffff" />
      <g transform="translate(10 141.75) rotate(0 82.5 17.5)">
        <text
          x="0"
          y="25"
          fontSize="28px"
          fill="#000000"
          textAnchor="start"
          style={{ whiteSpace: "pre" }}
          direction="ltr"
        >
          Source code
        </text>
      </g>
      <g transform="translate(426 141.25) rotate(0 29 17.5)">
        <text
          x="0"
          y="25"
          fontSize="28px"
          fill="#000000"
          textAnchor="start"
          style={{ whiteSpace: "pre" }}
          direction="ltr"
        >
          AST
        </text>
      </g>
      <g strokeLinecap="round">
        <g transform="translate(198 159.75) rotate(0 86.41884822919963 -0.22545091727283761)">
          <path
            d="M-0.95 -0.59 C27.95 -1.01, 144.71 -1.76, 173.78 -2.16 M0.76 1.71 C29.44 1.46, 144.1 -0.06, 172.72 -0.71"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(198 159.75) rotate(0 86.41884822919963 -0.22545091727283761)">
          <path
            d="M143.72 9.67 C153.8 5.82, 161.8 2.59, 172.68 -1.06 M144.84 10.35 C154.85 5.81, 162.53 2.55, 173.5 -0.3"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(198 159.75) rotate(0 86.41884822919963 -0.22545091727283761)">
          <path
            d="M143.37 -10.84 C153.62 -7.83, 161.74 -4.18, 172.68 -1.06 M144.48 -10.16 C154.55 -8.02, 162.34 -4.59, 173.5 -0.3"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
      </g>
      <g transform="translate(249 113.25) rotate(0 37.5 17.5)">
        <text
          x="0"
          y="25"
          fontSize="28px"
          fill="#000000"
          textAnchor="start"
          style={{ whiteSpace: "pre" }}
          direction="ltr"
        >
          parse
        </text>
      </g>
      <g transform="translate(742 133.25) rotate(0 153 17.5)">
        <text
          x="0"
          y="25"
          fontSize="28px"
          fill="#000000"
          textAnchor="start"
          style={{ whiteSpace: "pre" }}
          direction="ltr"
        >
          Baseline compiled code
        </text>
      </g>
      <g strokeLinecap="round">
        <g transform="translate(531 153.75) rotate(0 85.71369146571953 0.13791412040589535)">
          <path
            d="M-0.61 1.02 C27.75 0.92, 141.23 -0.61, 169.9 -0.75 M1.27 0.51 C30 0.56, 143.78 0.22, 172.04 0.4"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(531 153.75) rotate(0 85.71369146571953 0.13791412040589535)">
          <path
            d="M145.54 8.8 C150.49 8.58, 159.94 4.87, 173.17 -0.14 M143.69 10.25 C151.42 8.08, 157.65 6.18, 171.8 1.24"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(531 153.75) rotate(0 85.71369146571953 0.13791412040589535)">
          <path
            d="M145.56 -11.72 C150.48 -6.2, 159.93 -4.17, 173.17 -0.14 M143.71 -10.27 C151.29 -7.7, 157.51 -4.85, 171.8 1.24"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
      </g>
      <g strokeLinecap="round">
        <g transform="translate(1077 144.75) rotate(0 101.73991502142974 1.987380624562519)">
          <path
            d="M0.66 -0.67 C34.74 0.11, 170.21 4.06, 203.93 4.65 M-0.45 1.59 C33.6 2.03, 169.7 2.54, 203.47 2.86"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(1077 144.75) rotate(0 101.73991502142974 1.987380624562519)">
          <path
            d="M174.1 14.5 C183.46 10.18, 187.61 9.18, 204.95 1.4 M175.16 13.75 C183.59 9.93, 191.53 8, 203.18 3.2"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(1077 144.75) rotate(0 101.73991502142974 1.987380624562519)">
          <path
            d="M174.23 -6.02 C183.55 -5.14, 187.66 -0.93, 204.95 1.4 M175.29 -6.77 C183.67 -4.73, 191.56 -0.81, 203.18 3.2"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
      </g>
      <g transform="translate(1336 133.25) rotate(0 161 17.5)">
        <text
          x="0"
          y="25"
          fontSize="28px"
          fill="#000000"
          textAnchor="start"
          style={{ whiteSpace: "pre" }}
          direction="ltr"
        >
          Optimized compiled code
        </text>
      </g>
      <g strokeLinecap="round">
        <g transform="translate(1020.1749067559815 263.6786643624747) rotate(180.064692431412 157.38203442337476 -41.359414917371424)">
          <path
            d="M1.17 -1.04 C27.42 -15.2, 106.01 -84.18, 157.81 -83.82 C209.6 -83.47, 286.08 -13.03, 311.95 1.1 M0.32 1.02 C26.46 -12.44, 104.9 -82.1, 157.25 -82.44 C209.6 -82.77, 288.41 -15.11, 314.44 -1"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(1020.1749067559815 263.6786643624747) rotate(180.064692431412 157.38203442337476 -41.359414917371424)">
          <path
            d="M283.58 -6.96 C294.34 -7.43, 305.01 -3.31, 314.98 -1.93 M285.23 -7.64 C291.67 -5.75, 297.38 -4.35, 313.95 -0.68"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(1020.1749067559815 263.6786643624747) rotate(180.064692431412 157.38203442337476 -41.359414917371424)">
          <path
            d="M295.03 -23.99 C302.24 -18.84, 309.2 -9.2, 314.98 -1.93 M296.68 -24.67 C300.87 -19.25, 304.18 -14.27, 313.95 -0.68"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
      </g>
      <g strokeLinecap="round">
        <g transform="translate(473.99209640295794 124.75) rotate(0 -16.219287250128502 -24.843782630125816)">
          <path
            d="M0.55 -0.12 C-2.24 -9.44, -12.05 -57.22, -17.56 -56.06 C-23.07 -54.91, -30.05 -3.58, -32.49 6.79 M-0.62 -1.23 C-3.51 -10.86, -13.18 -59.22, -18.58 -57.68 C-23.97 -56.15, -30.84 -2.75, -32.99 8"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(473.99209640295794 124.75) rotate(0 -16.219287250128502 -24.843782630125816)">
          <path
            d="M-38.77 -21.7 C-35.71 -13.79, -36.36 -6.39, -34.45 7.73 M-38.01 -22.02 C-36.99 -10.71, -33.28 1.23, -33.43 8.83"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(473.99209640295794 124.75) rotate(0 -16.219287250128502 -24.843782630125816)">
          <path
            d="M-18.52 -18.39 C-20.18 -11.16, -25.55 -4.53, -34.45 7.73 M-17.75 -18.71 C-24.45 -8.71, -28.43 1.97, -33.43 8.83"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
      </g>
      <g transform="translate(335 22.25) rotate(0 121.5 17.5)">
        <text
          x="0"
          y="25"
          fontSize="28px"
          fill="#000000"
          textAnchor="start"
          style={{ whiteSpace: "pre" }}
          direction="ltr"
        >
          run by interpreter
        </text>
      </g>
      <g strokeLinecap="round">
        <g transform="translate(909.4920964029579 113.5) rotate(0 -16.925498357855645 -25.147581397253873)">
          <path
            d="M0.26 -0.38 C-2.72 -10.01, -12.46 -57.9, -18.04 -56.86 C-23.62 -55.82, -30.83 -4.93, -33.23 5.85 M-1.06 -1.63 C-3.62 -11.11, -10.13 -56.6, -15.64 -55.23 C-21.15 -53.87, -31.42 -3.59, -34.11 6.56"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(909.4920964029579 113.5) rotate(0 -16.925498357855645 -25.147581397253873)">
          <path
            d="M-38.27 -24.24 C-36.13 -15.1, -37.32 -5.18, -32.76 7.55 M-38.02 -23.66 C-37.49 -16.06, -36.44 -9.94, -34.47 6.14"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(909.4920964029579 113.5) rotate(0 -16.925498357855645 -25.147581397253873)">
          <path
            d="M-18.3 -19.53 C-21.91 -11.7, -28.8 -3.13, -32.76 7.55 M-18.04 -18.96 C-22.28 -12.44, -25.97 -7.43, -34.47 6.14"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
      </g>
      <g transform="translate(687.5 12) rotate(0 211 17.5)">
        <text
          x="0"
          y="25"
          fontSize="28px"
          fill="#000000"
          textAnchor="start"
          style={{ whiteSpace: "pre" }}
          direction="ltr"
        >
          run, analyze, and compile again
        </text>
      </g>
      <g strokeLinecap="round">
        <g transform="translate(1520.492096402958 110.5) rotate(0 -16.54422205849835 -25.36782695089542)">
          <path
            d="M-0.23 -1.15 C-2.94 -10.55, -11.47 -57.44, -16.83 -56.21 C-22.19 -54.98, -29.82 -4.32, -32.4 6.25 M-1.81 0.86 C-4.57 -8.88, -12.29 -58.96, -17.46 -57.91 C-22.63 -56.85, -30.48 -3.89, -32.86 7.17"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(1520.492096402958 110.5) rotate(0 -16.54422205849835 -25.36782695089542)">
          <path
            d="M-39.84 -21.39 C-35.26 -14.02, -36.61 -6.53, -32.5 6.41 M-38.56 -23.24 C-37.23 -15.24, -34.82 -6.87, -33.62 6.55"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(1520.492096402958 110.5) rotate(0 -16.54422205849835 -25.36782695089542)">
          <path
            d="M-19.65 -17.73 C-20.11 -11.32, -26.5 -4.74, -32.5 6.41 M-18.36 -19.58 C-22.19 -12.5, -24.95 -5.07, -33.62 6.55"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
      </g>
      <g transform="translate(1482.5 10) rotate(0 20.5 17.5)">
        <text
          x="0"
          y="25"
          fontSize="28px"
          fill="#000000"
          textAnchor="start"
          style={{ whiteSpace: "pre" }}
          direction="ltr"
        >
          run
        </text>
      </g>
      <g transform="translate(1136 278.25) rotate(0 44 17.5)">
        <text
          x="0"
          y="25"
          fontSize="28px"
          fill="#000000"
          textAnchor="start"
          style={{ whiteSpace: "pre" }}
          direction="ltr"
        >
          de-opt
        </text>
      </g>
      <g transform="translate(566 107.25) rotate(0 45 17.5)">
        <text
          x="0"
          y="25"
          fontSize="28px"
          fill="#000000"
          textAnchor="start"
          style={{ whiteSpace: "pre" }}
          direction="ltr"
        >
          compile
        </text>
      </g>
      <g transform="translate(1135 99.25) rotate(0 45 17.5)">
        <text
          x="0"
          y="25"
          fontSize="28px"
          fill="#000000"
          textAnchor="start"
          style={{ whiteSpace: "pre" }}
          direction="ltr"
        >
          compile
        </text>
      </g>
    </svg>
  );
};

const JSWASMTime = () => {
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1153.5 488.50667879018977"
      width="3460.5"
      height="1465.5200363705694"
      className="h-auto max-w-full [&_path]:stroke-mutedPrimary [&_rect]:fill-background [&_text]:fill-text"
      style={{
        "--odd": colors.mutedPrimary,
        "--even": colors.primary,
      }}
    >
      <rect
        x="0"
        y="0"
        width="1153.5"
        height="488.50667879018977"
        fill="#ffffff"
      />
      <g transform="translate(37.027611969934355 10) rotate(0 74.5 17.5)">
        <text
          x="0"
          y="25"
          fontSize="28px"
          fill="#000000"
          textAnchor="start"
          style={{ whiteSpace: "pre" }}
          direction="ltr"
        >
          JavaScript
        </text>
      </g>
      <g transform="translate(32.694278636601325 248.33333333333343) rotate(0 83.5 17.5)">
        <text
          x="0"
          y="25"
          fontSize="28px"
          fill="#000000"
          textAnchor="start"
          style={{ whiteSpace: "pre" }}
          direction="ltr"
        >
          WebAssembly
        </text>
      </g>
      <g strokeLinecap="round">
        <g transform="translate(42.60869565217399 400.3327657467115) rotate(0 2.1263696803022754 -21.04394473644055)">
          <path
            d="M-0.98 0.13 C-0.11 -6.8, 4.13 -35.03, 5.23 -42.22 M0.71 -0.84 C1.42 -7.52, 3.56 -33.83, 4.29 -40.71"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(42.60869565217399 400.3327657467115) rotate(0 2.1263696803022754 -21.04394473644055)">
          <path
            d="M9.91 -20.14 C8.08 -25.69, 5.16 -33.24, 3.83 -41.18 M10.41 -20.24 C8.67 -27.6, 5.21 -35.42, 3.92 -40.32"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(42.60869565217399 400.3327657467115) rotate(0 2.1263696803022754 -21.04394473644055)">
          <path
            d="M-4.56 -21.48 C-2.03 -26.51, -0.58 -33.65, 3.83 -41.18 M-4.06 -21.58 C-0.66 -28.59, 1.03 -35.92, 3.92 -40.32"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
      </g>
      <g transform="translate(10 409.1371135727985) rotate(0 33 12.5)">
        <text
          x="0"
          y="18"
          fontSize="20px"
          fill="#000000"
          textAnchor="start"
          style={{ whiteSpace: "pre" }}
          direction="ltr"
        >
          decode
        </text>
      </g>
      <g strokeLinecap="round">
        <g transform="translate(143.0434782608695 442.9414613988855) rotate(0 1.4367319713389861 -40.44263988295978)">
          <path
            d="M0.6 0.07 C1.18 -13.48, 2.82 -67.42, 3.42 -80.96 M-0.55 -0.94 C-0.16 -14.33, 1.52 -66.28, 2.22 -79.47"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(143.0434782608695 442.9414613988855) rotate(0 1.4367319713389861 -40.44263988295978)">
          <path
            d="M11.43 -51.69 C8.4 -58.69, 5.36 -69.14, 1.38 -80.25 M11.86 -50.77 C7.92 -59.08, 6.73 -68.52, 2.69 -79.35"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(143.0434782608695 442.9414613988855) rotate(0 1.4367319713389861 -40.44263988295978)">
          <path
            d="M-9.07 -52.54 C-6.07 -59.39, -3.08 -69.59, 1.38 -80.25 M-8.64 -51.62 C-6.31 -59.8, -1.22 -68.99, 2.69 -79.35"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
      </g>
      <g transform="translate(56.956521739130494 453.50667879018977) rotate(0 86.5 12.5)">
        <text
          x="0"
          y="18"
          fontSize="20px"
          fill="#000000"
          textAnchor="start"
          style={{ whiteSpace: "pre" }}
          direction="ltr"
        >
          compile + optimize
        </text>
      </g>
      <g strokeLinecap="round">
        <g transform="translate(379.13043478260863 408.3762440075808) rotate(0 2.4099821700026496 -21.33734180377411)">
          <path
            d="M-0.9 0.99 C-0.06 -6.06, 4.58 -34.55, 5.72 -41.76 M0.82 0.46 C1.5 -7, 4.26 -36.75, 5.04 -43.66"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(379.13043478260863 408.3762440075808) rotate(0 2.4099821700026496 -21.33734180377411)">
          <path
            d="M11.91 -22.22 C9.03 -29.2, 6.34 -37.11, 3.88 -42.37 M9.9 -22.56 C8.82 -29.3, 7.62 -35.97, 4.48 -43.04"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(379.13043478260863 408.3762440075808) rotate(0 2.4099821700026496 -21.33734180377411)">
          <path
            d="M-2.55 -23.68 C-0.32 -30.03, 2.1 -37.43, 3.88 -42.37 M-4.56 -24.02 C-1.39 -30.35, 1.64 -36.59, 4.48 -43.04"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
      </g>
      <g transform="translate(340.86956521739114 418.2892874858418) rotate(0 38.5 12.5)">
        <text
          x="0"
          y="18"
          fontSize="20px"
          fill="#000000"
          textAnchor="start"
          style={{ whiteSpace: "pre" }}
          direction="ltr"
        >
          execute
        </text>
      </g>
      <g strokeLinecap="round">
        <g transform="translate(92.94831025862163 168.7216546356005) rotate(0 0.3669260412893891 -22.645020862539212)">
          <path
            d="M0.17 0.74 C0.35 -6.74, 1.85 -38.02, 1.94 -46.03 M-1.21 0.09 C-1.18 -7.08, 1.31 -36.64, 1.47 -44.42"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(92.94831025862163 168.7216546356005) rotate(0 0.3669260412893891 -22.645020862539212)">
          <path
            d="M9.41 -20.81 C6.14 -31.09, 1.53 -37.25, -0.04 -42.75 M7.29 -21.64 C6.94 -27.93, 6.3 -32.39, 0.75 -44.77"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(92.94831025862163 168.7216546356005) rotate(0 0.3669260412893891 -22.645020862539212)">
          <path
            d="M-6.37 -21.67 C-3.8 -31.66, -2.57 -37.49, -0.04 -42.75 M-8.48 -22.51 C-5.48 -28.62, -2.76 -32.89, 0.75 -44.77"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
      </g>
      <g transform="translate(67.49999999999989 178.63469811386148) rotate(0 27 12.5)">
        <text
          x="0"
          y="18"
          fontSize="20px"
          fill="#000000"
          textAnchor="start"
          style={{ whiteSpace: "pre" }}
          direction="ltr"
        >
          parse
        </text>
      </g>
      <g strokeLinecap="round">
        <g transform="translate(538.7144797754114 170.7216546356005) rotate(0 -0.027752760102316643 -22.435762163122064)">
          <path
            d="M-0.9 1.06 C-0.66 -6.44, 0.13 -38.14, 0.28 -45.93 M0.83 0.57 C1.01 -6.71, -0.38 -37.25, -0.65 -44.79"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(538.7144797754114 170.7216546356005) rotate(0 -0.027752760102316643 -22.435762163122064)">
          <path
            d="M9.7 -23.86 C5.06 -28.62, 3.66 -33.86, 1.35 -44.33 M7.08 -24.67 C4.39 -30.98, 2.33 -37.05, -0.81 -45.18"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(538.7144797754114 170.7216546356005) rotate(0 -0.027752760102316643 -22.435762163122064)">
          <path
            d="M-5.74 -23.24 C-7.2 -28.01, -5.41 -33.37, 1.35 -44.33 M-8.35 -24.05 C-6.01 -30.43, -3.05 -36.7, -0.81 -45.18"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
      </g>
      <g transform="translate(490.4999999999999 180.63469811386148) rotate(0 52 12.5)">
        <text
          x="0"
          y="18"
          fontSize="20px"
          fill="#000000"
          textAnchor="start"
          style={{ whiteSpace: "pre" }}
          direction="ltr"
        >
          re-optimize
        </text>
      </g>
      <g strokeLinecap="round">
        <g transform="translate(1096.8871142457588 171.23860397833852) rotate(4.502498352315976 -3.087610823662658 -22.282394932235604)">
          <path
            d="M-0.65 0.51 C-1.76 -7.18, -5.45 -37.81, -6.71 -45.08 M1.21 -0.26 C-0.01 -7.31, -6.22 -36.54, -7.39 -43.98"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(1096.8871142457588 171.23860397833852) rotate(4.502498352315976 -3.087610823662658 -22.282394932235604)">
          <path
            d="M4.9 -23.86 C-0.93 -32.14, -1.08 -35.25, -7.68 -44.21 M4.4 -25.02 C1.07 -30.87, -4.6 -37.14, -8.31 -43.15"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(1096.8871142457588 171.23860397833852) rotate(4.502498352315976 -3.087610823662658 -22.282394932235604)">
          <path
            d="M-10.17 -21.02 C-11.53 -30.07, -7.19 -34.02, -7.68 -44.21 M-10.67 -22.19 C-8.79 -28.96, -9.25 -36.21, -8.31 -43.15"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
      </g>
      <g transform="translate(1054.5 179.30136478052822) rotate(0 44.5 25)">
        <text
          x="0"
          y="18"
          fontSize="20px"
          fill="#000000"
          textAnchor="start"
          style={{ whiteSpace: "pre" }}
          direction="ltr"
        >
          garbage
        </text>
        <text
          x="0"
          y="43"
          fontSize="20px"
          fill="#000000"
          textAnchor="start"
          style={{ whiteSpace: "pre" }}
          direction="ltr"
        >
          collection
        </text>
      </g>
      <g transform="translate(218.4999999999999 177.30861115733978) rotate(0 86.5 12.5)">
        <text
          x="0"
          y="18"
          fontSize="20px"
          fill="#000000"
          textAnchor="start"
          style={{ whiteSpace: "pre" }}
          direction="ltr"
        >
          compile + optimize
        </text>
      </g>
      <g transform="translate(806.5000000000001 175.30861115733978) rotate(0 38.5 12.5)">
        <text
          x="0"
          y="18"
          fontSize="20px"
          fill="#000000"
          textAnchor="start"
          style={{ whiteSpace: "pre" }}
          direction="ltr"
        >
          execute
        </text>
      </g>
      <g strokeLinecap="round">
        <g transform="translate(306.1516913611946 173.17817637473092) rotate(0 0.03704015893140422 -23.068852662552047)">
          <path
            d="M-0.99 0.49 C-0.66 -6.99, 0.88 -37.18, 1.07 -45.08 M0.69 -0.29 C0.94 -8.08, -0.17 -39.01, 0.14 -46.63"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(306.1516913611946 173.17817637473092) rotate(0 0.03704015893140422 -23.068852662552047)">
          <path
            d="M8.91 -24.89 C8.18 -31.36, 3.33 -36.34, 1.11 -47.83 M7.41 -24.04 C4.9 -31.2, 3.59 -38.32, -0.2 -46.7"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(306.1516913611946 173.17817637473092) rotate(0 0.03704015893140422 -23.068852662552047)">
          <path
            d="M-6.88 -24.85 C-4.11 -31.2, -5.43 -36.19, 1.11 -47.83 M-8.38 -24 C-5.73 -31.3, -1.88 -38.43, -0.2 -46.7"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
      </g>
      <g strokeLinecap="round">
        <g transform="translate(843.4850246945281 170.17817637473092) rotate(0 0.7184095012897842 -23.738749146569404)">
          <path
            d="M-0.54 0.08 C-0.38 -7.39, -0.47 -37.79, -0.16 -45.69 M1.38 -0.92 C1.99 -8.69, 2.04 -39.94, 1.92 -47.56"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(843.4850246945281 170.17817637473092) rotate(0 0.7184095012897842 -23.738749146569404)">
          <path
            d="M10.05 -27.88 C9.21 -29.99, 4.83 -35.37, 2.93 -46.83 M9.86 -25.55 C7.59 -31.82, 6.39 -37.66, 2.92 -46.91"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(843.4850246945281 170.17817637473092) rotate(0 0.7184095012897842 -23.738749146569404)">
          <path
            d="M-5.74 -27.82 C-3.31 -29.86, -4.42 -35.26, 2.93 -46.83 M-5.94 -25.48 C-3.8 -31.62, -0.59 -37.48, 2.92 -46.91"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
      </g>
      <g
        strokeLinecap="round"
        transform="translate(32.330062066752475 51.78492897119446) rotate(0 59.64285714285711 30.35714285714286)"
      >
        <path
          d="M0 0 C0 0, 0 0, 0 0 M0 0 C0 0, 0 0, 0 0 M0.49 6.37 C0.53 4.12, 2.86 3.86, 5.23 -0.12 M-0.15 6.43 C1.56 4.4, 4.06 1.89, 5.35 0.47 M1.72 12.63 C2.73 6.04, 7.98 4.17, 9.28 -0.98 M0.41 12.27 C3.63 9.01, 6.11 6.08, 10.79 0.64 M-1.95 18.71 C3.78 16.01, 5.88 8.13, 15.52 -0.2 M0.6 17.75 C3.88 12.1, 9.4 7.22, 16.2 -0.62 M0.15 25.74 C4.93 18.96, 9.08 13.91, 21.84 -0.24 M-0.15 23.17 C4.26 17.91, 9.31 14.33, 21.37 0.52 M-1.15 30.38 C9 23.04, 16.69 12.56, 27.94 1.23 M-0.58 31.03 C10.82 19.16, 18.8 8.31, 26.52 0.35 M1.69 35.89 C9.48 28.25, 16.25 19.59, 31.54 -1.11 M-0.54 36.97 C11.14 21.56, 25.16 7.58, 32.45 -0.59 M0.26 43.7 C13.4 29.37, 25.99 11.92, 35.65 -1.28 M-0.41 42.52 C9.75 31.79, 17.52 23.03, 35.92 1.06 M1.11 48.75 C12.13 34.88, 26.4 18.77, 42.71 1.09 M-0.44 49.82 C9.21 36.83, 19.24 26.3, 43.44 -0.08 M-0.8 55.36 C16.68 37.15, 31.73 14.8, 46.19 -0.12 M0.38 54.77 C15.24 36.92, 31.58 18.4, 46.62 0.34 M1.52 60.4 C13.46 46.11, 23.84 32.81, 52.72 1.62 M-0.4 61.48 C17.86 39.81, 34.64 19.45, 53.91 0.82 M6.51 62.32 C16.81 46.83, 29.51 33.74, 57.74 0.61 M6.44 60.65 C24.76 40.61, 41.88 18.7, 58 0.41 M11.88 62.44 C30.83 36.08, 51.04 12.44, 63.61 -1.96 M11.32 60.18 C23.38 46.7, 35 33.28, 63.55 -0.78 M16.51 61.9 C38.23 35.13, 57.14 13.29, 67.21 1.13 M15.38 61.4 C27.7 47.92, 37.15 36.25, 68.58 0.8 M22.82 58.91 C36.12 42.97, 54.51 25.61, 74.1 -1.76 M20.62 61.66 C40.98 38.03, 61.08 16.44, 74.23 0.59 M26.92 59.77 C45.57 37.9, 66.18 14.26, 78.16 1.98 M27.67 60.64 C40.4 45.9, 54.11 30.4, 80.07 0.38 M30.18 62.09 C43.1 48.69, 52.77 35.84, 83.63 0.39 M31.08 60.92 C50.39 39.39, 70.71 17.36, 85.95 -1.27 M37.41 61.85 C51.43 47.35, 63.39 30.8, 88.86 0 M37.19 60.3 C53.85 41.3, 69.72 23.37, 89.29 -0.61 M44.46 60.57 C61.62 38.8, 83.23 15.37, 96.31 1 M43.41 60.33 C59.79 40.77, 77.59 19.26, 94.89 -0.22 M47.69 61.15 C63.98 40.31, 81.91 20.38, 100.26 0.34 M47.35 61.41 C66.19 40.07, 83.58 19.12, 100.25 -0.6 M54.87 59.27 C69.56 38.65, 87.66 18.18, 104.92 -1.12 M53.48 61.56 C71.95 38.35, 91.46 16.5, 105.38 0.25 M60.12 62.74 C78.33 40.59, 95.2 15.52, 112.01 0.48 M57.67 61.08 C71.38 45.13, 86.7 28.5, 112.12 -0.68 M65.31 59.4 C82.81 37.73, 102.9 14.81, 114.29 -0.09 M64.34 61.68 C76.18 46.89, 87.43 33.47, 117.26 -0.28 M67.76 60.24 C85.03 45.32, 98.96 28.74, 121.12 -0.29 M67.83 61.01 C88.24 39.86, 107.2 17.04, 119.88 0.91 M74.33 62.49 C85.24 47.67, 96.11 32.41, 122.01 8.82 M74.16 61.04 C88.26 46.13, 101.1 31.33, 120.56 6.64 M81.05 60.83 C90.91 47.68, 99.77 37.38, 120.73 13.18 M80.36 60.52 C93.17 45.54, 107.43 30.36, 121.13 12.83 M83.22 62.4 C95.92 49.15, 104.44 39.45, 118.93 19.36 M84.29 61.39 C98.87 45.84, 112.92 29.17, 120.08 20.56 M91.09 62.02 C97.04 52.23, 107.46 41.22, 119.72 24.72 M89.94 61.25 C101.81 49.25, 112.02 36.65, 121.69 25.47 M95.92 61.27 C100.06 52, 106.45 46.27, 122.51 32.79 M95.24 59.78 C104.43 50.2, 113.64 39.36, 120.69 32.53 M101.67 59.63 C104.61 53.38, 111.86 46.99, 120.49 37.07 M101.38 61.2 C104.33 56.46, 110.35 50.8, 121.34 37.11 M107.08 61.58 C110.5 55.64, 116.24 50.85, 120.31 44.25 M106.65 60.65 C111.22 54.79, 116.32 49.49, 120.83 43.53 M112.69 60.13 C114.07 56.16, 118.68 53.73, 119.77 50.13 M111.57 60.78 C114.37 57.08, 118.55 52.57, 120.4 50.22 M117.26 61.04 C117.37 59.86, 118.38 57.77, 120.99 55.56 M117.06 60.32 C118.4 59.08, 119.87 57.28, 121.15 56.07"
          stroke="#12b886"
          strokeWidth="0.5"
          fill="none"
          // 1st JS fill
          style={{ stroke: `var(--odd)` }}
        />
        <path
          d="M-1.29 -1.14 C43.48 -0.41, 86.66 -0.02, 119.23 1.91 M0.01 0.82 C46.42 1.31, 93.38 0.44, 119.35 -0.4 M120.17 -0.89 C119.73 20.68, 121.1 42.22, 118.83 60.98 M119.74 0.49 C120.74 20.62, 118.94 41.36, 118.44 60.8 M119.04 62.3 C94.37 60.76, 67.5 61.29, 0.95 59.73 M119.89 60.14 C75.41 59.72, 32.65 60.31, -0.83 61.64 M-1.6 59.5 C0.54 43.48, 0.29 30.63, 1.63 -0.04 M-0.88 61.7 C-0.3 45.69, 0.08 31.64, -0.65 -0.44"
          stroke="#000000"
          strokeWidth="1"
          fill="none"
        />
      </g>
      <g
        strokeLinecap="round"
        transform="translate(152.2462878163118 52.23907359200575) rotate(0 156.2644787644789 30.35714285714286)"
      >
        <path
          d="M0 0 C0 0, 0 0, 0 0 M0 0 C0 0, 0 0, 0 0 M0.24 6.07 C2.18 4.26, 3.55 1.07, 4.84 0.97 M-0.12 6.57 C2.22 3.78, 4.06 1.48, 5.26 0.28 M-1.2 13.31 C3.59 8.71, 7.88 2.94, 10.32 -0.26 M-0.48 12.54 C4.01 7.95, 6.33 3.76, 10.36 -0.1 M-0.99 19.79 C1.86 15.52, 5.3 10.99, 14.89 -0.13 M-0.93 18.55 C4.2 14.5, 6.43 9.12, 15.79 -0.46 M-0.73 22.27 C9.57 16.9, 14.29 5.74, 21.96 -0.44 M-0.53 24.86 C6.92 14.78, 15.61 7.17, 21.84 -0.22 M0.56 29.18 C7.21 23.83, 11.02 18.24, 27.42 -0.08 M0.06 30.48 C9.43 18.16, 20.18 6.81, 26.39 -0.33 M-1.66 38.38 C12.82 21.25, 26.7 6.8, 33.89 1.23 M-1.23 36.02 C11.21 25.01, 20.96 12.37, 31.56 -0.81 M1.12 40.88 C12.26 27.55, 25.9 15.92, 38.29 2.07 M0.53 42.45 C8.42 34.59, 16.01 25.71, 36.89 -0.33 M1.34 48.22 C12.17 35.72, 23.97 21.28, 41.95 -1.62 M-0.11 49.88 C9.19 37.01, 19.86 26.32, 43.21 0.18 M0.87 56.32 C16.36 34.3, 35.61 14.58, 46.26 -1.34 M0.14 54.65 C14.65 36.8, 29.22 19.91, 47.9 0.02 M-1.39 60.63 C16.87 42.11, 33.39 20.07, 54.76 -0.98 M0.65 61.82 C11.5 45.68, 24.21 31.37, 52.72 -0.86 M5.91 61.21 C20.58 44.52, 31.55 29.94, 56.79 -1.65 M5.92 61.55 C24.98 39.43, 43.72 16.7, 57.15 0.55 M10.37 59.96 C27.84 38.87, 46.62 20.52, 65.61 1.45 M11.16 61.68 C21.67 46.45, 34.81 32.34, 64.17 -1.2 M17.78 61.63 C33.1 44.61, 46.36 26.47, 70.01 2.12 M15.82 60.02 C28.21 47.14, 41.47 32.54, 69.57 0.41 M22.49 59 C31.92 49.27, 44.25 37.09, 72.47 -1.7 M21.71 60.85 C35.31 45.47, 47.57 30.28, 73.79 0.26 M25.49 59.98 C47.84 38.56, 67.94 14.61, 80.76 -0.77 M26.72 61.32 C40.29 46.12, 52.71 30.3, 79.21 0.11 M30.06 62.77 C45.59 43.32, 61.47 27.12, 86.04 0.51 M32.23 59.94 C45.11 47.02, 56.53 32.21, 85.97 -1.05 M35.93 58.95 C52.64 43.95, 67.27 27.8, 90.54 -0.71 M36.87 60.99 C57.31 38.18, 76 17.44, 89.29 -0.49 M42.85 60.62 C56.29 46.61, 71.4 29.26, 97.65 1.33 M41.84 60.94 C58.63 42.18, 72.77 24.65, 95.27 0.64 M48.07 60.29 C63.54 39.89, 83.3 19.51, 99.56 0.2 M48.05 61.68 C65.89 38.24, 84.98 17.27, 100.19 -0.21 M53.29 62.22 C68.47 42.05, 84.26 28.09, 107.36 0.33 M52.76 61.17 C66.93 45.45, 79.72 30.86, 106.37 -0.56 M59.52 61.82 C74.64 42.67, 90.44 24.49, 110.71 0.19 M58.14 62.14 C70.6 45.52, 83.8 31.11, 111.44 -0.49 M64.55 61.52 C77.44 42.82, 93.1 27.92, 115.25 0.13 M64.42 61.29 C79.17 43.28, 93.53 26.78, 115.5 0.57 M70.6 61.91 C78.35 48, 92.63 35.13, 121.56 1.78 M69.22 61.7 C86.2 41.71, 100.99 24.53, 121.72 0.53 M74.43 60.82 C86.44 46.99, 98.38 30.35, 128.04 -0.58 M75.36 61.3 C88.56 44.95, 101.81 29.78, 126.97 1.32 M78.98 60.5 C90.03 49.56, 100.74 36.91, 132.39 -0.17 M80.18 61.29 C89.8 49.47, 102.17 35.91, 132.89 0.08 M83.46 58.71 C105.13 40.3, 123.69 18.23, 139.2 1.45 M85.32 60.56 C97.38 46.2, 108.87 31.13, 137.3 -0.4 M91.02 59.85 C107.97 41.08, 126.09 18.51, 142.13 1.48 M90.07 60.18 C104.35 43.19, 119.49 27.61, 143.94 0.75 M94.84 62.09 C106.36 49.02, 115.34 36.08, 147.51 -0.97 M95.17 59.77 C115.99 38.86, 135.25 16.88, 147.82 0.91 M101.77 60.51 C112.7 45.34, 126.47 33.27, 152.44 -1.8 M100.1 61.99 C115.96 43.66, 131.22 25.92, 153.02 0.43 M106.46 62.18 C116.7 50.03, 126.15 35.72, 160.46 -0.71 M106.93 60.96 C126.36 38.81, 145.73 16.25, 158.02 1.06 M110.96 61.36 C129.17 41.36, 146.79 20.79, 163.64 1.79 M111.62 60.69 C120.86 48.91, 133.2 35.08, 163.46 0.38 M118.89 62.52 C137.78 35.19, 157.88 13.18, 170.22 -0.34 M117.81 61.51 C130.1 45.08, 145.21 28.4, 169.53 0.25 M123.01 59.58 C136.52 42.44, 153.11 27.06, 174.74 0.33 M122.15 60.56 C136.64 42.31, 152.09 25.34, 175.72 -0.78 M127.4 58.95 C137.09 48.31, 149.41 33.74, 181.65 -0.09 M128.13 60.15 C139.1 47.67, 150.99 34.38, 180.16 1 M131.03 62.69 C143.49 48.5, 154.54 35.09, 187.45 -1.76 M133.36 60.27 C152.69 38.37, 173.91 15.42, 185.42 -1.13 M137.94 59.63 C154.37 43.61, 169.71 21.68, 192.3 2.09 M137.41 60.95 C155.91 38.74, 174.54 18.34, 189.85 0.17 M144.82 60.5 C163.74 39.77, 181.21 19.21, 198.15 0.22 M143.09 60.8 C163.45 39.04, 182.55 14.4, 195.36 0.64 M147.16 61.03 C167.38 38.34, 188.1 13.73, 200.39 -1.43 M148.29 61.33 C162.25 44.8, 177.09 27.9, 200.73 0.97 M154.86 61.12 C167.53 45.51, 181.48 30.56, 205.93 -0.68 M153.31 61.49 C163.74 47.88, 175.12 35.85, 207.45 -0.85 M157.71 60.68 C177.24 42.13, 190.78 23.77, 212.86 0.06 M157.95 60.79 C177.68 37.51, 199.48 14.19, 211.04 0.96 M164.31 59 C176.32 50.4, 187 37.98, 216.54 0.88 M164.16 60.02 C178.26 45.58, 190.7 30.93, 216.81 0.38 M168.94 62.17 C180.94 46.72, 192.47 33.55, 221.3 -0.46 M168.64 61.93 C188.93 37.58, 209.03 13.47, 223.22 0.04 M177.04 58.9 C196.11 37.54, 219.41 11.89, 226.45 -1.45 M175.95 60.41 C190.53 43.09, 206.11 24.64, 227.68 -0.35 M180.88 59.67 C192.81 49.15, 200.82 34.23, 234.01 0.33 M179.86 60.94 C195.8 43.27, 213.43 23.51, 233.85 0.44 M185.6 59.86 C203.03 40.4, 219.91 21.15, 238.13 -0.94 M185.13 61.03 C205.54 37.98, 224.87 15.51, 238.81 0.37 M188.93 62.88 C203.5 48.85, 215.79 32.94, 243.98 0.06 M190.87 60.62 C209.03 39.98, 227.23 20.27, 243.66 0.76 M195.22 59.27 C208.63 45.11, 221.89 28.73, 250.71 -0.82 M196.31 60.58 C215.5 39.77, 234.65 18.38, 248.08 1.05 M203.15 61.85 C215.74 47.03, 224.22 31.61, 252.88 -1.33 M202.12 61.1 C221.29 37.78, 241.8 15.55, 253.53 -0.08 M207.81 60.82 C218.21 47.13, 233.12 31.05, 260.07 2.27 M206.25 60.13 C223.96 41.13, 243.16 18.69, 258.54 -0.21 M212.33 62.92 C232.2 35.55, 254.38 15.68, 267.06 -1.6 M211.2 61.85 C225.83 44.77, 240.61 28.23, 264.53 -0.8 M218 62.51 C230.67 45.99, 242.35 31.45, 269.41 -0.77 M217.87 61.07 C232.44 44.24, 246.6 28.23, 269.09 -0.71 M223.9 60.75 C239.4 42.63, 253.32 24.63, 277.58 -0.18 M222.86 61.7 C233.72 48.78, 243.74 35.47, 275.84 0.21 M229.06 60.66 C243.77 40.45, 263.71 19.51, 280.6 1.27 M228.26 61.14 C245.63 41.82, 261.59 22.14, 279.73 -0.42 M232.02 62.3 C249.27 42.46, 266.83 20.07, 288.16 1.81 M233.01 60.8 C249.84 42.99, 264.55 24.8, 286.84 -1.09 M236.99 61.87 C250.93 46.8, 263.6 29.5, 290.24 -0.06 M238.65 60.43 C253.08 42.3, 269.48 26.39, 291.68 0.04 M245.5 62.86 C260.34 41.57, 278.29 21.68, 295.23 1.55 M244.71 60.67 C263.79 38.74, 284.03 15.14, 297.03 -0.4 M250.46 59.11 C266.99 37.26, 289.39 14.48, 301.58 -0.93 M250.44 61.37 C261.12 48.63, 271.65 34.27, 301.26 -0.59 M255.85 62.02 C271.13 41.17, 288.45 20.62, 307.9 -1.45 M254.18 60.15 C266.51 46.72, 280.02 29.78, 308.09 -1.06 M258.82 59.61 C273.5 46.75, 282.74 33.58, 312.58 -1.17 M259.15 60.73 C279.62 37.3, 298.36 15.5, 311.98 -0.24 M265.3 59.69 C281.77 41.54, 300.48 22.6, 314.05 5.41 M264.79 61.44 C275.05 50.54, 284.66 38.64, 311.95 6.71 M272.13 60.95 C278.71 48.71, 287.72 37.84, 313.38 11.75 M270.51 59.62 C281.51 47.96, 292.81 33.48, 312 12.56 M274.71 60.09 C287.03 47.93, 295.9 35.48, 313.48 16.75 M275.08 60.08 C286.25 47.5, 298.47 34.89, 311.9 18.74 M280.45 59.74 C290.09 49.07, 302.73 35.19, 313.8 22.55 M281.72 60.27 C288.29 51.52, 297.87 42.35, 313.63 24.51 M287.67 59.76 C293.66 54.43, 298.54 47.77, 313.95 29.72 M286.74 60.96 C295.23 50.54, 304.94 40.25, 312.67 31.41 M292.53 60.68 C297.35 56.87, 301.94 52.36, 311.2 37.07 M292.1 60.96 C298.68 53.31, 305.54 46.42, 313.18 36.45 M298.45 59.53 C302.22 55.27, 303.48 51.39, 311.33 41.07 M296.6 60.29 C301.61 55.42, 305.04 52.73, 312.57 42.76 M303.44 61.03 C302.93 58.5, 308.5 56.68, 311.78 47.58 M301.33 60.7 C305.06 57.82, 306.94 55.68, 312.17 48.47 M307.77 60.65 C308.18 59.38, 309.5 57.5, 313.39 54.36 M307.25 61.08 C309.28 58.97, 310.38 57.93, 312.54 54.87"
          stroke="#82c91e"
          strokeWidth="0.5"
          fill="none"
          // 2nd JS fill
          style={{ stroke: "var(--even)" }}
        />
        <path
          d="M-0.7 -0.83 C109.17 1.67, 216.6 -1, 313.06 0.38 M0.45 0.69 C95.33 -0.37, 191.62 -0.79, 312.96 -0.13 M314.12 -0.57 C313.28 13.21, 312.17 31.02, 312.79 61.83 M312.03 0.06 C313.38 15.62, 313.39 30.86, 311.66 60.1 M313.92 59.94 C242.77 62.07, 172.52 60.73, 1.31 59.35 M312.08 61.15 C193.71 61.99, 75.34 62.34, 0.03 60.78 M0.11 60.09 C2.21 37.26, -0.69 15.36, 0.86 1.85 M0.17 60.18 C0.07 42.11, 0.61 22.73, -0.62 -0.66"
          stroke="#000000"
          strokeWidth="1"
          fill="none"
        />
      </g>
      <g
        strokeLinecap="round"
        transform="translate(602.1037188035326 52.39214093135524) rotate(0 228.12111801242236 30.35714285714286)"
      >
        <path
          d="M0 0 C0 0, 0 0, 0 0 M0 0 C0 0, 0 0, 0 0 M0.16 6.8 C1.07 3.6, 3.08 2.09, 4.61 0.16 M-0.23 6.68 C1.29 4.38, 2.98 3.28, 5.2 0.5 M-0.51 12.65 C3.53 8.91, 5.35 7.01, 10.75 -0.38 M0.68 12.31 C3.4 8.45, 6.37 5.04, 10.4 0.04 M-0.15 20.43 C2.54 13.21, 6.15 10.61, 15.92 -0.69 M0.25 18.82 C3.85 12.79, 8.75 8.71, 15.1 0.2 M1.52 25.15 C7.64 15.56, 13.39 8.97, 19.7 0.32 M1.18 24.48 C3.87 18.98, 9.79 13.94, 21.08 0.83 M0.88 31.66 C10.08 20.07, 15.23 13.8, 25.86 1.38 M0.01 30.53 C6.01 23.62, 11.98 15.3, 26.82 -0.17 M1.63 38.05 C9.38 26.32, 17.13 17.57, 32.01 1.86 M-0.47 36.59 C6.26 29.8, 12.79 22.12, 31.81 -0.16 M1.68 42.95 C6.57 35.59, 16.94 24.99, 37.56 0.53 M-0.66 41.53 C14 28.09, 26.98 12.79, 37.71 0.83 M0.42 48.68 C9.89 37.14, 18.23 23.84, 42.05 -1.54 M0.37 48.32 C14.39 32.43, 29.15 14.58, 42 0.64 M0.34 52.84 C12.17 37.98, 25.95 25.79, 49.03 1.89 M-0.15 55.28 C9.79 44.03, 18.49 32.71, 47.18 -0.4 M-1.02 59.2 C21.08 39.29, 40.36 17.48, 52.46 1.1 M0.56 60.71 C12.49 45.91, 25.53 32.79, 52.47 -1.01 M4.52 62.54 C20.94 43.33, 36.26 25.34, 56.57 1.29 M5.73 61.35 C15.96 49.04, 26 35.77, 58.97 -0.29 M11.89 61.61 C31.22 39.24, 50.87 16.05, 62.22 1.44 M10.47 61.11 C28.5 40.54, 46.29 19.93, 63.38 0.77 M16.93 59.95 C24.74 49.29, 38.18 34.59, 66.81 1.23 M17.26 61.5 C36.7 35.94, 56.95 13.2, 69.17 -0.12 M23 62.75 C34.04 45.31, 50.8 27.44, 74.62 -0.14 M21.81 60.21 C36.23 42.9, 52.15 26.44, 74.25 0.02 M27.36 59.74 C41.25 41.34, 56.75 25.13, 80.7 -1.06 M26.83 59.7 C36.89 47.97, 48.4 34.52, 80.2 -0.01 M33.02 60.07 C43.91 47.89, 56.5 34.19, 85.25 1.38 M31.14 61.75 C42.61 48.14, 53.61 35.14, 85.92 -1.04 M39.16 59.19 C57.09 38.76, 79.31 16.14, 89.48 -1.72 M37.41 60.02 C53.51 42.79, 69.31 22.47, 90.83 1.06 M40.95 61.71 C59.93 37.86, 79.53 17.38, 94.01 -0.24 M43.35 60.63 C62.12 39.63, 79.87 18.97, 96.58 -0.07 M47.32 61.04 C68.71 40.19, 87.05 13.76, 98.71 1.85 M46.68 61.46 C66.86 38.41, 87.51 14.27, 100.2 -0.71 M52.09 62.49 C66.2 45.23, 81.77 27.65, 105.12 1.4 M53.68 60.93 C66.5 45.56, 80.03 30.54, 105.79 -0.54 M57.13 62.45 C67.13 47.89, 78.73 36.69, 112.28 -1.09 M57.6 60.89 C75.84 42.16, 90.97 23.36, 111.74 0.01 M62.07 59.94 C81.52 36.67, 104.5 13.73, 114.47 2.17 M63.72 59.85 C75.24 49.55, 85.83 37.31, 115.75 0.98 M68.21 59.55 C83.27 45.98, 94.85 31.98, 120.37 1.4 M68.53 61.62 C80.43 47.17, 91.88 34.05, 121.28 -0.27 M72.84 62.25 C93.02 37.37, 112.78 12.67, 128.2 0.36 M75.4 59.78 C95.3 37.22, 117.25 12.54, 126.02 -0.2 M81.16 60.36 C94.45 43.69, 110.04 24.69, 131.47 -0.03 M79.81 60.35 C91.28 48.83, 100.69 35.15, 132.95 0.11 M84.64 60.32 C99.93 43.46, 118.79 22.83, 138.82 1.2 M85 60.25 C102.63 40.05, 119.96 20.2, 137.5 -0.34 M88.89 61.63 C110.8 37.94, 130.18 15.19, 144.42 -0.06 M89.15 61.94 C102.55 48.21, 114.61 33.43, 143.25 -0.04 M96.03 59.71 C114.11 39.06, 132.59 20.25, 147.81 1.87 M95.12 59.94 C108.27 45.25, 121.37 29.6, 149.11 -0.3 M100.61 60.78 C120.18 39.83, 140.08 18.22, 152.32 1.33 M101.58 61.41 C114.18 47.01, 124.44 32.37, 153.02 -0.75 M107.9 60.7 C125.73 37.03, 146.59 15.76, 156.93 0.23 M106.73 60.69 C118.52 46.16, 132.82 30.25, 159.11 1.23 M109.86 59.91 C127.6 42, 148.15 17.68, 162.62 -1.15 M111.48 61.92 C131.68 36.46, 153.01 14.75, 165.42 -0.9 M115.43 62.24 C129.72 44.62, 144.53 28.52, 168.28 -1.19 M117.14 61.52 C129.75 46.31, 141.69 32.02, 169.09 -0.31 M122.48 61.83 C136.99 44.39, 150.93 28.9, 173.07 -2.12 M122.59 60.82 C138.1 42.96, 152.63 25.25, 176 -0.21 M128.12 61.96 C138.77 49.38, 147.46 35.82, 180.28 0.86 M127.99 60.58 C143.77 40.34, 162.45 19.85, 180 0.7 M132.63 62 C150.67 42.55, 165.79 22.53, 183.74 -1.51 M131.96 61.58 C149.52 41.71, 166.98 20.53, 186.6 0.77 M137.79 60.2 C155.56 42.48, 168.96 24.53, 191.65 -1.7 M137.27 61.17 C150.78 46.23, 163.48 30.26, 190.13 0.01 M142.78 60.62 C156.81 41.45, 174.54 26.95, 196.99 -0.54 M144.01 61.84 C160.3 41.15, 177.99 21.17, 195.45 0.62 M150.56 59.97 C167.83 39.45, 187.77 15.9, 201.4 -0.27 M149.32 59.77 C167 37.75, 187.77 15.34, 201.12 -0.44 M155.71 62.53 C165.64 49.7, 175.48 33.88, 205.53 -1.77 M154.51 61.4 C170.42 41.17, 187.64 21.05, 207.1 -0.9 M158.21 59.72 C170.41 48, 184.36 29.15, 212.9 -1.56 M158.16 60.76 C171.52 47.8, 181.9 34.58, 211.93 -0.58 M162.52 61.28 C184.23 36.6, 202.23 15.38, 216.34 -1.05 M164.54 60.22 C183.26 39.26, 203.15 17.67, 218.44 -0.88 M168.8 62.34 C180.67 50.4, 191.38 36.38, 221.8 0.43 M170.12 61.41 C180.71 47.23, 192.37 33.56, 222.9 -0.17 M174.61 59.1 C188.22 45.31, 202.28 26.19, 226.74 0.44 M174.57 60.41 C190.86 42.73, 205.62 24.63, 228.72 -1.27 M178.76 59.66 C194.88 41.94, 212.96 24.05, 232.06 0.36 M179.93 60.41 C197.44 40.97, 216.22 19.7, 233.67 -0.83 M187.7 58.91 C197.84 45.09, 213.87 30.33, 239.71 0.97 M186.36 60.22 C198.37 47.48, 209.54 34.1, 238.87 -0.08 M191.44 61.44 C208.65 40.34, 228.3 19.5, 243.96 1.6 M191.28 60.86 C203.16 47.89, 214.75 34.94, 243.26 0 M197.83 60.33 C214.36 41.2, 231.36 23.64, 250.49 -0.76 M197.07 60.09 C208.71 46.59, 219.46 33.01, 248.12 -0.46 M200.54 60.13 C215.76 44.39, 227.85 33.01, 254.12 0.18 M202.24 61.01 C213.13 46.34, 228.06 32.02, 254.03 -0.98 M205.34 59.65 C221.12 45.32, 231.98 32.88, 258.68 -1.12 M207.15 60.59 C217.54 47.38, 229.44 33.23, 260.1 -0.11 M210.06 62.88 C226.74 45.2, 238.61 32.7, 263.42 0.84 M211.19 60.26 C229.8 42.12, 244.75 21.72, 265.65 -0.91 M218.89 61.85 C232.44 45.72, 244.94 29.02, 270.84 1.48 M218.44 60.45 C235.76 40.53, 253.29 19.82, 269.42 -0.35 M222.31 59.51 C238.24 43.46, 257.56 22.48, 277.09 1.01 M222.89 61.18 C235.24 47.45, 247.5 33.39, 275.19 -0.78 M227.44 60.6 C244.71 39.79, 260.31 20.19, 279.85 -0.7 M228.1 60.58 C244.23 42.63, 261.6 23.87, 281.04 0.66 M233.93 62.54 C244.64 46.69, 259.32 31.39, 284.67 -1.22 M232.41 61.49 C251.1 42.04, 267.02 21.35, 287 0.59 M240.29 62.26 C252.89 41.87, 266.57 27.41, 292.89 -0.7 M238.63 60.01 C255.75 42.52, 271.73 24.72, 292.26 -0.07 M243.84 59.16 C256.08 50.27, 264.65 37.63, 295.99 0.97 M243.19 60.06 C255.96 46.45, 267.55 31.61, 296.83 0.52 M251.02 61.88 C266.69 42.13, 281.21 23.38, 303.47 -0.9 M249.88 59.95 C264.01 41.92, 279.23 24.64, 302.75 -0.38 M253.29 59.27 C269.68 45.26, 281.18 29.31, 309.22 -0.96 M255 60.93 C270.62 42.74, 286.59 22.94, 307.75 0.5 M261.53 59.19 C280.75 36.84, 299.98 14.87, 311.4 -0.95 M261.06 59.75 C273.23 46.22, 286.04 31.68, 312.47 1.03 M265.87 59.45 C278.4 45.37, 294.89 27.2, 318.82 1.17 M265.96 61.27 C277.6 46.76, 290 32.74, 318.15 0.18 M270.06 58.62 C285.42 40.12, 303.64 22.56, 322.8 -1.86 M270.69 60.95 C291.51 36.17, 312.24 11.2, 323.78 0.64 M275.42 58.96 C295.44 38.45, 313.14 16.03, 327.58 0.22 M276.52 61.45 C296.39 37.65, 315.63 12.91, 329.81 -0.66 M282.48 62.01 C301.47 38.55, 320.41 15.02, 334.12 -1.9 M280.01 61.95 C299.56 39.12, 317.13 19.2, 333.35 0.07 M286.16 59.74 C301.66 44.29, 318.86 26.68, 338.58 -2.26 M285.49 60.95 C301.27 44.9, 316.11 28.82, 339.83 -0.05 M290.94 61.67 C302.72 48.46, 315.06 35.71, 344.11 -0.7 M291.55 61.09 C309.44 40.13, 327.96 18.01, 344.2 0.1 M296.57 62.45 C317.08 35.65, 336.22 12.62, 350.6 0.71 M296.02 60.43 C312.24 41.03, 329.26 24.11, 349.98 0.86 M301.95 60.83 C314.16 46.97, 323.83 35.41, 353.83 0.82 M301.22 61.09 C313.42 46.73, 327.63 31.91, 355.7 0.67 M307.48 62.41 C322.99 40.7, 342.18 20.5, 360.64 -1.46 M307.6 59.72 C320.99 45.98, 333.89 31.9, 359.38 0.84 M310.97 62.65 C328.62 44.08, 341.13 26.38, 366.65 0.43 M312.95 60.11 C327.6 44.18, 343.71 26.82, 365.56 0.88 M318 61.63 C334.03 42.36, 348.49 26.08, 372.1 -0.4 M318.07 59.76 C333.5 42.07, 350.7 24.12, 370.5 1.06 M321.78 63.01 C334.52 49.06, 346.2 36.27, 376.26 -1.42 M323.98 60.44 C343.78 37.67, 364.04 15.07, 375.84 -1.03 M329.57 60.82 C340.5 44.92, 354.86 32.27, 381.31 0.19 M329.6 60.7 C343.1 43.71, 357.45 26.79, 381.81 0.1 M334.49 62.44 C347.41 46.36, 358.44 31.36, 386.67 -1.59 M332.93 60.53 C344.87 48.45, 356.78 35.31, 386.93 0.36 M337.95 59.36 C350.74 49.08, 360.1 36.3, 392.93 1.28 M338.72 59.81 C349.76 46.4, 362.18 33, 391.14 0.69 M345.5 62.17 C357.02 47.13, 370.05 32.97, 396.19 1.74 M343.72 60.99 C360.93 41.24, 377.58 22.84, 397.57 -0.4 M349.21 59.34 C363.12 49.04, 371.57 34.86, 403.94 0.55 M350.3 61.54 C369.72 38.64, 388.2 18.86, 401.65 -0.27 M355.53 60.14 C368.35 45.91, 382.93 29.5, 409.44 1.1 M355.66 60.59 C376.04 37.55, 395.4 14.65, 408.85 0.41 M359.7 61.51 C379.24 35.4, 400.93 14.92, 411.61 0.35 M361.54 61.47 C380.67 37.33, 401.91 15.07, 413.85 0.26 M365.61 58.94 C379.21 42.65, 397.01 26.88, 417.36 -0.32 M365.37 60.25 C387.08 36.07, 408.49 12.78, 418.2 -0.32 M372.14 61.33 C392.49 38.34, 413.2 13.15, 425.53 -0.26 M372 60.35 C388.25 40.35, 405.17 19.32, 423.58 -0.52 M377.08 61.88 C386.84 46, 399.46 35.63, 429.21 -0.63 M376.83 61.06 C391.44 43.25, 407.45 25.04, 429.4 -0.58 M383.5 60.94 C394.05 44.35, 406.73 28.34, 435.63 -1.56 M381.57 60.1 C400.69 39.73, 417.54 17.45, 434.04 0.77 M387.61 60.93 C402.23 41.31, 417.64 22.63, 440.55 0.75 M387.37 60.23 C401 44.86, 413.8 28.39, 440.55 -1.16 M392.46 61.92 C408.37 43.92, 420.87 24.87, 444.11 0.88 M391.85 60.52 C407.37 43.31, 421.97 27.04, 445.78 -0.38 M399.16 60.76 C416.08 39.55, 433.21 20.77, 449.24 -0.91 M397.63 61.17 C411.55 43.58, 428.18 24.97, 450.12 0.27 M401.96 62.27 C421.15 39.35, 441.29 13.62, 457.51 0.17 M402.73 60.34 C420.19 41.11, 436.95 20.42, 456.67 -0.28 M410.01 62.75 C426.55 38.19, 448.71 14.28, 456.87 3.35 M407.64 61.43 C426.81 38.81, 446 16.81, 458.29 2.23 M415.26 60.96 C427.04 44, 443.24 28.73, 459.45 6.39 M412.49 61.68 C430.18 41.34, 446.11 22.71, 458.72 9.2 M418.77 60.92 C435.65 43.15, 450.81 25.02, 460.67 16.21 M418.74 60.7 C434.08 42.86, 448.56 26.18, 458.96 15.43 M422.63 62.87 C432.79 48.57, 442.13 38.27, 461.04 21.52 M424.39 61.07 C438.7 45.43, 451.82 30.38, 458.44 19.5 M428.33 62.02 C437.72 54.45, 442.78 43.12, 457.34 27.95 M429.62 60.85 C438.81 50.71, 446.39 40.21, 459.49 26.6 M432.62 59.58 C441.96 53.67, 449.37 46.06, 460.36 33.69 M434.05 60.2 C442.62 51.94, 450.72 42.65, 458.36 33.76 M441.91 61.47 C447.61 55.04, 450.88 45.93, 458 40.58 M440.34 59.89 C448.44 51.94, 455.21 43.41, 459.72 38.73 M444.12 61.35 C451.97 56.23, 455.39 47.84, 458.5 45.26 M445.43 61.92 C448.89 56.52, 451.1 53.5, 459.07 44.77 M450.97 59.81 C453.83 57.25, 455.26 55.31, 459.83 50.8 M450.45 60.22 C453.72 56.65, 457.16 53.57, 459.65 50.25 M455.42 61.02 C457.05 59.25, 457.53 58.84, 459.03 57.29 M455.56 60.79 C456.84 60.04, 457.43 59.17, 458.93 57.34"
          stroke="#82c91e"
          strokeWidth="0.5"
          fill="none"
          // 4th JS fill
          style={{ stroke: `var(--even)` }}
        />
        <path
          d="M0.41 -0.04 C111.18 -1.89, 220.97 -2.27, 455.66 0.48 M-0.34 -0.12 C175.59 0.18, 351.01 0.01, 456.56 -0.21 M455.86 1.64 C455.67 16.38, 454.14 30.31, 455.87 60.7 M455.32 0.96 C455.88 16.79, 456.32 34.46, 456.74 61.11 M456.56 59.85 C351.94 62.45, 246.05 61.76, 0.88 59.98 M455.86 60.36 C332.72 61.46, 208.95 61.52, 0.12 60.53 M-1.34 61.76 C1.21 37.45, 0.49 17.78, -1.47 -1.15 M0.16 60.62 C-0.14 45.87, 0.58 29.43, 0.99 0.82"
          stroke="#000000"
          strokeWidth="1"
          fill="none"
        />
      </g>
      <g
        strokeLinecap="round"
        transform="translate(1058.0657588516733 51.67337618235297) rotate(0 30.198412698412653 30.35714285714286)"
      >
        <path
          d="M0 0 C0 0, 0 0, 0 0 M0 0 C0 0, 0 0, 0 0 M0.13 5.92 C1.39 4.9, 2.95 2.4, 4.57 0.99 M-0.25 6.05 C0.93 4.44, 2.51 3.35, 5.29 0.69 M-0.54 13.19 C2.42 9.82, 3.28 6.74, 10.11 -1.03 M-0.28 11.34 C4.51 7.92, 8.22 3.79, 10.35 0.47 M0.97 17.94 C2.81 12.93, 7.92 10.82, 14.25 -1.35 M-0.7 19.42 C4.53 13.23, 9.22 7.64, 14.83 0.87 M0.41 25.65 C4.52 20.97, 7.59 14, 22.93 -1.02 M0.89 24.43 C8.45 15.6, 16.23 6.36, 20.48 0.76 M-0.33 30.86 C8.84 21.56, 17.36 11.46, 25.45 2.24 M0.33 30.19 C4.23 24.86, 10.95 17.51, 25.27 0.83 M1.69 38.82 C12.84 20.71, 25.03 7.79, 32.69 -0.64 M0.61 37.81 C7.59 27.43, 17.42 16.83, 32 -0.06 M1.22 41.16 C9.99 29.42, 21.88 19.44, 36.55 0.78 M0.36 42.14 C10.25 29.41, 21.01 17.85, 37.53 -0.33 M-0.3 47.32 C7.44 39.09, 17.75 26.83, 44.12 -0.4 M0.44 48.53 C9.31 38.47, 19.07 27.63, 42.62 0.69 M-1.25 56.35 C10.04 43.6, 19.87 31.59, 49.26 -1.31 M1.08 53.92 C18.13 34.59, 37.13 14.2, 47.23 -0.68 M-0.25 60.08 C16.37 43.83, 31.92 21.66, 54.76 1.78 M-0.78 61.4 C17.94 38.93, 36.8 18.27, 52.32 -0.14 M7.28 60.19 C25.98 39.73, 43.22 19.42, 59.96 0.67 M5.55 60.49 C25.67 39.01, 44.53 14.66, 57.17 1.09 M8.96 61.48 C28.94 39.08, 49.41 14.76, 61.55 -0.22 M10.1 61.78 C23.88 45.45, 38.54 28.75, 61.88 2.17 M17.32 60.82 C28.23 47.26, 40.41 34.36, 61.18 7.32 M15.77 61.18 C24.73 49.29, 34.59 39.01, 62.7 7.15 M20.18 60.37 C35.73 46.25, 45.35 32.41, 62.86 14.09 M20.41 60.48 C35.51 42.6, 52.53 24.77, 61.04 14.99 M26.78 58.7 C35.02 54.19, 42.11 45.89, 61.3 20.95 M26.63 59.71 C36.35 50.38, 44.35 40.83, 61.56 20.45 M31.4 61.87 C38.3 52.21, 44.92 44.69, 60.8 25.65 M31.11 61.62 C42.69 47.44, 54.07 33.37, 62.73 26.15 M39.51 58.59 C47.29 50.18, 59.37 37.42, 60.7 30.7 M38.42 60.1 C44.57 52.32, 51.89 43.37, 61.94 31.79 M43.34 59.36 C48.36 56.73, 49.55 49.64, 63.02 38.51 M42.32 60.64 C47.95 54.47, 55.37 46.45, 62.86 38.63 M47.41 60.31 C51.9 56.03, 55.9 51.6, 61.88 43.28 M46.94 61.47 C53.48 54.88, 58.65 48.7, 62.57 44.59 M51.92 62.04 C55.69 59.3, 58.04 55.34, 62.45 50.29 M53.28 60.46 C56.5 56.75, 59.91 53.69, 62.22 50.78 M57.81 60.72 C58.94 59.89, 60 58.34, 62.65 56.28 M58.14 61.11 C59.61 59.58, 61.16 57.99, 61.86 56.84"
          stroke="#12b886"
          strokeWidth="0.5"
          fill="none"
          // 5th JS fill
          style={{ stroke: `var(--odd)` }}
        />
        <path
          d="M0.76 0.77 C16.34 -0.99, 34.22 1, 59.37 -0.24 M0.62 0.54 C17.28 -0.96, 33.8 -0.96, 59.62 0.19 M62.22 0.8 C59.02 13.97, 61.7 27.73, 60.04 62.52 M60.84 0.59 C61.15 17.98, 59.72 37.98, 60.2 61.26 M60.41 60.82 C44.53 62.86, 28.75 61.04, 1.14 59.79 M61.34 61.3 C45.54 59.58, 29.71 59.96, 0.06 61.7 M-0.43 60.14 C-0.59 48.96, -1.08 36.4, -0.16 -0.12 M0.77 60.93 C-0.57 49.03, 0.83 35.56, 0.34 0.14"
          stroke="#000000"
          strokeWidth="1"
          fill="none"
        />
      </g>
      <g
        strokeLinecap="round"
        transform="translate(465.4353863442219 51.857096445478305) rotate(0 67.71103896103887 30.35714285714286)"
      >
        <path
          d="M0 0 C0 0, 0 0, 0 0 M0 0 C0 0, 0 0, 0 0 M0.34 7.03 C0.71 5.29, 3.12 2.94, 5.21 0.28 M-0.57 6.48 C2.14 3.76, 3.72 1.9, 5.35 0.6 M1.42 11.24 C2.9 8.04, 6.28 6.68, 10.21 -1.38 M-0.35 12.46 C3.38 7.76, 7.58 2.06, 10.8 -0.64 M-2.01 20.44 C4.91 14.08, 8.64 10.7, 16.98 0.7 M0.75 18.1 C5.89 11.16, 13.09 4.98, 15.79 -0.63 M1.72 23.08 C2.63 19.56, 7.47 14.82, 20.8 -0.87 M0.79 23.24 C5.24 18.86, 10.56 12.2, 21.26 -0.22 M0.47 30.7 C7.11 23.63, 13.14 15.87, 27.85 0.22 M0.53 30.11 C6.08 23.86, 12.18 15.4, 25.52 0.82 M-0.99 35.63 C10.09 23.39, 23.91 10.81, 30.2 0.61 M0.68 36.09 C9.99 23.43, 21.06 10.38, 32.43 -0.69 M-1.68 42.23 C7.33 32.22, 15.73 27.05, 37.37 2.1 M0.43 42.54 C8.7 31.45, 18.78 21.84, 36.7 1 M-1.58 50.28 C8.52 39.39, 18.19 26.45, 42.38 -1.25 M0 49.45 C9.27 37.77, 19.49 25.37, 41.78 -1.07 M-0.13 54.8 C19.47 32.4, 34.52 15.6, 49.46 0.02 M-0.22 54.65 C11.43 42.74, 20.13 31.9, 47.1 -0.03 M-0.56 61.24 C13.9 44.96, 27.94 31.9, 52.1 -2.11 M-0.28 60.25 C17.78 39.95, 35.41 19.75, 53.92 -0.87 M5.39 62.48 C24.41 37.48, 43.12 16.96, 56.73 1.99 M6.3 61.01 C21.04 42.57, 37.88 24.31, 58.64 0.12 M9.44 60.18 C28.09 41, 49.69 18.28, 64.81 -1.3 M10.15 60.94 C27.11 41.5, 43.59 22.45, 64.6 -0.29 M16.58 61.68 C29.48 42.36, 44.82 26.38, 68.48 -1.69 M15.6 59.57 C37.31 36.3, 58.16 12.6, 69.4 0.21 M19.47 61.24 C34.64 48.29, 46.61 33.63, 72.65 -1.86 M20.74 60.46 C34.18 47.04, 44.82 32.92, 74.71 -0.15 M28.57 59.14 C38.6 48.39, 46.66 37.61, 78.68 1.62 M27.22 59.63 C42.97 39.74, 60.16 21.1, 79.61 -0.69 M31.76 60.8 C43.69 49.52, 54.15 32.9, 86.45 1.49 M31.6 60.02 C52.77 37.46, 73.8 12.37, 84.33 0.05 M36.45 59.9 C51.11 48.03, 64 30.73, 90.02 -1.14 M37.1 59.85 C52.1 44.95, 65.83 28.47, 89.66 0.85 M41.23 61.54 C55.08 48.42, 65.68 35.67, 95.73 -1.65 M42.99 61.17 C63.69 37.99, 84.49 14.15, 94.67 0.16 M49.32 62.06 C64.69 42.03, 79.07 23.05, 101.85 -0.74 M47.68 60.95 C62.88 43.6, 79 25.71, 100.1 0.61 M51.49 60.46 C63.09 49.64, 73.2 37.33, 104.68 -1.37 M53.35 59.81 C73.09 36.78, 94.97 12.79, 106.11 -0.62 M56.96 61.77 C75.34 41.49, 94.68 19.94, 110.21 -1.6 M58.53 60.74 C71.03 46.1, 83.45 30.32, 111.64 0.71 M62.84 60.89 C83.01 42.42, 97.63 21.11, 115.55 1.3 M63.25 60.19 C75.26 47.25, 84.86 35.56, 115.53 1 M69.83 61.75 C86.04 40.74, 99.92 22.47, 123.84 -1.84 M68.38 60.63 C84.96 45.26, 98.95 28.19, 121.13 -0.4 M76.26 60.43 C88.23 47.95, 98.94 32.92, 127.21 -0.62 M75.41 60.89 C90.97 41.31, 107.32 24.05, 126.92 -0.6 M77.77 60.29 C97.09 39.39, 118.5 18.01, 132.16 -1.28 M79.8 60.64 C94.72 42.65, 111.59 23.41, 131.6 0.08 M85.42 59.05 C97.76 45.07, 109.78 31.77, 138.62 1.23 M84.75 60.83 C105.03 38.79, 125.37 16.19, 136.81 1.3 M89.3 59.98 C103.46 47.91, 112.68 32.21, 134.72 6.12 M90.52 60.12 C105.38 42.52, 120.44 26.06, 135.65 6.86 M96.67 58.97 C103.81 49.18, 114.78 38.51, 135.55 12.57 M96.29 61.3 C109.93 43.21, 124.34 27.44, 137.03 13.85 M99.61 59.72 C109.07 49.38, 116.45 40.87, 136.94 18.17 M101.41 61.76 C114.51 45.85, 125.38 32.71, 137.23 20.41 M105.07 60.78 C118.85 46.78, 130.18 35.12, 136.83 26.3 M107.25 59.91 C117.92 47.88, 128.56 35.13, 136.91 26.39 M110.59 62.74 C120.07 51.7, 128.07 44.33, 138.23 33.47 M110.5 61.61 C118.24 53.62, 124.28 46.5, 137.77 32.03 M118.35 59.33 C126.06 50.82, 133.93 41.9, 136.09 36.71 M116.98 60.61 C121.24 55.03, 126.98 49.34, 137.08 38.67 M122.83 60.57 C127.99 56.02, 128.45 51.64, 138.77 45.44 M120.98 61.03 C125.14 56.09, 130.43 51.59, 136.9 43.9 M128.52 60.05 C130.3 57.75, 131.43 55.09, 136.01 49.03 M127.18 59.97 C130.3 57.4, 134.97 52.27, 137.17 50.02 M132.27 60.95 C132.93 59.46, 134.76 59.13, 135.98 55.84 M132.75 60.86 C134.19 59.49, 135.49 57.96, 136.28 56.65"
          stroke="#12b886"
          strokeWidth="0.5"
          fill="none"
          // 3rd JS fill
          style={{ stroke: `var(--odd)` }}
        />
        <path
          d="M1.36 0.85 C30.15 2.89, 60.18 3.19, 134.41 -0.21 M-0.78 -0.02 C52.53 -0.57, 104.08 -0.52, 135.75 0.05 M135.8 1.78 C135.59 13.87, 135.94 28.51, 135.09 62.34 M136.39 -0.1 C136.34 15.5, 135.04 32.25, 135.68 60.35 M136.75 61.98 C109.97 63.86, 81.47 60.32, 0.55 60.58 M135.27 60.62 C90.27 61.1, 42.82 60.29, 0.92 59.83 M-0.32 60.49 C1.05 40.5, -0.78 21.98, 0.6 1.13 M0.53 61.41 C0.06 43.11, -0.35 25.52, 0.04 -0.2"
          stroke="#000000"
          strokeWidth="1"
          fill="none"
        />
      </g>
      <g
        strokeLinecap="round"
        transform="translate(29.533307507932705 290.57414243884006) rotate(0 33.279220779220736 30.35714285714286)"
      >
        <path
          d="M0 0 C0 0, 0 0, 0 0 M0 0 C0 0, 0 0, 0 0 M0.28 6.12 C1.24 4.89, 2.89 2.86, 4.25 -0.02 M-0.36 6.7 C0.82 4.77, 2.25 2.72, 5.38 0.36 M0.04 10.98 C4.89 7.26, 7.11 5.19, 9.67 -0.05 M-0.3 11.29 C2.75 8.41, 5.88 5.1, 10.7 -0.4 M-0.19 18.36 C2.65 14.87, 8.08 11.91, 15.73 0.64 M0.31 18.27 C3.6 13.84, 8.88 8.96, 16.33 0.59 M-0.08 22.61 C5.84 17.56, 12.93 5.86, 20.31 0 M0.18 24.56 C5.98 16.32, 13.86 7.76, 20.64 0.05 M0.93 31.52 C8.2 21.01, 18.65 6.81, 24.65 -1.56 M-0.85 30.94 C4.77 24.88, 10.45 18.89, 26.85 0.42 M-1.71 38.78 C9.89 26.73, 20.4 11.84, 31.93 1.18 M-0.33 36.63 C5.39 29.42, 13.83 20.77, 31.27 0.84 M1.44 42.87 C15.72 24.39, 27.32 9.89, 38.8 1.09 M-0.84 42.05 C7.56 33.06, 16.65 24.38, 36.48 -0.31 M1.04 50.21 C18.52 30.17, 33.63 10.95, 41.83 1.6 M0.45 49.52 C13.6 34.42, 25.46 18.73, 43 -0.94 M-1.38 54.75 C11.93 42.42, 19.01 32.96, 49.36 -0.46 M0.86 54.65 C11.83 39.61, 24.07 26.12, 46.53 -0.6 M-1.53 60.87 C13.32 45.68, 24.27 32.73, 51.85 0.05 M-0.69 60.87 C12.21 48.01, 22.3 34.52, 53.56 0.03 M7.3 60.18 C26.06 38.33, 46.24 16.02, 57.82 -0.57 M5.34 59.92 C21.91 42.46, 38.28 23.32, 58.64 -0.28 M10.32 60.56 C21.18 49.62, 33.18 36.74, 64.16 0.01 M10.5 60.61 C27.26 40.95, 46.16 21.34, 64.01 -0.76 M17.39 58.88 C31.93 44.6, 47.06 27.23, 67.36 1.83 M15.8 61.2 C35.94 38.89, 56.16 17.04, 68.16 0.71 M21.65 61.94 C32.28 49.79, 46.06 35.03, 66.65 9.21 M21.65 60.03 C35.19 44.82, 49.93 28.95, 68.21 7.88 M25.87 61.32 C39.95 44.54, 51.68 30.66, 66.25 13.09 M27.54 60.06 C37 49.75, 45.19 39.59, 67.57 14.15 M30.35 60.28 C39.87 52.26, 48.7 41.58, 68.74 17.48 M31.23 61.46 C44.13 47.53, 55.92 33.81, 68.54 18.72 M39.27 60.6 C49.14 48.31, 60.01 35.83, 66.09 26.07 M38.43 60.16 C48.1 49.74, 57.12 39.81, 68.71 24.85 M40.6 61.52 C52.76 50.91, 58.79 39.68, 69.45 29.84 M42.02 60.41 C50.65 52.56, 58.72 44.04, 68.03 31.19 M47.78 59.28 C54.46 52.98, 60.76 45.88, 68.97 37.93 M47.04 62.08 C53.7 54.89, 57.38 49.15, 67.95 38.34 M54.9 62.31 C58.83 56.93, 62.96 50.55, 67.54 45.27 M53.18 61.52 C56.34 57.57, 61.27 51.93, 68.48 44.15 M59.43 62.03 C61.7 58.27, 62.47 56.78, 67.96 51.25 M57.48 60.52 C60.7 58.16, 63.59 53.55, 68.49 50.37 M63.27 61.12 C65.24 58.8, 66.93 57.42, 67.82 56.52 M63.92 60.71 C64.96 59.21, 66.07 57.76, 67.5 56.27"
          stroke="#12b886"
          strokeWidth="0.5"
          fill="none"
          // 1st WASM fill
          style={{ stroke: `var(--odd)` }}
        />
        <path
          d="M-0.38 -0.71 C24.44 0.42, 46.12 -0.27, 66.45 -0.31 M-0.29 0.09 C21.82 0.99, 42.56 0.2, 67.41 -0.06 M67.67 0.34 C66.31 16.26, 66.4 27.99, 65.93 59.37 M67.06 0.49 C65.69 13.36, 66.28 25.67, 66.42 61.39 M65.26 61.56 C50.32 61.73, 36.81 59.12, -0.03 58.89 M67.14 61.41 C44.99 61.35, 22.77 60.68, 0.85 59.95 M0.53 58.92 C-1.36 41.52, 1.16 25.44, -2 0.8 M-0.73 61.22 C-0.73 42.68, 0.13 23.9, 0.79 0.65"
          stroke="#000000"
          strokeWidth="1"
          fill="none"
        />
      </g>
      <g
        strokeLinecap="round"
        transform="translate(95.6075110821364 290.7292800939775) rotate(0 59.64285714285711 30.35714285714286)"
      >
        <path
          d="M0 0 C0 0, 0 0, 0 0 M0 0 C0 0, 0 0, 0 0 M0.49 6.86 C1.48 5.61, 2.62 3.48, 5.41 0.08 M-0.06 6.63 C2.01 4.42, 3.97 1.71, 4.77 0.55 M1.02 10.72 C2.7 10.72, 4.49 5.79, 11.85 1.44 M0.49 12.51 C3.05 8.55, 5.24 5.35, 10.57 -0.82 M-0.51 16.9 C3.35 16.16, 5.28 11.18, 14.83 -0.97 M-0.38 17.74 C4.82 13.66, 10.19 6.42, 15.98 0.74 M0.69 25.72 C6.42 16.96, 14.22 9.57, 22.44 -0.38 M-0.56 23.77 C5.08 17.14, 11.7 10.66, 21.6 0.44 M1.1 30.16 C6.58 22.61, 14.97 16.18, 27.13 0.67 M-0.23 30.34 C7.76 20.41, 16.36 12.34, 26.98 0.52 M-1.6 37.98 C6.06 29.02, 15.66 20.87, 30.96 -0.85 M-0.88 36.4 C11.28 24.32, 21.82 12.57, 32.18 -0.06 M-1.5 42.9 C11.68 29.94, 22.9 20.18, 37.56 -0.94 M-0.61 42.9 C13.78 25.62, 29 9.54, 37.1 0.62 M-1.42 47.88 C15.84 31.46, 28.92 12.72, 42.2 -1.47 M0.45 49.55 C11.27 36.45, 23.38 22.13, 43.27 -0.15 M0.42 53.01 C16.35 35.44, 34.25 17.17, 47.46 0.98 M-0.67 53.89 C10.49 43.78, 19.5 32.6, 47.16 0.78 M-1.85 62.69 C12.38 47.23, 24.95 32.69, 53.33 -1.8 M-0.51 61.84 C16.44 42.85, 33.52 23.11, 54.01 0.82 M5.53 58.63 C17.18 49.4, 27.53 34.1, 56.85 1.52 M5.88 60.05 C16.91 47.76, 29.66 34.7, 59.13 0.1 M11.88 61.18 C23.68 44.65, 39.18 27.91, 62.21 0.91 M10.55 60.45 C28.13 43.29, 43.22 22.99, 63.71 -0.11 M15.94 62.27 C36.46 40.3, 54.66 18.67, 68.42 0.1 M16.18 60.55 C35.94 38.67, 54.7 18.61, 68.13 1.04 M20.22 62.6 C38.68 44.5, 52.8 24.39, 75.38 -0.28 M22.15 60 C41.37 35.93, 64.03 11.54, 73.8 0.42 M25.18 58.77 C47.24 37.94, 64.68 16.14, 79.56 0.43 M26.34 60.92 C45.09 39.58, 62.86 18.3, 78.44 -0.62 M32.81 62.41 C49.01 42.15, 63.37 23.81, 84.07 -1.98 M32.45 60.41 C46.54 44.76, 60.23 29.07, 85.91 0.13 M36.76 59.27 C58.48 40.25, 77.83 16.77, 90.35 -1.45 M37.83 60.98 C57.69 38.12, 78.93 14.21, 89.51 0.25 M41.98 60.39 C62.07 36.86, 83.05 16.86, 96.22 1.48 M42.76 60.95 C61.12 38.92, 79.24 19.15, 95.8 -0.94 M46.18 61.95 C68.22 38.95, 89.26 15.45, 99.56 -1.2 M47.63 61.67 C61.89 44.26, 78.52 26.1, 99.92 0.13 M54.73 60.63 C71.91 39.84, 90.91 19.37, 104.42 -1.89 M53.54 60.2 C74.82 37.44, 96.35 12.95, 105.39 -0.38 M59.61 61.05 C74.66 39.79, 95.06 21.13, 112.63 1.83 M58.86 62.01 C73.28 44.81, 87.89 25.89, 111.43 0.83 M64.79 59.55 C76.7 42.98, 91.34 28.93, 117.31 -1.01 M64.42 60.13 C80.02 42.61, 95.45 23.87, 116.1 1.3 M69.94 59.4 C85.75 41.49, 101.53 26.17, 120.4 2.13 M68.81 61.62 C83.81 45.31, 97.71 29.13, 119.63 1.04 M72.52 61.87 C87.7 44.4, 99.66 31.6, 120.29 6 M74.19 60 C88.24 44.67, 101.25 29.11, 121.58 6.47 M79.41 61.37 C88.02 51, 97.72 40.02, 121.83 14.04 M79.6 61.7 C94.19 42.63, 109.6 25.07, 120.71 14.31 M85.01 60.61 C94.38 49.79, 103.38 40.18, 120.03 18.11 M84.78 60.46 C96.26 46.46, 107.36 34.83, 120.22 20.56 M90.93 61.66 C98.16 53.64, 106.36 45.46, 119.6 24.58 M89.49 61.82 C99.65 48.44, 109.34 37.87, 121.07 25.93 M96.03 61.12 C101.96 52.63, 109.87 45.67, 121.79 33.75 M95.29 61.49 C103.04 52.29, 109.01 45.15, 120.47 32.54 M100.12 61.25 C105.95 55.64, 112.82 45.92, 121.92 35.66 M100.9 61.86 C108.2 53.92, 115.1 45.05, 121.1 37.09 M106.03 61.06 C110.95 53.03, 118.27 46.62, 120.96 45.26 M105.96 60.4 C108.46 57.55, 111.77 53.18, 120.38 43.3 M111.28 59.92 C114.67 56.28, 117.1 53.07, 119.46 50.3 M110.67 60.35 C112.97 58.49, 115.41 56.55, 119.91 50.89 M117.3 61.12 C118.28 60.1, 118.31 58.79, 121.29 55.59 M116.72 60.36 C118.02 59.11, 119.18 58.23, 120.85 55.82"
          stroke="#82c91e"
          strokeWidth="0.5"
          fill="none"
          // 2nd WASM fill
          style={{ stroke: `var(--even)` }}
        />
        <path
          d="M0.17 -0.06 C30.22 -1.14, 61.03 0.83, 120.72 0.11 M-0.86 0.44 C37.48 -0.91, 75.53 0.05, 119.6 0.72 M120.14 -0.34 C118.04 18.13, 121.19 37.97, 117.39 59.76 M119.55 -0.09 C119.89 17.51, 119.45 37.07, 118.5 60.09 M120.44 61.64 C83.15 58.31, 46.57 59.24, -1.59 59.12 M118.36 59.86 C94.98 59.85, 70.09 60.18, 0.5 61.32 M0.51 59.26 C1.8 41.87, 1.53 23.23, -1.56 0.04 M-0.53 60.64 C0.28 37.75, 0.8 17.21, -0.47 -0.62"
          stroke="#000000"
          strokeWidth="1"
          fill="none"
        />
      </g>
      <g
        strokeLinecap="round"
        transform="translate(216.22552818985582 291.29355860619654) rotate(0 163.0299539170507 30.35714285714286)"
      >
        <path
          d="M0 0 C0 0, 0 0, 0 0 M0 0 C0 0, 0 0, 0 0 M-1.03 6.67 C1.43 4.58, 1.48 3.54, 5.43 0.23 M-0.06 6.57 C1.3 4.7, 2.82 3.27, 4.89 0.31 M1.46 13.21 C3.38 7.9, 5.43 4.25, 9.55 0.85 M0.87 11.67 C2.06 9.78, 5.2 6.06, 10.13 -0.42 M1.87 19.02 C5.76 11.37, 10.47 4.46, 13.98 0.71 M0.47 18.78 C4.9 12.85, 11.08 5.63, 14.87 0.71 M1.18 24.54 C5.52 20.09, 9.65 12.31, 19.96 -1.11 M-0.47 23.92 C6.79 15.67, 13.91 6.76, 21.84 0.56 M-1.59 31.98 C6.6 23.59, 11.98 15.34, 26.4 -1.26 M0.09 30.46 C7.54 21.23, 14.53 14.53, 25.31 -0.38 M1.23 36.19 C12.18 22.34, 23.88 9.47, 30.03 1.62 M0 36.97 C8.7 25.67, 19.5 13.65, 31.37 0.78 M1.26 44.25 C11.62 29.35, 20.29 20.1, 36.76 -1.68 M-0.34 41.88 C12.76 27.59, 24.41 13.32, 37.1 -0.25 M0.93 50.91 C10.65 35.56, 21.65 24.57, 43.76 0.12 M0.66 48.13 C8.89 39.2, 16.63 28.58, 42.43 -0.61 M-1.05 54.41 C18.43 34.61, 36.64 13.07, 47.16 1.96 M0.9 54.39 C17.62 34.42, 34.89 13.6, 47.41 0.25 M1.97 59.69 C21.86 37.6, 38.48 14.79, 52.1 1.54 M-0.09 61.44 C18.54 40.08, 37.76 17.51, 54.03 -1.06 M3.92 59.35 C18.75 48.49, 30.35 33.45, 56.41 -1.54 M5.93 60.64 C24.81 39.5, 43.6 16.67, 57.56 0.61 M9.91 59.02 C24.5 44.02, 41.75 26.94, 64.69 1.35 M11.44 60.44 C27 41.03, 45.75 20.92, 64.33 -0.65 M18.07 62.27 C36.08 40.02, 55.79 15.35, 67.98 -1.04 M16.78 60.69 C35.41 37.4, 56.76 13.03, 69.05 0.67 M21.97 59.85 C36.73 43.79, 53.67 23.65, 73.86 -0.68 M22.13 61.16 C38.72 42.46, 53.45 22.73, 74.64 -0.11 M28.72 60.75 C39.76 46.9, 52.92 30.5, 78.06 0.88 M27.39 59.95 C41.62 42.02, 57.35 24.51, 79.51 0.61 M30.58 59.38 C43.12 48.11, 52.37 32.57, 86.62 -0.43 M31.48 59.91 C48.21 42.11, 65.79 21.77, 85.42 -0.86 M39.14 58.64 C55.31 39.5, 75.2 18.36, 91.49 -0.01 M38.12 61.13 C52.14 44.3, 65.47 29.11, 90.74 0.95 M40.85 61.1 C63.03 37.72, 80.18 17.35, 96.67 -1.51 M43.17 61.34 C54.08 47.41, 66.02 33.69, 96.3 -0.94 M46.61 60.84 C65.16 43.06, 77.98 26.37, 101.82 -1.66 M47.79 61.08 C67.89 37.93, 87.19 16.22, 100.69 0.56 M54.58 58.83 C73.01 35.42, 94.25 11.52, 104.4 0.8 M53.03 60.43 C70.46 40.8, 89 21.6, 106.07 -1.06 M57.11 62.31 C77.14 36.43, 99.8 13.04, 111.29 0.31 M58.39 61.69 C72.56 45.5, 87.18 28.17, 111.48 0.64 M62.24 60.68 C80.05 43.28, 92.78 26.81, 116.24 0.3 M63.04 60.53 C81.67 39.4, 100.45 19.13, 116.01 0.16 M69.29 60.6 C85.67 42.56, 97.48 25.85, 122.81 0.59 M69.07 60.47 C85.89 40.46, 104.61 19.71, 121.37 0.76 M75.01 61.11 C89.12 45.54, 103.23 31.2, 127.26 0.81 M75.34 61.31 C88.88 44.8, 101.2 30.19, 126.51 1.18 M81.17 60.8 C97.61 41.87, 114.78 22.36, 132 0.18 M78.79 61.53 C92.36 44.81, 106.89 28, 132.78 0.8 M84.74 60.87 C101.77 40.81, 119.95 19.12, 137.25 0.75 M84.23 60.79 C99.74 43.8, 113.11 29.57, 137.19 0.09 M89.45 60.31 C99.66 49.25, 114.24 36.33, 143.15 -1.6 M89.68 60.31 C107.35 40.83, 123.69 22.86, 142.29 -0.98 M95.98 59 C110.37 43.92, 123.42 32.11, 149.37 2.08 M96.17 61.34 C114.25 37.79, 134.92 15.41, 147.44 -0.46 M101.53 60.86 C115.72 40.73, 134.31 23.03, 153.25 0.87 M101.03 61.6 C113.88 44.53, 128.62 29.25, 154.63 -0.01 M105.97 60.9 C125.91 35.59, 148.3 12.39, 157.42 -0.9 M105.76 59.68 C121.71 43.73, 136.5 26.46, 157.82 -0.45 M111.48 60.47 C127.45 38.82, 146.14 17.94, 163.96 -0.48 M111.27 61.53 C131.11 36.43, 152.79 13.01, 164.7 0.65 M116.63 62.25 C132.86 44.25, 146.32 25.27, 169.94 -1.61 M117.77 60.86 C132.77 43.1, 147.34 26.74, 170.06 -0.54 M120.06 61.49 C138.56 43.6, 152.4 22.91, 173.64 0.61 M122 61.58 C141.65 38.88, 160.41 15.49, 175.55 0.27 M126.56 61.05 C139.51 49.27, 148.59 33.81, 178.12 -1.14 M127.12 60.26 C145.33 41.07, 160.01 22.99, 181.03 -0.03 M130.73 62.58 C153.02 37.56, 173.47 15.04, 185.34 0.71 M131.97 60.57 C150.58 37.81, 171.55 15.95, 186.37 0.46 M139.06 61.62 C156.43 41.44, 174.09 19.57, 191.84 -0.26 M138.9 59.65 C156 40.4, 174.56 18.5, 190.76 1.12 M141.62 62.71 C162.86 38.5, 179.38 20.21, 194.8 -1.32 M143.08 60.65 C160.15 43.47, 174.31 25.2, 196.53 -0.8 M150.12 58.57 C169.43 39.97, 185.57 19.79, 199.7 0.54 M148.32 61.09 C167.62 37.47, 188.13 15.08, 200.45 0.29 M153.56 61.16 C166.48 47.92, 179.97 32.84, 206.43 -0.28 M154.39 61.35 C165.35 49.07, 175.73 35.83, 207.55 -1.23 M159.74 61.61 C169.07 47.93, 181.28 34.33, 212.94 1.13 M158.15 61.79 C170.31 45.88, 183.55 32.58, 212.43 0.21 M166.08 61.53 C179.78 43.59, 196.05 24.45, 217.34 -0.67 M164.14 61.5 C180.85 42.88, 194.6 26.22, 217.09 -0.17 M170.6 60.47 C186.71 44.61, 202.44 26.68, 221.53 1.65 M169.22 60.99 C180.57 46.97, 193.38 33.93, 222.21 0.94 M173.36 59.72 C194.37 37.79, 213.71 14.53, 229.33 -0.68 M175.68 61.31 C187.36 45.62, 200.08 30.72, 228.98 -0.63 M180.09 61.48 C199.39 38.72, 220.89 12.56, 234.11 -1.42 M180.59 60.57 C192.26 46.46, 205.86 30.94, 232.44 -0.1 M184.31 59.95 C200.55 40.58, 216.36 25.66, 236.23 0.57 M185.56 60.31 C204.33 40.04, 221.17 20.26, 238.56 -0.52 M190.95 60.5 C203.18 46.79, 216.75 30.96, 241.99 0.7 M190.11 61.99 C204.38 46.27, 214.93 32.77, 242.93 -0.15 M194.49 58.75 C216.91 37.94, 236.31 16.29, 250.52 0.01 M195.46 61.38 C215.48 40.5, 232.12 20.1, 249.28 0.32 M202.58 59.74 C222.02 41.05, 238.11 18.78, 255.21 1.09 M201.81 61.05 C220.39 39.68, 240.45 16.62, 254.66 0.89 M206.17 60.98 C221.87 41.5, 240.31 24.69, 259.39 -0.84 M206.22 60.76 C228.15 38, 246.84 13.47, 258.77 0.69 M211.11 59.68 C227.97 43.74, 240.11 27.04, 266.44 1.18 M211.86 61.91 C226.26 45.03, 239.74 30.36, 265.75 0.46 M216.31 59.78 C238.55 37.43, 258.32 12.22, 271.4 1.06 M217.85 60.01 C233.94 42.57, 250.76 23.51, 269.49 0.94 M221.33 59.14 C238.19 43.74, 255.08 27.59, 275.1 -1.32 M222.58 61.06 C241.07 39.49, 260.57 18.64, 275.48 -0.65 M228.54 60.63 C247.02 36.72, 268.58 14.34, 279.79 -0.91 M227.51 60.04 C246.07 41.2, 261.46 21.1, 280.06 -0.21 M234.72 59.25 C245.97 48.8, 255.7 34.84, 287.25 -0.38 M232.46 61.32 C250.1 39.67, 269.23 19.38, 286.29 -0.31 M237.19 61.3 C257.25 38.11, 275.09 15.18, 290.46 0.96 M239.49 61.11 C256.68 40.11, 272.5 21.39, 291.23 0.28 M245.44 59.45 C264.31 38.34, 283.78 13.29, 295.66 -1.66 M244.15 61.89 C260.18 41.31, 277.62 22.05, 297.78 -1.03 M251.27 59.9 C267.26 38.21, 286.15 17.86, 302.03 0.65 M249.29 60.83 C270.62 37.48, 292.22 12.39, 301.94 -0.17 M256.37 61.49 C269.08 46.06, 279 29.8, 307.79 1.51 M254.43 60.27 C268.24 44.89, 279.96 30.02, 306.69 -0.01 M258.49 58.83 C273.92 44.31, 291.8 25.25, 313.8 -1.53 M259.51 60.13 C276.06 40.82, 293.31 22.49, 313.25 0.16 M267.05 61.43 C281.32 40.63, 299.49 20.01, 317.76 0.09 M264.26 60.35 C281.64 41.33, 298.36 23.76, 318.93 -1.07 M269.24 60.81 C289.92 39.55, 311.18 17.02, 321.75 1.07 M269.95 61.31 C282.4 47.65, 292.24 36.86, 322.4 -0.64 M277.7 61.64 C293.69 40.73, 309.57 22.11, 329.1 2.88 M274.75 60.32 C292.02 40.92, 308.33 22.92, 328.25 0.8 M279.94 61.62 C291.47 50.15, 301.07 38.61, 327.99 8.91 M280.88 60.75 C296.37 43.4, 310.97 25.72, 328.23 7.42 M285.26 58.82 C297.78 48.95, 306.31 38.05, 329.45 14.52 M287.18 60.75 C300.44 45.06, 314.05 29.54, 327 13.51 M291.66 63.11 C296.91 50.99, 306.61 43.28, 328.49 18.24 M291.71 61.93 C301.99 48.87, 311.9 38.25, 326.91 20.08 M295.32 59.97 C305.82 48.46, 319.13 35.91, 326.19 24.36 M296.95 60.53 C303.18 53.39, 311.01 43.9, 327.74 24.68 M302.21 61.68 C306.09 52.62, 314.27 48.64, 329.26 30.08 M301.04 61.9 C312.38 50.72, 322.35 38.44, 328.07 31.93 M306.19 62.4 C313.57 55.83, 317.13 49.59, 327.56 37.37 M307.65 60.9 C315.54 52.09, 321.27 45.69, 326.35 38.61 M312.71 61.31 C316.76 57.49, 322.89 52.47, 329.01 44.32 M313.27 60.35 C317.02 54.7, 322.25 48.87, 327.57 44.43 M317.27 61.41 C320.74 58.45, 323.06 54.89, 326.75 49.04 M318.79 61.22 C320.33 58.13, 322.96 55.71, 327.71 50.51 M323.16 61.47 C325.13 60.15, 325.85 58.44, 327.6 55.54 M323.49 60.77 C324.48 59.63, 325.91 57.8, 327.7 55.63"
          stroke="#12b886"
          strokeWidth="0.5"
          fill="none"
          // 3re WASM fill
          style={{ stroke: `var(--odd)` }}
        />
        <path
          d="M0.98 -0.65 C89.04 0.69, 181.01 -1.24, 326.43 0.9 M-0.54 0.1 C104.16 2.1, 206.4 1.97, 326.63 -0.68 M327.93 0.4 C325.07 14.21, 327.74 29.89, 327.93 61.88 M326.05 0.53 C326.22 23.01, 326.56 44.16, 326.56 61.29 M325.97 59.97 C209.13 60.59, 89.62 61.54, 0.77 59.57 M325.65 61.24 C225.81 59.97, 123.99 60.76, 0.31 61.12 M-0.47 60.56 C-1.82 40.3, -1.35 24.66, -0.38 -1.54 M0.38 60.32 C-1.19 42.89, -1.34 25.66, -0.25 -0.7"
          stroke="#000000"
          strokeWidth="1"
          fill="none"
        />
      </g>
    </svg>
  );
};

const Timeshift = () => {
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 337.1076588451583 611.8937908638269"
      width="1011.3229765354749"
      height="1835.6813725914808"
      className="h-auto max-w-full [&_path]:stroke-mutedPrimary [&_rect]:fill-background [&_text]:fill-text"
    >
      <rect
        x="0"
        y="0"
        width="337.1076588451583"
        height="611.8937908638269"
        fill="#ffffff"
      />
      <g strokeLinecap="round">
        <g transform="translate(187.63491442324926 43.66666666666663) rotate(0 -0.009371631220233212 70.22198938019577)">
          <path
            d="M-0.33 -0.36 C-0.09 23.21, 0.05 117.44, 0.31 140.8"
            stroke="#000000"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="1.5 7"
          />
        </g>
      </g>
      <g transform="translate(28.968247756582286 50) rotate(0 69.5 12.5)">
        <text
          x="0"
          y="18"
          fontFamily="Virgil, Segoe UI Emoji"
          fontSize="20px"
          fill="#000000"
          textAnchor="start"
          style={{ whiteSpace: "pre" }}
          direction="ltr"
        >
          Ahead of time
        </text>
      </g>
      <g transform="translate(204.96824775658274 51.33333333333326) rotate(0 59.5 12.5)">
        <text
          x="0"
          y="18"
          fontFamily="Virgil, Segoe UI Emoji"
          fontSize="20px"
          fill="#000000"
          textAnchor="start"
          style={{ whiteSpace: "pre" }}
          direction="ltr"
        >
          Just in time
        </text>
      </g>
      <g transform="translate(242.96824775658274 125.33333333333337) rotate(0 31 12.5)">
        <text
          x="0"
          y="18"
          fontFamily="Virgil, Segoe UI Emoji"
          fontSize="20px"
          fill="#000000"
          textAnchor="start"
          style={{ whiteSpace: "pre" }}
          direction="ltr"
        >
          running
        </text>
      </g>
      <g transform="translate(58.9682477565824 123.33333333333337) rotate(0 38.5 12.5)">
        <text
          x="0"
          y="18"
          fontFamily="Virgil, Segoe UI Emoji"
          fontSize="20px"
          fill="#000000"
          textAnchor="start"
          style={{ whiteSpace: "pre" }}
          direction="ltr"
        >
          compiling
        </text>
      </g>
      <g strokeLinecap="round">
        <g transform="translate(140.9682477565825 139.23011506881676) rotate(0 45.98781009452574 0.46593747236215677)">
          <path
            d="M0.38 -0.55 C15.78 -0.58, 77.31 -0.89, 92.85 -0.9 M-0.88 1.77 C14.28 2.02, 76.01 1.45, 91.65 0.69"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(140.9682477565825 139.23011506881676) rotate(0 45.98781009452574 0.46593747236215677)">
          <path
            d="M62.81 10.87 C73.44 8.32, 83.4 3.26, 89.86 2.68 M63.71 10.69 C70.36 9.93, 74.87 7.97, 91.12 1.62"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(140.9682477565825 139.23011506881676) rotate(0 45.98781009452574 0.46593747236215677)">
          <path
            d="M62.29 -9.65 C72.97 -5.23, 83.11 -3.32, 89.86 2.68 M63.19 -9.82 C70.08 -6.18, 74.7 -3.75, 91.12 1.62"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
      </g>
      <g strokeLinecap="round">
        <g transform="translate(326.30158108991577 81) rotate(0 -151.34440460496728 -0.6129656476667265)">
          <path
            d="M0.81 -1.02 C-49.75 -1.43, -252.15 -1.95, -302.82 -2.28 M-0.23 1.06 C-50.95 0.82, -252.88 -0.35, -303.49 -0.9"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
      </g>
      <g transform="translate(130.30158108991554 10) rotate(0 60 12.5)">
        <text
          x="0"
          y="18"
          fontFamily="Virgil, Segoe UI Emoji"
          fontSize="20px"
          fill="#000000"
          textAnchor="start"
          style={{ whiteSpace: "pre" }}
          direction="ltr"
        >
          Native Code
        </text>
      </g>
      <g strokeLinecap="round">
        <g transform="translate(173.9682477565824 246.29888472594314) rotate(0 1.55802877657095 70.20707386620342)">
          <path
            d="M1.14 -0.49 C1.27 23.17, 1.84 117.56, 1.98 140.9"
            stroke="#000000"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="1.5 7"
          />
        </g>
      </g>
      <g transform="translate(15.30158108991543 252.6322180592765) rotate(0 69.5 12.5)">
        <text
          x="0"
          y="18"
          fontFamily="Virgil, Segoe UI Emoji"
          fontSize="20px"
          fill="#000000"
          textAnchor="start"
          style={{ whiteSpace: "pre" }}
          direction="ltr"
        >
          Ahead of time
        </text>
      </g>
      <g transform="translate(191.30158108991577 253.96555139260977) rotate(0 59.5 12.5)">
        <text
          x="0"
          y="18"
          fontFamily="Virgil, Segoe UI Emoji"
          fontSize="20px"
          fill="#000000"
          textAnchor="start"
          style={{ whiteSpace: "pre" }}
          direction="ltr"
        >
          Just in time
        </text>
      </g>
      <g transform="translate(214.6349144232488 347.9655513926099) rotate(0 31 12.5)">
        <text
          x="0"
          y="18"
          fontFamily="Virgil, Segoe UI Emoji"
          fontSize="20px"
          fill="#000000"
          textAnchor="start"
          style={{ whiteSpace: "pre" }}
          direction="ltr"
        >
          running
        </text>
      </g>
      <g transform="translate(207.30158108991577 322.6322180592765) rotate(0 38.5 12.5)">
        <text
          x="0"
          y="18"
          fontFamily="Virgil, Segoe UI Emoji"
          fontSize="20px"
          fill="#000000"
          textAnchor="start"
          style={{ whiteSpace: "pre" }}
          direction="ltr"
        >
          compiling
        </text>
      </g>
      <g strokeLinecap="round">
        <g transform="translate(312.6349144232488 283.6322180592765) rotate(0 -150.7887646737057 -1.019622314721346)">
          <path
            d="M1.06 0.23 C-49.46 -0.01, -251.61 -1.97, -302.25 -2.27 M0.15 -0.69 C-50.5 -0.68, -252.06 -0.37, -302.63 -0.88"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
      </g>
      <g transform="translate(123.30158108991532 213.29888472594314) rotate(0 53 12.5)">
        <text
          x="0"
          y="18"
          fontFamily="Virgil, Segoe UI Emoji"
          fontSize="20px"
          fill="#000000"
          textAnchor="start"
          style={{ whiteSpace: "pre" }}
          direction="ltr"
        >
          JavaScript
        </text>
      </g>
      <g strokeLinecap="round">
        <g transform="translate(181.30158108991634 462.29888472594325) rotate(0 -0.19609577942219403 70.02102969773114)">
          <path
            d="M-0.47 0.45 C-0.55 23.65, -0.32 116.23, 0.09 139.59"
            stroke="#000000"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="1.5 7"
          />
        </g>
      </g>
      <g transform="translate(22.63491442324937 468.6322180592765) rotate(0 69.5 12.5)">
        <text
          x="0"
          y="18"
          fontFamily="Virgil, Segoe UI Emoji"
          fontSize="20px"
          fill="#000000"
          textAnchor="start"
          style={{ whiteSpace: "pre" }}
          direction="ltr"
        >
          Ahead of time
        </text>
      </g>
      <g transform="translate(198.63491442324926 469.96555139260977) rotate(0 59.5 12.5)">
        <text
          x="0"
          y="18"
          fontFamily="Virgil, Segoe UI Emoji"
          fontSize="20px"
          fill="#000000"
          textAnchor="start"
          style={{ whiteSpace: "pre" }}
          direction="ltr"
        >
          Just in time
        </text>
      </g>
      <g transform="translate(225.30158108991577 567.9655513926098) rotate(0 31 12.5)">
        <text
          x="0"
          y="18"
          fontFamily="Virgil, Segoe UI Emoji"
          fontSize="20px"
          fill="#000000"
          textAnchor="start"
          style={{ whiteSpace: "pre" }}
          direction="ltr"
        >
          running
        </text>
      </g>
      <g transform="translate(59.301581089916226 533.298884725943) rotate(0 38.5 12.5)">
        <text
          x="0"
          y="18"
          fontFamily="Virgil, Segoe UI Emoji"
          fontSize="20px"
          fill="#000000"
          textAnchor="start"
          style={{ whiteSpace: "pre" }}
          direction="ltr"
        >
          compiling
        </text>
      </g>
      <g strokeLinecap="round">
        <g transform="translate(146.6349144232497 547.1678353242513) rotate(0 29.950833802852287 0.22294786761341356)">
          <path
            d="M0.26 -0.7 C10.56 -1.02, 50.91 -1.18, 60.96 -1.07 M-1.06 1.55 C9.19 1.35, 50.09 0.99, 60.24 0.41"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(146.6349144232497 547.1678353242513) rotate(0 29.950833802852287 0.22294786761341356)">
          <path
            d="M31.2 12.22 C38.6 8.96, 46.8 4.79, 61.87 0.99 M33.34 11.93 C38.26 7.78, 45.61 5.69, 59.46 -0.56"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(146.6349144232497 547.1678353242513) rotate(0 29.950833802852287 0.22294786761341356)">
          <path
            d="M30.6 -8.29 C38.28 -6.78, 46.63 -6.17, 61.87 0.99 M32.74 -8.58 C37.91 -7.79, 45.41 -4.92, 59.46 -0.56"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
      </g>
      <g strokeLinecap="round">
        <g transform="translate(319.9682477565823 499.6322180592765) rotate(0 -151.65129971541148 -0.7493813879788149)">
          <path
            d="M-0.7 0.43 C-51.41 0.07, -253.15 -1.38, -303.44 -1.93 M1.14 -0.38 C-49.82 -0.56, -253.8 -0.09, -304.44 -0.36"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
      </g>
      <g transform="translate(121.30158108991611 429.29888472594314) rotate(0 59.50000000000006 12.5)">
        <text
          x="0"
          y="18"
          fontFamily="Virgil, Segoe UI Emoji"
          fontSize="20px"
          fill="#000000"
          textAnchor="start"
          style={{ whiteSpace: "pre" }}
          direction="ltr"
        >
          WebAssembly
        </text>
      </g>
      <g transform="translate(215.6349144232488 293.33333333333326) rotate(0 33 12.5)">
        <text
          x="0"
          y="18"
          fontFamily="Virgil, Segoe UI Emoji"
          fontSize="20px"
          fill="#000000"
          textAnchor="start"
          style={{ whiteSpace: "pre" }}
          direction="ltr"
        >
          parsing
        </text>
      </g>
      <g transform="translate(216.9682477565823 512.6666666666666) rotate(0 39.5 12.5)">
        <text
          x="0"
          y="18"
          fontFamily="Virgil, Segoe UI Emoji"
          fontSize="20px"
          fill="#000000"
          textAnchor="start"
          style={{ whiteSpace: "pre" }}
          direction="ltr"
        >
          decoding
        </text>
      </g>
      <g transform="translate(236.9682477565823 367.33333333333337) rotate(0 8 12.5)">
        <text
          x="0"
          y="18"
          fontFamily="Virgil, Segoe UI Emoji"
          fontSize="20px"
          fill="#000000"
          textAnchor="start"
          style={{ whiteSpace: "pre" }}
          direction="ltr"
        >
          ...
        </text>
      </g>
      <g transform="translate(219.1349144232488 540.5) rotate(0 38.5 12.5)">
        <text
          x="0"
          y="18"
          fontFamily="Virgil, Segoe UI Emoji"
          fontSize="20px"
          fill="#000000"
          textAnchor="start"
          style={{ whiteSpace: "pre" }}
          direction="ltr"
        >
          compiling
        </text>
      </g>
    </svg>
  );
};

const NativeCompiling = () => {
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 271.99999999999966 298.3333333333333"
      width="271.99999999999966"
      height="298.3333333333333"
      className="h-auto max-w-full text-mutedPrimary [&_path]:stroke-current [&_rect]:fill-background [&_text]:fill-text"
      style={{
        "--x86": colors.mutedPrimary,
        "--ARM": colors.danger,
      }}
    >
      <rect
        x="0"
        y="0"
        width="271.99999999999966"
        height="298.3333333333333"
        fill="#ffffff"
      />
      <g transform="translate(32 10) rotate(0 23.500000000000057 12.5)">
        <text
          x="0"
          y="18"
          fontFamily="Virgil, Segoe UI Emoji"
          fontSize="20px"
          fill="#000000"
          textAnchor="start"
          style={{ whiteSpace: "pre" }}
          direction="ltr"
        >
          Rust
        </text>
      </g>
      <g transform="translate(135.33333333333314 10) rotate(0 6.5 12.5)">
        <text
          x="0"
          y="18"
          fontFamily="Virgil, Segoe UI Emoji"
          fontSize="20px"
          fill="#000000"
          textAnchor="start"
          style={{ whiteSpace: "pre" }}
          direction="ltr"
        >
          C
        </text>
      </g>
      <g transform="translate(208.6666666666664 10) rotate(0 13.5 12.5)">
        <text
          x="0"
          y="18"
          fontFamily="Virgil, Segoe UI Emoji"
          fontSize="20px"
          fill="#000000"
          textAnchor="start"
          style={{ whiteSpace: "pre" }}
          direction="ltr"
        >
          Go
        </text>
      </g>
      {/* Rust to x86 */}
      <g strokeLinecap="round" style={{ color: "var(--x86)" }}>
        <g transform="translate(48 47.00000000000006) rotate(0 0.8737194006005211 96.26218745850335)">
          <path
            d="M-1.14 0.43 C-1.1 32.41, 0.15 159.83, 0.8 191.82 M0.47 -0.39 C0.79 31.73, 2.57 160.59, 2.88 192.92"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(48 47.00000000000006) rotate(0 0.8737194006005211 96.26218745850335)">
          <path
            d="M-7 162.85 C-5.42 176.04, -0.77 185.44, 1.88 193.2 M-7.42 165.77 C-5.49 172.95, -2.45 181.62, 2.68 192.39"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(48 47.00000000000006) rotate(0 0.8737194006005211 96.26218745850335)">
          <path
            d="M13.52 162.61 C7.9 175.69, 5.35 185.17, 1.88 193.2 M13.1 165.52 C9.2 172.89, 6.42 181.64, 2.68 192.39"
            strokeWidth="1"
            fill="none"
          />
        </g>
      </g>
      {/* C to x86 */}
      <g strokeLinecap="round" style={{ color: "var(--x86)" }}>
        <g transform="translate(142.4562138433172 41.00000000000006) rotate(0 -37.58732818091488 95.12190896831606)">
          <path
            d="M0.57 0.82 C-11.89 32.45, -63.08 158.63, -75.74 190.05 M-0.59 0.2 C-12.56 31.47, -60.74 156.57, -73.36 188.3"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(142.4562138433172 41.00000000000006) rotate(0 -37.58732818091488 95.12190896831606)">
          <path
            d="M-71.3 157.27 C-71.57 164.34, -72.98 170.09, -72.52 187.91 M-72.21 158.31 C-72.58 168.39, -73.77 178.91, -72.51 189.04"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(142.4562138433172 41.00000000000006) rotate(0 -37.58732818091488 95.12190896831606)">
          <path
            d="M-52.19 164.74 C-56.59 170.28, -62.13 174.43, -72.52 187.91 M-53.09 165.77 C-59.8 173.35, -67.28 181.42, -72.51 189.04"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
      </g>
      {/* Go to x86 */}
      <g strokeLinecap="round" style={{ color: "var(--x86)" }}>
        <g transform="translate(218.1595056303246 41.666666666666686) rotate(0 -61.93255678906871 98.04946465037912)">
          <path
            d="M-0.38 0.68 C-21.07 33.49, -104.16 163.62, -124.87 196.11 M1.63 -0.01 C-19.1 32.53, -104.39 161.54, -125.49 194.4"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(218.1595056303246 41.666666666666686) rotate(0 -61.93255678906871 98.04946465037912)">
          <path
            d="M-117.55 166.22 C-119.2 173.54, -121.59 180.83, -124.93 195.03 M-119.04 165.26 C-121.61 176.47, -124.68 188.9, -125.03 193.51"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(218.1595056303246 41.666666666666686) rotate(0 -61.93255678906871 98.04946465037912)">
          <path
            d="M-100.37 177.43 C-106.06 182.01, -112.58 186.62, -124.93 195.03 M-101.86 176.48 C-111.1 183.46, -120.85 191.53, -125.03 193.51"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
      </g>
      {/* Rust to ARM */}
      <g strokeLinecap="round" style={{ color: "var(--ARM)" }}>
        <g transform="translate(58 45) rotate(0 63.91183479903742 94.82758433023)">
          <path
            d="M1.12 -0.26 C22.36 31.52, 106.31 159.4, 127.57 191.1 M0.26 -1.45 C21.29 29.99, 105.06 157.45, 126.39 189.56"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(58 45) rotate(0 63.91183479903742 94.82758433023)">
          <path
            d="M101.85 170.97 C111.68 178.13, 117.2 182.07, 126.91 189.82 M103.24 171.49 C107.63 176.46, 113.6 180.7, 126.03 190.45"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(58 45) rotate(0 63.91183479903742 94.82758433023)">
          <path
            d="M118.98 159.66 C123.52 170.5, 123.73 177.95, 126.91 189.82 M120.36 160.18 C120.74 167.8, 122.64 174.73, 126.03 190.45"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
      </g>
      {/* C to ARM */}
      <g strokeLinecap="round" style={{ color: "var(--ARM)" }}>
        <g transform="translate(146.1717756135887 41.666666666666686) rotate(0 29.38730277888203 95.37852041859335)">
          <path
            d="M-0.59 1.03 C9.23 32.55, 49.59 159.01, 59.37 190.23 M1.3 0.53 C10.97 32.24, 48.84 157.15, 58.71 188.57"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(146.1717756135887 41.666666666666686) rotate(0 29.38730277888203 95.37852041859335)">
          <path
            d="M42.33 165.57 C48.4 171.5, 51.3 182.19, 57.23 189.3 M41.29 165.6 C46.41 171.51, 50.58 178.53, 59.26 188.17"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(146.1717756135887 41.666666666666686) rotate(0 29.38730277888203 95.37852041859335)">
          <path
            d="M61.94 159.53 C61.48 167.4, 57.78 180.11, 57.23 189.3 M60.9 159.56 C60.73 167.02, 59.56 175.69, 59.26 188.17"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
      </g>
      {/* Go to ARM */}
      <g strokeLinecap="round" style={{ color: "var(--ARM)" }}>
        <g transform="translate(229.56039232076466 49.000000000000114) rotate(0 -5.179950716720782 89.32300169844328)">
          <path
            d="M0.54 -0.37 C-1.44 29.76, -9.3 150.28, -10.9 180.25 M-0.63 -1.61 C-2.3 28.24, -7.09 148.2, -8.52 178.61"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(229.56039232076466 49.000000000000114) rotate(0 -5.179950716720782 89.32300169844328)">
          <path
            d="M-18.17 148.94 C-12.71 162.8, -10.54 173.61, -10.03 177.2 M-18.14 149.33 C-13.66 160.49, -10.67 170.73, -9.04 178.88"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(229.56039232076466 49.000000000000114) rotate(0 -5.179950716720782 89.32300169844328)">
          <path
            d="M2.33 149.83 C0 163.45, -5.63 173.92, -10.03 177.2 M2.36 150.22 C-0.36 161.11, -4.58 171.03, -9.04 178.88"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
      </g>
      {/* x86 box */}
      <g
        strokeLinecap="round"
        transform="translate(10 240.99999999999994) rotate(0 56.00000000000006 23.666666666666686)"
        style={{ color: "var(--x86)" }}
      >
        <path
          d="M-1.5 0.69 C39 -1.68, 77.66 -1.83, 111.32 -1.55 M-0.4 0.88 C44.68 -0.7, 88.3 -0.29, 111.67 0.97 M110.98 -0.38 C113.61 11.38, 110.3 23.84, 112.88 45.76 M111.01 0.71 C112.58 13.02, 111.55 28.08, 111.58 47.51 M111.43 48.86 C75.41 46.49, 37.42 46.41, 1.74 46.88 M111.97 47.65 C79.45 48.37, 45.94 48.66, 0.36 46.45 M-1.97 48.86 C0.37 35.82, -0.21 21.2, 1.81 -1.95 M-0.58 48.24 C-0.07 29.21, -0.14 13.08, 0.9 0.63"
          stroke="#000000"
          strokeWidth="1"
          fill="none"
        />
      </g>
      {/* ARM box */}
      <g
        strokeLinecap="round"
        transform="translate(149.99999999999966 240.66666666666669) rotate(0 56 23.666666666666686)"
        style={{ color: "var(--ARM)" }}
      >
        <path
          d="M-0.9 1.41 C45.49 1.99, 88.07 0.53, 112.75 -1.01 M-0.58 -0.6 C37.47 -0.32, 72.42 -1.58, 111.5 -0.4 M110.53 -0.68 C111.66 12.9, 112.91 21.39, 111.46 48.69 M112.96 0.32 C112.26 14.76, 113.11 31.36, 112.95 46.99 M111.69 46.92 C88.9 49.3, 65.9 49.11, 0.99 47.02 M112.93 48.01 C80.04 47.7, 47.89 46.06, -0.18 46.59 M-0.89 48.45 C0.88 36.42, -0.06 22.74, 1.01 0.87 M0.3 46.83 C0.26 31.62, -0.87 18.77, -0.3 0.26"
          stroke="#000000"
          strokeWidth="1"
          fill="none"
        />
      </g>
      <g transform="translate(46.000000000000114 252.16666666666657) rotate(0 20 12.5)">
        <text
          x="20"
          y="18"
          fontFamily="Virgil, Segoe UI Emoji"
          fontSize="20px"
          fill="#000000"
          textAnchor="middle"
          style={{ whiteSpace: "pre" }}
          direction="ltr"
        >
          X86
        </text>
      </g>
      <g transform="translate(184.99999999999966 251.83333333333331) rotate(0 21 12.5)">
        <text
          x="21"
          y="18"
          fontFamily="Virgil, Segoe UI Emoji"
          fontSize="20px"
          fill="#000000"
          textAnchor="middle"
          style={{ whiteSpace: "pre" }}
          direction="ltr"
        >
          ARM
        </text>
      </g>
    </svg>
  );
};

const WASMCompiling = () => {
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 271.99999999999955 298.33333333333337"
      width="271.99999999999955"
      height="298.33333333333337"
      className="h-auto max-w-full text-mutedPrimary [&_path]:stroke-current [&_rect]:fill-background [&_text]:fill-text"
      style={{
        "--x86": colors.mutedPrimary,
        "--ARM": colors.danger,
        "--WASM": colors.mutedBackground,
      }}
    >
      <rect
        x="0"
        y="0"
        width="271.99999999999955"
        height="298.33333333333337"
        fill="#ffffff"
      />
      <g transform="translate(32 10) rotate(0 23.5 12.5)">
        <text
          x="0"
          y="18"
          fontFamily="Virgil, Segoe UI Emoji"
          fontSize="20px"
          fill="#000000"
          textAnchor="start"
          style={{ whiteSpace: "pre" }}
          direction="ltr"
        >
          Rust
        </text>
      </g>
      <g transform="translate(135.33333333333348 10) rotate(0 6.5 12.5)">
        <text
          x="0"
          y="18"
          fontFamily="Virgil, Segoe UI Emoji"
          fontSize="20px"
          fill="#000000"
          textAnchor="start"
          style={{ whiteSpace: "pre" }}
          direction="ltr"
        >
          C
        </text>
      </g>
      <g transform="translate(208.66666666666652 10) rotate(0 13.5 12.5)">
        <text
          x="0"
          y="18"
          fontFamily="Virgil, Segoe UI Emoji"
          fontSize="20px"
          fill="#000000"
          textAnchor="start"
          style={{ whiteSpace: "pre" }}
          direction="ltr"
        >
          Go
        </text>
      </g>
      {/* x86 box */}
      <g
        strokeLinecap="round"
        transform="translate(10 241) rotate(0 56 23.666666666666686)"
        style={{ color: "var(--x86)" }}
      >
        <path
          d="M0.65 0.67 C32.9 0.96, 66.74 -1.7, 111.42 -0.31 M-0.26 -0.02 C38.15 -1.19, 74.08 -1.21, 112.91 0.74 M111.34 -0.77 C113.5 9.89, 111.3 21.29, 111.05 46.09 M111.24 0.75 C112.57 10.74, 111.41 21.55, 111.8 46.36 M112.6 46.03 C70.27 46.48, 30.56 49.01, -1.6 45.65 M111.85 48.01 C73.42 47.78, 36.15 47.69, 0.09 47.17 M-0.71 46.04 C-0.78 37.73, 0.64 24.23, -1.42 -1.37 M-0.97 47.13 C0.34 30.05, -0.55 14.03, 0.92 -0.91"
          stroke="#000000"
          strokeWidth="1"
          fill="none"
        />
      </g>
      {/* ARM box */}
      <g
        strokeLinecap="round"
        transform="translate(149.99999999999955 240.66666666666674) rotate(0 56 23.666666666666686)"
        style={{ color: "var(--ARM)" }}
      >
        <path
          d="M0.67 -0.8 C23.56 -1.02, 43.61 -0.95, 111.69 0.68 M-0.02 0.75 C29.03 -0.44, 58.34 1.2, 112.74 -0.87 M111.23 1.53 C111.84 13.27, 113.14 26.93, 110.76 46.01 M112.75 0.9 C111.22 10.7, 110.95 21.73, 111.02 47.98 M110.69 46.4 C75.18 47.82, 41.88 46.07, -1.69 48.1 M112.68 46.64 C85.02 47.09, 58 47.25, -0.17 46.6 M-1.29 46.68 C0.7 32.65, -2.05 15, -1.37 0.96 M-0.2 47.38 C-0.7 35.24, -0.24 25.76, -0.91 0.66"
          stroke="#000000"
          strokeWidth="1"
          fill="none"
        />
      </g>
      <g transform="translate(46.000000000000455 252.16666666666674) rotate(0 20 12.5)">
        <text
          x="20"
          y="18"
          fontFamily="Virgil, Segoe UI Emoji"
          fontSize="20px"
          fill="#000000"
          textAnchor="middle"
          style={{ whiteSpace: "pre" }}
          direction="ltr"
        >
          X86
        </text>
      </g>
      <g transform="translate(184.99999999999955 251.83333333333326) rotate(0 21 12.5)">
        <text
          x="21"
          y="18"
          fontFamily="Virgil, Segoe UI Emoji"
          fontSize="20px"
          fill="#000000"
          textAnchor="middle"
          style={{ whiteSpace: "pre" }}
          direction="ltr"
        >
          ARM
        </text>
      </g>
      {/* WASM box */}
      <g
        strokeLinecap="round"
        transform="translate(79.33333333333258 156.83333333333348) rotate(0 56 23.666666666666686)"
        style={{ color: "var(--WASM)" }}
      >
        <path
          d="M-0.65 -1.79 C36.78 -0.79, 75.4 -1.25, 113.57 -0.52 M-0.73 -0.33 C34.25 1.08, 65.81 0.29, 112.11 -0.33 M111.33 1.09 C111.41 11.13, 111.04 23.38, 110.13 45.82 M111.73 -0.6 C112.23 16.78, 113.07 35.72, 112.12 47.63 M112.15 48.87 C84.12 45.09, 60.21 45.59, 0.89 47.03 M111.92 47.19 C70.91 47.11, 28.91 47.54, 0.93 46.98 M0.77 45.72 C-1.27 34.83, 1.12 23.81, -0.46 -1.93 M-0.85 46.98 C0.9 33.17, 0.64 21.59, -0.73 0.42"
          stroke="#000000"
          strokeWidth="1"
          fill="none"
        />
      </g>
      <g transform="translate(107.33333333333258 168) rotate(0 28 12.5)">
        <text
          x="28"
          y="18"
          fontFamily="Virgil, Segoe UI Emoji"
          fontSize="20px"
          fill="#000000"
          textAnchor="middle"
          style={{ whiteSpace: "pre" }}
          direction="ltr"
        >
          WASM
        </text>
      </g>
      {/* WASM to x86 */}
      <g strokeLinecap="round" style={{ color: "var(--x86)" }}>
        <g transform="translate(101.99999999999955 211.83333333333348) rotate(0 -12.33440656478524 10.415006438321427)">
          <path
            d="M-1.07 -0.35 C-5.19 3.45, -20.29 18.53, -24.19 22.41 M0.56 -1.58 C-3.77 1.89, -20.89 16.72, -25.23 20.5"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(101.99999999999955 211.83333333333348) rotate(0 -12.33440656478524 10.415006438321427)">
          <path
            d="M-17.8 6.02 C-19.53 10.46, -21.52 15.55, -25.27 21.71 M-16.58 6.87 C-20.26 10.03, -21.6 13.64, -25.55 21.12"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(101.99999999999955 211.83333333333348) rotate(0 -12.33440656478524 10.415006438321427)">
          <path
            d="M-10.5 14.43 C-14.71 15.92, -19.21 18.12, -25.27 21.71 M-9.28 15.29 C-14.87 16.15, -18.17 17.5, -25.55 21.12"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
      </g>
      {/* WASM to ARM */}
      <g strokeLinecap="round" style={{ color: "var(--ARM)" }}>
        <g transform="translate(173.33333333333303 213.16666666666674) rotate(0 14.696044110754997 10.089114467132163)">
          <path
            d="M-0.35 -0.19 C4.67 3.36, 24.64 16.79, 29.74 20.21 M1.67 -1.33 C6.6 2.48, 24.28 17.7, 29.01 21.51"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(173.33333333333303 213.16666666666674) rotate(0 14.696044110754997 10.089114467132163)">
          <path
            d="M11.86 16.02 C15.91 18.5, 20.63 18.68, 30.34 20.96 M12.8 14.63 C15.89 16.74, 19.47 17.67, 29.69 21.41"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(173.33333333333303 213.16666666666674) rotate(0 14.696044110754997 10.089114467132163)">
          <path
            d="M19.72 6.6 C21.59 11.57, 24.21 14.27, 30.34 20.96 M20.66 5.21 C21.94 9.52, 23.74 12.6, 29.69 21.41"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
      </g>
      {/* Rust to WASM */}
      <g strokeLinecap="round" style={{ color: "var(--WASM)" }}>
        <g transform="translate(53.333333333333485 39.833333333333485) rotate(0 30.900237581082706 54.25827643913681)">
          <path
            d="M-0.19 0.41 C10.58 18.62, 52.9 91.01, 63.54 108.94 M-1.74 -0.42 C8.92 17.5, 51.6 89.03, 62.36 107.31"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(53.333333333333485 39.833333333333485) rotate(0 30.900237581082706 54.25827643913681)">
          <path
            d="M39.83 87.53 C45.55 91.82, 48.82 97.83, 61.74 105.85 M38.29 88.24 C45.63 92.87, 51.33 99.04, 62.25 106.98"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(53.333333333333485 39.833333333333485) rotate(0 30.900237581082706 54.25827643913681)">
          <path
            d="M57.48 77.07 C59.45 83.53, 59.01 91.74, 61.74 105.85 M55.94 77.78 C58.66 85.33, 59.65 94.3, 62.25 106.98"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
      </g>
      {/* C to WASM */}
      <g strokeLinecap="round" style={{ color: "var(--WASM)" }}>
        <g transform="translate(139.99999999999955 45.16666666666674) rotate(0 -0.5530334366998204 48.32690529448604)">
          <path
            d="M0.41 -0.46 C0.29 15.74, -0.65 80.57, -1.06 97.02 M-0.84 -1.74 C-1 14.65, -1.19 82.05, -1.51 98.4"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(139.99999999999955 45.16666666666674) rotate(0 -0.5530334366998204 48.32690529448604)">
          <path
            d="M-12.25 71.67 C-9.35 77.69, -4.64 84.78, -2.98 97.74 M-11.54 70.21 C-7.71 80.87, -2.71 92.22, -1.85 98.94"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(139.99999999999955 45.16666666666674) rotate(0 -0.5530334366998204 48.32690529448604)">
          <path
            d="M8.27 71.88 C5.61 77.91, 4.76 84.95, -2.98 97.74 M8.98 70.42 C4.78 80.82, 1.75 92.09, -1.85 98.94"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
      </g>
      {/* Go to WASM */}
      <g strokeLinecap="round" style={{ color: "var(--WASM)" }}>
        <g transform="translate(221.99999999999955 43.16666666666674) rotate(0 -25.62593078827183 50.94158600102179)">
          <path
            d="M-0.46 0.94 C-9.03 17.53, -43.31 83.52, -51.64 99.97 M1.5 0.39 C-7.24 17.15, -44.05 84.77, -52.76 101.49"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(221.99999999999955 43.16666666666674) rotate(0 -25.62593078827183 50.94158600102179)">
          <path
            d="M-46.96 71.27 C-49.68 81.72, -51.45 87.21, -53.42 103.32 M-48.42 71.46 C-50.75 83.66, -52.05 93.67, -52.21 101.02"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(221.99999999999955 43.16666666666674) rotate(0 -25.62593078827183 50.94158600102179)">
          <path
            d="M-28.86 80.94 C-36.76 88.56, -43.68 91.31, -53.42 103.32 M-30.32 81.13 C-39.34 89.7, -47.41 96.1, -52.21 101.02"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
      </g>
    </svg>
  );
};

const Portability = () => {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <p className="m-0">Compiling to native</p>
        <NativeCompiling />
      </div>
      <div className="flex flex-col gap-2">
        <p className="m-0">Compiling to WASM</p>
        <WASMCompiling />
      </div>
    </div>
  );
};

const Glue = () => {
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 592.9999999999998 277.8620635668436"
      width="592.9999999999998"
      height="277.8620635668436"
      className="h-auto max-w-full text-mutedPrimary [&_path]:stroke-current [&_rect]:fill-background [&_text]:fill-text"
      style={{
        "--runtime": colors.mutedBackground,
        "--glue": colors.danger,
      }}
    >
      <rect
        x="0"
        y="0"
        width="592.9999999999998"
        height="277.8620635668436"
        fill="#ffffff"
      />
      {/* Runtime */}
      <g
        strokeLinecap="round"
        transform="translate(10 68.03982330858713) rotate(0 71.33333333333331 89.33333333333331)"
        style={{ color: "var(--runtime)" }}
      >
        <path
          d="M0 0 C0 0, 0 0, 0 0 M0 0 C0 0, 0 0, 0 0 M-0.23 7.17 C1.82 3.71, 3.93 2.19, 5.15 1.08 M0.04 6.62 C1.88 4.06, 3.24 2.49, 5.02 0.33 M-0.85 11.09 C3.36 6.22, 9.19 2.96, 11.55 -1.09 M0.91 12.64 C2.83 8.96, 5.24 6.98, 10.11 0.17 M-1.57 16.73 C6.07 11.3, 9.58 4.15, 16.61 -1.26 M0.07 18.13 C2.8 14.4, 7.22 10.96, 15.37 0.48 M1.67 22.53 C9.22 16.66, 16.94 5.2, 20.37 0.62 M0.87 24.07 C7.17 15.35, 15.18 9.08, 20.9 -0.5 M-1.17 30.11 C6.41 23.18, 12.46 12.41, 25.29 1.04 M-0.09 30.24 C9.38 18.78, 20.74 8.02, 25.79 -0.32 M0.38 36.67 C11.93 23.28, 24.36 6.5, 33.22 0.57 M0.71 35.91 C10.24 25.68, 20.63 14.45, 31.67 -0.35 M-0.14 44.21 C12.17 28.42, 26.33 13.04, 37.23 0.85 M-0.41 42.65 C9.92 31.17, 19.37 21.86, 36.94 0.72 M0.64 49.07 C16.17 33.42, 28.85 15.86, 43.56 1.84 M-0.69 48.91 C9.12 37.4, 18.73 26.39, 41.68 -0.78 M1.27 55.88 C12.14 40.69, 23.4 30.95, 47.12 -0.91 M-0.73 55.17 C13.43 39.08, 26.35 23.44, 48 0.88 M-1.02 62.88 C17.65 38.04, 40.3 14.19, 53.51 0.93 M-0.06 60.33 C10.86 49.05, 22.92 35.77, 52.91 -0.8 M-0.98 67.86 C16.41 47.88, 29.47 33.28, 58.51 1.79 M-1 66.81 C20.18 43.09, 41.22 19.77, 58.7 -0.14 M1.44 73.66 C16.77 55.14, 33.57 35.5, 62.07 -0.58 M1.08 73.16 C14.97 56.24, 30.02 38.42, 63.85 -0.96 M-0.1 77.73 C16.61 61.24, 32.18 45.83, 67.82 0.13 M-0.65 78.73 C14.05 62.42, 29.15 44.8, 69.35 -0.17 M-1.03 86.06 C24.61 56.5, 47.94 29.99, 73.08 0.06 M-0.21 84.78 C21.51 59.28, 45.2 32.76, 73.61 0.59 M1.64 90.48 C29.38 56.75, 55.77 23.38, 80.35 -1.6 M-0.49 90.82 C18.37 70.07, 37.42 47.55, 78.82 -0.64 M-1.31 98.64 C19.56 73.88, 39.32 51.76, 83.31 -1.32 M-0.97 97.79 C22.29 71.95, 44.68 45.31, 85.82 0.18 M-0.54 103.47 C32.49 63.17, 66.8 26.14, 90.29 2.01 M-0.13 102.62 C22.89 77.68, 45.54 53, 90.52 -0.5 M-1.39 108.79 C19.91 84.17, 38.6 64.17, 94.35 0.28 M0.28 108.95 C22.14 86.97, 44.16 60.57, 94.7 0.53 M1.49 115.18 C23.28 89.87, 44.44 63.91, 100.69 1.5 M-0.61 116.14 C33.68 81.06, 64.43 44.64, 100.45 -0.31 M-0.38 121.32 C25.57 91.07, 55.19 57.71, 104.71 -1.05 M-0.36 121.74 C32.72 83.66, 67.52 44.94, 107.01 -1.15 M0.06 129.95 C35.04 86.84, 68.75 50.82, 111.47 0.53 M-1.06 128.56 C37.49 83.15, 77.45 37.44, 111.16 -0.16 M0.15 133.39 C31.99 96.48, 62.25 63.15, 117.09 -1.32 M0.39 133.31 C38.72 91.85, 75.5 48.87, 115.43 -0.51 M-1.66 139.02 C36.47 97.17, 73.62 54.8, 123.44 -0.09 M-0.1 141.25 C37.53 95.41, 75.34 51.86, 121.76 0.29 M-0.5 147.29 C49.91 86.15, 96.64 30.44, 125.04 2.31 M0.41 145.25 C34.32 107.18, 67.01 68.58, 127.16 1.01 M-1.41 152.92 C42.53 102.9, 85.94 52.87, 134.1 1.38 M0.24 152.27 C52.8 92.5, 105.71 31.77, 131.99 -0.17 M1.02 159.14 C31.73 122.52, 64.03 85.4, 137.08 0.11 M-0.5 158.39 C31.66 122.24, 63.52 85.61, 137.96 0.62 M-0.05 163.03 C52.2 105.51, 105.17 46.94, 142.62 0.4 M-0.63 165.22 C37.22 123.6, 73.74 81.75, 143.82 -0.33 M-0.38 171.96 C35.76 131.15, 68.61 88.78, 141.92 4.84 M-0.14 171.43 C46.58 117.51, 93.64 62.94, 143.66 5.52 M-0.56 176.62 C38.3 136.52, 71.62 95.57, 144.24 13.57 M0.58 176.64 C52.38 116.53, 102.99 57.65, 143.26 12.28 M1.93 182.05 C51.52 124.64, 100.86 68.73, 142.28 19.51 M2.39 180.25 C46.66 127.77, 91.89 76.73, 143.87 18.59 M9.04 179.47 C44.6 134.17, 85.08 92.8, 144.07 24.89 M7.9 180.53 C42.82 139, 77.55 98.59, 143.36 24.16 M13.58 180.81 C51.09 133.82, 92.89 88.3, 143.19 32.04 M11.91 180.16 C63.73 122.45, 116.86 63.64, 144.08 30.08 M19.89 181.89 C42.13 149.1, 67.61 123.4, 142.3 37.3 M18.14 180.62 C58.23 135.49, 97.12 90.64, 143.4 36.51 M21.69 181.53 C68.95 132.84, 108.73 83.09, 140.8 44.47 M22.4 181 C46.84 150.58, 71.99 121.81, 142.1 42.77 M27.19 179.45 C52.07 150.96, 77.13 123.01, 144.76 50.4 M29.41 180.11 C66.95 133.06, 107.65 88.51, 143.77 48.45 M34.81 181.46 C75.17 134.74, 115.71 84.23, 141.8 54.54 M33.16 180.93 C60.66 148.95, 89.53 116.68, 142.61 55.88 M38.46 181.41 C77.88 132.43, 119.3 87.14, 142.52 60.88 M39.13 181.7 C61.66 155.69, 84.68 128.82, 143.58 61.31 M46.37 178.75 C75.38 145.69, 106.58 108.56, 143.9 67.24 M43.98 180.59 C70.37 149.19, 96.38 118.79, 142.81 67.27 M47.86 179.99 C73.5 155.36, 95.72 130.61, 142.73 75.28 M49.18 180.27 C72.41 154.77, 95.68 130.04, 141.8 73.69 M54.68 180.71 C84.16 147.27, 116.29 111.28, 142.34 79.93 M55.23 181.08 C75.3 157.55, 94.39 137.42, 143.08 78.51 M60.49 178.8 C86.95 146.61, 115.16 115.75, 143.39 87 M60.04 181.38 C89.29 146.33, 118.76 112.96, 141.9 86.35 M66.9 179.74 C91.28 149.58, 116.18 120.13, 141.23 91.08 M65.83 179.92 C91.83 151.62, 116.32 122.47, 142.39 91.59 M70.95 181.81 C92.39 156.07, 115.32 127.12, 141.39 96.86 M71.44 180.26 C96.39 151.7, 122.26 120.86, 141.98 96.76 M75.1 181.38 C101.83 151.02, 127.99 120.6, 140.91 105.06 M77.28 181.08 C94.16 160.32, 112.03 138.84, 143.59 103.69 M82.74 182.13 C96.38 162.04, 114.19 143.23, 143.15 110 M81.64 180.61 C100.55 160.36, 117.14 139.74, 143.33 110.08 M88.2 180.31 C103.18 162.67, 116.65 145.45, 144.56 117.07 M87.62 180.96 C105.33 158.17, 125.07 136.55, 142.09 116.18 M92.22 181.99 C109.79 162.1, 125.36 142.68, 143.99 120.72 M91.47 180.54 C102.99 168.2, 115.44 153.18, 143.82 121.88 M96 180.31 C108.3 169.67, 114.58 159.09, 142.25 129.73 M97.48 180.4 C112.21 164.76, 125.98 149.4, 143.87 129.12 M104.64 180.74 C114.87 169.76, 125.62 155.21, 143.42 133.2 M102.34 180.62 C115.33 166.98, 125.77 152.77, 143.23 134.96 M109.18 178.31 C118.95 169.38, 124.93 158.31, 141.61 142.03 M108.02 180.67 C120.33 166.32, 131.96 151.87, 142.15 140.25 M114.1 178.86 C123.35 166.18, 135.9 152.13, 143.8 146.46 M114.19 179.83 C122.05 172.25, 128.26 163.52, 141.84 146.26 M119.3 180.33 C128.61 169.72, 135.84 158.22, 143.13 154.05 M119 179.49 C126.26 170.26, 134.38 161.08, 142.68 151.77 M123.6 181.96 C130.7 174.04, 139.19 163.23, 142.41 158.92 M123.54 179.6 C131.23 173.36, 136.37 165.83, 142.57 159.45 M130.77 181.55 C134.66 174.45, 139.97 169.08, 143.51 163.78 M128.7 181.01 C133.81 175.75, 137.71 170.52, 143.15 165.03 M133.54 180.68 C136.96 179.46, 137.99 177.15, 142.41 169.86 M135.16 180.08 C137.37 176.22, 141.68 172.28, 143.36 170.17 M140.33 179.78 C141.03 179.57, 141.11 178.55, 142.71 176.93 M140.15 180.09 C140.73 179.64, 141.25 179.03, 143 177.24"
          stroke="#ced4da"
          strokeWidth="0.5"
          fill="none"
        />
        <path
          d="M0.54 -1.87 C27.58 0.59, 57 -2.15, 144.19 -0.15 M-0.69 -0.37 C34.54 -1.17, 66.93 -0.81, 142.76 0.49 M143.99 -1.09 C142.97 56.76, 142.64 114.26, 143.45 178.86 M141.82 -0.17 C142.8 50.92, 142.38 104.61, 142.1 177.94 M141.12 179.79 C94.57 179.22, 46.95 179.28, 1.41 179.47 M141.95 178.24 C92.16 177.62, 41.81 177.11, -0.43 178.85 M1.36 178.64 C0.19 124.68, 0.96 72.7, 0.35 0.24 M0.56 178.11 C1.44 140.87, 1.97 103.99, 0.47 0.28"
          stroke="#000000"
          strokeWidth="1"
          fill="none"
        />
      </g>
      <g transform="translate(44.33333333333326 144.87315664192045) rotate(0 37 12.5)">
        <text
          x="37"
          y="18"
          fontFamily="Virgil, Segoe UI Emoji"
          fontSize="20px"
          fill="#000000"
          textAnchor="middle"
          style={{
            whiteSpace: "pre",
            strokeWidth: "2px",
            paintOrder: "stroke",
            stroke: "#000000CC",
            strokeLinecap: "butt",
            strokeLinejoin: "miter",
            fontWeight: 800,
          }}
          direction="ltr"
        >
          Runtime
        </text>
      </g>
      {/* wasm glue */}
      <g
        strokeLinecap="round"
        transform="translate(175.33333333333348 71.3731566419205) rotate(0 71.33333333333326 29)"
        style={{ color: "var(--glue)" }}
      >
        <path
          d="M0 0 C0 0, 0 0, 0 0 M0 0 C0 0, 0 0, 0 0 M-0.09 5.6 C1.51 4.93, 2.26 3.15, 4.69 0.75 M-0.12 6.19 C2 3.89, 3.46 2.33, 4.6 0.43 M-0.74 11.92 C2.97 7.75, 9.01 4.64, 11.56 -0.42 M0.67 11.75 C2.88 9.69, 4.43 6.05, 10.95 0.11 M1.18 16.94 C4.66 9.88, 11.72 3.56, 16.68 1.46 M-0.79 19.09 C4.47 13.18, 9.13 8.1, 16.5 -0.53 M1.13 25.95 C6.64 17.57, 13.9 10.76, 21.92 0.08 M0.36 24.09 C4.34 19.4, 9.61 14.13, 22.06 -0.54 M1.59 29.42 C6.79 21.06, 16.78 12.96, 25.48 1.47 M-0.41 29.82 C7.47 22.47, 13.38 14.04, 26.21 -0.37 M-1.2 35.91 C9.32 24.05, 19.56 14.74, 30.25 -1.7 M0.73 37.69 C11.37 23.06, 23.74 7.71, 31.27 0.37 M1.31 41.52 C7.04 32.58, 17.08 24.48, 35.52 -0.9 M-0.23 41.99 C9.02 32.55, 16.76 22.48, 37.72 -0.61 M0.75 47.47 C10.51 36.81, 22.58 23.86, 43.06 1.43 M0.54 48.58 C14.23 31.27, 28.56 14.57, 43.05 0 M1.16 54.01 C17.57 33, 37.78 12.8, 48.54 1.2 M0.89 53.92 C11.6 41.43, 22.59 27.58, 48.18 -0.44 M-0.14 60.24 C17.01 40.73, 37.91 22.36, 51.55 -2.12 M0.37 60.05 C21.55 36.92, 41.07 13.51, 52.3 -0.16 M5.38 57.28 C27.19 39.48, 46.66 16.31, 59.14 -0.23 M7.16 58.86 C20.42 42.84, 34.47 28.6, 57.29 -0.61 M13.13 58.65 C25.26 42.4, 40.4 29.84, 63.76 1.2 M12.53 59.56 C24.1 46.96, 33.81 33.72, 64.53 -0.11 M17.88 57.38 C34.48 39.13, 50.39 21.85, 66.81 -0.11 M18.21 59.02 C31.95 42.79, 46.09 25.83, 69.32 0.56 M21.35 59.85 C32.35 48.45, 44.06 35.37, 72.62 -1.94 M22.86 58.6 C32.87 46.94, 44.06 34.66, 73.77 0.52 M30.17 59 C45.11 41.43, 58.56 23.47, 79.93 -0.2 M28.91 58.59 C45.25 39.7, 60.58 18.79, 79.12 -0.82 M31.4 59.59 C52.57 37.02, 72.81 10.81, 83.93 0.24 M32.95 58.54 C52.37 36.96, 70.96 15.26, 84.65 0.59 M38.55 59.44 C57.43 35.55, 78.72 13.37, 91.73 -1.15 M38.61 59.66 C54.13 42.11, 68.79 25.35, 90.07 -0.17 M43.02 58.71 C58.28 42.53, 74.03 24.63, 96.37 0.66 M42.93 59.19 C60.03 39.48, 78.13 20, 96.35 -0.63 M48.18 57.11 C68.33 40.74, 83.39 22.09, 100.33 1.52 M49.24 58.76 C64.36 43.35, 78.06 25.86, 100.13 -0.52 M52.82 59.19 C66.85 47.11, 76.52 33.94, 105.5 1.36 M53.53 58.79 C65.71 47.88, 76.6 33.89, 106.6 0.57 M60.48 60.31 C77.56 39.75, 95.51 16.55, 112.72 1.41 M58.64 59.6 C73 44.75, 85.18 29.68, 111.83 -0.42 M66.29 60.14 C82.92 36.62, 100.67 16.48, 115.08 2.26 M66 60.03 C81.54 39.33, 98.09 21.38, 117.04 1.09 M71.68 60.19 C87.01 42.96, 101.88 24.35, 120.76 1.26 M69.18 60.08 C82.24 44.6, 93.78 31.11, 122.24 -0.01 M73.79 57.78 C93.93 35.33, 114.17 15.96, 127.74 2.14 M76.18 60.02 C90.92 42.61, 103.09 26.89, 127.86 0.03 M80.93 59.3 C98.4 40.9, 115 21.25, 133.19 0.91 M79.8 58.78 C94.93 44.5, 108.98 26.57, 133.01 -0.98 M86.57 57.47 C106.42 35.97, 122.8 14.12, 136.98 -0.82 M86.47 58.32 C99.73 43.15, 113.19 27.94, 137.82 1.16 M92.9 60.56 C110.61 34.94, 128.88 14.68, 143.63 1.34 M90.69 60 C104.91 43.93, 118.59 27.87, 142.35 -0.58 M96.75 57.68 C110.24 43.02, 123.03 30.39, 144.62 5.95 M97.83 58.93 C113.55 38.95, 129.86 19.85, 143.67 5.97 M101.15 60.01 C116.24 46.9, 128.43 32.93, 143.42 13.5 M102.58 60.43 C115.07 43.54, 130.27 27.88, 141.87 13.2 M109.3 58.03 C118.56 47.79, 128.64 34.92, 142.58 18.12 M107.77 58.28 C118.08 47.64, 129.45 35.23, 143.96 18.38 M112.1 58.81 C123.17 45.71, 134.68 34.28, 143.73 23.01 M112.78 59.23 C121.72 48.42, 131.43 39.02, 142.73 24.39 M118.1 59.23 C128.02 51.07, 133.04 41.55, 144.92 30.44 M118.39 59.25 C122.62 51.97, 128.23 45.71, 143.04 30.69 M125.06 59.25 C131.44 50.46, 137.74 42.29, 144.14 34.99 M123.15 59.99 C130.01 51.05, 136.77 42.47, 142.15 35.81 M129.89 59.14 C131.82 55.75, 138.5 49.3, 144.66 41.58 M128.31 59.13 C133.84 53.3, 138.37 48.19, 141.95 42.42 M132.7 60.35 C135.45 56.77, 138.87 53.86, 142.16 47.49 M134.05 58.94 C135.98 57.4, 137.54 55.5, 142.74 48.21 M139.71 59.44 C141.01 57.79, 142.07 56.58, 142.51 55.69 M139.32 59.17 C140.54 57.97, 141.1 57.23, 142.65 55.24"
          stroke="#228be6"
          strokeWidth="0.5"
          fill="none"
        />
        <path
          d="M-1.97 1.21 C47.68 0.2, 93.69 2.18, 144.54 -0.72 M0.3 -0.59 C36.54 -0.42, 73.89 -0.92, 141.8 -0.48 M144.2 -0.2 C142.66 17.76, 143.22 40.01, 144.3 57.09 M143.44 0.32 C143.1 13.7, 143.78 27.48, 142.11 58.67 M141.34 59.93 C93.15 57.65, 47.26 58.8, -0.12 57.56 M142.37 57.86 C104.22 56.89, 64.14 57.75, -0.48 58.18 M-0.1 56.91 C0.51 38.97, -0.89 19.98, 1.81 0.13 M0.64 58.38 C-0.17 38.76, 0.53 17.71, 0.36 0.52"
          stroke="#000000"
          strokeWidth="1"
          fill="none"
        />
      </g>
      {/* js glue */}
      <g
        strokeLinecap="round"
        transform="translate(430.6666666666665 71.03982330858713) rotate(0 71.33333333333326 29)"
        style={{ color: "var(--glue)" }}
      >
        <path
          d="M0 0 C0 0, 0 0, 0 0 M0 0 C0 0, 0 0, 0 0 M-0.79 6.28 C1.8 4.63, 2.96 2.79, 4.73 0.55 M-0.06 6.37 C0.83 4.76, 2.37 3.15, 5.05 0.38 M-0.29 11.35 C4.05 8.44, 7.26 1.17, 11.97 0.95 M-0.25 12.41 C3.12 7.42, 6.45 4.37, 9.94 -0.56 M-1.37 17.43 C4.94 13.58, 6.89 7.61, 14.11 -0.77 M0.27 18.15 C5.35 11.3, 11.83 4.95, 15.1 0 M0.16 24.29 C8.62 15.53, 14.82 9.56, 22.17 1.46 M0.26 23.55 C6.8 15.69, 14.84 7.95, 22.22 -0.62 M-1.71 29.98 C4.99 25.24, 11.57 19.26, 25.07 -1.49 M-0.54 30.79 C8.6 19.01, 19.94 7.61, 26.54 -0.48 M-2.11 37.55 C10.09 29.39, 14.6 16.19, 33.58 -1.7 M-0.43 36.84 C6.47 28.16, 13.16 20.7, 32.61 0.02 M1.38 44.37 C9.63 34.82, 16.46 25.18, 36.15 -0.65 M-0.16 42.19 C13.96 27.83, 26.51 10.39, 36.53 0.38 M-0.47 47.62 C12.85 36.98, 23.95 22.44, 40.9 -0.03 M0.69 49.52 C11.46 34.68, 25.74 19.73, 42.78 0.36 M0.77 54.31 C18.32 35.45, 35.01 12.38, 47.15 -0.45 M-0.02 54.73 C11.6 40.3, 24.98 26.8, 46.66 0.4 M0.03 61.02 C13.11 46.68, 24.2 29.67, 51.38 -0.19 M0.65 59.92 C19.39 39.17, 37.86 17.66, 53.11 -0.05 M8.75 59.12 C23.49 39.01, 40.99 19.55, 58.75 2.02 M7.61 59.67 C25.21 35.87, 45.5 13.22, 59.12 -0.13 M10.45 61.12 C28.67 37.79, 47.59 18.21, 65.12 0.3 M12.24 58.52 C23.65 45.68, 35.07 33.84, 64.58 0.78 M17.31 57.79 C32.81 42.26, 46.5 26.48, 68.51 -1.19 M17.79 59.26 C35.14 39.21, 52.23 18.77, 68.66 -0.51 M21.66 60.02 C40.25 39.28, 58.66 20.09, 75.12 1.04 M21.77 59.84 C41.57 39.09, 60.88 16.47, 74.69 -0.71 M30.02 59.97 C42.58 45.09, 56.1 28.91, 78.84 -0.93 M28.87 59.72 C47.04 37.34, 64.34 16.51, 78.56 0.42 M34.58 60.39 C52.62 38.19, 71.02 17.22, 83.24 -1.23 M33.29 60.29 C47.69 43.15, 61.71 28.71, 85.53 0.35 M39.23 59.86 C53.94 39.87, 70.32 25.28, 89.06 1.1 M39.67 59.17 C55.88 40.04, 73.03 20.39, 90.69 0.25 M43.01 58.03 C54.97 43.92, 68.89 30.37, 96.22 -0.67 M43.42 58.7 C58.48 41.45, 75.66 23.29, 95.75 -0.73 M50.18 60.84 C65.88 40.59, 82.4 20.31, 99.33 0.32 M49.6 58.17 C68.15 37, 87.5 15.93, 101.48 1 M53.64 57.84 C69.52 44.52, 85.16 27.77, 105.68 -2.29 M55.33 58.35 C67.38 42.04, 82.97 26.56, 106.56 -0.22 M60.34 60.13 C72.98 45.04, 85.99 30.82, 110.72 1.26 M59.95 60.47 C73.04 44.7, 85.59 30.22, 111.93 -0.86 M66.02 57.87 C83.09 35.59, 103.25 13.96, 115.45 -1.24 M64.75 58.95 C85.24 36, 106 13.73, 117.06 0.84 M70 57.82 C86.14 39.22, 105.98 19.48, 121.15 1.59 M70.56 59.99 C90.44 37.02, 108.39 14.31, 121.57 -0.43 M76.56 57.28 C94.37 39.34, 111.79 19.78, 128.21 2.2 M76 58.66 C94.3 36.83, 114.49 14.69, 126.91 -0.46 M82.39 61.4 C102.98 37.92, 122.48 13.36, 133.43 0.11 M79.86 59.35 C91.74 46.61, 101.65 34.19, 132.54 -0.38 M86.59 60.37 C105.9 36.59, 126.03 12.47, 137.54 -0.85 M85.94 60.06 C103.57 40.77, 121.16 20.54, 138.34 -0.29 M90.22 58.73 C101.52 47.89, 114.68 32.38, 143.22 0.72 M91.48 58.86 C105.41 44.61, 118.08 28.36, 143.49 -0.92 M98.27 60.55 C107.32 46.4, 123.27 30.96, 141.32 7.11 M95.99 58.19 C106.9 45.67, 118.49 34.38, 143.56 6.87 M103.13 58.78 C113.65 45.29, 126.44 30.51, 143.94 13.31 M101.64 59.28 C111.71 46.71, 122.13 34.27, 142.52 12.99 M106.65 60.37 C119.9 46.11, 130.86 32.81, 143.52 18.69 M108.15 58.5 C119.24 46.08, 128.71 33.49, 142.6 18.96 M111.6 59.65 C124.25 46.68, 133.27 32.45, 140.82 26.45 M113.12 59.77 C124.42 46.7, 135.7 31.6, 143.24 24.42 M119.67 59.48 C127.22 50.46, 132.92 42.4, 142.27 29.58 M118.95 58.89 C127.95 48.3, 137.6 36.29, 143.29 30.3 M123 60.57 C126.98 53.03, 131.17 50.39, 143.5 36.18 M123.23 59.96 C128.87 52.39, 134.71 46.85, 143.36 37.2 M130.13 58.68 C133.47 53.9, 139.34 45.26, 142.64 43.39 M129.53 59.71 C131.56 56.2, 133.89 52.74, 142.11 42.47 M133.65 58.35 C137.59 56.36, 138.09 54.09, 143.13 47.5 M133.87 59.76 C136.06 56.24, 138.31 54.14, 143.58 48.86 M139.56 59.22 C140.32 58.36, 141.31 57.71, 143.24 55.07 M139.52 59.18 C140.67 58.03, 141.38 56.81, 142.61 55.22"
          stroke="#228be6"
          strokeWidth="0.5"
          fill="none"
        />
        <path
          d="M-0.02 -0.54 C42.89 0.35, 87.33 -0.86, 141.38 -1.51 M0.66 0.47 C33.24 0.08, 68.56 -0.9, 142.1 -0.18 M143.89 0.05 C142.68 18.64, 142.04 39.75, 143.98 59.3 M143.63 -0.65 C142.67 22.77, 141.9 43.78, 143.22 57.13 M141.42 58.11 C89.23 59.47, 33.64 57.41, -1.25 57.13 M142.92 58.52 C112.55 57.04, 84.67 57.66, 0.8 58.55 M-1.1 56.19 C-0.4 44.48, 0.68 34.58, -0.65 -0.58 M0.33 57.51 C1.16 42.79, 1.27 28.17, -0.19 -0.63"
          stroke="#000000"
          strokeWidth="1"
          fill="none"
        />
      </g>
      {/* my rust code */}
      <g
        strokeLinecap="round"
        transform="translate(176.66666666666663 173.37315664192045) rotate(0 70.99999999999994 37.33333333333334)"
      >
        <path
          d="M0 0 C0 0, 0 0, 0 0 M0 0 C0 0, 0 0, 0 0 M-0.64 6.01 C1.18 4.1, 2.87 3.13, 4.33 -0.28 M0.13 6.72 C1.52 4.25, 3.55 1.47, 4.74 0.55 M1.07 11.24 C1.47 8.68, 5.46 6.86, 9.55 -0.96 M-0.16 11.62 C2.88 9.04, 4.83 5.87, 11.3 -0.73 M0.74 16.99 C3.73 14.1, 9.14 8.81, 16.16 1.89 M0.54 18.1 C5.17 11.59, 10.21 5.57, 16.14 0.46 M1.16 23.53 C7 14.22, 16.82 5.98, 22.29 0.91 M0.88 23.44 C5 18.42, 9.66 11.84, 21.93 -0.73 M-1.46 31.27 C7.03 21.34, 19.51 12.66, 24.65 -1.65 M-0.95 31.08 C10.16 19.05, 19.84 6.96, 25.4 0.31 M-1.84 35.1 C12.91 25.26, 25.3 10.25, 32.89 -0.52 M-0.06 36.68 C8.08 26.57, 17.11 18.09, 31.04 -0.9 M1.31 41.75 C9.47 30.08, 20.61 22.11, 36.86 1.67 M0.71 42.67 C8.98 33.86, 15.39 24.43, 37.62 0.35 M0.16 47.28 C14.03 32.3, 27.16 18.22, 40.56 -0.4 M0.49 48.92 C11.79 35.42, 23.53 21.23, 43.08 0.27 M-0.96 55.03 C9.06 44.74, 19.78 32.8, 45.72 -1.48 M0.55 53.78 C9.59 43.26, 19.81 32.1, 46.87 0.98 M1.96 60.97 C17.47 42.73, 31.51 24.09, 53.68 -0.49 M0.69 60.56 C17.67 40.91, 33.64 19.25, 52.87 -1.11 M-2.06 67.6 C21.74 41.99, 44.6 12.77, 57.03 0.7 M-0.52 66.55 C21.29 42.25, 42.29 17.78, 57.75 1.05 M-0.17 73.49 C23.31 44.19, 49.33 16.57, 65.48 -1.44 M-0.11 73.71 C19.09 52, 37.32 31.13, 63.82 -0.47 M1.68 75.78 C21.23 54.75, 41.14 32.05, 69.47 1.12 M1.59 76.26 C23.43 50.9, 46.36 25.85, 69.45 -0.17 M6.19 74.93 C31.59 52.66, 51.81 28.08, 74.08 1.23 M7.25 76.58 C26.75 56.15, 44.73 33.74, 73.88 -0.81 M11.48 76.26 C28.57 60.49, 41.37 43.74, 78.6 1.82 M12.19 75.86 C27.48 61.51, 41.4 44.04, 79.69 1.03 M19.15 77.38 C41.38 50.76, 64.6 21.5, 86.47 1.12 M17.31 76.67 C35.37 57.41, 51.34 37.98, 85.58 -0.72 M24.95 77.21 C47.08 47.4, 70.36 20.9, 88.84 1.96 M24.66 77.09 C45.17 50.71, 66.66 27.08, 90.79 0.8 M30.35 77.26 C50.4 54.62, 69.92 30.66, 94.51 0.97 M27.84 77.14 C44.41 57.51, 59.48 39.97, 95.99 -0.31 M32.46 74.85 C58.2 45.79, 84.22 19.77, 101.49 1.85 M34.85 77.08 C53.81 55.06, 70.04 34.67, 101.61 -0.26 M39.59 76.37 C61.95 52.39, 83.47 27.09, 106.94 0.62 M38.46 75.85 C57.58 56.94, 75.74 34.29, 106.76 -1.27 M44.58 75.29 C70.32 47.07, 92.43 18.62, 110.73 -1.11 M44.48 76.14 C61.96 56.13, 79.49 36.23, 111.57 0.87 M51.56 77.63 C74.66 45.66, 98.39 19.11, 116.73 1.81 M49.35 77.06 C67.22 56.54, 84.68 36.14, 115.44 -0.12 M54.75 75.5 C73.93 54.35, 92.29 35.31, 123.62 -0.38 M55.84 76.75 C79 47.79, 102.98 19.87, 122.67 -0.35 M59.81 77.08 C82.82 54.89, 102.7 32.08, 127.67 1.13 M61.25 77.49 C82.51 50.7, 106.51 24.92, 126.12 0.83 M67.31 75.85 C86.1 54.48, 105.58 30.79, 132.08 -0.29 M65.78 76.11 C85.76 54.48, 106.59 31.18, 133.46 -0.02 M70.76 75.87 C95.81 47.29, 121.05 20.07, 138.48 -1.43 M71.45 76.3 C91.13 53.09, 111.74 31.14, 137.48 -0.05 M76.11 77.05 C100.11 53.29, 118.81 28.02, 144.26 0.71 M76.39 77.07 C89.53 59.59, 104.24 42.88, 142.38 0.96 M83.72 76.32 C104.92 50.22, 126.29 24.7, 144.14 4.51 M81.82 77.06 C103.58 50.97, 125.4 25.07, 142.15 5.33 M87.9 76.96 C101.72 59.72, 120.44 39.41, 144.65 11.1 M86.32 76.95 C105.35 55.47, 123.47 34.74, 141.95 11.94 M90.87 77.82 C103.91 61.7, 118.18 46.75, 141.12 17.2 M92.79 75.81 C102.59 64.76, 112.21 53.53, 141.94 18.23 M98.29 78.56 C114.76 59.15, 130.1 41.5, 141.65 26.6 M96.77 77.5 C109.94 62.98, 120.38 50.64, 142.22 24.79 M101.25 76.92 C115.18 63.86, 127.03 47.08, 141.96 31.68 M103.34 77.01 C116.23 62.1, 129.05 46.43, 142.44 32.02 M107.77 77.96 C121.2 62.36, 131.15 50.02, 142.68 35.37 M107.51 76.89 C119.16 65.81, 128.59 53.69, 142.02 37.18 M112.8 75.29 C120.78 66.79, 129.52 60.2, 140.88 44.44 M113.04 75.56 C122.92 66.95, 131.58 55.31, 142.57 42.84 M117.72 76.38 C127.83 67.6, 136.57 57.43, 143.39 51.46 M118.87 77.75 C128.1 66.92, 137.99 56.35, 142.04 49.96 M124.32 75.72 C128.54 73.25, 132.75 65.57, 141.61 56.33 M123.99 76.8 C129.63 69.99, 136.58 61.27, 142.47 54.5 M130.36 76.17 C135.22 70.12, 140.04 63.09, 142.27 59.78 M129.76 77.13 C132.31 71.49, 136.54 67.52, 141.53 62.12 M135.31 77.41 C136.4 74.65, 140.45 70.11, 144.04 66.11 M134.94 76.44 C137.04 74.02, 139.18 70.98, 142.88 67.25 M140.19 76.71 C140.75 75.26, 141.73 74.2, 142.28 73.46 M139.96 76.65 C140.8 75.89, 141.48 75.27, 142.6 73.61"
          stroke="#82c91e"
          strokeWidth="0.5"
          fill="none"
        />
        <path
          d="M0.44 -2 C35.77 -0.43, 68.98 -1.23, 141.25 0.99 M0.36 -0.52 C52.89 -1.72, 103.64 -0.1, 141.03 0.18 M140.91 -0.15 C140.1 26.62, 143 54.59, 143.16 74.18 M142.67 -0.37 C141.93 18.26, 140.75 35.04, 142.4 74.85 M143.31 73.17 C86.9 71.6, 33.97 72.17, 1.06 75.8 M141.34 75.32 C104.33 73.46, 66.77 73.23, 0.88 73.81 M0.86 76.54 C0.79 54.06, 2.14 33.03, 0.66 0.15 M0.09 74.68 C-0.25 58.64, 0.31 42.02, 0.79 -0.47"
          stroke="#000000"
          strokeWidth="1"
          fill="none"
        />
      </g>
      <g strokeLinecap="round">
        <g transform="translate(370.4668126498659 11.019911654293537) rotate(0 0.37786893000213695 127.91112012912825)">
          <path
            d="M1.13 -1.02 C1.14 41.74, -0.31 213.82, -0.38 256.84"
            stroke="#000000"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="1.5 7"
          />
        </g>
      </g>
      <g transform="translate(63.33333333333303 21.03982330858713) rotate(0 96 12.5)">
        <text
          x="0"
          y="18"
          fontFamily="Virgil, Segoe UI Emoji"
          fontSize="20px"
          fill="#000000"
          textAnchor="start"
          style={{ whiteSpace: "pre" }}
          direction="ltr"
        >
          WebAssembly module
        </text>
      </g>
      <g transform="translate(423.9999999999998 21.70648997525376) rotate(0 79.5 12.5)">
        <text
          x="0"
          y="18"
          fontFamily="Virgil, Segoe UI Emoji"
          fontSize="20px"
          fill="#000000"
          textAnchor="start"
          style={{ whiteSpace: "pre" }}
          direction="ltr"
        >
          JavaScript host
        </text>
      </g>
      <g transform="translate(201.16666666666674 87.8731566419205) rotate(0 45.5 12.5)">
        <text
          x="45.5"
          y="18"
          fontFamily="Virgil, Segoe UI Emoji"
          fontSize="20px"
          fill="#000000"
          textAnchor="middle"
          style={{
            whiteSpace: "pre",
            strokeWidth: "2px",
            paintOrder: "stroke",
            stroke: "#000000CC",
            strokeLinecap: "butt",
            strokeLinejoin: "miter",
          }}
          direction="ltr"
        >
          glue code
        </text>
      </g>
      <g transform="translate(457.1666666666663 84.8731566419205) rotate(0 45.5 12.5)">
        <text
          x="45.5"
          y="18"
          fontFamily="Virgil, Segoe UI Emoji"
          fontSize="20px"
          fill="#000000"
          textAnchor="middle"
          style={{
            whiteSpace: "pre",
            strokeWidth: "2px",
            paintOrder: "stroke",
            stroke: "#000000CC",
            strokeLinecap: "butt",
            strokeLinejoin: "miter",
          }}
          direction="ltr"
        >
          glue code
        </text>
      </g>
      <g transform="translate(206 183.03982330858713) rotate(0 41 25)">
        <text
          x="41"
          y="18"
          fontFamily="Virgil, Segoe UI Emoji"
          fontSize="20px"
          fill="#000000"
          textAnchor="middle"
          style={{
            whiteSpace: "pre",
            strokeWidth: "2px",
            paintOrder: "stroke",
            stroke: "#000000CC",
            strokeLinecap: "butt",
            strokeLinejoin: "miter",
            fontWeight: 800,
          }}
          direction="ltr"
        >
          My Rust
        </text>
        <text
          x="41"
          y="43"
          fontFamily="Virgil, Segoe UI Emoji"
          fontSize="20px"
          fill="#000000"
          textAnchor="middle"
          style={{
            whiteSpace: "pre",
            strokeWidth: "2px",
            paintOrder: "stroke",
            stroke: "#000000CC",
            strokeLinecap: "butt",
            strokeLinejoin: "miter",
            fontWeight: 800,
          }}
          direction="ltr"
        >
          code
        </text>
      </g>
      <g transform="translate(469.33333333333326 185.70648997525387) rotate(0 30 25)">
        <text
          x="30"
          y="18"
          fontFamily="Virgil, Segoe UI Emoji"
          fontSize="20px"
          fill="#000000"
          textAnchor="middle"
          style={{
            whiteSpace: "pre",
            strokeWidth: "2px",
            paintOrder: "stroke",
            stroke: "#000000CC",
            strokeLinecap: "butt",
            strokeLinejoin: "miter",
            fontWeight: 800,
          }}
          direction="ltr"
        >
          My JS
        </text>
        <text
          x="30"
          y="43"
          fontFamily="Virgil, Segoe UI Emoji"
          fontSize="20px"
          fill="#000000"
          textAnchor="middle"
          style={{
            whiteSpace: "pre",
            strokeWidth: "2px",
            paintOrder: "stroke",
            stroke: "#000000CC",
            strokeLinecap: "butt",
            strokeLinejoin: "miter",
            fontWeight: 800,
          }}
          direction="ltr"
        >
          code
        </text>
      </g>
      {/* my js code */}
      <g
        strokeLinecap="round"
        transform="translate(432.33333333333326 174.03982330858713) rotate(0 70.99999999999989 37.33333333333337)"
      >
        <path
          d="M0 0 C0 0, 0 0, 0 0 M0 0 C0 0, 0 0, 0 0 M-0.7 6.27 C0.34 5.59, 2.15 2.95, 5.49 0.4 M-0.6 6.4 C1.06 5.14, 1.53 3.92, 4.85 0.66 M-0.17 12.19 C4.11 8.49, 7.33 5.55, 12.13 1.39 M0.93 12.07 C3.54 9.39, 6.36 5.27, 10.93 -0.61 M-0.76 18.35 C6.27 12.99, 8.09 6.52, 16.72 0.99 M0.31 17.46 C4.77 13.49, 7.32 8.47, 14.89 1.2 M-0.28 24.88 C6.96 16.03, 13.16 6.75, 19.42 -0.1 M0.67 23.2 C7.76 14.05, 16.46 4.24, 21.76 -0.17 M1.81 28.87 C8.63 23.77, 12.37 16.3, 24.32 -0.51 M0.19 30.53 C10.25 18.88, 19.4 6.77, 26.21 1.16 M-0.12 35.39 C9 23.11, 19.94 10.86, 30.85 -1.19 M-0.41 37.56 C11.82 23.73, 24.73 8.36, 31.63 0 M-0.61 40.54 C14.31 28.57, 24.15 14.04, 36.13 1.74 M0.75 43.2 C13.63 27.14, 27.36 11.72, 37.29 -0.4 M-1.85 50.53 C13.28 34.39, 26.09 18.18, 43.47 -0.29 M-0.89 49.01 C9.57 39.08, 18.23 28.25, 42.01 -0.82 M2.16 53.09 C17.14 31.82, 38.6 10.28, 48.38 -1.55 M0.63 53.61 C12.16 42.09, 22.06 28.4, 47.25 -0.31 M-0.39 60.25 C11.38 48.98, 22.55 36, 55.07 0.72 M0.95 60.25 C17.24 41.08, 34.16 21.77, 52.75 -0.69 M0.74 67.88 C16.3 45.37, 36.97 26.82, 58.43 1.14 M0.29 67.23 C17.26 46.63, 35.45 25.54, 57.65 1.18 M-0.89 74.6 C14.76 53.32, 32.41 36.8, 64.57 0.84 M-0.08 73.75 C23.53 45.79, 46.34 20.12, 64.12 -1.08 M3.5 77.88 C18.18 59.69, 30.88 43.22, 68.76 -1.73 M3.17 76.79 C24.29 51.65, 47.54 25.58, 68.49 0.36 M7.84 76.21 C33.88 46.85, 62.43 14.45, 76 -0.08 M8.48 76.26 C28.54 55.53, 47.51 32.79, 74.84 -0.91 M12.55 76.17 C37.32 51.22, 60.2 23.69, 78.97 -0.89 M13.83 76.86 C35.35 51.33, 56.82 27.09, 80.18 0.11 M18.98 77.4 C39.48 52.66, 63.84 25.88, 86.54 -1.3 M18.38 75.94 C37.07 54.25, 57.31 31.34, 84.05 -0.54 M22.7 75.06 C44.4 54.9, 62.22 30.89, 89.79 1.87 M22.81 76.88 C47.06 46.97, 73.18 19.53, 89.62 -0.16 M27.46 78.63 C52.41 51.83, 73.27 24.26, 94.47 -1.19 M28.46 76.73 C43.05 59.94, 57.91 41.35, 95.35 0.24 M33.73 74.64 C57.97 50.98, 82.36 22.42, 99.06 1.58 M34.94 75.8 C59.58 46.68, 84.11 18.92, 100.1 -0.44 M40.65 77.45 C64.88 45.27, 90 14.94, 107.21 -1.27 M39.27 77.36 C64.54 47.93, 88.96 17.99, 106.75 0.21 M45.92 76.68 C59.3 61.92, 72.06 44.41, 109.78 -1.83 M44.84 77.91 C67.43 50.31, 89.38 24.47, 111.36 -0.2 M51.03 76.28 C68.68 56.03, 82.33 37.62, 116.65 -1.42 M49.81 77.15 C71.72 53.22, 92.22 27.62, 116.08 -0.55 M54.6 77.52 C72.72 55.91, 92.07 36.02, 122.04 0.45 M55.54 77.78 C74.8 54.16, 93.5 30.36, 121.6 -0.31 M60.18 78.44 C86.3 47.04, 108.69 17.85, 125.76 1.09 M61.51 75.95 C80.04 55.08, 97.32 33.57, 127.54 0.35 M66.29 76.66 C85.69 53.97, 105.78 27.29, 133.07 -1.9 M66.53 76.81 C87 51.78, 110.59 26.81, 133.43 0.89 M70.85 76.09 C87.78 56.95, 102.96 38.71, 136.68 0.14 M72.25 76.19 C92.58 51.53, 113.17 27.84, 137.82 0.11 M77.28 77.72 C104.41 48.07, 127.12 16.99, 140.57 2.42 M76.4 76.2 C90.72 59.72, 104.77 43.98, 143.25 0.42 M82.89 78.3 C101.94 52.56, 125.39 29.64, 144.07 7.74 M82.33 76.86 C103.52 50.94, 124.57 25.66, 143.43 5.81 M84.98 77.18 C98.58 62.32, 108.45 48.86, 142.84 11.4 M86.18 77.73 C106.85 54.58, 124.99 33.28, 143.38 13.62 M93.28 74.98 C105.69 61.57, 119.71 46.7, 144.33 19.53 M92.49 75.52 C102.16 65.3, 112.12 53.98, 141.95 19.77 M95.95 76.41 C108.92 62.84, 123.05 46.09, 142.31 26.04 M97.33 77.73 C114.04 56.3, 132.34 35.68, 143.58 24.55 M104.11 76.95 C113.83 66.42, 123.09 54.63, 142.17 31.68 M103.92 76.27 C115.38 63.02, 125.8 50.75, 142.59 30.59 M109.84 77.65 C116.18 66.54, 121.34 58.4, 144.72 35.5 M107.76 77.09 C117 66.91, 125.71 55.57, 142.23 37.13 M114.63 75.87 C122.72 69.62, 126.98 59.76, 144.23 41.58 M114.24 75.79 C123.34 64.67, 132.38 54.88, 141.76 43.74 M119.44 76.02 C124.87 69.02, 130.56 64.1, 144.26 50.59 M117.8 77.28 C127.86 67.7, 135.53 58.26, 141.47 48.61 M125.17 76.31 C129.44 70.32, 134.71 62.68, 142.93 54.72 M123.5 77.33 C128.14 71.14, 132.21 65.38, 143.02 54.49 M130.67 75.5 C134.86 71.79, 138.11 64.39, 142.23 60.74 M130.22 76.31 C131.93 71.69, 136.09 67.99, 141.87 62.53 M133.96 75.94 C136.44 75.6, 139.03 71.77, 143.46 66.18 M134.55 76.54 C137.59 74.03, 139.39 71.53, 142.55 66.91 M139.75 76.74 C141.22 75.42, 142.19 74.75, 142.74 73.83 M140.08 76.7 C140.78 75.78, 141.86 74.54, 142.62 73.58"
          stroke="#82c91e"
          strokeWidth="0.5"
          fill="none"
        />
        <path
          d="M0.1 -0.97 C47.94 1.04, 92.7 1.28, 140.39 0.47 M0.09 0.52 C44.41 1.41, 89.45 0.1, 141.23 -0.45 M143.36 -1.01 C142.62 27.45, 142.31 52.57, 140.09 72.69 M141.35 0.51 C142.99 28.83, 143.31 57.05, 141.12 75.12 M143.74 76.09 C104.49 76.33, 66.93 74.07, 1.85 73.75 M142.67 75.37 C104.96 73.23, 69 73.03, 0.04 74.77 M0.49 74.42 C1.81 52.31, -0.91 30.63, 0.53 0.57 M0.58 74.65 C0.57 54.39, -0.21 34.3, 0.88 0.44"
          stroke="#000000"
          strokeWidth="1"
          fill="none"
        />
      </g>
      {/* wasm glue to rust code */}
      <g strokeLinecap="round">
        <g transform="translate(233.14086167303003 132.55364209818657) rotate(0 0.2320976131009047 16.303221744784764)">
          <path
            d="M-0.7 -0.29 C-0.5 5.23, 0.8 27.21, 0.95 32.65 M1.14 -1.49 C1.27 4.27, 0.68 28.28, 0.4 34.09"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(233.14086167303003 132.55364209818657) rotate(0 0.2320976131009047 16.303221744784764)">
          <path
            d="M-5.08 19.53 C-3.57 22.88, -2.59 27.78, -0.63 33.68 M-4.82 18.95 C-3.74 21.94, -1.54 26.28, -0.08 34.72"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(233.14086167303003 132.55364209818657) rotate(0 0.2320976131009047 16.303221744784764)">
          <path
            d="M6.14 19.91 C4.52 23.09, 2.36 27.88, -0.63 33.68 M6.4 19.33 C4.96 22.2, 4.65 26.45, -0.08 34.72"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
      </g>
      {/* rust code to wasm glue */}
      <g strokeLinecap="round">
        <g transform="translate(256 166.70648997525376) rotate(0 -0.7313303538272748 -15.033125297399266)">
          <path
            d="M0.19 -0.64 C-0.01 -5.75, -0.3 -24.83, -0.58 -29.72 M-1.17 1.63 C-1.58 -3.93, -1.85 -26.65, -1.48 -31.7"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(256 166.70648997525376) rotate(0 -0.7313303538272748 -15.033125297399266)">
          <path
            d="M2.56 -17.39 C1.89 -23.51, -0.15 -27.94, -1.48 -30.41 M3.21 -16.87 C1.89 -21.97, 0.56 -26.96, -0.79 -32.01"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(256 166.70648997525376) rotate(0 -0.7313303538272748 -15.033125297399266)">
          <path
            d="M-7.7 -17.6 C-4.74 -23.66, -3.16 -28.02, -1.48 -30.41 M-7.05 -17.08 C-4.8 -22.08, -2.55 -26.99, -0.79 -32.01"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
      </g>
      {/* js glue to js code */}
      <g strokeLinecap="round">
        <g transform="translate(492.57043083651524 134.96339937005348) rotate(0 -0.07302388792231795 16.43330296436946)">
          <path
            d="M0.23 -1.02 C0.24 4.2, 0.98 26.78, 0.96 32.51 M-1.11 1.06 C-1.26 6.97, 0.34 28.84, 0.42 33.89"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(492.57043083651524 134.96339937005348) rotate(0 -0.07302388792231795 16.43330296436946)">
          <path
            d="M-7.32 19.81 C-3.83 24.32, -0.27 31.04, -0.55 35.18 M-6.11 18.44 C-4.5 22.72, -2.89 27.23, 1.04 33.08"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(492.57043083651524 134.96339937005348) rotate(0 -0.07302388792231795 16.43330296436946)">
          <path
            d="M3.89 19.27 C3.2 24, 2.59 30.92, -0.55 35.18 M5.1 17.9 C3.54 22.23, 1.99 26.9, 1.04 33.08"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
      </g>
      {/* js code to js glue */}
      <g strokeLinecap="round">
        <g transform="translate(515.4295691634848 169.11624724712067) rotate(0 -0.7205015100568062 -14.639979855716234)">
          <path
            d="M-1.02 0.77 C-1.38 -4.28, -1.13 -25.04, -0.97 -30.05 M0.64 0.13 C0 -4.74, -1.88 -23.31, -2.08 -28.54"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(515.4295691634848 169.11624724712067) rotate(0 -0.7205015100568062 -14.639979855716234)">
          <path
            d="M5.03 -15.24 C1.54 -19.63, 0.08 -26.66, -0.9 -28.8 M3.78 -15.12 C2.31 -18.73, 0.98 -21.18, -2.82 -28.75"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(515.4295691634848 169.11624724712067) rotate(0 -0.7205015100568062 -14.639979855716234)">
          <path
            d="M-5.21 -14.49 C-4.64 -19.09, -2.03 -26.42, -0.9 -28.8 M-6.46 -14.37 C-5.35 -18.15, -4.1 -20.78, -2.82 -28.75"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
      </g>
      {/* wasm glue to js glue */}
      <g strokeLinecap="round" style={{ color: "var(--glue)" }}>
        <g transform="translate(326 86.70648997525382) rotate(0 48.82288787637992 0.11255939519998037)">
          <path
            d="M0.03 0.4 C16.37 0.5, 82.58 1.07, 99.05 0.97 M-1.41 -0.44 C14.66 -0.69, 81.41 -0.89, 97.96 -0.64"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(326 86.70648997525382) rotate(0 48.82288787637992 0.11255939519998037)">
          <path
            d="M70.38 9.03 C82.15 4.83, 91.08 2.67, 98.58 -1.66 M70.56 10.37 C80.93 4.88, 91.78 2.85, 98.08 -1.38"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(326 86.70648997525382) rotate(0 48.82288787637992 0.11255939519998037)">
          <path
            d="M70.47 -11.49 C82.26 -7.82, 91.16 -2.1, 98.58 -1.66 M70.65 -10.15 C81.16 -7.74, 91.98 -1.86, 98.08 -1.38"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
      </g>
      {/* js glue to wasm glue */}
      <g strokeLinecap="round" style={{ color: "var(--glue)" }}>
        <g transform="translate(424.6666666666665 106.03982330858713) rotate(0 -48.59821452399251 0.31886602987847823)">
          <path
            d="M0.16 -0.8 C-15.72 -0.49, -80.3 1, -96.27 1.44 M-1.21 1.39 C-17.19 1.4, -81.53 -0.07, -97.36 -0.28"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(424.6666666666665 106.03982330858713) rotate(0 -48.59821452399251 0.31886602987847823)">
          <path
            d="M-70.32 -10.47 C-73.9 -7.25, -79.36 -4.93, -98.6 -0.04 M-68.51 -9.76 C-76.37 -7.3, -83.49 -4.85, -96.89 0.13"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
        <g transform="translate(424.6666666666665 106.03982330858713) rotate(0 -48.59821452399251 0.31886602987847823)">
          <path
            d="M-70.7 10.05 C-74.12 8.81, -79.51 6.67, -98.6 -0.04 M-68.89 10.76 C-76.59 8.04, -83.61 5.32, -96.89 0.13"
            stroke="#000000"
            strokeWidth="1"
            fill="none"
          />
        </g>
      </g>
    </svg>
  );
};

export { GOLDemo, JSRuntimeChart, JSWASMTime, Timeshift, Portability, Glue };
