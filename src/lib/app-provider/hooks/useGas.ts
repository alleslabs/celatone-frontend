import { useCelatoneApp } from "../contexts";

interface GasParams {
  denom: string;
  tokenPerGas: number;
  gasAdjustment: number;
  maxGasLimit: number;
}

export const useGas = (): GasParams => {
  const {
    chainConfig: {
      fees,
      gas: { gasAdjustment, maxGasLimit },
    },
  } = useCelatoneApp();

  // Check if fees or fee_tokens is undefined or empty
  if (!fees?.fee_tokens.length)
    return {
      denom: "",
      tokenPerGas: 0,
      maxGasLimit,
      gasAdjustment,
    };

  // Use the first fee token for gas parameters
  const fee = fees.fee_tokens[0];
  return {
    denom: fee.denom,
    tokenPerGas:
      fee.fixed_min_gas_price ??
      fee.low_gas_price ??
      fee.average_gas_price ??
      fee.high_gas_price ??
      0,
    gasAdjustment,
    maxGasLimit,
  };
};
