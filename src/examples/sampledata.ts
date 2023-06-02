export const selectedInterval = [-0.02, 6];

export const track0 = [
  {
    start: -100,
    end: -10,
    interval: 10,
    color: {
      available:
        "linear-gradient(180deg, rgba(133, 145, 255, 0.3) 0%, rgba(81, 95, 217, 0.11) 100%)",
      utilized:
        "linear-gradient(180deg, #8591FF 0%, rgba(81, 95, 217, 0.1) 100%)",
      selected:
        "linear-gradient(180deg, rgba(81, 95, 217, 1) 0%, rgba(81, 95, 217, 0.9) 100%)",
    },
  },
  {
    start: -9,
    end: -1,
    interval: 1,
    color: {
      available:
        "linear-gradient(180deg, rgba(89, 156, 255, 0.3) 0%, rgba(89, 156, 255, 0.11) 100%)",
      utilized:
        "linear-gradient(180deg, #599CFF 0%, rgba(89, 156, 255, 0.1) 100%)",
      selected:
        "linear-gradient(180deg, rgba(89, 156, 255, 1) 0%, rgba(89, 156, 255, 0.9) 100%)",
    },
  },
  {
    start: -0.9,
    end: -0.1,
    interval: 0.1,
    color: {
      available:
        "linear-gradient(180deg, rgba(47, 177, 250, 0.3) 0%, rgba(0, 163, 255, 0.11) 100%)",
      utilized:
        "linear-gradient(180deg, #2FB1FA 0%, rgba(0, 163, 255, 0.1) 100%)",
      selected:
        "linear-gradient(180deg, rgba(0, 163, 255, 1) 0%, rgba(0, 163, 255, 0.9) 100%)",
    },
  },
  {
    start: -0.09,
    end: -0.01,
    interval: 0.01,
    color: {
      available:
        "linear-gradient(180deg, rgba(110, 196, 249, 0.3) 0%, rgba(78, 169, 253, 0.11) 100%)",
      utilized:
        "linear-gradient(180deg, #6EC4F9 0%, rgba(78, 169, 253, 0.1) 100%)",
      selected:
        "linear-gradient(180deg, rgba(78, 169, 253, 1) 0%, rgba(78, 169, 253, 0.9) 100%)",
    },
  },
  {
    start: 0.01,
    end: 0.09,
    interval: 0.01,
    color: {
      available:
        "linear-gradient(180deg, rgba(254, 139, 99, 0.3) 0%, rgba(224, 101, 63, 0.11) 100%)",
      utilized:
        "linear-gradient(180deg, #FE8B63 0%, rgba(224, 101, 63, 0.1) 100%)",
      selected:
        "linear-gradient(180deg, rgba(224, 101, 63, 1) 0%, rgba(224, 101, 63, 0.9) 100%)",
    },
  },
  {
    start: 0.1,
    end: 0.9,
    interval: 0.1,
    color: {
      available:
        "linear-gradient(180deg, rgba(255, 151, 90, 0.3) 0%, rgba(255, 118, 38, 0.11) 100%)",
      utilized:
        "linear-gradient(180deg, #FF975A 0%, rgba(255, 118, 38, 0.1) 100%)",
      selected:
        "linear-gradient(180deg, rgba(255, 118, 38, 1) 0%, rgba(255, 118, 38, 0.9) 100%)",
    },
  },
  {
    start: 1,
    end: 9,
    interval: 1,
    color: {
      available:
        "linear-gradient(180deg, rgba(255, 171, 94, 0.3) 0%, rgba(255, 157, 86, 0.11) 100%)",
      utilized:
        "linear-gradient(180deg, #FFAB5E 0%, rgba(255, 153, 60, 0.1) 100%)",
      selected:
        "linear-gradient(180deg, rgba(255, 153, 60, 1) 0%, rgba(255, 153, 60, 0.9) 100%)",
    },
  },
  {
    start: 10,
    end: 100,
    interval: 10,
    color: {
      available:
        "linear-gradient(180deg, rgba(255, 206, 148, 0.3) 0%, rgba(255, 196, 126, 0.11) 100%)",
      utilized:
        "linear-gradient(180deg, #FFCE94 0%, rgba(255, 196, 126, 0.1) 100%)",
      selected:
        "linear-gradient(180deg, rgba(255, 196, 126, 1) 0%, rgba(255, 196, 126, 0.9) 100%)",
    },
  },
];
export const track1 = track0.slice(0, 4);
export const track2 = track0.slice(4, 8);

export const ticks0 = [-10, -1, -0.1, -0.01, 0.01, 0.1, 1, 10];
export const ticks1 = [-10, -1, -0.1, -0.01];
export const ticks2 = [0.01, 0.1, 1, 10];

const trackMap = track0.reduce((acc: any, { start, end, interval }) => {
  acc.push(start);
  do {
    const tick = parseFloat((acc[acc.length - 1] + interval).toFixed(12));
    acc.push(tick);
  } while (acc[acc.length - 1] < end);
  return acc;
}, []);

export const barSample = trackMap.map((tick: number, idx: number) => {
  const value = idx < 37 ? 2 - Math.log10(37 - idx) : 2 - Math.log10(idx - 36);

  return {
    key: tick,
    value: [
      { label: "utilized", amount: +(value * 100).toFixed(0) },
      { label: "available", amount: +(value * 70).toFixed(0) },
    ],
  };
});

export const dotSample = trackMap.map((tick: number, idx: number) => {
  return {
    key: tick,
    value: (Math.random() * 2).toFixed(2),
  };
});
