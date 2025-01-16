import type { Accept } from "react-dropzone";

export type DropzoneFileType =
  | "wasm"
  | "schema"
  | "mv"
  | "move"
  | "toml"
  | "vy"
  | "standard-json";

export interface DropzoneConfig {
  accept: Accept;
  text: {
    prettyFileType: string;
    rawFileType: string;
  };
}

export const DROPZONE_CONFIG: { [key in DropzoneFileType]: DropzoneConfig } = {
  wasm: {
    accept: { "application/octet-stream": [".wasm"] },
    text: {
      prettyFileType: "Wasm",
      rawFileType: ".wasm",
    },
  },
  schema: {
    accept: { "application/json": [".json"] },
    text: {
      prettyFileType: "JSON Schema",
      rawFileType: ".json",
    },
  },
  mv: {
    accept: { "application/octet-stream": [".mv"] },
    text: {
      prettyFileType: ".mv",
      rawFileType: ".mv",
    },
  },
  move: {
    accept: { "application/octet-stream": [".move"] },
    text: {
      prettyFileType: ".move",
      rawFileType: ".move",
    },
  },
  toml: {
    accept: { "application/octet-stream": [".toml"] },
    text: {
      prettyFileType: ".toml",
      rawFileType: ".toml",
    },
  },
  vy: {
    accept: { "application/octet-stream": [".vy"] },
    text: {
      prettyFileType: ".vy",
      rawFileType: ".vy",
    },
  },
  "standard-json": {
    accept: { "application/json": [".json"] },
    text: {
      prettyFileType: ".json file",
      rawFileType: ".json",
    },
  },
};
