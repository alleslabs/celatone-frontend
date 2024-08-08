import type { Accept } from "react-dropzone";

export type DropzoneFileType = "wasm" | "schema" | "move";

interface DropzoneConfig {
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
  move: {
    accept: { "application/octet-stream": [".mv"] },
    text: {
      prettyFileType: ".mv",
      rawFileType: ".mv",
    },
  },
};
