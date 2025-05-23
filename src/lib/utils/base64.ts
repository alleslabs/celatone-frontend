export { decode as libDecode, encode as libEncode } from "js-base64";

// TODO: Change the whole project encode/decode function to use from lib
export const decode = (str: string): string =>
  Buffer.from(str, "base64").toString("binary");

export const encode = (str: string): string =>
  Buffer.from(str, "binary").toString("base64");

export const utf8ToBytes = (str: string): Uint8Array =>
  Buffer.from(str, "utf-8");
