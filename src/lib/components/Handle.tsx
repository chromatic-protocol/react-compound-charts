import React from "react";

interface HandleProps {
  domain: Array<number>;
  handle: {
    id: string;
    value: number;
    percent: number;
  };
  getHandleProps: Function;
  style?: object;
  format: Function;
}

const Handle = ({
  domain: [min, max],
  handle: { id, value, percent = 0 },
  format = (val: number) => val,
  getHandleProps,
}: HandleProps) => {
  const leftPosition = `calc(${percent}% - 0.5px)`;

  const leftRight = +id.split("$$-")[1] === 0 ? "left" : "right";

  const fixedValue = leftRight === "left" ? value : value - 1;

  return (
    <>
      <div
        className={`react_range__handle_wrapper ${leftRight}`}
        style={{ left: leftPosition }}
        {...getHandleProps(id)}
      />
      <div
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        className={`react_range__handle_container ${leftRight}`}
        style={{ left: leftPosition }}
      >
        <div className={`react_range__handle_value ${leftRight}`}>
          {format(fixedValue)}
        </div>
      </div>
    </>
  );
};

export default Handle;
