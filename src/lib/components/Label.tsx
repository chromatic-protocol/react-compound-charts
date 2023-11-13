import React, { ReactNode } from "react";

interface LabelProps {
  value: number;
  label: ReactNode | string;
  prefix?: string;
  suffix?: string;
  isVisible?: boolean;
}

const Label = ({
  value,
  label,
  prefix,
  suffix,
  isVisible = false,
}: LabelProps) => {
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
              {prefix}
              {label}
              {suffix}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Label;
