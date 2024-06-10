import { fromBase64, toHex } from "@cosmjs/encoding";
import { useMemo } from "react";

import { useBlockDataLcd } from "lib/services/block";
import type { BlockDataResponseLcd } from "lib/services/types";
import { useValidatorsLcd } from "lib/services/validator";
import type { Nullable, Validator } from "lib/types";
import { consensusPubkeyToHexAddress } from "lib/utils";

export const useBlockDataWithValidatorLcd = (
  height: number
): {
  data: BlockDataResponseLcd | undefined;
  isLoading: boolean;
} => {
  const { data: blockData, isLoading: isLoadingBlockData } =
    useBlockDataLcd(height);
  const { data: validators, isLoading: isLoadingValidators } =
    useValidatorsLcd();

  const validator = useMemo<Nullable<Validator>>(() => {
    if (!blockData || !validators) return null;

    const { proposerAddress } = blockData.block;
    if (!proposerAddress) return null;

    const found = validators.find(
      (each) =>
        consensusPubkeyToHexAddress(each.consensusPubkey) ===
        toHex(fromBase64(proposerAddress)).toUpperCase()
    );
    if (!found) return null;
    return {
      validatorAddress: found.validatorAddress,
      moniker: found.moniker,
      identity: found.identity,
    };
  }, [blockData, validators]);

  return {
    data: blockData
      ? {
          block: {
            ...blockData.block,
            proposer: validator,
          },
          transactions: blockData.transactions,
          pagination: blockData.pagination,
        }
      : undefined,
    isLoading: isLoadingBlockData || isLoadingValidators,
  };
};
