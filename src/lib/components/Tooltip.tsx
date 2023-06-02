import React from "react";

interface TooptipProps extends React.PropsWithChildren {
  index: number;
}

function Tooltip(props: TooptipProps) {
  if (!props.children) return null;

  const { index, children } = props;

  return (
    <div className={`react_range__tooltip_wrapper`}>
      {React.cloneElement(children as React.ReactElement<any>, {
        index,
      })}
    </div>
  );
}

export default Tooltip;
