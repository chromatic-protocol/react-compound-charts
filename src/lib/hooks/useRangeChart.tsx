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
    full: () => {},
  };

  const [data, setData] = useState<RangeChartData>({
    min: 0,
    max: 0,
    values: [],
  });

  const move = useCallback(() => {
    return ref?.current?.move([data.min, data.max]) ?? dummys;
  }, [ref?.current, data]);

  return { data, setData, ref, move };
}
