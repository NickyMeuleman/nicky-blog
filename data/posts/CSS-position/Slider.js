/** @jsx jsx */
import { jsx } from "theme-ui";

function Slider({ val, setVal, labelText, idPrepend, passedSx }) {
  return (
    <label htmlFor={idPrepend + labelText} sx={passedSx}>
      <div sx={{ display: "flex", justifyContent: "space-between" }}>
        <label htmlFor={`${idPrepend + labelText}checkbox`}>
          <input
            id={`${idPrepend + labelText}checkbox`}
            type="checkbox"
            checked={typeof val === "number" || typeof val === "string"}
            onChange={(e) => {
              if (!e.target.checked) {
                setVal(null);
              } else {
                setVal(0);
              }
            }}
          />
          {labelText}
        </label>
        <div>{val}px</div>
      </div>
      <input
        type="range"
        id={idPrepend + labelText}
        name={idPrepend + labelText}
        min="0"
        max="100"
        value={val || 0}
        onChange={(e) => {
          const { value } = e.target;
          setVal(value);
        }}
        sx={{
          width: "100%",
          outlineOffset: "6px",
          cursor: "pointer",
        }}
      />
    </label>
  );
}

export { Slider };
