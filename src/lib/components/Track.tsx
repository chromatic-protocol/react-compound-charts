import React from "react";

interface TrackProps {
  source: {
    id?: string;
    value: number;
    percent: number;
  };
  target: {
    id?: string;
    value: number;
    percent: number;
  };
  height: number;
  getTrackProps: Function;
}

interface GetTrackConfig extends Pick<TrackProps, "source" | "target"> {}

const getTrackConfig = ({ source, target }: GetTrackConfig) => {
  return {
    left: `calc(${source.percent}% - 0.5px)`,
    width: `calc(${target.percent - source.percent}% - 1px)`,
  };
};

const Track = ({ source, target, height, getTrackProps }: TrackProps) => {
  return (
    <div
      className={`react_range__track`}
      style={{
        height: height,
        ...getTrackConfig({ source, target }),
      }}
      {...getTrackProps()}
    />
  );
};

export default Track;
