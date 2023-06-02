import React from "react";
import { Ticks, TicksProps } from "react-compound-slider";

interface SlotProps extends Omit<TicksProps, "values" | "children"> {
  size: number;
  height: number;
  children: (p: any) => JSX.Element;
  className: string;
}

function Slot(props: SlotProps) {
  const { children, size, height, className, ...ticksProps } = props;

  const indexValueArray = Array.from(Array(size).keys());

  const getX = (percent: number) => ({
    left: `${percent}%`,
  });

  const width = `${100 / size}%`;

  return (
    <Ticks values={indexValueArray} {...ticksProps}>
      {({ ticks }) => (
        <>
          {ticks.map((tick, index: number) => {
            const { percent } = tick;
            return (
              <div
                className={`react_range__slot_wrapper ${className}`}
                style={{
                  height: height,
                  width: width,
                  ...getX(percent),
                }}
                key={tick.id}
              >
                {children({ x: percent, index })}
              </div>
            );
          })}
        </>
      )}
    </Ticks>
  );
}

export default Slot;

Object.defineProperty(Slot, "name", { writable: true, value: Ticks.name });
