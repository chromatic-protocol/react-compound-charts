import React, { useState } from "react";

RangeChart;

import {
  selectedInterval as defaultSelected,
  track0,
  track1,
  track2,
  ticks0,
  ticks1,
  ticks2,
  barSample,
  dotSample,
} from "./sampledata";

import { FillUpChart, RangeChart } from "../lib";

import SampleSlider from "./SampleSlider";
import { useRangeChart } from "../lib/hooks/useRangeChart";

function ToolTipComponent({ index }: any) {
  const style = {
    height: 100,
    width: 100,
    border: "1px solid black",
    backgroundColor: "white",
  };

  const { value } = barSample[index];

  return (
    <div style={style}>
      {value?.map(({ label, amount }: any, idx: number) => (
        <div key={idx}>{`${label}: ${amount}`}</div>
      ))}
    </div>
  );
}

function App() {
  const {
    data: { min, max, values },
    setData,
    ref,
    move,
  } = useRangeChart();

  const [toggleState, setToggleState] = useState(false);

  const [selectedAmount1, setSelectedAmount1] = useState<number>(0);

  const [selectedAmount2, setSelectedAmount2] = useState<number>(0);

  return (
    <div>
      <h1>Range Chart</h1>
      <div>Min: {min}</div>
      <div>Max: {max}</div>
      <div>Values: {values?.toString()}</div>
      <button onClick={() => setToggleState(!toggleState)}>Toggle</button>
      <button onClick={() => move().left.prev()}>{"<-"}</button>
      <button onClick={() => move().left.next()}>{"->"}</button>
      <button onClick={() => move().right.prev()}>{"<-"}</button>
      <button onClick={() => move().right.next()}>{"->"}</button>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <RangeChart
          ref={ref}
          barData={barSample}
          dotData={toggleState ? dotSample : undefined}
          trackConfig={track0}
          labels={ticks0}
          defaultValues={defaultSelected}
          onChangeCallback={setData}
          height={300}
          width={700}
          isGridVisible={toggleState}
          tooltipComponent={<ToolTipComponent />}
        />
      </div>

      <h2>Empty</h2>
      <button onClick={() => setToggleState(!toggleState)}>Toggle</button>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <RangeChart
          barData={[]}
          dotData={[]}
          trackConfig={track0}
          labels={ticks0}
          defaultValues={defaultSelected}
          onChangeCallback={setData}
          height={300}
          width={700}
          isGridVisible={toggleState}
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
          tooltipComponent={<ToolTipComponent />}
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
          tooltipComponent={<ToolTipComponent />}
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
