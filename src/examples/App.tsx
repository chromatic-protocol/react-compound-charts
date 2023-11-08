import React, { useState } from "react";

import {
  barSample,
  selectedInterval as defaultSelected,
  dotSample,
  ticks0,
  ticks1,
  ticks2,
  track0,
  track1,
  track2,
} from "./sampledata";

import { FillUpChart, RangeChart } from "../lib";
import { useRangeChart } from "../lib/hooks/useRangeChart";

import SampleSlider from "./SampleSlider";

import { shift } from "@floating-ui/dom";
import { Tooltip } from "react-tooltip";

function ToolTipComponent() {
  function getValues(key: any) {
    return barSample?.find((data: any) => data.key === +key)?.value;
  }

  const fixToBottom = {
    name: "fixToBottom",
    fn({ x, elements }) {
      const bottomOfSlot =
        (elements.reference?.offsetParent.getBoundingClientRect().bottom ?? 0) +
        window.scrollY;

      return {
        x,
        y: bottomOfSlot,
      };
    },
  };

  return (
    <Tooltip
      style={{ zIndex: 999 }}
      anchorSelect={`.react_range__bar_stack.available, .react_range__bar_stack.utilized`}
      middlewares={[shift(), fixToBottom]}
      place="bottom"
      render={({ content: key }) => {
        const values = getValues(key);
        const utilized = values?.find(
          ({ label }) => label === "utilized"
        ).amount;
        const available = values?.find(
          ({ label }) => label === "available"
        ).amount;
        return (
          <>
            <div>key: {key}</div>
            <div>utilized: {utilized}</div>
            <div>available: {available}</div>
          </>
        );
      }}
    />
  );
}

function App() {
  const {
    data: { min, max, values },
    setData,
    ref,
    move,
  } = useRangeChart();

  const [dotState, setDotState] = useState(false);
  const [handleState, setHandleState] = useState(true);

  const [selectedAmount1, setSelectedAmount1] = useState<number>(0);

  const [selectedAmount2, setSelectedAmount2] = useState<number>(0);

  return (
    <div>
      <ToolTipComponent />
      <h1>Range Chart</h1>
      <div>Min: {min}</div>
      <div>Max: {max}</div>
      <div>Values: {values?.toString()}</div>
      <button onClick={() => setDotState(!dotState)}>Toggle Dots</button>
      <button onClick={() => setHandleState(!handleState)}>
        Toggle Handles
      </button>
      <button onClick={() => move().left.prev()}>{"<-"}</button>
      <button onClick={() => move().left.next()}>{"->"}</button>
      <button onClick={() => move().right.prev()}>{"<-"}</button>
      <button onClick={() => move().right.next()}>{"->"}</button>
      <button onClick={() => move().full()}>{"full"}</button>
      <div
        className="rangeChart_sample"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <RangeChart
          ref={ref}
          barData={barSample}
          dotData={dotState ? dotSample : undefined}
          trackConfig={track0}
          labels={ticks0}
          defaultValues={defaultSelected}
          onChangeCallback={setData}
          height={300}
          width={700}
          isGridVisible={dotState}
          isHandlesVisible={handleState}
          customLabelFormatter={(value) => value + "%"}
        />
      </div>

      <h2>Empty</h2>
      <button onClick={() => setDotState(!dotState)}>Toggle</button>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <RangeChart
          barData={[]}
          dotData={[]}
          trackConfig={track0}
          labels={ticks0}
          defaultValues={defaultSelected}
          height={300}
          width={700}
          isGridVisible={dotState}
        />
      </div>

      <h1>Fill Up Chart</h1>

      <h2>Negative</h2>
      <input
        value={`${selectedAmount1}`}
        type="number"
        onChange={({ target: { value } }) => setSelectedAmount1(+value)}
      />
      <SampleSlider
        width={"150px"}
        value={selectedAmount1}
        setValue={setSelectedAmount1}
      />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <FillUpChart
          data={barSample}
          trackConfig={track1}
          labels={ticks1}
          selectedAmount={selectedAmount1}
          reverse={true}
          height={300}
          width={700}
          selectableLabel="available"
        />
      </div>

      <h2>Positive</h2>
      <input
        value={`${selectedAmount2}`}
        type="number"
        onChange={({ target: { value } }) => setSelectedAmount2(+value)}
      />
      <SampleSlider
        width={"150px"}
        value={selectedAmount2}
        setValue={setSelectedAmount2}
      />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <FillUpChart
          data={barSample}
          trackConfig={track2}
          labels={ticks2}
          selectedAmount={selectedAmount2}
          height={300}
          width={700}
          selectableLabel="available"
        />
      </div>

      <h2>Empty</h2>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <FillUpChart
          data={[]}
          trackConfig={track1}
          labels={ticks1}
          selectedAmount={selectedAmount1}
          height={300}
          width={700}
          selectableLabel="available"
        />
      </div>
    </div>
  );
}

export default App;
