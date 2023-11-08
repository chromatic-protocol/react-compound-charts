import "./styles/index.scss";

import React, {
  ReactNode,
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";

import { Handles, Slider, Tracks } from "react-compound-slider";

import Bar from "./components/Bar";
import Dot from "./components/Dot";
import Grid from "./components/Grid";
import Handle from "./components/Handle";
import Label from "./components/Label";
import Slot from "./components/Slot";
import Track from "./components/Track";

import {
  BarData,
  BarDataMap,
  DotData,
  DotDataMap,
  RangeChartData,
  RangeChartRef,
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
  onChangeCallback?: (params: RangeChartData) => void;
  isGridVisible?: boolean;
  isHandlesVisible?: boolean;
  customLabelFormatter?: (arg: number) => ReactNode;
}

const RangeChart = forwardRef<RangeChartRef, RangeChartProps>((props, _ref) => {
  const {
    height,
    width,
    barData = [],
    dotData = [],
    dotOffset = 40,
    labels,
    trackConfig,
    defaultValues = [],
    onChangeCallback = () => {},
    isGridVisible = false,
    isHandlesVisible = true,
    customLabelFormatter,
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

  const dotMaxValue = useMemo<number>(() => {
    return Math.max(...dotData.map(({ value }) => value));
  }, [dotData]);

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
      min: minIndex,
      max: maxIndex,
      values: configMap.track.slice(minIndex, maxIndex),
    });
  }

  function initialize([minValue, maxValue]: number[]) {
    const [minIndex, maxIndex] = getIndexes([minValue, maxValue]);
    onChangeCallback({
      min: minIndex,
      max: maxIndex,
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

  function getNextIndex(
    indexes: [number, number],
    target: number,
    reverse: boolean
  ) {
    const newPosition = reverse ? -1 : 1;

    const rest = +!target;
    const restIndex = indexes[rest];
    const targetIndex = indexes[target];

    let result: number[] = [];

    if (targetIndex + newPosition === restIndex) {
      result[target] = targetIndex + newPosition;
      result[rest] = restIndex + newPosition;
    } else {
      result[target] = targetIndex + newPosition;
      result[rest] = restIndex;
    }
    if (result[0] < 0 || result[1] > configMap.track.length) {
      return indexes;
    }

    return result;
  }

  useImperativeHandle(
    _ref,
    () => ({
      getTrackMap: () => {
        return configMap.track;
      },
      move: (indexes: [number, number]) => {
        return {
          left: {
            next: () => {
              handleChange(getNextIndex(indexes, 0, false));
            },
            prev: () => {
              handleChange(getNextIndex(indexes, 0, true));
            },
          },
          right: {
            next: () => {
              handleChange(getNextIndex(indexes, 1, false));
            },
            prev: () => {
              handleChange(getNextIndex(indexes, 1, true));
            },
          },
          full: () => {
            handleChange([0, configMap.track.length]);
          },
        };
      },
    }),
    [configMap.track]
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
        {isHandlesVisible && (
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
        )}
        {isHandlesVisible && (
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
        )}
        <Slot size={configMap.track.length} height={height} className={`graph`}>
          {({ index }) => {
            const barData = barDataMap[index];
            const dotData = dotDataMap[index];

            const position = valueFormatter(index);

            return (
              <>
                <Bar
                  position={position}
                  color={configMap.colorList[index]}
                  data={barData}
                  minValue={0}
                  maxValue={Math.max(barMaxValue, 0.001)}
                />
                <Dot
                  data={dotData}
                  offset={dotOffset}
                  minValue={0}
                  maxValue={Math.max(dotMaxValue, 0.001)}
                />
              </>
            );
          }}
        </Slot>
        <Slot size={configMap.track.length} height={height} className={`grid`}>
          {({ index }) => {
            const value = valueFormatter(index);
            const formattedValue =
              customLabelFormatter === undefined
                ? value
                : customLabelFormatter(value);

            return (
              <>
                <Label
                  value={value}
                  formattedValue={formattedValue}
                  isVisible={labels.includes(value)}
                />
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
