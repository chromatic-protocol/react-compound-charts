import "./styles/index.scss";

import React, { useMemo } from "react";

import { Slider } from "react-compound-slider";

import Grid from "./components/Grid";
import Bar from "./components/Bar";
import Tooltip from "./components/Tooltip";
import Slot from "./components/Slot";
import Label from "./components/Label";

import { BarData, BarDataMap, Color, ConfigMap, TrackConfig } from "./types";
import { getDataMapWithSelectedValue } from "./utils";

interface FillUpChartProp {
  height: number;
  width?: number;
  data: BarData[];
  labels: number[];
  trackConfig: TrackConfig[];
  tooltipComponent?: React.ReactElement<any>;
  selectedAmount: number;
  selectableLabel: string;
  selectedLabel?: string;
  reverse?: boolean;
}

function FillUpChart(props: FillUpChartProp) {
  const {
    trackConfig,
    labels,
    data = [],
    height,
    width,
    tooltipComponent,
    selectedAmount,
    reverse = false,
    selectableLabel,
    selectedLabel = "selected",
  } = props;

  const configMap = useMemo(() => {
    const { track, colorList } = trackConfig.reduce<ConfigMap>(
      (acc, { start, end, interval, color }) => {
        function pushConfig(tick: number, color: Color) {
          acc.track.push(tick);
          if (tick !== 0) {
            acc.colorList.push(color);
          }
        }
        pushConfig(start, color);
        do {
          const tick = parseFloat(
            (acc.track[acc.track.length - 1] + interval).toFixed(12)
          );
          pushConfig(tick, color);
        } while (acc.track[acc.track.length - 1] < end);
        return acc;
      },
      { track: [], colorList: [] }
    );

    return {
      track: [...track],
      colorList,
    };
  }, [trackConfig]);

  const dataMap = useMemo<BarDataMap>(
    () =>
      getDataMapWithSelectedValue(
        configMap,
        data,
        selectedAmount,
        reverse ? "reduceRight" : "reduce",
        selectableLabel,
        selectedLabel
      ),
    [configMap, data, selectedAmount]
  );

  const maxValue = useMemo<number>(() => {
    return (
      Math.max(
        ...data.map(({ value }) =>
          value.reduce<number>((acc, { amount }) => acc + amount, 0)
        )
      ) * 1.2
    );
  }, [data]);

  const valueFormatter = (index: number) => configMap.track[index];

  const domain = [0, configMap.track.length];

  const SLIDER_MODE = 3;

  const style = {
    width: width ?? "100%",
    height: height,
    padding: `${height / 2}px 0`,
  };

  return (
    <div className="react_range__range_container fill_up" style={style}>
      <Slider
        mode={SLIDER_MODE}
        step={1}
        domain={domain}
        values={[]}
        rootStyle={{ position: "relative", width: "100%" }}
      >
        <Slot size={configMap.track.length} height={height} className={`graph`}>
          {({ index }) => {
            return (
              <>
                <Bar
                  color={configMap.colorList[index]}
                  data={dataMap[index]}
                  minValue={0}
                  maxValue={maxValue}
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
                <Grid value={value} isBold={labels.includes(value)} />
              </>
            );
          }}
        </Slot>
      </Slider>
    </div>
  );
}
export default FillUpChart;
