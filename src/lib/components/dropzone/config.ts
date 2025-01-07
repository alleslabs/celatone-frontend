import type { Accept } from "react-dropzone";

export interface DropzoneConfig {
  accept: Accept;
  text: {
    prettyFileType: string;
    rawFileType: string;
  };
}

export type DropzoneFileType = "move" | "mv" | "schema" | "toml" | "wasm";

export const DROPZONE_CONFIG: { [key in DropzoneFileType]: DropzoneConfig } = {
  move: {
    accept: { "application/octet-stream": [".move"] },
    text: {
      prettyFileType: ".move",
      rawFileType: ".move",
    },
  },
  mv: {
    accept: { "application/octet-stream": [".mv"] },
    text: {
      prettyFileType: ".mv",
      rawFileType: ".mv",
    },
  },
  schema: {
    accept: { "application/json": [".json"] },
    text: {
      prettyFileType: "JSON Schema",
      rawFileType: ".json",
    },
  },
  toml: {
    accept: { "application/octet-stream": [".toml"] },
    text: {
      prettyFileType: ".toml",
      rawFileType: ".toml",
    },
  },
  wasm: {
    accept: { "application/octet-stream": [".wasm"] },
    text: {
      prettyFileType: "Wasm",
      rawFileType: ".wasm",
    },
  },
};
