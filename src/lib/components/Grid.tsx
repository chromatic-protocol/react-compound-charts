import React from "react";

interface GridProps {
  value: number;
  isBold: boolean;
  isVisible?: boolean;
}

const Grid = ({ value, isBold, isVisible = false }: GridProps) => {
  const isPositive = value > 0;

  const borderPosition = isPositive
    ? {
        borderLeft: "solid",
      }
    : {
        borderRight: "solid",
      };

  return (
    <>
      {(isVisible || isBold) && (
        <div
          className={`react_range__grid${isBold ? "_bold" : ""}`}
          style={{ border: "none", ...borderPosition }}
        />
      )}
    </>
  );
};

export default Grid;
