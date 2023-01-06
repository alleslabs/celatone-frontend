export const parseTxHash = (txHash: string) => txHash.substring(2);

export const parseTxHashOpt = (
  hashOpt: string | undefined
): string | undefined => (hashOpt ? parseTxHash(hashOpt) : hashOpt);
