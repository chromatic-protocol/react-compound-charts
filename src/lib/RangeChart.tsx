import "./styles/index.scss";

import React, { memo, useMemo, forwardRef, useImperativeHandle } from "react";

import { Slider, Handles, Tracks } from "react-compound-slider";

import Track from "./components/Track";
import Grid from "./components/Grid";
import Handle from "./components/Handle";
import Bar from "./components/Bar";
import Tooltip from "./components/Tooltip";
import Slot from "./components/Slot";
import Label from "./components/Label";
import Dot from "./components/Dot";

import { BarData, BarDataMap, DotData, DotDataMap, TrackConfig } from "./types";
import { getConfigMap, getDataMap } from "./utils";

interface RangeChartProps {
  height: number;
  width?: number;
  barData: BarData[];
  dotData: DotData[];
  dotOffset?: number;
  labels: number[];
  trackConfig: TrackConfig[];
  selectedInterval?: number[];
  onChangeCallback: Function;
  isGridVisible?: boolean;
  tooltipComponent?: React.ReactElement<any>;
}

const RangeChart = forwardRef((props: RangeChartProps, _ref) => {
  const {
    height,
    width,
    barData = [],
    dotData = [],
    dotOffset = 40,
    labels,
    trackConfig,
    selectedInterval = [],
    onChangeCallback,
    isGridVisible = false,
    tooltipComponent,
  } = props;

  const configMap = useMemo(() => {
    return getConfigMap(trackConfig);
  }, [trackConfig]);

  const barDataMap = useMemo<BarDataMap>(
    () => getDataMap(configMap, barData) as BarDataMap,
    [configMap, barData]
  );

  const dotDataMap = useMemo<DotDataMap>(
    () => getDataMap(configMap, dotData) as DotDataMap,
    [configMap, dotData]
  );

  const barMaxValue = useMemo<number>(() => {
    return (
      Math.max(
        ...barData.map(({ value }) =>
          value.reduce((acc, { amount }) => acc + amount, 0)
        )
      ) * 1.2
    );
  }, [barData]);

  const valueFormatter = (index: number) => configMap.track[index];

  const getValues = (indexes: number[]) => {
    const [leftIndex, rightIndex] = indexes;
    return [valueFormatter(leftIndex), valueFormatter(rightIndex - 1)];
  };

  const getIndexes = (values: number[]) => {
    const [leftValue, rightValue] = values;
    return [
      configMap.track.indexOf(leftValue),
      configMap.track.indexOf(rightValue) + 1,
    ];
  };

  const selectedIndexes = useMemo<number[]>(() => {
    return getIndexes(selectedInterval);
  }, [selectedInterval]);

  const domain = [0, configMap.track.length];

  function handleChange(newIndexes: readonly number[]) {
    onChangeCallback(getValues([...newIndexes]));
  }

  const SLIDER_MODE = 3;

  const style = {
    width: width ?? "100%",
    height: height,
    padding: `${height / 2}px 0`,
  };

  useImperativeHandle(
    _ref,
    () => ({
      getTrackMap: () => {
        return configMap.track;
      },
    }),
    [configMap]
  );

  return (
    <div className="react_range__range_container range" style={style}>
      <Slider
        mode={SLIDER_MODE}
        step={1}
        domain={domain}
        onUpdate={handleChange}
        values={selectedIndexes}
        rootStyle={{ position: "relative", width: "100%" }}
      >
        <Handles>
          {({ handles, getHandleProps }) => (
            <>
              {handles.map((handle) => (
                <Handle
                  key={handle.id}
                  handle={handle}
                  domain={domain}
                  format={valueFormatter}
                  getHandleProps={getHandleProps}
                />
              ))}
            </>
          )}
        </Handles>
        <Tracks left={false} right={false}>
          {({ tracks, getTrackProps }) => (
            <>
              {tracks?.map(({ id, source, target }) => (
                <Track
                  key={id}
                  source={source}
                  target={target}
                  height={height}
                  getTrackProps={getTrackProps}
                />
              ))}
            </>
          )}
        </Tracks>
        <Slot size={configMap.track.length} height={height} className={`graph`}>
          {({ index }) => {
            const barData = barDataMap[index];
            const dotData = dotDataMap[index];

            return (
              <>
                <Bar
                  color={configMap.colorList[index]}
                  data={barData}
                  minValue={0}
                  maxValue={barMaxValue}
                />
                <Dot
                  data={dotData}
                  offset={dotOffset}
                  minValue={0}
                  maxValue={2}
                />
                <Tooltip index={index}>{tooltipComponent}</Tooltip>
              </>
            );
          }}
        </Slot>
        <Slot size={configMap.track.length} height={height} className={`grid`}>
          {({ index }) => {
            const value = valueFormatter(index);

            return (
              <>
                <Label value={value} isVisible={labels.includes(value)} />
                <Grid
                  value={value}
                  isVisible={isGridVisible}
                  isBold={labels.includes(value)}
                />
              </>
            );
          }}
        </Slot>
      </Slider>
    </div>
  );
});
export default memo(RangeChart);
