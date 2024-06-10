import { useMemo } from "react";

import { useBlockDataLcd } from "lib/services/block";
import { useValidatorsLcd } from "lib/services/validator";
import type { BlockData, Nullable, Option, Validator } from "lib/types";

export const useBlockDataWithValidatorLcd = (
  height: number
): {
  data: Option<BlockData>;
  isLoading: boolean;
} => {
  const { data: blockData, isLoading: isLoadingBlockData } =
    useBlockDataLcd(height);
  const { data: validators, isLoading: isLoadingValidators } =
    useValidatorsLcd();

  const proposer = useMemo<Nullable<Validator>>(() => {
    if (!blockData || !validators) return null;

    const found = validators.find(
      (validator) =>
        validator.consensusAddress === blockData.proposerConsensusAddr
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
          ...blockData.block,
          proposer,
        }
      : undefined,
    isLoading: isLoadingBlockData || isLoadingValidators,
  };
};
