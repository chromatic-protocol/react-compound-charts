import React from "react";
import { scaleLinear } from "d3-scale";

import { Color } from "../types";

interface StackProps {
  height: string;
  id: string;
  color: string;
  label: string;
  position: number;
}

function Stack(props: StackProps) {
  const { height, color, id, label, position } = props;
  const style = {
    background: color,
    height: height,
  };
  return (
    <div
      style={style}
      className={`react_range__bar_stack ${label}`}
      id={id}
      data-tooltip-content={position}
      data-tooltip-id={`react_range__bar_stack-${label}`}
    />
  );
}

export type BarDataType = {
  label: string;
  amount: number;
};

interface BarProps {
  color: Color;
  data: BarDataType[];
  position: number;
  minValue: number;
  maxValue: number;
}

function Bar(props: BarProps) {
  if (!props.data) return null;

  const { color, data, minValue, maxValue, position } = props;

  function getStackColor(label: string) {
    return color[label] ?? "#000000";
  }

  const getStackHeight = scaleLinear()
    .domain([minValue, maxValue])
    .range([0, 100]);

  return (
    <>
      {data
        .map(({ label, amount }, index) => {
          const id = `$$-${index}`;

          return (
            <Stack
              key={id}
              id={id}
              height={`${getStackHeight(Math.max(amount, 0))}%`}
              color={getStackColor(label)}
              position={position}
              label={label}
            />
          );
        })
        .reverse()}
    </>
  );
}

export default Bar;
