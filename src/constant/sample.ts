import { AlgoResult } from "packme-wasm";

export const SAMPLE_RESULT: AlgoResult = {
  unpacked_items: [
    {
      id: "item 1",
      dim: {
        length: 10,
        width: 10,
        height: 30,
      },
      pos: {
        length: 0,
        width: 0,
        height: 0,
      },
      rot: "LHW",
    },
  ],
  containers: [
    {
      id: "container 1",
      dim: {
        length: 20,
        width: 20,
        height: 30,
      },
      items: [
        {
          id: "item 1",
          dim: {
            length: 10,
            width: 10,
            height: 30,
          },
          pos: {
            length: 0,
            width: 0,
            height: 0,
          },
          rot: "LWH",
        },
        {
          id: "item 1",
          dim: {
            length: 10,
            width: 10,
            height: 30,
          },
          pos: {
            length: 10,
            width: 0,
            height: 0,
          },
          rot: "LWH",
        },
        {
          id: "item 1",
          dim: {
            length: 10,
            width: 10,
            height: 30,
          },
          pos: {
            length: 0,
            width: 10,
            height: 0,
          },
          rot: "LWH",
        },
        {
          id: "item 1",
          dim: {
            length: 10,
            width: 10,
            height: 30,
          },
          pos: {
            length: 10,
            width: 10,
            height: 0,
          },
          rot: "LWH",
        },
      ],
    },
  ],
};
