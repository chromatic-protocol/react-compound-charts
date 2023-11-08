import React, { ReactNode } from "react";

interface LabelProps {
  value: number;
  formattedValue?: ReactNode;
  isVisible?: boolean;
}

const Label = ({ value, formattedValue, isVisible = false }: LabelProps) => {
  const isPositive = value > 0;

  const labelPosition = isPositive
    ? {
        left: 0,
      }
    : {
        right: 0,
      };

  return (
    <>
      {isVisible && (
        <>
          <div
            className={`react_range__label_wrapper`}
            style={{ ...labelPosition }}
          >
            <div className={`react_range__label`}>
              {formattedValue ?? value}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Label;
