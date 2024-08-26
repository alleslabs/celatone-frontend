import { useCelatoneApp } from "../contexts";

interface GasPrice {
  denom: string;
  tokenPerGas: number;
}

export const useGasPrice = (): GasPrice => {
  const {
    chainConfig: { fees },
  } = useCelatoneApp();

  if (!fees || !fees.fee_tokens.length)
    return {
      denom: "",
      tokenPerGas: 0,
    };

  const fee = fees.fee_tokens[0];

  return {
    denom: fee.denom,
    tokenPerGas:
      fee.fixed_min_gas_price ??
      fee.low_gas_price ??
      fee.average_gas_price ??
      fee.high_gas_price ??
      0,
  };
};
