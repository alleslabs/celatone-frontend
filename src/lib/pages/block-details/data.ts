import type { BlockData, Nullable, Option, Validator } from "lib/types";

import { useBlockDataRest } from "lib/services/block";
import { useValidatorsRest } from "lib/services/validator";
import { useMemo } from "react";

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
          identity: found.identity,
          moniker: found.moniker,
          validatorAddress: found.validatorAddress,
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
