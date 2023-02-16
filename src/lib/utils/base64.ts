export { encode as libEncode, decode as libDecode } from "js-base64";

/**
 * @todos Change the whole project encode/decode function to use from lib
 */
export const decode = (str: string): string =>
  Buffer.from(str, "base64").toString("binary");

export const encode = (str: string): string =>
  Buffer.from(str, "binary").toString("base64");
