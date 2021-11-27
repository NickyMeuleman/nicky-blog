/* eslint-disable no-bitwise, no-continue, react-hooks/exhaustive-deps */
/** @jsx jsx */
import { jsx } from "theme-ui";
import { useState, useEffect, useRef } from "react";
import theme from "../../../src/gatsby-plugin-theme-ui/index";

const Button = ({ children, ...props }) => {
  return (
    <button
      type="button"
      sx={{
        outlineWidth: "1px",
        outlineOffset: "2px",
        cursor: "pointer",
        px: 3,
        py: 2,
        backgroundColor: "transparent",
        color: "text",
        borderStyle: "solid",
        borderWidth: "1px",
        borderColor: "text",
        ":hover": {
          color: "primary",
          borderColor: "mutedPrimary",
        },
        ":disabled": {
          color: "mutedText",
          backgroundColor: "gray",
          borderColor: "inherit",
          cursor: "not-allowed",
        },
      }}
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
  const GRID_COLOR = theme.colors.watermarkBg || "#CCCCCC";
  const DEAD_COLOR = theme.colors.background || "#FFFFFF";
  const ALIVE_COLOR = theme.colors.mutedPrimary || "#000000";

  const loadWasm = async () => {
    // TODO: this concat stuff isn't needed anymore I think
    try {
      /* eslint no-useless-concat: "off" */
      const wasmModule = await import(
        "wasm-game-of-life-nmeuleman" + "/wasm_game_of_life_nmeuleman_bg.js"
      );
      const wasmMemModule = await import(
        "wasm-game-of-life-nmeuleman" + "/wasm_game_of_life_nmeuleman_bg.wasm"
      );
      setWasm(wasmModule);
      setWasmMem(wasmMemModule);
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
    const cells = new Uint8Array(wasmMem.memory.buffer, pointer, (64 * 64) / 8);
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
          CELL_SIZE
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
          CELL_SIZE
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
            (CELL_SIZE + 1) * 64 + 1
          );
        }

        // Horizontal lines.
        for (let j = 0; j <= 64; j += 1) {
          ctxRef.current.moveTo(0, j * (CELL_SIZE + 1) + 1);
          ctxRef.current.lineTo(
            (CELL_SIZE + 1) * 64 + 1,
            j * (CELL_SIZE + 1) + 1
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
    <div sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <div sx={{ display: "flex", gap: 2 }}>
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
              64 - 1
            );
            const col = Math.min(
              Math.floor(canvasLeft / (CELL_SIZE + 1)),
              64 - 1
            );

            universeRef.current.toggle_cell(row, col);
            drawCells();
          }
        }}
      />
    </div>
  );
};

export { GOLDemo };
