// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const parseTxHash = (txHash: any) => (txHash as string).substring(2);
