import { useMemo } from "react";

import { useBlockDataRest } from "lib/services/block";
import { useValidatorsRest } from "lib/services/validator";
import type { BlockData, Nullable, Option, Validator } from "lib/types";

export const useBlockDataWithValidatorRest = (
  height: number
): {
  data: Option<BlockData>;
  isLoading: boolean;
} => {
  const { data: blockData, isLoading: isLoadingBlockData } =
    useBlockDataRest(height);
  const { data: validators, isLoading: isLoadingValidators } =
    useValidatorsRest();

  const proposer = useMemo<Nullable<Validator>>(() => {
    if (!blockData || !validators) return null;

    const found = validators.find(
      (validator) =>
        validator.consensusAddress === blockData.proposerConsensusAddress
    );

    return found
      ? {
          validatorAddress: found.validatorAddress,
          moniker: found.moniker,
          identity: found.identity,
        }
      : null;
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
