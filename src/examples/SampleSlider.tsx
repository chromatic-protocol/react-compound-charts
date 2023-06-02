import React from "react";
import { Slider, Rail, Handles, Tracks } from "react-compound-slider";

function SliderRail() {
  return (
    <div
      style={{
        position: "absolute" as "absolute",
        width: "100%",
        height: 10,
        transform: "translate(0%, -50%)",
        backgroundColor: "#ddd",
      }}
    />
  );
}

function Handle({
  domain: [min, max],
  handle: { id, value, percent },
  getHandleProps,
}: any) {
  return (
    <>
      <div
        style={{
          left: `${percent}%`,
          position: "absolute",
          transform: "translate(-50%, -50%)",
          zIndex: 5,
          width: 20,
          height: 42,
          cursor: "pointer",
          backgroundColor: "none",
        }}
        {...getHandleProps(id)}
      />
      <div
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        style={{
          left: `${percent}%`,
          position: "absolute",
          transform: "translate(-50%, -50%)",
          zIndex: 2,
          width: 6,
          height: 20,
          backgroundColor: "grey",
        }}
      />
    </>
  );
}

function Track({ source, target, getTrackProps, disabled = false }: any) {
  return (
    <div
      style={{
        position: "absolute",
        transform: "translate(0%, -50%)",
        height: 10,
        zIndex: 1,
        backgroundColor: "#999",
        cursor: "pointer",
        left: `${source.percent}%`,
        width: `${target.percent - source.percent}%`,
      }}
      {...getTrackProps()}
    />
  );
}

function SampleSlider(props: any) {
  const { value, setValue, width } = props;
  const sliderStyle = {
    position: "relative",
    width: width ?? "100%",
    touchAction: "none",
  };
  const domain = [0, 2170];
  return (
    <div>
      <Slider
        mode={1}
        step={1}
        domain={domain}
        rootStyle={sliderStyle}
        onUpdate={([value]) => setValue(value)}
        values={[value]}
      >
        <Rail>{() => <SliderRail />}</Rail>
        <Handles>
          {({ handles, getHandleProps }) => (
            <div className="slider-handles">
              {handles.map((handle) => (
                <Handle
                  key={handle.id}
                  handle={handle}
                  domain={domain}
                  getHandleProps={getHandleProps}
                />
              ))}
            </div>
          )}
        </Handles>
        <Tracks right={false}>
          {({ tracks, getTrackProps }) => (
            <div className="slider-tracks">
              {tracks.map(({ id, source, target }) => (
                <Track
                  key={id}
                  source={source}
                  target={target}
                  getTrackProps={getTrackProps}
                />
              ))}
            </div>
          )}
        </Tracks>
      </Slider>
    </div>
  );
}

export default SampleSlider;
