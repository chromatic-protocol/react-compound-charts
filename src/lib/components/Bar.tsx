import React from "react";
import { scaleLinear } from "d3-scale";

import { Color } from "../types";

interface StackProps {
  height: string;
  id: string;
  color: string;
}

function Stack(props: StackProps) {
  const { height, color, id } = props;
  const style = {
    background: color,
    height: height,
  };
  return <div style={style} className={`react_range__bar_stack`} id={id} />;
}

export type BarDataType = {
  label: string;
  amount: number;
};

interface BarProps {
  color: Color;
  data: BarDataType[];
  minValue: number;
  maxValue: number;
}

function Bar(props: BarProps) {
  if (!props.data) return null;

  const { color, data, minValue, maxValue } = props;

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
              height={`${getStackHeight(amount)}%`}
              color={getStackColor(label)}
            />
          );
        })
        .reverse()}
    </>
  );
}

export default Bar;
