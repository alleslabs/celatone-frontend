import type { Accept } from "react-dropzone";

export type DropzoneFileType =
  | "wasm"
  | "json"
  | "mv"
  | "move"
  | "toml"
  | "vy"
  | "sol";

export interface DropzoneConfig {
  accept: Accept;
  text: {
    rawFileType: string;
  };
}

export const DROPZONE_CONFIG: { [key in DropzoneFileType]: DropzoneConfig } = {
  wasm: {
    accept: { "application/octet-stream": [".wasm"] },
    text: {
      rawFileType: ".wasm",
    },
  },
  json: {
    accept: { "application/json": [".json"] },
    text: {
      rawFileType: ".json",
    },
  },
  mv: {
    accept: { "application/octet-stream": [".mv"] },
    text: {
      rawFileType: ".mv",
    },
  },
  move: {
    accept: { "application/octet-stream": [".move"] },
    text: {
      rawFileType: ".move",
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
  sol: {
    accept: { "application/octet-stream": [".sol"] },
    text: {
      rawFileType: ".sol",
    },
  },
};
