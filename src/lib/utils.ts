import {
  BarData,
  BarDataMap,
  Color,
  ConfigMap,
  DotData,
  TrackConfig,
} from "./types";

export function getConfigMap(trackConfig: TrackConfig[]) {
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
}

export function getDataMap<T extends BarData | DotData>(
  configMap: ConfigMap,
  data: T[]
) {
  return configMap.track.map((key) => data.find((d) => d.key === key)?.value!);
}

export function getDataMapWithSelectedValue(
  configMap: ConfigMap,
  data: BarData[],
  selectedAmount: number,
  reduceFunction: "reduce" | "reduceRight",
  selectableLabel: string,
  selectedLabel: string
) {
  const { map } = configMap.track[reduceFunction]<{
    map: BarDataMap;
    remainAmount: number;
  }>(
    (acc, key: BarData["key"], index: number) => {
      if (!data || data.length === 0) return acc;

      const values = data.find((d) => d.key === key)?.value;
      if (!values) return acc;

      const newItem = values.flatMap((value) => {
        if (value.label !== selectableLabel) return value;
        const unselected = Math.max(value.amount - acc.remainAmount, 0);
        const selected = value.amount - unselected;
        acc.remainAmount = Math.max(acc.remainAmount - value.amount, 0);
        return [
          { label: selectedLabel, amount: selected },
          { label: value.label, amount: unselected },
        ];
      });
      acc.map[index] = newItem;

      return acc;
    },
    {
      map: [],
      remainAmount: selectedAmount,
    }
  );
  return map;
}
