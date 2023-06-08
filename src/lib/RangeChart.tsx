import "./styles/index.scss";

import React, {
  memo,
  useMemo,
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from "react";

import { Slider, Handles, Tracks, mode3 } from "react-compound-slider";

import Track from "./components/Track";
import Grid from "./components/Grid";
import Handle from "./components/Handle";
import Bar from "./components/Bar";
import Tooltip from "./components/Tooltip";
import Slot from "./components/Slot";
import Label from "./components/Label";
import Dot from "./components/Dot";

import {
  BarData,
  BarDataMap,
  DotData,
  DotDataMap,
  RangeChartData,
  TrackConfig,
} from "./types";
import { getConfigMap, getDataMap } from "./utils";

interface RangeChartProps {
  height: number;
  width?: number;
  barData: BarData[];
  dotData: DotData[];
  dotOffset?: number;
  labels: number[];
  trackConfig: TrackConfig[];
  defaultValues?: number[];
  onChangeCallback: (params: RangeChartData) => void;
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
    defaultValues = [],
    onChangeCallback,
    isGridVisible = false,
    tooltipComponent,
  } = props;

  const [selectedValues, setSelectedValues] = useState(defaultValues);

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
    return getIndexes(selectedValues);
  }, [selectedValues]);

  function handleChange([minIndex, maxIndex]: number[]) {
    const [minValue, maxValue] = getValues([minIndex, maxIndex]);
    setSelectedValues([minValue, maxValue]);
    onChangeCallback({
      min: minValue,
      max: maxValue,
      values: configMap.track.slice(minIndex, maxIndex),
    });
  }

  function initialize([minValue, maxValue]: number[]) {
    const [minIndex, maxIndex] = getIndexes([minValue, maxValue]);
    onChangeCallback({
      min: minValue,
      max: maxValue,
      values: configMap.track.slice(minIndex, maxIndex),
    });
  }

  useEffect(() => {
    initialize(defaultValues);
  }, []);

  const domain = [0, configMap.track.length];

  const SLIDER_MODE = 3;

  const style = {
    width: width ?? "100%",
    height: height,
    padding: `${height / 2}px 0`,
  };

  function getNextIndex(target: number, reverse: boolean) {
    const newPosition = reverse ? -1 : 1;

    const rest = +!target;
    const restIndex = selectedIndexes[rest];
    const targetIndex = selectedIndexes[target];

    let result: number[] = [];

    if (targetIndex + newPosition === restIndex) {
      result[target] = targetIndex + newPosition;
      result[rest] = restIndex + newPosition;
    } else {
      result[target] = targetIndex + newPosition;
      result[rest] = restIndex;
    }
    if (result[0] < 0 || result[1] > configMap.track.length) {
      return selectedIndexes;
    }

    return result;
  }

  useImperativeHandle(
    _ref,
    () => ({
      getTrackMap: () => {
        return configMap.track;
      },
      move: {
        left: {
          next: () => {
            handleChange(getNextIndex(0, false));
          },
          prev: () => {
            handleChange(getNextIndex(0, true));
          },
        },
        right: {
          next: () => {
            handleChange(getNextIndex(1, false));
          },
          prev: () => {
            handleChange(getNextIndex(1, true));
          },
        },
      },
    }),
    [configMap.track, selectedIndexes]
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
