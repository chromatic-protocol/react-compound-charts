import React from "react";
import { scaleLinear } from "d3-scale";

interface DotProps {
  data: number;
  offset: number;
  minValue: number;
  maxValue: number;
}

function Dot(props: DotProps) {
  if (!props.data) return null;

  const { data, offset, minValue, maxValue } = props;

  const getY = scaleLinear()
    .domain([minValue, maxValue])
    .range([0 + offset, 100 - offset]);

  return (
    <div className={`react_range__dot`} style={{ bottom: `${getY(data)}%` }} />
  );
}

export default Dot;
