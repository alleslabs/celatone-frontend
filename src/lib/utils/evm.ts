enum EvmMethod {
  transfer = "0x",
  transferErc20 = "0xa9059cbb",
}

export const getEvmMethod = (txInput: string) => {
  if (txInput === EvmMethod.transfer) return "transfer";
  if (txInput.startsWith(EvmMethod.transferErc20)) return "transfer ERC20";
  return txInput.slice(0, 10);
};
