import { fromBase64 } from "@cosmjs/encoding";
import { resolveBcsType } from "@initia/utils";

export interface DecodeArgsOptions {
  params: string[];
  rawArgs: string[];
  shouldDecode?: boolean;
}

export const decodeArgs = ({
  params,
  rawArgs,
  shouldDecode = true,
}: DecodeArgsOptions) => {
  if (!shouldDecode || !params.length) {
    return rawArgs;
  }

  return params.map((param, index) => {
    const arg = rawArgs[index];
    if (!arg) return null;
    try {
      return resolveBcsType(param).parse(fromBase64(arg));
    } catch {
      return null;
    }
  });
};

export const getFilteredParams = (allParams: string[]) => {
  return allParams[0] === "signer" || allParams[0] === "&signer"
    ? allParams.slice(1)
    : allParams;
};
