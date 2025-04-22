import type { Accept } from "react-dropzone";

export type DropzoneFileType =
  | "json"
  | "move"
  | "mv"
  | "sol"
  | "toml"
  | "vy"
  | "wasm";

export interface DropzoneConfig {
  accept: Accept;
  text: {
    rawFileType: string;
  };
}

export const DROPZONE_CONFIG: { [key in DropzoneFileType]: DropzoneConfig } = {
  json: {
    accept: { "application/json": [".json"] },
    text: {
      rawFileType: ".json",
    },
  },
  move: {
    accept: { "application/octet-stream": [".move"] },
    text: {
      rawFileType: ".move",
    },
  },
  mv: {
    accept: { "application/octet-stream": [".mv"] },
    text: {
      rawFileType: ".mv",
    },
  },
  sol: {
    accept: { "application/octet-stream": [".sol"] },
    text: {
      rawFileType: ".sol",
    },
  },
  toml: {
    accept: { "application/octet-stream": [".toml"] },
    text: {
      rawFileType: ".toml",
    },
  },
  vy: {
    accept: { "application/octet-stream": [".vy"] },
    text: {
      rawFileType: ".vy",
    },
  },
  wasm: {
    accept: { "application/octet-stream": [".wasm"] },
    text: {
      rawFileType: ".wasm",
    },
  },
};
