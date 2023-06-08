import { useCallback, useRef, useState } from "react";
import { RangeChartData, RangeChartRef } from "../types";

export function useRangeChart() {
  const ref = useRef<RangeChartRef>(null);

  const dummys = {
    left: {
      next: () => {},
      prev: () => {},
    },
    right: {
      next: () => {},
      prev: () => {},
    },
  };

  const move = useCallback(() => ref?.current?.move ?? dummys, [ref?.current]);

  const [data, setData] = useState<RangeChartData>({
    min: 0,
    max: 0,
    values: [],
  });

  return {data, setData, ref, move};
}
