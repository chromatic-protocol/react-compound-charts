export type Color = {
  [label: string]: string;
};

export type TrackConfig = {
  start: number;
  end: number;
  interval: number;
  color: Color;
};

export type ConfigMap = {
  track: number[];
  colorList: Color[];
};

export type StackValue = { label: string; amount: number };

export type BarData = {
  key: number;
  value: StackValue[];
};

export type BarDataMap = Array<BarData["value"]>;

export type DotData = {
  key: number;
  value: number;
};

export type DotDataMap = Array<DotData["value"]>;

export type RangeChartData = {
  values?: number[];
  min?: number;
  max?: number;
};
