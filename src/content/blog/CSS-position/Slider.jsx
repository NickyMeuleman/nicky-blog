function Slider({ val, setVal, labelText, idPrepend, marginTop }) {
  return (
    <label htmlFor={idPrepend + labelText} className={marginTop && "mt-4"}>
      <div className="flex justify-between">
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
        className="w-full cursor-pointer outline-offset-4"
      />
    </label>
  );
}

export { Slider };
